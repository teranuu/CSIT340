package com.corethreads.corethreads.init;

import com.corethreads.corethreads.entity.*;
import com.corethreads.corethreads.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    private final ProductImageRepository imageRepository;
    private final SellerRepository sellerRepository;
    private final CustomerRepository customerRepository;

    public DataInitializer(ProductRepository productRepository,
                           ProductVariantRepository variantRepository,
                           ProductImageRepository imageRepository,
                           SellerRepository sellerRepository,
                           CustomerRepository customerRepository) {
        this.productRepository = productRepository;
        this.variantRepository = variantRepository;
        this.imageRepository = imageRepository;
        this.sellerRepository = sellerRepository;
        this.customerRepository = customerRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Only seed if products table is empty
        if (productRepository.count() > 0) {
            return; // Data already exists
        }

        // Ensure there is at least one Customer and Seller for seeding
        Seller defaultSeller = sellerRepository.findAll().stream().findFirst().orElse(null);
        if (defaultSeller == null) {
            // Create a minimal customer
            Customer customer = new Customer();
            customer.setUsername("seed_user");
            customer.setFirstName("Seed");
            customer.setLastName("User");
            customer.setEmail("seed@example.com");
            customer.setPassword("password");
            customer = customerRepository.save(customer);

            // Create a minimal seller linked to the customer
            Seller seller = new Seller(customer, "Seed Store", "Default seeded seller");
            defaultSeller = sellerRepository.save(seller);
        }

        // Product 1: Grey Sweatpants
        Product product1 = new Product("Grey Sweatpants", "Comfortable grey sweatpants for casual wear", null, defaultSeller);
        product1 = productRepository.save(product1);
        
        ProductVariant variant1 = new ProductVariant("M", "Grey", "SKU-GREY-001", 50L, new BigDecimal("49.99"), product1);
        variantRepository.save(variant1);
        
        ProductImage image1 = new ProductImage(product1, "/images/Grey_sweatpants.png", 0);
        imageRepository.save(image1);

        // Product 2: Black Hoodie
        Product product2 = new Product("Black Hoodie", "Classic black hoodie with embroidered logo", null, defaultSeller);
        product2 = productRepository.save(product2);
        
        ProductVariant variant2 = new ProductVariant("L", "Black", "SKU-BLACK-001", 30L, new BigDecimal("54.99"), product2);
        variantRepository.save(variant2);
        
        ProductImage image2 = new ProductImage(product2, "/images/Black_hoodie.png", 0);
        imageRepository.save(image2);

        // Product 3: Classic Cap
        Product product3 = new Product("Classic Cap", "Timeless baseball cap with adjustable strap", null, defaultSeller);
        product3 = productRepository.save(product3);
        
        ProductVariant variant3 = new ProductVariant("One Size", "Black", "SKU-CAP-001", 100L, new BigDecimal("39.99"), product3);
        variantRepository.save(variant3);
        
        ProductImage image3 = new ProductImage(product3, "/images/Classic_cap.png", 0);
        imageRepository.save(image3);

        System.out.println("✓ Sample products seeded successfully!");
    }
}
