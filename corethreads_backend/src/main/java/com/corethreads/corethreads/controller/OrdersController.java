package com.corethreads.corethreads.controller;

import com.corethreads.corethreads.entity.Orders;
import com.corethreads.corethreads.service.OrdersService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin("*")
public class OrdersController {

    @Autowired
    private OrdersService ordersService;

    @GetMapping
    public List<Orders> getAllOrders() {
        return ordersService.getAllOrders();
    }

    @GetMapping("/{id}")
    public Orders getOrderById(@PathVariable Long id) {
        return ordersService.getOrderById(id);
    }

    @PostMapping("/create/{customerId}")
    public Orders createOrder(@RequestBody Orders order, @PathVariable Long customerId) {
        return ordersService.createOrder(order, customerId);
    }

    @PutMapping("/update/{id}")
    public Orders updateOrder(@PathVariable Long id, @RequestBody Orders order) {
        return ordersService.updateOrder(id, order);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteOrder(@PathVariable Long id) {
        boolean deleted = ordersService.deleteOrder(id);
        return deleted ? "Order deleted successfully" : "Order not found";
    }

    @GetMapping("/customer/{customerId}")
    public List<Orders> getOrdersByCustomer(@PathVariable Long customerId) {
        return ordersService.getOrdersByCustomer(customerId);
    }
}