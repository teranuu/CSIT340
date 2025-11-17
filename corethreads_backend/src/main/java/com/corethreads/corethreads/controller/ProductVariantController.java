package com.corethreads.corethreads.controller;

import com.corethreads.corethreads.entity.ProductVariant;
import com.corethreads.corethreads.service.ProductVariantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/variants")
public class ProductVariantController {

    private final ProductVariantService variantService;

    public ProductVariantController(ProductVariantService variantService) {
        this.variantService = variantService;
    }

    // --- Get all variants ---
    @GetMapping
    public ResponseEntity<List<ProductVariant>> getAllVariants() {
        return ResponseEntity.ok(variantService.getAllVariants());
    }

    // --- Get variant by ID ---
    @GetMapping("/{id}")
    public ResponseEntity<ProductVariant> getVariantById(@PathVariable Long id) {
        return variantService.getVariantById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // --- Get variants for a product ---
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductVariant>> getVariantsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(variantService.getVariantsByProductId(productId));
    }

    // --- Create variant ---
    @PostMapping
    public ResponseEntity<ProductVariant> createVariant(@RequestBody ProductVariant variant) {
        return ResponseEntity.ok(variantService.saveVariant(variant));
    }

    // --- Update variant ---
    @PutMapping("/{id}")
    public ResponseEntity<ProductVariant> updateVariant(@PathVariable Long id, @RequestBody ProductVariant variant) {
        return variantService.getVariantById(id)
                .map(existing -> {
                    existing.setSize(variant.getSize());
                    existing.setColor(variant.getColor());
                    existing.setSku(variant.getSku());
                    existing.setStock(variant.getStock());
                    existing.setProduct(variant.getProduct());
                    return ResponseEntity.ok(variantService.saveVariant(existing));
                }).orElse(ResponseEntity.notFound().build());
    }

    // --- Delete variant ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVariant(@PathVariable Long id) {
        variantService.deleteVariant(id);
        return ResponseEntity.noContent().build();
    }
}