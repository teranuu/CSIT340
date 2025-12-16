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
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
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
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
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

        return new ProductSummaryDto(
                product.getProductId(),
                product.getName(),
                product.getDescription(),
                price,
                imageUrl
        );
    }
}
