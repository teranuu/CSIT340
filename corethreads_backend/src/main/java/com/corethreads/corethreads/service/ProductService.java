package com.corethreads.corethreads.service;

import com.corethreads.corethreads.entity.Product;
import com.corethreads.corethreads.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // --- Create or update a product ---
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    // --- Get all products ---
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // --- Get product by ID ---
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    // --- Delete product ---
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}