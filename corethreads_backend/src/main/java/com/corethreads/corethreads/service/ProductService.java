package com.corethreads.corethreads.service;

import com.corethreads.corethreads.dto.ProductSummaryDto;
import com.corethreads.corethreads.entity.Product;
import com.corethreads.corethreads.entity.ProductImage;
import com.corethreads.corethreads.entity.ProductVariant;
import com.corethreads.corethreads.repository.ProductImageRepository;
import com.corethreads.corethreads.repository.ProductRepository;
import com.corethreads.corethreads.repository.ProductVariantRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;

    public ProductService(ProductRepository productRepository,
                          ProductVariantRepository productVariantRepository,
                          ProductImageRepository productImageRepository) {
        this.productRepository = productRepository;
        this.productVariantRepository = productVariantRepository;
        this.productImageRepository = productImageRepository;
    }

    // --- Create or update a product ---
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    // --- Get all products ---
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // --- Get product summaries with first image and lowest price ---
    public List<ProductSummaryDto> getProductSummaries() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());
    }

    // --- Get product by ID ---
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    // --- Delete product ---
    // Perform a safe soft-delete to avoid FK violations with variants/images/orders
    public void deleteProduct(Long id) {
        productRepository.findById(id).ifPresent(product -> {
            product.setActive(false);
            product.setUpdatedAt(java.time.LocalDateTime.now());
            productRepository.save(product);
        });
    }

    // --- Get products by category ---
    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    // --- Search products by keyword ---
    public List<Product> searchProducts(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllProducts();
        }
        return productRepository.searchByKeyword(keyword.trim());
    }

    // --- Get active products only ---
    public List<Product> getActiveProducts() {
        return productRepository.findByIsActiveTrue();
    }

    // --- Get active products by category ---
    public List<Product> getActiveProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryIdAndActiveTrue(categoryId);
    }

    // --- Get product detail by ID ---
    public Optional<Map<String, Object>> getProductDetail(Long productId) {
        return productRepository.findById(productId).map(this::mapToDetail);
    }

    private Map<String, Object> mapToDetail(Product product) {
        // Get all variants
        List<ProductVariant> variants = productVariantRepository.findByProductId(product.getProductId());

        // Get lowest price
        BigDecimal price = variants.stream()
                .map(ProductVariant::getPrice)
                .filter(p -> p != null)
                .min(Comparator.naturalOrder())
                .orElse(BigDecimal.ZERO);

        // Prefer product-level stock when it is positive; otherwise fall back to variant sum
        Long productStock = product.getStock();
        Long variantStockSum = variants.stream()
            .map(ProductVariant::getStock)
            .filter(s -> s != null)
            .reduce(0L, Long::sum);
        Long stock = (productStock != null && productStock > 0) ? productStock : variantStockSum;

        System.out.println("=== PRODUCT DETAIL STOCK CALCULATION ===");
        System.out.println("ProductId: " + product.getProductId());
        System.out.println("Product.stock: " + productStock);
        System.out.println("VariantStock sum: " + variantStockSum);
        System.out.println("Final stock used: " + stock);

        // Get all images ordered by display order
        List<ProductImage> images = productImageRepository.findByProductIdOrderByDisplayOrder(product.getProductId());
        List<String> imageUrls = new ArrayList<>(
            images.stream()
                .map(ProductImage::getImageUrl)
                .map(this::normalizeImageUrl)
                .collect(Collectors.toList())
        );

        if (imageUrls.isEmpty()) {
            imageUrls.add("https://via.placeholder.com/400x400?text=No+Image");
        }

        // Map variants to specs
        List<Map<String, Object>> variantInfos = variants.stream()
            .map(v -> {
                Map<String, Object> m = new HashMap<>();
                m.put("size", v.getSize());
                m.put("color", v.getColor());
                m.put("price", v.getPrice());
                m.put("stock", v.getStock());
                return m;
            })
            .collect(Collectors.toList());

        String category = product.getCategories() != null ? product.getCategories().getName() : "Apparel";

        Map<String, Object> detail = new HashMap<>();
        detail.put("productId", product.getProductId());
        detail.put("name", product.getName());
        detail.put("description", product.getDescription());
        detail.put("price", price);
        detail.put("stock", stock);
        detail.put("imageUrls", imageUrls);
        detail.put("category", category);
        detail.put("variants", variantInfos);
        return detail;
    }

    private String normalizeImageUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            return "https://via.placeholder.com/400x400?text=No+Image";
        }
        boolean isAbsolute = imageUrl.startsWith("http://") || imageUrl.startsWith("https://");
        boolean isStaticPath = imageUrl.startsWith("/images/");
        if (!isAbsolute && !isStaticPath) {
            imageUrl = imageUrl.startsWith("/") ? imageUrl : "/images/" + imageUrl;
        }
        return imageUrl;
    }

    private ProductSummaryDto mapToSummary(Product product) {
        // Get lowest price among variants, if any
        List<ProductVariant> variants = productVariantRepository.findByProductId(product.getProductId());
        BigDecimal price = variants.stream()
                .map(ProductVariant::getPrice)
                .filter(p -> p != null)
                .min(Comparator.naturalOrder())
                .orElse(null);

        // Get first image by display order, if any
        List<ProductImage> images = productImageRepository.findByProductIdOrderByDisplayOrder(product.getProductId());
        String imageUrl = images.stream()
                .map(ProductImage::getImageUrl)
                .findFirst()
                .orElse("https://via.placeholder.com/400x400?text=No+Image");

        // Normalize image URL to point to Spring static folder when a bare filename is stored
        if (imageUrl != null && !imageUrl.isBlank()) {
            boolean isAbsolute = imageUrl.startsWith("http://") || imageUrl.startsWith("https://");
            boolean isStaticPath = imageUrl.startsWith("/images/");
            if (!isAbsolute && !isStaticPath) {
                // If it already starts with '/', keep it; otherwise prefix with '/images/'
                imageUrl = imageUrl.startsWith("/") ? imageUrl : "/images/" + imageUrl;
            }
        }

        // Seller metadata (store name and owning customer) for ownership checks on the client
        Long sellerId = null;
        Long sellerCustomerId = null;
        String sellerStoreName = null;
        if (product.getSeller() != null) {
            sellerId = product.getSeller().getSellerId();
            sellerStoreName = product.getSeller().getStoreName();
            if (product.getSeller().getCustomer() != null) {
                sellerCustomerId = product.getSeller().getCustomer().getCustomerId();
            }
        }

        return new ProductSummaryDto(
                product.getProductId(),
                product.getName(),
                product.getDescription(),
                price,
                imageUrl,
                sellerId,
                sellerCustomerId,
                sellerStoreName,
                product.getProductCode()
        );
    }
}
