package com.corethreads.corethreads.dto;

public class CategoryDto {
    private Long categoriesId;
    private String name;
    private String description;
    private Long parentId;

    public CategoryDto() {}

    public Long getCategoriesId() { return categoriesId; }
    public void setCategoriesId(Long categoriesId) { this.categoriesId = categoriesId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getParentId() { return parentId; }
    public void setParentId(Long parentId) { this.parentId = parentId; }
}
