package com.corethreads.corethreads.controller;

import com.corethreads.corethreads.entity.Order;
import com.corethreads.corethreads.entity.Product;
import com.corethreads.corethreads.entity.ProductImage;
import com.corethreads.corethreads.entity.ProductVariant;
import com.corethreads.corethreads.entity.Seller;
import com.corethreads.corethreads.repository.OrderRepository;
import com.corethreads.corethreads.repository.ProductRepository;
import com.corethreads.corethreads.repository.ProductImageRepository;
import com.corethreads.corethreads.repository.ProductVariantRepository;
import com.corethreads.corethreads.service.SellerService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.multipart.MultipartFile;
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
    private ProductVariantRepository productVariantRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    /**
     * ONE-TIME: Sync all Product.stock to ProductVariant.stock for the current seller
     * This fixes existing products where stocks are mismatched
     */
    @PostMapping("/products/sync-stock")
    public ResponseEntity<?> syncAllProductStocks(HttpServletRequest httpRequest) {
        try {
            HttpSession session = httpRequest.getSession(false);
            if (session == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
            }

            Long customerId = (Long) session.getAttribute("customerId");
            if (customerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
            }

            Seller seller = sellerService.getSellerByCustomerId(customerId)
                    .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Seller profile not found"));

            // Get all seller's products
            List<Product> products = productRepository.findBySeller_SellerIdAndIsActiveTrue(seller.getSellerId());
            int syncedCount = 0;

            for (Product product : products) {
                long newStock = product.getStock() != null ? product.getStock() : 0L;
                List<ProductVariant> variants = productVariantRepository.findByProductId(product.getProductId());
                
                if (!variants.isEmpty()) {
                    // Distribute stock equally across all variants
                    long perVariant = newStock / variants.size();
                    long remainder = newStock % variants.size();
                    
                    for (int i = 0; i < variants.size(); i++) {
                        variants.get(i).setStock(perVariant + (i == 0 ? remainder : 0));
                        productVariantRepository.save(variants.get(i));
                    }
                    syncedCount++;
                }
            }

            return ResponseEntity.ok(Map.of(
                    "message", "Stock synchronized successfully",
                    "syncedProducts", syncedCount,
                    "totalProducts", products.size()
            ));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to sync stock: " + ex.getMessage()));
        }
    }

    /**
     * ONE-TIME: Sync Product.stock from the sum of its variants for the current seller
     * Useful when variants have the correct values and product-level stock is stale/zero
     */
    @PostMapping("/products/sync-stock-from-variants")
    public ResponseEntity<?> syncProductStockFromVariants(HttpServletRequest httpRequest) {
        try {
            HttpSession session = httpRequest.getSession(false);
            if (session == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
            }

            Long customerId = (Long) session.getAttribute("customerId");
            if (customerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
            }

            Seller seller = sellerService.getSellerByCustomerId(customerId)
                    .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Seller profile not found"));

            List<Product> products = productRepository.findBySeller_SellerIdAndIsActiveTrue(seller.getSellerId());
            int syncedCount = 0;

            for (Product product : products) {
                List<ProductVariant> variants = productVariantRepository.findByProductId(product.getProductId());
                long variantSum = variants.stream()
                        .map(ProductVariant::getStock)
                        .filter(s -> s != null)
                        .reduce(0L, Long::sum);
                product.setStock(variantSum);
                productRepository.save(product);
                syncedCount++;
            }

            return ResponseEntity.ok(Map.of(
                    "message", "Stock synchronized from variants",
                    "syncedProducts", syncedCount,
                    "totalProducts", products.size()
            ));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to sync stock from variants: " + ex.getMessage()));
        }
    }

    /**
     * Sanitize product name: remove risky chars, control chars, limit length
     */
    private String sanitizeProductName(String raw) {
        if (raw == null || raw.trim().isEmpty()) return null;
        String v = raw
                .replaceAll("[\\u0000-\\u001F\\u007F]", "") // control chars
                .replaceAll("[<>`\"'=\\\\]", "") // risky meta chars
                .replaceAll("-{2,}", "-") // collapse dashes
                .replaceAll("/{2,}", "/") // collapse slashes
                .replaceAll("\\s{2,}", " ") // collapse multiple spaces
                .trim();
        // Whitelist: keep only A-Z a-z 0-9 space . , & ( ) - / # +
        v = v.replaceAll("[^A-Za-z0-9 .&()'\\-/#\\+,]", "");
        if (v.length() > 100) v = v.substring(0, 100);
        return v.isEmpty() ? null : v;
    }

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
            System.err.println("=== SELLER REGISTRATION ERROR ===");
            System.err.println("Exception: " + ex.getClass().getSimpleName());
            System.err.println("Message: " + ex.getMessage());
            ex.printStackTrace();
            System.err.println("==============================");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred during seller registration: " + ex.getMessage()));
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
            List<Product> products = productRepository.findBySeller_SellerIdAndIsActiveTrue(seller.getSellerId());
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

            List<Product> products = productRepository.findBySeller_SellerIdAndIsActiveTrue(seller.getSellerId());

            List<Map<String, Object>> productList = products.stream()
                    .map(product -> {
                        Map<String, Object> productMap = new HashMap<>();
                        productMap.put("productId", product.getProductId());
                        productMap.put("name", product.getName());
                        productMap.put("description", product.getDescription());
                        productMap.put("isActive", product.isActive());
                        productMap.put("category", product.getCategory());
                        productMap.put("price", product.getPrice());
                        productMap.put("stock", product.getStock());
                        productMap.put("colors", product.getColors() == null || product.getColors().isBlank() ? java.util.List.of() : java.util.Arrays.stream(product.getColors().split(",")).map(String::trim).filter(s -> !s.isEmpty()).toList());
                        productMap.put("productCode", product.getProductCode());
                    String imageUrl = productImageRepository.findByProductIdOrderByDisplayOrder(product.getProductId())
                        .stream()
                        .map(ProductImage::getImageUrl)
                        .findFirst()
                        .orElse("/images/placeholder.png");
                    productMap.put("imageUrl", imageUrl);
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

    public record UpsertProductRequest(String name, String description, Boolean active, String category, String price, Long stock, java.util.List<String> colors) {}

    /**
     * Create a new product for the current seller
     */
    @PostMapping("/products")
    public ResponseEntity<?> createSellerProduct(@RequestBody UpsertProductRequest request, HttpServletRequest httpRequest) {
        try {
            HttpSession session = httpRequest.getSession(false);
            if (session == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
            }

            Long customerId = (Long) session.getAttribute("customerId");
            if (customerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
            }

            Seller seller = sellerService.getSellerByCustomerId(customerId)
                    .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(HttpStatus.NOT_FOUND, "Seller profile not found"));

            if (request.name() == null || request.name().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Product name is required"));
            }

            String safeName = sanitizeProductName(request.name());
            if (safeName == null || safeName.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Product name is invalid after sanitization"));
            }

            Product product = new Product();
            product.setName(safeName);
            product.setDescription(request.description() != null ? request.description().trim() : null);
            product.setSeller(seller);
            product.setActive(request.active() == null ? true : request.active());
            if (request.category() != null) {
                product.setCategory(request.category().trim());
            }
            if (request.price() != null && !request.price().isBlank()) {
                try {
                    product.setPrice(new java.math.BigDecimal(request.price()));
                } catch (NumberFormatException ex) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Invalid price"));
                }
            }
            if (request.stock() != null) {
                product.setStock(Math.max(0L, request.stock()));
            }
            if (request.colors() != null) {
                java.util.Set<String> allowed = java.util.Set.of("black","white","grey","navy blue","olive green","dark blue");
                java.util.List<String> filtered = request.colors().stream()
                        .filter(java.util.Objects::nonNull)
                        .map(String::trim)
                        .filter(c -> !c.isEmpty() && allowed.contains(c))
                        .distinct()
                        .toList();
                product.setColors(filtered.isEmpty() ? null : String.join(",", filtered));
            }
            // Colors: allow only fixed safe set
            if (request.colors() != null) {
                java.util.Set<String> allowed = java.util.Set.of("black","white","grey","navy blue","olive green","dark blue");
                java.util.List<String> filtered = request.colors().stream()
                        .filter(java.util.Objects::nonNull)
                        .map(String::trim)
                        .filter(c -> !c.isEmpty() && allowed.contains(c))
                        .distinct()
                        .toList();
                product.setColors(filtered.isEmpty() ? null : String.join(",", filtered));
            }
            // Auto-generate product code (immutable)
            product.setProductCode("PRD-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            product.setCreatedAt(java.time.LocalDateTime.now());
            product.setUpdatedAt(java.time.LocalDateTime.now());

            Product saved = productRepository.save(product);

            Map<String, Object> response = new HashMap<>();
            response.put("productId", saved.getProductId());
            response.put("name", saved.getName());
            response.put("description", saved.getDescription());
            response.put("isActive", saved.isActive());
            response.put("category", saved.getCategory());
            response.put("price", saved.getPrice());
            response.put("stock", saved.getStock());
            response.put("productCode", saved.getProductCode());
            response.put("colors", saved.getColors() == null || saved.getColors().isBlank() ? java.util.List.of() : java.util.Arrays.stream(saved.getColors().split(",")).map(String::trim).filter(s -> !s.isEmpty()).toList());
            response.put("createdAt", saved.getCreatedAt());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (org.springframework.web.server.ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(Map.of("error", ex.getReason()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Failed to create product"));
        }
    }

    /**
     * Update an existing product owned by the current seller
     */
    @PutMapping("/products/{productId}")
    public ResponseEntity<?> updateSellerProduct(@PathVariable Long productId,
                                                 @RequestBody UpsertProductRequest request,
                                                 HttpServletRequest httpRequest) {
        try {
            System.out.println("=== SELLER UPDATE PRODUCT ENDPOINT CALLED ===");
            System.out.println("ProductId: " + productId);
            System.out.println("Request stock: " + request.stock());
            
            HttpSession session = httpRequest.getSession(false);
            if (session == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
            }
            Long customerId = (Long) session.getAttribute("customerId");
            if (customerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
            }

            Seller seller = sellerService.getSellerByCustomerId(customerId)
                    .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(HttpStatus.NOT_FOUND, "Seller profile not found"));

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

            if (product.getSeller() == null || !product.getSeller().getSellerId().equals(seller.getSellerId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Not allowed to modify this product"));
            }

            if (request.name() != null && !request.name().trim().isEmpty()) {
                String safeName = sanitizeProductName(request.name());
                if (safeName != null && !safeName.isEmpty()) {
                    product.setName(safeName);
                }
            }
            if (request.description() != null) {
                product.setDescription(request.description().trim());
            }
            if (request.active() != null) {
                product.setActive(request.active());
            }
            if (request.category() != null) {
                product.setCategory(request.category().trim());
            }
            if (request.price() != null && !request.price().isBlank()) {
                try {
                    product.setPrice(new java.math.BigDecimal(request.price()));
                } catch (NumberFormatException ex) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Invalid price"));
                }
            }
            if (request.stock() != null) {
                long newStock = Math.max(0L, request.stock());
                System.out.println("Setting product stock to: " + newStock);
                product.setStock(newStock);
                
                // Update ProductVariant stocks proportionally to maintain consistency
                List<ProductVariant> variants = productVariantRepository.findByProductId(productId);
                if (!variants.isEmpty()) {
                    long oldTotalStock = variants.stream()
                            .map(ProductVariant::getStock)
                            .filter(s -> s != null)
                            .reduce(0L, Long::sum);
                    
                    if (oldTotalStock > 0) {
                        // Distribute new stock proportionally
                        long distributed = 0;
                        for (int i = 0; i < variants.size(); i++) {
                            ProductVariant v = variants.get(i);
                            long oldVariantStock = v.getStock() != null ? v.getStock() : 0;
                            if (i == variants.size() - 1) {
                                // Last variant gets remainder to avoid rounding errors
                                v.setStock(newStock - distributed);
                            } else {
                                long variantStock = oldTotalStock > 0 
                                    ? (long) Math.floor((double) oldVariantStock / oldTotalStock * newStock)
                                    : newStock / variants.size();
                                v.setStock(variantStock);
                                distributed += variantStock;
                            }
                            productVariantRepository.save(v);
                        }
                    } else {
                        // Equal distribution if no previous stock
                        long perVariant = newStock / variants.size();
                        long remainder = newStock % variants.size();
                        for (int i = 0; i < variants.size(); i++) {
                            variants.get(i).setStock(perVariant + (i == 0 ? remainder : 0));
                            productVariantRepository.save(variants.get(i));
                        }
                    }
                }
            }
            product.setUpdatedAt(java.time.LocalDateTime.now());

            System.out.println("About to save product with stock: " + product.getStock());
            Product saved = productRepository.save(product);
            System.out.println("Product saved successfully. Saved stock: " + saved.getStock());

            Map<String, Object> response = new HashMap<>();
            response.put("productId", saved.getProductId());
            response.put("name", saved.getName());
            response.put("description", saved.getDescription());
            response.put("isActive", saved.isActive());
            response.put("category", saved.getCategory());
            response.put("price", saved.getPrice());
            response.put("stock", saved.getStock());
            response.put("productCode", saved.getProductCode());
            response.put("colors", saved.getColors() == null || saved.getColors().isBlank() ? java.util.List.of() : java.util.Arrays.stream(saved.getColors().split(",")).map(String::trim).filter(s -> !s.isEmpty()).toList());
            response.put("updatedAt", saved.getUpdatedAt());
            return ResponseEntity.ok(response);
        } catch (org.springframework.web.server.ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(Map.of("error", ex.getReason()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Failed to update product"));
        }
    }

    /**
     * Soft-delete a product owned by the current seller (marks inactive)
     */
    @DeleteMapping("/products/{productId}")
    public ResponseEntity<?> deleteSellerProduct(@PathVariable Long productId, HttpServletRequest httpRequest) {
        try {
            HttpSession session = httpRequest.getSession(false);
            if (session == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
            }
            Long customerId = (Long) session.getAttribute("customerId");
            if (customerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
            }
            Seller seller = sellerService.getSellerByCustomerId(customerId)
                    .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(HttpStatus.NOT_FOUND, "Seller profile not found"));

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

            if (product.getSeller() == null || !product.getSeller().getSellerId().equals(seller.getSellerId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Not allowed to delete this product"));
            }

            product.setActive(false);
            product.setUpdatedAt(java.time.LocalDateTime.now());
            productRepository.save(product);
            return ResponseEntity.noContent().build();
        } catch (org.springframework.web.server.ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(Map.of("error", ex.getReason()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Failed to delete product"));
        }
    }

    /**
     * Upload a product image and attach to product
     */
    @PostMapping(path = "/products/{productId}/image", consumes = {"multipart/form-data"})
    public ResponseEntity<?> uploadProductImage(@PathVariable Long productId,
                                                @RequestParam("file") MultipartFile file,
                                                HttpServletRequest httpRequest) {
        try {
            HttpSession session = httpRequest.getSession(false);
            if (session == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
            }
            Long customerId = (Long) session.getAttribute("customerId");
            if (customerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
            }
            Seller seller = sellerService.getSellerByCustomerId(customerId)
                    .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(HttpStatus.NOT_FOUND, "Seller profile not found"));

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

            if (product.getSeller() == null || !product.getSeller().getSellerId().equals(seller.getSellerId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Not allowed to modify this product"));
            }

            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Image file is required"));
            }
            String contentType = file.getContentType();
            if (contentType == null || !contentType.toLowerCase().startsWith("image/")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Only image files are allowed"));
            }

            // Generate safe filename
            String original = file.getOriginalFilename();
            String ext = ".img";
            if (original != null && original.contains(".")) {
                ext = original.substring(original.lastIndexOf('.'));
            }
            String safeName = "product_" + productId + "_" + System.currentTimeMillis() + ext;

            // Save into both dev and runtime static paths
            java.nio.file.Path devPath = java.nio.file.Paths.get("src", "main", "resources", "static", "images", safeName);
            java.nio.file.Path runtimePath = java.nio.file.Paths.get("target", "classes", "static", "images", safeName);
            java.nio.file.Files.createDirectories(devPath.getParent());
            java.nio.file.Files.createDirectories(runtimePath.getParent());
            byte[] bytes = file.getBytes();
            java.nio.file.Files.write(devPath, bytes);
            java.nio.file.Files.write(runtimePath, bytes);

            // Persist ProductImage
            com.corethreads.corethreads.entity.ProductImage img = new com.corethreads.corethreads.entity.ProductImage();
            img.setProduct(product);
            img.setImageUrl("/images/" + safeName);
            img.setDisplayOrder(0);
            img.setUploadedAt(java.time.LocalDateTime.now());
            productImageRepository.save(img);

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("imageUrl", img.getImageUrl()));
        } catch (org.springframework.web.server.ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(Map.of("error", ex.getReason()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Failed to upload image"));
        }
    }
}
