package com.corethreads.corethreads.init;

import com.corethreads.corethreads.entity.Customer;
import com.corethreads.corethreads.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * One-time corrective runner to reset mistakenly assigned ADMIN roles on customers.
 * Disabled by default. Enable by starting the app with --admin.fixRolesOnce=true.
 * Safe to run multiple times (idempotent).
 */
@Component
@Order(0)
public class RoleCleanupRunner implements CommandLineRunner {

    private final CustomerRepository customerRepository;

    @Value("${admin.fixRolesOnce:false}")
    private boolean fixRolesOnce;

    @Value("${admin.username:admin}")
    private String adminUsername;

    public RoleCleanupRunner(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public void run(String... args) {
        if (!fixRolesOnce) {
            return; // inactive by default
        }

        System.out.println("=== ROLE CLEANUP RUNNER ===");
        System.out.println("Fix flag enabled: resetting non-admin users with ADMIN role to USER...");

        // Load all users with ADMIN role except the configured admin account
        List<Customer> toDemote = customerRepository.findAll().stream()
                .filter(c -> c.getRole() == Customer.Role.ADMIN)
                .filter(c -> c.getUsername() == null || !c.getUsername().equalsIgnoreCase(adminUsername))
                .toList();

        if (toDemote.isEmpty()) {
            System.out.println("No non-admin accounts with ADMIN role found. Nothing to change.");
            return;
        }

        for (Customer c : toDemote) {
            c.setRole(Customer.Role.USER);
        }
        customerRepository.saveAll(toDemote);

        System.out.println("Updated roles to USER for " + toDemote.size() + " account(s).");
        System.out.println("Admin account preserved: username='" + adminUsername + "'.");
        System.out.println("=== ROLE CLEANUP COMPLETE ===");
    }
}
