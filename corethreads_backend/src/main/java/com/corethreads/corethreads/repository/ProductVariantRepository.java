package com.corethreads.corethreads.repository;

import com.corethreads.corethreads.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    // Use nested property path or explicit JPQL
    @Query("SELECT v FROM ProductVariant v WHERE v.product.productId = :productId")
    List<ProductVariant> findByProductId(@Param("productId") Long productId);
}