package com.corethreads.corethreads.controller;

import com.corethreads.corethreads.entity.Address;
import com.corethreads.corethreads.entity.Customer;
import com.corethreads.corethreads.repository.AddressRepository;
import com.corethreads.corethreads.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private CustomerRepository customerRepository;

    /**
     * ✅ Get all addresses for the authenticated user
     */
    @GetMapping
    public ResponseEntity<?> getAddresses(HttpServletRequest request) {
        try {
            Long customerId = getAuthenticatedCustomerId(request);
            if (customerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not authenticated"));
            }

            List<Address> addresses = addressRepository.findByCustomerCustomerId(customerId);
            List<Map<String, ?>> response = addresses.stream().map(addr -> {
                Customer customer = addr.getCustomer();
                String firstName = customer != null ? safeString(customer.getFirstName()) : "";
                String lastName = customer != null ? safeString(customer.getLastName()) : "";
                return Map.ofEntries(
                        Map.entry("id", addr.getAddressId()),
                        Map.entry("firstName", firstName),
                        Map.entry("lastName", lastName),
                        Map.entry("phone", addr.getPhone() != null ? addr.getPhone() : ""),
                        Map.entry("street", addr.getStreetAddress()),
                        Map.entry("city", (addr.getCity() != null ? addr.getCity() : "") + ", " + 
                                          (addr.getStateProvince() != null ? addr.getStateProvince() : "") + ", " + 
                                          (addr.getPostalCode() != null ? addr.getPostalCode() : "")),
                        Map.entry("isDefault", addr.isDefault())
                );
            }).collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch addresses: " + ex.getMessage()));
        }
    }

    /**
     * ✅ Create a new address for the authenticated user
     */
    @PostMapping
    public ResponseEntity<?> createAddress(@RequestBody Map<String, String> addressData, HttpServletRequest request) {
        try {
            Long customerId = getAuthenticatedCustomerId(request);
            System.out.println("DEBUG: customerId from session = " + customerId);
            
            if (customerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not authenticated"));
            }

            // Validate input
            String phone = sanitizeInput(addressData.get("phone"));
            String street = sanitizeInput(addressData.get("street"));
            String city = sanitizeInput(addressData.get("city"));

            if ((phone == null || phone.isEmpty()) && customerRepository.findById(customerId).map(Customer::getPhoneNumber).orElse("" ).isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Phone is required"));
            }
            if (street == null || street.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Street is required"));
            }
            if (city == null || city.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "City is required"));
            }

            Customer customer = customerRepository.findByCustomerIdNative(customerId)
                    .orElseThrow(() -> {
                        System.err.println("DEBUG: Customer not found for customerId: " + customerId);
                        System.err.println("DEBUG: All customers count: " + customerRepository.findAll().size());
                        System.err.println("DEBUG: All customer IDs: " + customerRepository.findAll().stream().map(c -> c.getCustomerId()).toList());
                        return new RuntimeException("Customer not found (ID: " + customerId + ")");
                    });

            if (phone == null || phone.isEmpty()) {
                phone = sanitizeInput(customer.getPhoneNumber());
            }

            Address address = new Address();
            address.setCustomer(customer);
            address.setContactName(buildCustomerName(customer));
            address.setPhone(phone);
            address.setStreetAddress(street);
            address.setCity(city);
            address.setStateProvince("Philippines"); // Default
            address.setPostalCode("");
            address.setCountry("Philippines"); // Default
            address.setDefault(false);

            // If this is the first address, set it as default
            List<Address> existingAddresses = addressRepository.findByCustomerCustomerId(customerId);
            if (existingAddresses.isEmpty()) {
                address.setDefault(true);
            }

            Address savedAddress = addressRepository.save(address);

            return ResponseEntity.ok(Map.of(
                    "id", savedAddress.getAddressId(),
                    "message", "Address created successfully"
            ));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create address: " + ex.getMessage()));
        }
    }

    /**
     * ✅ Update an address
     */
    @PutMapping("/{addressId}")
    public ResponseEntity<?> updateAddress(@PathVariable Long addressId, @RequestBody Map<String, String> addressData, HttpServletRequest request) {
        try {
            Long customerId = getAuthenticatedCustomerId(request);
            if (customerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not authenticated"));
            }

            Address address = addressRepository.findById(addressId)
                    .orElseThrow(() -> new RuntimeException("Address not found"));

            // Verify ownership
            if (!address.getCustomer().getCustomerId().equals(customerId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Unauthorized"));
            }

            // Update fields
            String phone = sanitizeInput(addressData.get("phone"));
            String street = sanitizeInput(addressData.get("street"));
            String city = sanitizeInput(addressData.get("city"));

            if (phone != null && !phone.isEmpty()) address.setPhone(phone);
            if (street != null && !street.isEmpty()) address.setStreetAddress(street);
            if (city != null && !city.isEmpty()) address.setCity(city);

            addressRepository.save(address);

            return ResponseEntity.ok(Map.of("message", "Address updated successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update address"));
        }
    }

    /**
     * ✅ Delete an address
     */
    @DeleteMapping("/{addressId}")
    public ResponseEntity<?> deleteAddress(@PathVariable Long addressId, HttpServletRequest request) {
        try {
            Long customerId = getAuthenticatedCustomerId(request);
            if (customerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not authenticated"));
            }

            Address address = addressRepository.findById(addressId)
                    .orElseThrow(() -> new RuntimeException("Address not found"));

            // Verify ownership
            if (!address.getCustomer().getCustomerId().equals(customerId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Unauthorized"));
            }

            // If deleting default address, set another as default
            if (address.isDefault()) {
                List<Address> otherAddresses = addressRepository.findByCustomerCustomerId(customerId).stream()
                        .filter(a -> !a.getAddressId().equals(addressId))
                        .collect(Collectors.toList());
                
                if (!otherAddresses.isEmpty()) {
                    Address newDefault = otherAddresses.get(0);
                    newDefault.setDefault(true);
                    addressRepository.save(newDefault);
                }
            }

            addressRepository.delete(address);
            return ResponseEntity.ok(Map.of("message", "Address deleted successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete address"));
        }
    }

    /**
     * ✅ Set address as default
     */
    @PatchMapping("/{addressId}/set-default")
    public ResponseEntity<?> setDefaultAddress(@PathVariable Long addressId, HttpServletRequest request) {
        try {
            Long customerId = getAuthenticatedCustomerId(request);
            if (customerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not authenticated"));
            }

            Address address = addressRepository.findById(addressId)
                    .orElseThrow(() -> new RuntimeException("Address not found"));

            // Verify ownership
            if (!address.getCustomer().getCustomerId().equals(customerId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Unauthorized"));
            }

            // Remove default from all other addresses
            List<Address> allAddresses = addressRepository.findByCustomerCustomerId(customerId);
            for (Address addr : allAddresses) {
                addr.setDefault(false);
                addressRepository.save(addr);
            }

            // Set this address as default
            address.setDefault(true);
            addressRepository.save(address);

            return ResponseEntity.ok(Map.of("message", "Default address updated"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to set default address"));
        }
    }

    /**
     * ✅ SECURITY FIX: Sanitizes input to prevent injection attacks
     */
    private String sanitizeInput(String input) {
        if (input == null) return "";
        return input
                .replaceAll("[\\x00-\\x1F\\x7F]", "")
                .replace("<", "")
                .replace(">", "")
                .replace("\"", "")
                .replace("'", "")
                .substring(0, Math.min(input.length(), 255));
    }

    /**
     * ✅ SECURITY FIX: Extracts authenticated customer ID from session
     */
    private Long getAuthenticatedCustomerId(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return null;
        Object customerId = session.getAttribute("customerId");
        if (customerId instanceof Long) {
            return (Long) customerId;
        } else if (customerId instanceof Integer) {
            return ((Integer) customerId).longValue();
        }
        return null;
    }

    private String buildCustomerName(Customer customer) {
        if (customer == null) return "";
        return (safeString(customer.getFirstName()) + " " + safeString(customer.getLastName())).trim();
    }

    private String safeString(String value) {
        return value == null ? "" : value.trim();
    }
}
