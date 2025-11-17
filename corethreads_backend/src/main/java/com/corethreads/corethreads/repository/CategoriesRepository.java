package com.corethreads.corethreads.repository;

import com.corethreads.corethreads.entity.Categories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriesRepository extends JpaRepository<Categories, Long> {
    // Optional: find category by name
    boolean existsByName(String name);
}