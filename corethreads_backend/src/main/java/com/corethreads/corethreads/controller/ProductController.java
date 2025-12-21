package com.corethreads.corethreads.controller;

import com.corethreads.corethreads.dto.ProductSummaryDto;
import com.corethreads.corethreads.entity.Product;
import com.corethreads.corethreads.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // --- Get all products ---
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // --- Get product summaries with image and lowest price ---
    @GetMapping("/summary")
    public ResponseEntity<List<ProductSummaryDto>> getProductSummaries() {
        return ResponseEntity.ok(productService.getProductSummaries());
    }

    // --- Get product by ID ---
    @GetMapping("/{productId}")
    public ResponseEntity<Map<String, Object>> getProductById(@PathVariable Long productId) {
        return productService.getProductDetail(productId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // --- Search products by keyword ---
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(productService.searchProducts(keyword));
    }

    // --- Get products by category ---
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable Long categoryId,
                                                               @RequestParam(defaultValue = "false") boolean activeOnly) {
        List<Product> products = activeOnly 
            ? productService.getActiveProductsByCategory(categoryId)
            : productService.getProductsByCategory(categoryId);
        return ResponseEntity.ok(products);
    }

    // --- Get active products only ---
    @GetMapping("/active")
    public ResponseEntity<List<Product>> getActiveProducts() {
        return ResponseEntity.ok(productService.getActiveProducts());
    }

    // --- Create product ---
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productService.saveProduct(product));
    }

    // --- Update product ---
    @PutMapping("/{productId}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long productId, @RequestBody Product product) {
        return productService.getProductById(productId)
                .map(existing -> {
                    existing.setName(product.getName());
                    existing.setDescription(product.getDescription());
                    existing.setCategories(product.getCategories());
                    existing.setActive(product.isActive());
                    return ResponseEntity.ok(productService.saveProduct(existing));
                }).orElse(ResponseEntity.notFound().build());
    }

    // --- Delete product ---
    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }
}