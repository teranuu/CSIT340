package com.corethreads.corethreads.service;

import com.corethreads.corethreads.entity.Customer;
import com.corethreads.corethreads.entity.Seller;
import com.corethreads.corethreads.repository.CustomerRepository;
import com.corethreads.corethreads.repository.SellerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class SellerService {

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private CustomerRepository customerRepository;

    /**
     * Register a customer as a seller
     */
    public Seller registerSeller(Long customerId, String storeName, String storeDescription) {
        // Verify customer exists
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));

        // Check if customer is already a seller
        if (sellerRepository.findByCustomer_CustomerId(customerId).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Customer is already registered as a seller");
        }

        // Validate store name
        if (storeName == null || storeName.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Store name is required");
        }

        Seller seller = new Seller();
        seller.setCustomer(customer);
        seller.setStoreName(storeName);
        seller.setStoreDescription(storeDescription);
        seller.setVerified(false);
        seller.setCreatedAt(LocalDateTime.now());

        return sellerRepository.save(seller);
    }

    /**
     * Get seller profile by customer ID
     */
    public Optional<Seller> getSellerByCustomerId(Long customerId) {
        return sellerRepository.findByCustomer_CustomerId(customerId);
    }

    /**
     * Get seller by seller ID
     */
    public Seller getSellerById(Long sellerId) {
        return sellerRepository.findById(sellerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Seller not found"));
    }

    /**
     * Update seller profile
     */
    public Seller updateSeller(Long sellerId, String storeName, String storeDescription) {
        Seller seller = getSellerById(sellerId);

        if (storeName != null && !storeName.isBlank()) {
            seller.setStoreName(storeName);
        }
        if (storeDescription != null) {
            seller.setStoreDescription(storeDescription);
        }

        return sellerRepository.save(seller);
    }

    /**
     * Check if a customer is a seller
     */
    public boolean isCustomerSeller(Long customerId) {
        return sellerRepository.findByCustomer_CustomerId(customerId).isPresent();
    }
}
