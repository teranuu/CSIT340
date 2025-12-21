package com.corethreads.corethreads.init;

import com.corethreads.corethreads.entity.Customer;
import com.corethreads.corethreads.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Order(1) // Run before DataInitializer
public class AdminInitializer implements CommandLineRunner {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Value("${admin.username:admin}")
    private String adminUsername;

    @Value("${admin.password:}")
    private String adminPassword;

    @Value("${admin.email:admin@corethreads.com}")
    private String adminEmail;

    @Value("${admin.firstname:Admin}")
    private String adminFirstName;

    @Value("${admin.lastname:User}")
    private String adminLastName;

    public AdminInitializer(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Debug: Print what we're reading
        System.out.println("=== ADMIN INITIALIZER DEBUG ===");
        System.out.println("Admin Username: " + adminUsername);
        System.out.println("Admin Password Set: " + (adminPassword != null && !adminPassword.trim().isEmpty()));
        System.out.println("Admin Email: " + adminEmail);
        
        // Only create admin if password is provided via environment variable or application.properties
        if (adminPassword == null || adminPassword.trim().isEmpty()) {
            System.out.println("⚠ Admin password not set. Skipping admin user creation.");
            System.out.println("  To create an admin user, add to application.properties:");
            System.out.println("  admin.password=YourSecurePassword123");
            return;
        }

        // Check if admin user already exists
        var existingAdmin = customerRepository.findByUsername(adminUsername);
        if (existingAdmin.isPresent()) {
            Customer admin = existingAdmin.get();
            
            // Ensure admin has ADMIN role
            if (admin.getRole() != Customer.Role.ADMIN) {
                System.out.println("⚠ Updating user role to ADMIN...");
                admin.setRole(Customer.Role.ADMIN);
                customerRepository.save(admin);
                System.out.println("✓ User role updated to ADMIN");
            }
            
            // Check if password needs to be updated (not BCrypted)
            if (!admin.getPassword().startsWith("$2")) {
                System.out.println("⚠ Updating admin user password to use BCrypt encryption...");
                String hashedPassword = passwordEncoder.encode(adminPassword);
                admin.setPassword(hashedPassword);
                customerRepository.save(admin);
                System.out.println("✓ Admin user password updated successfully");
                System.out.println("  Username: " + adminUsername);
                System.out.println("  Password: [HASHED WITH BCRYPT]");
            } else {
                System.out.println("✓ Admin user already exists with BCrypt password (username: " + adminUsername + ")");
            }
            return;
        }

        // Create admin user with BCrypt hashed password
        Customer adminUser = new Customer();
        adminUser.setUsername(adminUsername);
        adminUser.setFirstName(adminFirstName);
        adminUser.setLastName(adminLastName);
        adminUser.setEmail(adminEmail);
        // Hash the password using BCrypt before saving
        String hashedPassword = passwordEncoder.encode(adminPassword);
        adminUser.setPassword(hashedPassword);
        // Set admin role
        adminUser.setRole(Customer.Role.ADMIN);
        
        customerRepository.save(adminUser);
        System.out.println("✓ Created admin user successfully");
        System.out.println("  Username: " + adminUsername);
        System.out.println("  Email: " + adminEmail);
        System.out.println("  Role: ADMIN");
        System.out.println("  Password: [HASHED WITH BCRYPT]");
        System.out.println("  ⚠ Remember to change the password after first login!");
    }
}
