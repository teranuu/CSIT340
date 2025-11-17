package com.corethreads.corethreads.service;

import com.corethreads.corethreads.entity.ProductVariant;
import com.corethreads.corethreads.repository.ProductVariantRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductVariantService {

    private final ProductVariantRepository variantRepository;

    public ProductVariantService(ProductVariantRepository variantRepository) {
        this.variantRepository = variantRepository;
    }

    // --- Create or update a variant ---
    public ProductVariant saveVariant(ProductVariant variant) {
        return variantRepository.save(variant);
    }

    // --- Get all variants ---
    public List<ProductVariant> getAllVariants() {
        return variantRepository.findAll();
    }

    // --- Get variants for a specific product ---
    public List<ProductVariant> getVariantsByProductId(Long productId) {
        return variantRepository.findByProductId(productId);
    }

    // --- Get variant by ID ---
    public Optional<ProductVariant> getVariantById(Long id) {
        return variantRepository.findById(id);
    }

    // --- Delete variant ---
    public void deleteVariant(Long id) {
        variantRepository.deleteById(id);
    }
}