package com.corethreads.corethreads.repository;

import com.corethreads.corethreads.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    @Query("SELECT i FROM ProductImage i WHERE i.product.productId = :productId ORDER BY i.displayOrder ASC")
    List<ProductImage> findByProductIdOrderByDisplayOrder(@Param("productId") Long productId);
}
