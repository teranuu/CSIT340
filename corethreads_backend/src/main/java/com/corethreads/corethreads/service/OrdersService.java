package com.corethreads.corethreads.service;

import com.corethreads.corethreads.entity.Customer;
import com.corethreads.corethreads.entity.Orders;
import com.corethreads.corethreads.repository.CustomerRepository;
import com.corethreads.corethreads.repository.OrdersRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrdersService {

    @Autowired
    private OrdersRepository ordersRepository;

    @Autowired
    private CustomerRepository customerRepository;

    public List<Orders> getAllOrders() {
        return ordersRepository.findAll();
    }

    public Orders getOrderById(Long id) {
        return ordersRepository.findById(id).orElse(null);
    }

    public Orders createOrder(Orders order, Long customerId) {
        Customer customer = customerRepository.findById(customerId).orElse(null);

        if (customer == null) {
            throw new RuntimeException("Customer not found with ID: " + customerId);
        }

        order.setCustomer(customer);
        return ordersRepository.save(order);
    }

    public Orders updateOrder(Long id, Orders orderDetails) {
        Orders existingOrder = ordersRepository.findById(id).orElse(null);

        if (existingOrder == null) {
            return null;
        }

        existingOrder.setOrderDate(orderDetails.getOrderDate());
        existingOrder.setOrderStatus(orderDetails.getOrderStatus());
        existingOrder.setTotalAmount(orderDetails.getTotalAmount());

        return ordersRepository.save(existingOrder);
    }

    public boolean deleteOrder(Long id) {
        if (ordersRepository.existsById(id)) {
            ordersRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Orders> getOrdersByCustomer(Long customerId) {
        return ordersRepository.findByCustomerCustomerId(customerId);
    }
}