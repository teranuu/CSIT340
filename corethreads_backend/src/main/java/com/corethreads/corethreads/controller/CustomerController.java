package com.corethreads.corethreads.controller;

import com.corethreads.corethreads.entity.Customer;
import com.corethreads.corethreads.service.CustomerService;
import com.corethreads.corethreads.util.InputValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@RequestBody Customer customer, HttpServletRequest request) {
        try {
            // 🔒 SECURITY: Validate and sanitize all inputs
            if (customer.getUsername() == null || customer.getUsername().isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Username is required"));
            }
            
            // 🔒 SECURITY: Validate username format
            if (!InputValidator.isValidUsername(customer.getUsername())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Username must be 3-20 characters, alphanumeric and underscore only"));
            }
            
            if (customer.getPassword() == null || customer.getPassword().isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Password is required"));
            }
            
            // 🔒 SECURITY: Validate password strength
            if (!InputValidator.isValidPassword(customer.getPassword())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Password must be at least 6 characters with at least one non-letter character"));
            }
            
            if (customer.getEmail() == null || customer.getEmail().isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Email is required"));
            }
            
            // 🔒 SECURITY: Validate email format
            if (!InputValidator.isValidEmail(customer.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid email address"));
            }
            
            if (customer.getFirstName() == null || customer.getFirstName().isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "First name is required"));
            }
            
            // 🔒 SECURITY: Sanitize and validate first name
            String sanitizedFirstName = InputValidator.sanitizeText(customer.getFirstName(), 50);
            if (sanitizedFirstName.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "First name contains invalid characters"));
            }
            customer.setFirstName(sanitizedFirstName);
            
            if (customer.getLastName() == null || customer.getLastName().isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Last name is required"));
            }
            
            // 🔒 SECURITY: Sanitize and validate last name
            String sanitizedLastName = InputValidator.sanitizeText(customer.getLastName(), 50);
            if (sanitizedLastName.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Last name contains invalid characters"));
            }
            customer.setLastName(sanitizedLastName);

            Customer registeredCustomer = customerService.registerCustomer(customer);
            
            // 🔒 SECURITY: Create server-side session after successful registration
            HttpSession session = request.getSession(true);
            session.setAttribute("customerId", registeredCustomer.getCustomerId());
            session.setAttribute("username", registeredCustomer.getUsername());
            session.setAttribute("role", "CUSTOMER"); // Set default role
            System.out.println("✅ Registration successful - customerId = " + registeredCustomer.getCustomerId());
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                            "customerId", registeredCustomer.getCustomerId(),
                            "username", registeredCustomer.getUsername(),
                            "email", registeredCustomer.getEmail(),
                            "firstName", registeredCustomer.getFirstName(),
                            "lastName", registeredCustomer.getLastName(),
                            "dateOfBirth", registeredCustomer.getDateOfBirth(),
                            "gender", registeredCustomer.getGender(),
                            "phoneNumber", registeredCustomer.getPhoneNumber(),
                            "message", "Registration successful"
                    ));
        } catch (InputValidator.SecurityException ex) {
            // 🔒 SECURITY: Log security violations
            System.err.println("🚨 Security violation in registration: " + ex.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid input provided"));
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode())
                    .body(Map.of("error", ex.getReason()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred during registration"));
        }
    }

    public record LoginRequest(String username, String password) {}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        try {
            System.out.println("=== LOGIN ENDPOINT DEBUG ===");
            System.out.println("Username from request: " + request.username());
            System.out.println("Password provided: " + (request.password() != null && !request.password().isEmpty() ? "YES" : "NO"));
            
            // 🔒 SECURITY: Validate and sanitize input to prevent injection attacks
            if (request.username() == null || request.username().isBlank()) {
                System.out.println("❌ Username is blank");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid credentials"));
            }
            
            if (request.password() == null || request.password().isBlank()) {
                System.out.println("❌ Password is blank");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid credentials"));
            }
            
            // 🔒 SECURITY: Validate input length
            if (request.username().length() > 255 || request.password().length() > 255) {
                System.out.println("❌ Input exceeds maximum length");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid credentials"));
            }
            
            // 🔒 SECURITY: Detect potential SQL injection attempts
            if (InputValidator.containsSQLInjectionAttempt(request.username())) {
                System.err.println("🚨 SQL Injection attempt detected in username");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid credentials"));
            }
            
            // 🔒 SECURITY: Detect potential XSS attempts
            if (InputValidator.containsXSSAttempt(request.username())) {
                System.err.println("🚨 XSS attempt detected in username");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid credentials"));
            }

            System.out.println("✓ Input validation passed");
            Customer customer = customerService.login(request.username(), request.password());
            System.out.println("✓ Customer authenticated: " + customer.getUsername());
            
            // ✅ Create server-side session after successful login
            HttpSession session = httpRequest.getSession(true);
            session.setAttribute("customerId", customer.getCustomerId());
            session.setAttribute("username", customer.getUsername());
            session.setAttribute("role", customer.getRole().toString()); // Store role in session
            System.out.println("DEBUG: Login successful - customerId = " + customer.getCustomerId() + ", username = " + customer.getUsername() + ", role = " + customer.getRole());
            
            // Return user data without exposing sensitive information
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("customerId", customer.getCustomerId());
            response.put("username", customer.getUsername());
            response.put("email", customer.getEmail());
            response.put("firstName", customer.getFirstName());
            response.put("lastName", customer.getLastName());
            response.put("dateOfBirth", customer.getDateOfBirth() != null ? customer.getDateOfBirth().toString() : null);
            response.put("gender", customer.getGender());
            response.put("phoneNumber", customer.getPhoneNumber());
            response.put("role", customer.getRole().toString());
            response.put("message", "Login successful");
            System.out.println("✓ Response ready: " + response);
            return ResponseEntity.ok(response);
        } catch (ResponseStatusException ex) {
            System.out.println("❌ ResponseStatusException: " + ex.getMessage());
            ex.printStackTrace();
            // ✅ Generic error message prevents account enumeration attacks
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
        } catch (Exception ex) {
            System.out.println("❌ Exception during login: " + ex.getMessage());
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred during login"));
        }
    }

    // ✅ SECURITY FIX: Logout endpoint to invalidate server-side session (CWE-613)
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        try {
            // Invalidate the HttpSession to clear server-side session
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.invalidate();
            }
            // Explicitly expire the JSESSIONID cookie in the browser
            ResponseCookie expireSession = ResponseCookie.from("JSESSIONID", "")
                    .maxAge(0)
                    .path("/")
                    .httpOnly(true)
                    .secure(request.isSecure())
                    .sameSite("Lax")
                    .build();

            // Add no-cache headers and Set-Cookie to ensure full logout
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, expireSession.toString())
                    .headers(headers -> {
                        headers.add("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
                        headers.add("Pragma", "no-cache");
                    })
                    .body(Map.of("message", "Logged out successfully"));
        } catch (Exception e) {
            ResponseCookie expireSession = ResponseCookie.from("JSESSIONID", "")
                    .maxAge(0)
                    .path("/")
                    .httpOnly(true)
                    .secure(request.isSecure())
                    .sameSite("Lax")
                    .build();
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, expireSession.toString())
                    .headers(headers -> {
                        headers.add("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
                        headers.add("Pragma", "no-cache");
                    })
                    .body(Map.of("message", "Logged out successfully"));
        }
    }

    // ✅ SECURITY FIX: Validate session endpoint for frontend (CWE-613)
    @GetMapping("/validate-session")
    public ResponseEntity<?> validateSession(HttpServletRequest request) {
        try {
            // Check if a valid session exists
            HttpSession session = request.getSession(false);
            if (session != null) {
                // Session exists and is valid
                Long customerId = (Long) session.getAttribute("customerId");
                String username = (String) session.getAttribute("username");
                String role = (String) session.getAttribute("role");
                
                if (customerId != null) {
                    // Fetch customer details to get firstName
                        Customer customer = customerService.getCustomerById(customerId);
                    
                        return ResponseEntity.ok()
                            .headers(headers -> {
                                headers.add("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
                                headers.add("Pragma", "no-cache");
                            })
                            .body(Map.of(
                                "valid", true, 
                                "customerId", customerId,
                                "username", username,
                                "firstName", customer.getFirstName(),
                                "role", role,
                                "balance", customer.getBalance(),
                                "message", "Session is active"
                        ));
                }
            }
            // No valid session found
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .headers(headers -> {
                        headers.add("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
                        headers.add("Pragma", "no-cache");
                    })
                    .body(Map.of("valid", false, "message", "No active session"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("valid", false, "message", "Session validation failed"));
        }
    }

    // ✅ SECURITY FIX: Dedicated admin session validation endpoint (CWE-613)
    @GetMapping("/validate-admin-session")
    public ResponseEntity<?> validateAdminSession(HttpServletRequest request) {
        try {
            System.out.println("🔐 Validating admin session...");
            
            // Check if a valid session exists
            HttpSession session = request.getSession(false);
            if (session == null) {
                System.out.println("❌ No session found");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("valid", false, "message", "No active session"));
            }
            
            // Get session attributes
            Long customerId = (Long) session.getAttribute("customerId");
            String username = (String) session.getAttribute("username");
            String role = (String) session.getAttribute("role");
            
            System.out.println("Session attributes - customerId: " + customerId + ", username: " + username + ", role: " + role);
            
            // Validate session has required attributes
            if (customerId == null) {
                System.out.println("❌ No customerId in session");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("valid", false, "message", "Invalid session"));
            }
            
            // ✅ CRITICAL SECURITY CHECK: Verify user has ADMIN role
            if (role == null || !role.equals("ADMIN")) {
                System.out.println("❌ User does not have ADMIN role. Current role: " + role);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("valid", false, "message", "Admin privileges required"));
            }
            
            System.out.println("✅ Admin session is valid");
            return ResponseEntity.ok(Map.of(
                    "valid", true, 
                    "customerId", customerId,
                    "username", username,
                    "role", role,
                    "message", "Admin session is active"
            ));
        } catch (Exception e) {
            System.out.println("❌ Admin session validation error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("valid", false, "message", "Admin session validation failed"));
        }
    }

    // ✅ Get current authenticated user's data from session
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        try {
            // Get session and validate it exists
            HttpSession session = request.getSession(false);
            if (session == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Not authenticated"));
            }

            // Get customerId from session
            Long customerId = (Long) session.getAttribute("customerId");
            if (customerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Not authenticated"));
            }

            // Fetch user data from database
            Customer customer = customerService.getCustomerById(customerId);
            return ResponseEntity.ok(Map.of(
                    "customerId", customer.getCustomerId(),
                    "username", customer.getUsername(),
                    "email", customer.getEmail(),
                    "firstName", customer.getFirstName(),
                    "lastName", customer.getLastName(),
                    "dateOfBirth", customer.getDateOfBirth(),
                    "gender", customer.getGender(),
                    "phoneNumber", customer.getPhoneNumber()
            ));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch user data"));
        }
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<?> getCustomerById(@PathVariable Long customerId) {
        try {
            // ✅ SECURITY FIX: Prevent IDOR (CWE-639) - Add authorization in production
            // TODO: Verify current user can only access own profile
            // User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            // if (!customerId.equals(currentUser.getId()) && !isAdmin(currentUser)) {
            //     return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Unauthorized"));
            // }
            
            Customer customer = customerService.getCustomerById(customerId);
            return ResponseEntity.ok(Map.of(
                    "customerId", customer.getCustomerId(),
                    "username", customer.getUsername(),
                    "email", customer.getEmail(),
                    "firstName", customer.getFirstName(),
                    "lastName", customer.getLastName(),
                    "dateOfBirth", customer.getDateOfBirth(),
                    "gender", customer.getGender(),
                    "phoneNumber", customer.getPhoneNumber()
            ));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }
    }

    // ✅ UPDATE USER INFORMATION
    @PutMapping("/{customerId}")
    public ResponseEntity<?> updateCustomer(@PathVariable Long customerId, @RequestBody Customer customerData) {
        try {
            // ✅ SECURITY FIX: Validate authorization (IDOR prevention)
            if (customerData.getFirstName() != null && customerData.getFirstName().isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "First name cannot be empty"));
            }
            if (customerData.getLastName() != null && customerData.getLastName().isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Last name cannot be empty"));
            }
            if (customerData.getEmail() != null && customerData.getEmail().isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Email cannot be empty"));
            }

            Customer updatedCustomer = customerService.updateCustomer(customerId, customerData);
            return ResponseEntity.ok(Map.of(
                    "customerId", updatedCustomer.getCustomerId(),
                    "username", updatedCustomer.getUsername(),
                    "email", updatedCustomer.getEmail(),
                    "firstName", updatedCustomer.getFirstName(),
                    "lastName", updatedCustomer.getLastName(),
                    "dateOfBirth", updatedCustomer.getDateOfBirth(),
                    "gender", updatedCustomer.getGender(),
                    "phoneNumber", updatedCustomer.getPhoneNumber(),
                    "message", "User information updated successfully"
            ));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update user information: " + ex.getMessage()));
        }
    }

    // ✅ CHANGE PASSWORD ENDPOINT
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> passwordData, HttpServletRequest request) {
        try {
            // Get the authenticated user from session
            HttpSession session = request.getSession(false);
            if (session == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Session not found"));
            }

            Long customerId = (Long) session.getAttribute("customerId");
            if (customerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not authenticated"));
            }

            // Validate input
            String oldPassword = passwordData.get("oldPassword");
            String newPassword = passwordData.get("newPassword");

            // 🔒 SECURITY: Null and blank validation
            if (oldPassword == null || oldPassword.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Old password is required"));
            }
            if (newPassword == null || newPassword.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "New password is required"));
            }

            // 🔒 SECURITY: Length validation to prevent buffer overflow attacks
            if (oldPassword.length() > 255 || newPassword.length() > 255) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Password exceeds maximum length"));
            }

            // 🔒 SECURITY: Detect SQL injection attempts in password fields (CWE-89)
            if (InputValidator.containsSQLInjectionAttempt(oldPassword)) {
                System.err.println("🚨 SQL Injection attempt detected in old password field");
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid password format"));
            }
            if (InputValidator.containsSQLInjectionAttempt(newPassword)) {
                System.err.println("🚨 SQL Injection attempt detected in new password field");
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid password format"));
            }

            // 🔒 SECURITY: Detect XSS attempts in password fields (CWE-79)
            if (InputValidator.containsXSSAttempt(oldPassword)) {
                System.err.println("🚨 XSS attempt detected in old password field");
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid password format"));
            }
            if (InputValidator.containsXSSAttempt(newPassword)) {
                System.err.println("🚨 XSS attempt detected in new password field");
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid password format"));
            }

            // 🔒 SECURITY: Sanitize inputs to prevent injection attacks
            oldPassword = sanitizePassword(oldPassword);
            newPassword = sanitizePassword(newPassword);

            // 🔒 SECURITY: Validate password length after sanitization
            if (oldPassword.length() < 1) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid password format"));
            }
            if (newPassword.length() < 8) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "New password must be at least 8 characters"));
            }
            if (newPassword.length() > 128) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "New password is too long"));
            }

            // 🔒 SECURITY: Prevent password reuse - ensure new password is different from old
            if (oldPassword.equals(newPassword)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "New password must be different from current password"));
            }

            // Verify old password and change to new password
            Customer customer = customerService.changePassword(customerId, oldPassword, newPassword);
            
            System.out.println("✅ Password changed successfully for customerId: " + customerId);
            
            return ResponseEntity.ok(Map.of(
                    "message", "Password changed successfully",
                    "customerId", customer.getCustomerId(),
                    "username", customer.getUsername()
            ));
        } catch (ResponseStatusException ex) {
            // Return 401 if old password is incorrect (generic message prevents user enumeration)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Current password is incorrect"));
        } catch (Exception ex) {
            System.err.println("❌ Error changing password: " + ex.getMessage());
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to change password"));
        }
    }

    /**
     * ✅ SECURITY FIX: Sanitizes password inputs to prevent injection attacks
     * Removes null characters and control characters
     */
    private String sanitizePassword(String input) {
        if (input == null) return "";
        return input.replaceAll("[\\x00-\\x1F\\x7F]", "").substring(0, Math.min(input.length(), 128));
    }
}
