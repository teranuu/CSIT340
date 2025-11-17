package com.corethreads.corethreads.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "orders")
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "order_date")
    private LocalDate orderDate;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "status")
    private String status;

    // ----- Constructors -----

    public Orders() {
    }

    public Orders(Long orderId, LocalDate orderDate, Long customerId, String status) {
        this.orderId = orderId;
        this.orderDate = orderDate;
        this.customerId = customerId;
        this.status = status;
    }

    // ----- Getters and Setters -----

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public LocalDate getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDate orderDate) {
        this.orderDate = orderDate;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
