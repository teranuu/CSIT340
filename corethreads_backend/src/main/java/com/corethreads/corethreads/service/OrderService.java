package com.corethreads.corethreads.service;

import com.corethreads.corethreads.entity.Order;
import com.corethreads.corethreads.entity.OrderItem;
import com.corethreads.corethreads.entity.Customer;
import com.corethreads.corethreads.entity.Product;
import com.corethreads.corethreads.entity.ProductVariant;
import com.corethreads.corethreads.repository.OrderRepository;
import com.corethreads.corethreads.repository.OrderItemRepository;
import com.corethreads.corethreads.repository.ProductRepository;
import com.corethreads.corethreads.repository.ProductVariantRepository;
import com.corethreads.corethreads.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductVariantRepository productVariantRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public Order createOrder(Order order) {
        // Generate unique order number
        if (order.getOrderNumber() == null) {
            order.setOrderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        order.setCreatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    public Optional<Order> getOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }

    public Optional<Order> getOrderByNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber);
    }

    public List<Order> getCustomerOrders(Long customerId) {
        return orderRepository.findByCustomer_CustomerIdOrderByCreatedAtDesc(customerId);
    }

    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }

    public Order updateOrderStatus(Long orderId, String status) {
        return orderRepository.findById(orderId)
                .map(order -> {
                    order.setStatus(status);
                    order.setUpdatedAt(LocalDateTime.now());
                    return orderRepository.save(order);
                })
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public void cancelOrder(Long orderId) {
        updateOrderStatus(orderId, "CANCELLED");
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public static record CheckoutItem(Long productId, String size, String color, Long quantity) {}
    public static record CheckoutResult(Order order, List<Map<String, Object>> failures) {}

    @Transactional
    public CheckoutResult processCheckout(Long customerId, List<CheckoutItem> items) {
        System.out.println("[OrderService] Starting checkout for customer: " + customerId);
        
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found: " + customerId));
        System.out.println("[OrderService] Customer found: " + customer.getUsername());

        List<Map<String, Object>> failures = new ArrayList<>();
        List<OrderItem> preparedItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;
        List<Long> affectedProductIds = new ArrayList<>();

        for (CheckoutItem item : items) {
            System.out.println("[OrderService] Processing item: productId=" + item.productId() + ", qty=" + item.quantity());
            
            if (item == null || item.productId() == null || item.quantity() == null || item.quantity() <= 0) {
                failures.add(Map.of("productId", item != null ? item.productId() : null, "reason", "Invalid item"));
                continue;
            }

            Product product = productRepository.findById(item.productId()).orElse(null);
            if (product == null) {
                System.out.println("[OrderService] Product not found: " + item.productId());
                failures.add(Map.of("productId", item.productId(), "reason", "Product not found"));
                continue;
            }

            List<ProductVariant> variants = productVariantRepository.findByProductId(item.productId());
            System.out.println("[OrderService] Found " + (variants != null ? variants.size() : 0) + " variants");
            
            ProductVariant variant = null;
            if (variants != null && !variants.isEmpty()) {
                variant = variants.stream()
                        .filter(v -> (item.size() == null || (v.getSize() != null && v.getSize().equalsIgnoreCase(item.size())))
                                && (item.color() == null || (v.getColor() != null && v.getColor().equalsIgnoreCase(item.color()))))
                        .findFirst()
                        .orElse(variants.get(0));
            }

            if (variant == null) {
                System.out.println("[OrderService] No variants available for product: " + item.productId());
                failures.add(Map.of("productId", item.productId(), "reason", "No variants available"));
                continue;
            }

            long available = variant.getStock() != null ? variant.getStock() : 0L;
            if (available < item.quantity()) {
                System.out.println("[OrderService] Insufficient stock: available=" + available + ", requested=" + item.quantity());
                failures.add(Map.of("productId", item.productId(), "variantId", variant.getVariantId(),
                        "available", available, "requested", item.quantity(), "reason", "Insufficient stock"));
                continue;
            }

            BigDecimal unitPrice = variant.getPrice() != null ? variant.getPrice() : 
                    (product.getPrice() != null ? product.getPrice() : BigDecimal.ZERO);
            BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(item.quantity()));
            total = total.add(subtotal);

            OrderItem oi = new OrderItem();
            oi.setVariant(variant);
            oi.setQuantity(item.quantity());
            oi.setUnitPrice(unitPrice);
            oi.setSubtotal(subtotal);
            preparedItems.add(oi);
            affectedProductIds.add(product.getProductId());
        }

        if (!failures.isEmpty()) {
            System.out.println("[OrderService] Validation failures: " + failures.size());
            return new CheckoutResult(null, failures);
        }

        // Validate sufficient balance
        double currentBalance = customer.getBalance() != null ? customer.getBalance() : 0.0;
        double required = total.doubleValue();
        if (currentBalance < required) {
            System.out.println("[OrderService] Insufficient balance: current=" + currentBalance + ", required=" + required);
            List<Map<String, Object>> balFailure = new ArrayList<>();
            balFailure.add(Map.of(
                    "reason", "Insufficient balance",
                    "currentBalance", currentBalance,
                    "requiredAmount", required
            ));
            return new CheckoutResult(null, balFailure);
        }

        System.out.println("[OrderService] Creating order with total: " + total);
        Order order = new Order();
        order.setCustomer(customer);
        order.setTotalAmount(total);
        order.setStatus("DELIVERED");  // ✅ Auto-mark as delivered (instant fulfillment for demo)
        order = createOrder(order);
        System.out.println("[OrderService] Order created: " + order.getOrderNumber());

        // Persist items and deduct stock
        for (OrderItem oi : preparedItems) {
            oi.setOrder(order);
            ProductVariant v = oi.getVariant();
            long newStock = (v.getStock() != null ? v.getStock() : 0L) - oi.getQuantity();
            v.setStock(Math.max(0L, newStock));
            productVariantRepository.save(v);
            orderItemRepository.save(oi);
        }
        System.out.println("[OrderService] Order items saved: " + preparedItems.size());

        // Recalculate product-level stock
        List<Long> uniqueProductIds = affectedProductIds.stream().distinct().collect(Collectors.toList());
        for (Long pid : uniqueProductIds) {
            List<ProductVariant> vs = productVariantRepository.findByProductId(pid);
            long sum = vs.stream().map(ProductVariant::getStock).filter(s -> s != null).reduce(0L, Long::sum);
            productRepository.findById(pid).ifPresent(p -> {
                p.setStock(sum);
                productRepository.save(p);
            });
        }

        // Deduct customer balance and persist
        double newBalance = currentBalance - required;
        customer.setBalance(newBalance);
        customerRepository.save(customer);
        System.out.println("[OrderService] Balance updated: newBalance=" + newBalance);
        System.out.println("[OrderService] Checkout completed successfully");

        return new CheckoutResult(order, failures);
    }
}
