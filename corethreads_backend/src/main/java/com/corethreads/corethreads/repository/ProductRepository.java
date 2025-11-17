package com.corethreads.corethreads.repository;

import com.corethreads.corethreads.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Add custom queries if needed, e.g. find by category
}