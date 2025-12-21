package com.corethreads.corethreads.dto;

import java.math.BigDecimal;

public class ProductSummaryDto {
    private Long productId;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;

    // Seller metadata so the frontend can avoid showing a user's own products
    private Long sellerId;
    private Long sellerCustomerId;
    private String sellerStoreName;

    // Product code for cross-lookups
    private String productCode;

    public ProductSummaryDto(Long productId,
                             String name,
                             String description,
                             BigDecimal price,
                             String imageUrl,
                             Long sellerId,
                             Long sellerCustomerId,
                             String sellerStoreName,
                             String productCode) {
        this.productId = productId;
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.sellerId = sellerId;
        this.sellerCustomerId = sellerCustomerId;
        this.sellerStoreName = sellerStoreName;
        this.productCode = productCode;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Long getSellerId() {
        return sellerId;
    }

    public void setSellerId(Long sellerId) {
        this.sellerId = sellerId;
    }

    public Long getSellerCustomerId() {
        return sellerCustomerId;
    }

    public void setSellerCustomerId(Long sellerCustomerId) {
        this.sellerCustomerId = sellerCustomerId;
    }

    public String getSellerStoreName() {
        return sellerStoreName;
    }

    public void setSellerStoreName(String sellerStoreName) {
        this.sellerStoreName = sellerStoreName;
    }

    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }
}
