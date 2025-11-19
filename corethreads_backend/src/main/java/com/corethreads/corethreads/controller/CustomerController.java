package com.corethreads.corethreads.controller;

import com.corethreads.corethreads.entity.Customer;
import com.corethreads.corethreads.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*") // Allow all origins for development
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@RequestBody Customer customer) {
        try {
            Customer registeredCustomer = customerService.registerCustomer(customer);
            return ResponseEntity.ok(registeredCustomer);
        } catch (org.springframework.web.server.ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode())
                    .body(java.util.Map.of("error", ex.getReason()));
        }
    }

    // Simple DTO for login request
    public record LoginRequest(String username, String password) {}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Customer customer = customerService.login(request.username(), request.password());
        // Return a simple map to avoid exposing password
        return ResponseEntity.ok(java.util.Map.of(
                "id", customer.getId(),
                "username", customer.getUsername(),
                "email", customer.getEmail(),
                "firstName", customer.getFirstName(),
                "lastName", customer.getLastName()
        ));
    }
}
