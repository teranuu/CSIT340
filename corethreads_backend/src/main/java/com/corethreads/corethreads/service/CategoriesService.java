package com.corethreads.corethreads.service;

import com.corethreads.corethreads.entity.Categories;
import com.corethreads.corethreads.repository.CategoriesRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriesService {

    private final CategoriesRepository categoriesRepository;

    public CategoriesService(CategoriesRepository categoriesRepository) {
        this.categoriesRepository = categoriesRepository;
    }

    // --- Get all categories ---
    public List<Categories> getAllCategories() {
        return categoriesRepository.findAll();
    }

    // --- Get category by ID ---
    public Optional<Categories> getCategoryById(Long id) {
        return categoriesRepository.findById(id);
    }

    // --- Save or update category ---
    public Categories saveCategory(Categories category) {
        return categoriesRepository.save(category);
    }

    // --- Delete category ---
    public void deleteCategory(Long id) {
        categoriesRepository.deleteById(id);
    }
}