package com.corethreads.corethreads.service;

import com.corethreads.corethreads.entity.Customer;
import com.corethreads.corethreads.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

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
        
        // ✅ SECURITY FIX: Enforce strong password policy (CWE-521)
        // Requires: 8-64 chars, uppercase, lowercase, number, special char
        if (raw.length() < 8 || raw.length() > 64) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be 8-64 characters");
        }
        if (!raw.matches(".*[A-Z].*")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password needs uppercase letter");
        }
        if (!raw.matches(".*[a-z].*")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password needs lowercase letter");
        }
        if (!raw.matches(".*\\d.*")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password needs number");
        }
        if (!raw.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};:'\"\\|,.<>/?].*")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password needs special character");
        }
        
        // Check for duplicate username
        if (customerRepository.existsByUsername(customer.getUsername())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already taken");
        }
        
        // Check for duplicate email
        if (customerRepository.existsByEmail(customer.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        // Hash password before saving
        customer.setPassword(passwordEncoder.encode(raw));
        return customerRepository.save(customer);
    }

    /**
     * Attempts login validating username existence and password match.
     * Returns the customer if login is successful.
     */
    public Customer login(String username, String password) {
        return customerRepository.findByUsername(username)
                .filter(c -> passwordEncoder.matches(password, c.getPassword()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
    }

    /**
     * Retrieves customer by ID (safe operation)
     */
    public Customer getCustomerById(Long customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));
    }

    /**
     * Retrieves customer by username (used internally)
     */
    public Optional<Customer> findByUsername(String username) {
        return customerRepository.findByUsername(username);
    }

    /**
     * Updates customer information (profile data)
     * Does NOT allow updating username or password through this endpoint
     */
    public Customer updateCustomer(Long customerId, Customer customerData) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));

        // ✅ SECURITY FIX: Only allow updating safe fields, prevent username/password changes here
        if (customerData.getFirstName() != null && !customerData.getFirstName().isBlank()) {
            customer.setFirstName(customerData.getFirstName());
        }
        if (customerData.getLastName() != null && !customerData.getLastName().isBlank()) {
            customer.setLastName(customerData.getLastName());
        }
        if (customerData.getEmail() != null && !customerData.getEmail().isBlank()) {
            // Check for duplicate email (allow same email as current user)
            if (!customer.getEmail().equals(customerData.getEmail()) 
                    && customerRepository.existsByEmail(customerData.getEmail())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
            }
            customer.setEmail(customerData.getEmail());
        }
        if (customerData.getDateOfBirth() != null) {
            customer.setDateOfBirth(customerData.getDateOfBirth());
        }
        if (customerData.getGender() != null && !customerData.getGender().isBlank()) {
            customer.setGender(customerData.getGender());
        }
        if (customerData.getPhoneNumber() != null && !customerData.getPhoneNumber().isBlank()) {
            customer.setPhoneNumber(customerData.getPhoneNumber());
        }

        return customerRepository.save(customer);
    }

    /**
     * Changes customer password after validating the old password
     * Applies the same strong password policy as registration
     * ✅ SECURITY FIX: Includes comprehensive input validation and sanitization
     */
    public Customer changePassword(Long customerId, String oldPassword, String newPassword) {
        // Validate inputs are not null or empty
        if (oldPassword == null || oldPassword.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Old password is required");
        }
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New password is required");
        }

        // Retrieve customer
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));

        // ✅ SECURITY FIX: Validate old password (CWE-257)
        if (!passwordEncoder.matches(oldPassword, customer.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Current password is incorrect");
        }

        // ✅ SECURITY FIX: Prevent password reuse (CWE-521)
        if (oldPassword.equals(newPassword)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New password must be different from current password");
        }

        // Validate new password length to prevent buffer overflow / DoS
        if (newPassword.length() < 8 || newPassword.length() > 128) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be 8-128 characters");
        }

        // ✅ SECURITY FIX: Validate strong password policy (CWE-521)
        if (!newPassword.matches(".*[A-Z].*")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password needs uppercase letter");
        }
        if (!newPassword.matches(".*[a-z].*")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password needs lowercase letter");
        }
        if (!newPassword.matches(".*\\d.*")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password needs number");
        }
        if (!newPassword.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};:'\"\\|,.<>/?].*")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password needs special character");
        }

        // ✅ SECURITY FIX: Hash and save new password (CWE-256)
        customer.setPassword(passwordEncoder.encode(newPassword));
        return customerRepository.save(customer);
    }
}
