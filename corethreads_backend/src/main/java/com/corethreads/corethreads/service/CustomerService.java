package com.corethreads.corethreads.service;

import com.corethreads.corethreads.entity.Customer;
import com.corethreads.corethreads.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public Customer registerCustomer(Customer customer) {
        // TODO: Add password hashing before saving
        return customerRepository.save(customer);
    }
}
