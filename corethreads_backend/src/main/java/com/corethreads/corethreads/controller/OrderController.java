package com.corethreads.corethreads.controller;

import com.corethreads.corethreads.entity.Order;
import com.corethreads.corethreads.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
// Allow credentials for dev frontend; wildcard is invalid with cookies
@CrossOrigin(origins = {"http://localhost:5173"}, allowCredentials = "true")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        return ResponseEntity.ok(orderService.createOrder(order));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrder(@PathVariable Long orderId) {
        return orderService.getOrderById(orderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<Order> getOrderByNumber(@PathVariable String orderNumber) {
        return orderService.getOrderByNumber(orderNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Order>> getCustomerOrders(@PathVariable Long customerId) {
        return ResponseEntity.ok(orderService.getCustomerOrders(customerId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable String status) {
        return ResponseEntity.ok(orderService.getOrdersByStatus(status));
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long orderId, @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long orderId) {
        orderService.cancelOrder(orderId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    /**
     * Checkout endpoint: creates an order for the current session customer
     * Validates variant availability, deducts stock, creates order + items.
     */
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody Map<String, Object> payload, HttpServletRequest httpRequest) {
        try {
            System.out.println("[OrderController] Checkout request received");
            HttpSession session = httpRequest.getSession(false);
            if (session == null || session.getAttribute("customerId") == null) {
                System.out.println("[OrderController] No session or customerId");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Not authenticated"));
            }
            
            // Be tolerant of different types in the session (Long/Integer/String)
            Object cidObj = session.getAttribute("customerId");
            Long customerId = null;
            if (cidObj instanceof Number) {
                customerId = ((Number) cidObj).longValue();
            } else if (cidObj instanceof String) {
                try {
                    customerId = Long.valueOf((String) cidObj);
                } catch (NumberFormatException nfe) {
                    System.out.println("[OrderController] Invalid customerId format: " + cidObj);
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(Map.of("error", "Invalid session identifier"));
                }
            }
            if (customerId == null) {
                System.out.println("[OrderController] customerId is null");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Not authenticated"));
            }

            System.out.println("[OrderController] Customer ID: " + customerId);

                if (payload == null || payload.get("items") == null) {
                System.out.println("[OrderController] Empty payload or items");
                return ResponseEntity.badRequest().body(Map.of("error", "No items to checkout"));
            }
            // Parse items from a generic payload
            Object rawItems = payload.get("items");
            if (!(rawItems instanceof List<?> rawList) || rawList.isEmpty()) {
                System.out.println("[OrderController] Items list is invalid or empty");
                return ResponseEntity.badRequest().body(Map.of("error", "No valid items to checkout"));
            }
            System.out.println("[OrderController] Items count: " + rawList.size());

            // Convert payload items to OrderService.CheckoutItem (avoid generic inference issues)
            List<OrderService.CheckoutItem> serviceItems = new java.util.ArrayList<>();
            for (Object e : rawList) {
                if (!(e instanceof Map)) { continue; }
                Map<?, ?> m = (Map<?, ?>) e;
                Long pid = null;
                Object pidObj = m.get("productId");
                if (pidObj instanceof Number) pid = ((Number) pidObj).longValue();
                else if (pidObj instanceof String s) {
                    try { pid = Long.valueOf(s); } catch (Exception ignored) {}
                }
                String size = m.get("size") != null ? String.valueOf(m.get("size")) : null;
                String color = m.get("color") != null ? String.valueOf(m.get("color")) : null;
                Long qty = null;
                Object qObj = m.get("quantity");
                if (qObj instanceof Number) qty = ((Number) qObj).longValue();
                else if (qObj instanceof String qs) {
                    try { qty = Long.valueOf(qs); } catch (Exception ignored) {}
                }
                serviceItems.add(new OrderService.CheckoutItem(pid, size, color, qty));
            }

            // Call service to process checkout
            OrderService.CheckoutResult result = orderService.processCheckout(customerId, serviceItems);

            if (!result.failures().isEmpty()) {
                System.out.println("[OrderController] Checkout validation failures");
                // If failure is due to insufficient balance, tailor the message
                String errorMsg = "Some items failed validation";
                try {
                    boolean insufficientBalance = result.failures().stream()
                            .anyMatch(f -> "Insufficient balance".equals(f.get("reason")));
                    if (insufficientBalance) {
                        errorMsg = "Insufficient balance";
                    }
                } catch (Exception ignored) {}
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                        "error", errorMsg,
                        "failures", result.failures()
                ));
            }

            Order order = result.order();
            System.out.println("[OrderController] Order created successfully: " + order.getOrderNumber());
            
                Map<String, Object> response = Map.of(
                    "orderId", order.getOrderId(),
                    "orderNumber", order.getOrderNumber(),
                    "status", order.getStatus(),
                    "totalAmount", order.getTotalAmount(),
                    "remainingBalance", order.getCustomer() != null ? order.getCustomer().getBalance() : null
                );
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception ex) {
            System.err.println("[OrderController] Exception during checkout:");
            ex.printStackTrace();
            // Provide a safe, concise error without leaking internal details
            String msg = ex.getMessage() != null ? ex.getMessage() : "Unknown error";
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Checkout failed", "details", msg));
        }
    }
}
