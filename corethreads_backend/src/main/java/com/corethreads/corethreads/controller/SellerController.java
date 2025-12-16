package com.corethreads.corethreads.controller;

import com.corethreads.corethreads.entity.Order;
import com.corethreads.corethreads.entity.Product;
import com.corethreads.corethreads.entity.Seller;
import com.corethreads.corethreads.repository.OrderRepository;
import com.corethreads.corethreads.repository.ProductRepository;
import com.corethreads.corethreads.service.SellerService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sellers")
public class SellerController {

    @Autowired
    private SellerService sellerService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    public record RegisterSellerRequest(String storeName, String storeDescription) {}

    /**
     * Register current customer as a seller
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerSeller(@RequestBody RegisterSellerRequest request, HttpServletRequest httpRequest) {
        try {
            HttpSession session = httpRequest.getSession(false);
            if (session == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Not authenticated"));
            }

            Long customerId = (Long) session.getAttribute("customerId");
            if (customerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Not authenticated"));
            }

            Seller seller = sellerService.registerSeller(customerId, request.storeName(), request.storeDescription());

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "sellerId", seller.getSellerId(),
                    "storeName", seller.getStoreName(),
                    "storeDescription", seller.getStoreDescription() != null ? seller.getStoreDescription() : "",
                    "verified", seller.isVerified(),
                    "createdAt", seller.getCreatedAt(),
                    "message", "Seller registered successfully"
            ));
        } catch (org.springframework.web.server.ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode())
                    .body(Map.of("error", ex.getReason()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred during seller registration"));
        }
    }

    /**
     * Get current user's seller profile
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentSellerProfile(HttpServletRequest request) {
        try {
            HttpSession session = request.getSession(false);
            if (session == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Not authenticated"));
            }

            Long customerId = (Long) session.getAttribute("customerId");
            if (customerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Not authenticated"));
            }

            return sellerService.getSellerByCustomerId(customerId)
                    .map(seller -> ResponseEntity.ok(Map.of(
                            "sellerId", seller.getSellerId(),
                            "storeName", seller.getStoreName(),
                            "storeDescription", seller.getStoreDescription() != null ? seller.getStoreDescription() : "",
                            "verified", seller.isVerified(),
                            "createdAt", seller.getCreatedAt()
                    )))
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(Map.of("error", "Seller profile not found")));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch seller profile"));
        }
    }

    /**
     * Get seller dashboard statistics
     */
    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats(HttpServletRequest request) {
        try {
            HttpSession session = request.getSession(false);
            if (session == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Not authenticated"));
            }

            Long customerId = (Long) session.getAttribute("customerId");
            if (customerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Not authenticated"));
            }

            Seller seller = sellerService.getSellerByCustomerId(customerId)
                    .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Seller profile not found"));

            // Get seller's products count
            List<Product> products = productRepository.findBySeller_SellerId(seller.getSellerId());
            long totalProducts = products.size();

            // Get seller's orders (for now, we'll use all orders - adjust based on your Order entity structure)
            List<Order> orders = orderRepository.findAll(); // TODO: Filter by seller when Order entity has seller reference
            long totalOrders = orders.size();

            // Calculate total sales from orders
            BigDecimal totalSales = orders.stream()
                    .map(Order::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            return ResponseEntity.ok(Map.of(
                    "totalSales", totalSales,
                    "totalProducts", totalProducts,
                    "totalOrders", totalOrders
            ));
        } catch (org.springframework.web.server.ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode())
                    .body(Map.of("error", ex.getReason()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch dashboard statistics"));
        }
    }

    /**
     * Get seller's products
     */
    @GetMapping("/products")
    public ResponseEntity<?> getSellerProducts(HttpServletRequest request) {
        try {
            HttpSession session = request.getSession(false);
            if (session == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Not authenticated"));
            }

            Long customerId = (Long) session.getAttribute("customerId");
            if (customerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Not authenticated"));
            }

            Seller seller = sellerService.getSellerByCustomerId(customerId)
                    .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Seller profile not found"));

            List<Product> products = productRepository.findBySeller_SellerId(seller.getSellerId());

            List<Map<String, Object>> productList = products.stream()
                    .map(product -> {
                        Map<String, Object> productMap = new HashMap<>();
                        productMap.put("productId", product.getProductId());
                        productMap.put("name", product.getName());
                        productMap.put("description", product.getDescription());
                        productMap.put("isActive", product.isActive());
                        productMap.put("createdAt", product.getCreatedAt());
                        // Add more fields as needed (price from variants, images, etc.)
                        return productMap;
                    })
                    .toList();

            return ResponseEntity.ok(Map.of("products", productList));
        } catch (org.springframework.web.server.ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode())
                    .body(Map.of("error", ex.getReason()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch products"));
        }
    }

    /**
     * Get seller's orders
     */
    @GetMapping("/orders")
    public ResponseEntity<?> getSellerOrders(
            @RequestParam(required = false) String status,
            HttpServletRequest request) {
        try {
            HttpSession session = request.getSession(false);
            if (session == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Not authenticated"));
            }

            Long customerId = (Long) session.getAttribute("customerId");
            if (customerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Not authenticated"));
            }

            Seller seller = sellerService.getSellerByCustomerId(customerId)
                    .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Seller profile not found"));

            // For now, return all orders. TODO: Filter by seller when Order entity has seller reference
            List<Order> orders;
            if (status != null && !status.isEmpty()) {
                orders = orderRepository.findByStatus(status.toUpperCase());
            } else {
                orders = orderRepository.findAll();
            }

            List<Map<String, Object>> orderList = orders.stream()
                    .map(order -> {
                        Map<String, Object> orderMap = new HashMap<>();
                        orderMap.put("orderId", order.getOrderId());
                        orderMap.put("orderNumber", order.getOrderNumber());
                        orderMap.put("customerName", order.getCustomer().getFirstName() + " " + order.getCustomer().getLastName());
                        orderMap.put("totalAmount", order.getTotalAmount());
                        orderMap.put("status", order.getStatus());
                        orderMap.put("createdAt", order.getCreatedAt());
                        return orderMap;
                    })
                    .toList();

            return ResponseEntity.ok(Map.of("orders", orderList));
        } catch (org.springframework.web.server.ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode())
                    .body(Map.of("error", ex.getReason()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch orders"));
        }
    }

    public record UpdateSellerRequest(String storeName, String storeDescription) {}

    /**
     * Update seller profile
     */
    @PutMapping("/profile")
    public ResponseEntity<?> updateSellerProfile(@RequestBody UpdateSellerRequest request, HttpServletRequest httpRequest) {
        try {
            HttpSession session = httpRequest.getSession(false);
            if (session == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Not authenticated"));
            }

            Long customerId = (Long) session.getAttribute("customerId");
            if (customerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Not authenticated"));
            }

            Seller seller = sellerService.getSellerByCustomerId(customerId)
                    .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Seller profile not found"));

            Seller updatedSeller = sellerService.updateSeller(seller.getSellerId(), request.storeName(), request.storeDescription());

            return ResponseEntity.ok(Map.of(
                    "sellerId", updatedSeller.getSellerId(),
                    "storeName", updatedSeller.getStoreName(),
                    "storeDescription", updatedSeller.getStoreDescription() != null ? updatedSeller.getStoreDescription() : "",
                    "verified", updatedSeller.isVerified(),
                    "message", "Seller profile updated successfully"
            ));
        } catch (org.springframework.web.server.ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode())
                    .body(Map.of("error", ex.getReason()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update seller profile"));
        }
    }
}
