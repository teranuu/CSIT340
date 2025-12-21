package com.corethreads.corethreads.repository;

import com.corethreads.corethreads.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Find products by category (Categories PK is categoriesId mapped to column `id`)
    @Query("SELECT p FROM Product p WHERE p.categories.categoriesId = :categoryId")
    List<Product> findByCategoryId(@Param("categoryId") Long categoryId);
    
    // Search products by name (case-insensitive)
    List<Product> findByNameContainingIgnoreCase(String name);
    
    // Search products by name or description
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Product> searchByKeyword(@Param("keyword") String keyword);
    
    // Find active products
    List<Product> findByIsActiveTrue();
    
    // Find products by category and active status
    @Query("SELECT p FROM Product p WHERE p.categories.categoriesId = :categoryId AND p.isActive = true")
    List<Product> findByCategoryIdAndActiveTrue(@Param("categoryId") Long categoryId);
    
    // Find products by seller ID
    List<Product> findBySeller_SellerId(Long sellerId);

    // Find active products by seller ID
    List<Product> findBySeller_SellerIdAndIsActiveTrue(Long sellerId);
}