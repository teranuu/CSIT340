package com.corethreads.corethreads.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "product_variants")
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "size")
    private String size;

    @Column(name = "color")
    private String color;

    @Column(name = "sku", unique = true, nullable = false)
    private String sku;

    @Column(name = "stock", nullable = false)
    private int stock;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // --- Constructors ---
    public ProductVariant() {}

    public ProductVariant(String size, String color, String sku, int stock, Product product) {
        this.size = size;
        this.color = color;
        this.sku = sku;
        this.stock = stock;
        this.product = product;
    }

    // --- Getters and Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
}