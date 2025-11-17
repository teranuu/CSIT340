package com.corethreads.corethreads.controller;

import com.corethreads.corethreads.entity.Categories;
import com.corethreads.corethreads.service.CategoriesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoriesController {

    private final CategoriesService categoriesService;

    public CategoriesController(CategoriesService categoriesService) {
        this.categoriesService = categoriesService;
    }

    // --- Get all categories ---
    @GetMapping
    public ResponseEntity<List<Categories>> getAllCategories() {
        return ResponseEntity.ok(categoriesService.getAllCategories());
    }

    // --- Get category by ID ---
    @GetMapping("/{id}")
    public ResponseEntity<Categories> getCategoryById(@PathVariable Long id) {
        return categoriesService.getCategoryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // --- Create category ---
    @PostMapping
    public ResponseEntity<Categories> createCategory(@RequestBody Categories category) {
        return ResponseEntity.ok(categoriesService.saveCategory(category));
    }

    // --- Update category ---
    @PutMapping("/{id}")
    public ResponseEntity<Categories> updateCategory(@PathVariable Long id, @RequestBody Categories category) {
        return categoriesService.getCategoryById(id)
                .map(existing -> {
                    existing.setName(category.getName());
                    existing.setDescription(category.getDescription());
                    return ResponseEntity.ok(categoriesService.saveCategory(existing));
                }).orElse(ResponseEntity.notFound().build());
    }

    // --- Delete category ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoriesService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}