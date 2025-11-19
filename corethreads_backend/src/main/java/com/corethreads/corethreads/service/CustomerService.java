package com.corethreads.corethreads.service;

import com.corethreads.corethreads.entity.Customer;
import com.corethreads.corethreads.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * Registers a new customer applying basic password policy and hashing.
     * Policy: password cannot be only letters (must contain at least one non-letter character).
     */
    public Customer registerCustomer(Customer customer) {
        if (customer.getPassword() == null || customer.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
        }
        String raw = customer.getPassword();
        if (raw.matches("^[A-Za-z]+$")) { // purely letters
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must include at least one number or symbol");
        }
        if (raw.length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 6 characters long");
        }
        if (customerRepository.existsByUsername(customer.getUsername())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already taken");
        }
        if (customerRepository.existsByEmail(customer.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        customer.setPassword(passwordEncoder.encode(raw));
        return customerRepository.save(customer);
    }

    /**
     * Attempts login validating username existence and password match.
     */
    public Customer login(String username, String password) {
        return customerRepository.findByUsername(username)
                .filter(c -> passwordEncoder.matches(password, c.getPassword()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
    }
}
