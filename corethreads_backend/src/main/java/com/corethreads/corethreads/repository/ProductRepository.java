package com.corethreads.corethreads.repository;

import com.corethreads.corethreads.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Find products by category ID
    List<Product> findByCategoryId(Long categoryId);
    
    // Search products by name (case-insensitive)
    List<Product> findByNameContainingIgnoreCase(String name);
    
    // Search products by name or description
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Product> searchByKeyword(@Param("keyword") String keyword);
    
    // Find active products
    List<Product> findByActiveTrue();
    
    // Find products by category and active status
    List<Product> findByCategoryIdAndActiveTrue(Long categoryId);
}