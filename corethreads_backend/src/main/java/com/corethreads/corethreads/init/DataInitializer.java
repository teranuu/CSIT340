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

        // Find joshy's seller account (Eco Threads) - this should be seller_id 1
        Seller joshySeller = sellerRepository.findAll().stream()
                .filter(s -> "Eco Threads".equals(s.getStoreName()))
                .findFirst()
                .orElse(null);

        // Create additional sellers for other products
        Seller seller2 = null;
        Seller seller3 = null;

        // Only create additional sellers if we don't already have them
        if (sellerRepository.count() < 3) {
            // Create customer 2
            Customer customer2 = new Customer();
            customer2.setUsername("seller2");
            customer2.setFirstName("Sarah");
            customer2.setLastName("Jones");
            customer2.setEmail("sarah@example.com");
            customer2.setPassword("password");
            customer2 = customerRepository.save(customer2);

            // Create seller 2
            seller2 = new Seller(customer2, "Urban Style", "Modern streetwear collection");
            seller2 = sellerRepository.save(seller2);

            // Create customer 3
            Customer customer3 = new Customer();
            customer3.setUsername("seller3");
            customer3.setFirstName("Mike");
            customer3.setLastName("Chen");
            customer3.setEmail("mike@example.com");
            customer3.setPassword("password");
            customer3 = customerRepository.save(customer3);

            // Create seller 3
            seller3 = new Seller(customer3, "Classic Wear", "Timeless fashion essentials");
            seller3 = sellerRepository.save(seller3);
        } else {
            // Use existing sellers
            seller2 = sellerRepository.findById(2L).orElse(null);
            seller3 = sellerRepository.findById(3L).orElse(null);
        }

        // Fallback if joshy's seller doesn't exist
        if (joshySeller == null) {
            joshySeller = sellerRepository.findAll().stream().findFirst().orElse(seller2);
        }

        // Product 1: CoreThreads Shoes (White, Black) - OWNED BY JOSHY
        Product product1 = new Product("CoreThreads Shoes", "Premium athletic shoes with superior comfort", null, joshySeller);
        product1 = productRepository.save(product1);
        variantRepository.save(new ProductVariant("10", "White", "SKU-SHOES-001", 25L, new BigDecimal("49.50"), product1));
        variantRepository.save(new ProductVariant("10", "Black", "SKU-SHOES-002", 15L, new BigDecimal("49.50"), product1));
        imageRepository.save(new ProductImage(product1, "/images/corethreads_shoes.png", 0));
        imageRepository.save(new ProductImage(product1, "/images/corethreads_shoes_black.png", 1));

        // Product 2: Grey Sweatpants (Grey, White) - OWNED BY JOSHY
        Product product2 = new Product("Grey Sweatpants", "Comfortable grey sweatpants for casual wear", null, joshySeller);
        product2 = productRepository.save(product2);
        variantRepository.save(new ProductVariant("M", "Grey", "SKU-GREY-001", 50L, new BigDecimal("49.99"), product2));
        variantRepository.save(new ProductVariant("M", "White", "SKU-GREY-002", 20L, new BigDecimal("49.99"), product2));
        // Added Black variant and image
        variantRepository.save(new ProductVariant("M", "Black", "SKU-GREY-003", 20L, new BigDecimal("49.99"), product2));
        imageRepository.save(new ProductImage(product2, "/images/Grey_sweatpants.png", 0));
        imageRepository.save(new ProductImage(product2, "/images/Black_sweatpants.png", 1));
        // No explicit white variant image provided; reuse primary image

        // Product 3: Black Hoodie (Black, White) - OWNED BY JOSHY
        Product product3 = new Product("Black Hoodie", "Classic black hoodie with embroidered logo", null, joshySeller);
        product3 = productRepository.save(product3);
        variantRepository.save(new ProductVariant("L", "Black", "SKU-HOODIE-001", 30L, new BigDecimal("54.99"), product3));
        variantRepository.save(new ProductVariant("L", "White", "SKU-HOODIE-002", 15L, new BigDecimal("54.99"), product3));
        imageRepository.save(new ProductImage(product3, "/images/Black_hoodie.png", 0));
        imageRepository.save(new ProductImage(product3, "/images/White_hoodie.png", 1));

        // Product 4: Classic Cap (Navy Blue, White) - OWNED BY SELLER 2
        Product product4 = new Product("Classic Cap", "Timeless baseball cap with adjustable strap", null, seller2);
        product4 = productRepository.save(product4);
        variantRepository.save(new ProductVariant("One Size", "Navy Blue", "SKU-CAP-001", 100L, new BigDecimal("39.99"), product4));
        variantRepository.save(new ProductVariant("One Size", "White", "SKU-CAP-002", 80L, new BigDecimal("39.99"), product4));
        // Added Black variant and image
        variantRepository.save(new ProductVariant("One Size", "Black", "SKU-CAP-003", 60L, new BigDecimal("39.99"), product4));
        imageRepository.save(new ProductImage(product4, "/images/Classic_cap.png", 0));
        imageRepository.save(new ProductImage(product4, "/images/Classic_cap_black.png", 1));

        // Product 5: Beanie (Black, White) - OWNED BY SELLER 2
        Product product5 = new Product("Beanie", "Cozy beanie perfect for cold weather", null, seller2);
        product5 = productRepository.save(product5);
        variantRepository.save(new ProductVariant("One Size", "Black", "SKU-BEANIE-001", 120L, new BigDecimal("24.99"), product5));
        variantRepository.save(new ProductVariant("One Size", "White", "SKU-BEANIE-002", 90L, new BigDecimal("24.99"), product5));
        // Added Orange variant and image
        variantRepository.save(new ProductVariant("One Size", "Orange", "SKU-BEANIE-003", 70L, new BigDecimal("24.99"), product5));
        imageRepository.save(new ProductImage(product5, "/images/Beanie.png", 0));
        imageRepository.save(new ProductImage(product5, "/images/Beanie_orange.png", 1));

        // Product 6: Jacket (Olive Green, White) - OWNED BY SELLER 3
        Product product6 = new Product("Jacket", "Lightweight jacket suitable for all seasons", null, seller3);
        product6 = productRepository.save(product6);
        variantRepository.save(new ProductVariant("M", "Olive Green", "SKU-JACKET-001", 40L, new BigDecimal("79.99"), product6));
        variantRepository.save(new ProductVariant("M", "White", "SKU-JACKET-002", 25L, new BigDecimal("79.99"), product6));
        imageRepository.save(new ProductImage(product6, "/images/Jacket.png", 0));
        imageRepository.save(new ProductImage(product6, "/images/Jacket_white.png", 1));

        // Product 7: Jeans (Dark Blue, Black) - OWNED BY SELLER 3
        Product product7 = new Product("Jeans", "Durable denim jeans with a classic fit", null, seller3);
        product7 = productRepository.save(product7);
        variantRepository.save(new ProductVariant("32", "Dark Blue", "SKU-JEANS-001", 60L, new BigDecimal("59.99"), product7));
        variantRepository.save(new ProductVariant("32", "Black", "SKU-JEANS-002", 50L, new BigDecimal("59.99"), product7));
        imageRepository.save(new ProductImage(product7, "/images/Jeans.png", 0));
        imageRepository.save(new ProductImage(product7, "/images/Jeans_black.png", 1));

        // Product 8: Socks Pack - OWNED BY SELLER 2
        Product product8 = new Product("Socks Pack", "Pack of comfortable everyday socks", null, seller2);
        product8 = productRepository.save(product8);
        variantRepository.save(new ProductVariant("One Size", "Multi", "SKU-SOCKS-001", 200L, new BigDecimal("19.99"), product8));
        imageRepository.save(new ProductImage(product8, "/images/Socks_pack.png", 0));

        // Product 9: CoreThreads T-Shirt (White, Black) - OWNED BY SELLER 3
        Product product9 = new Product("CoreThreads T-Shirt", "Soft cotton t-shirt for everyday wear", null, seller3);
        product9 = productRepository.save(product9);
        variantRepository.save(new ProductVariant("M", "White", "SKU-TSHIRT-001", 100L, new BigDecimal("29.99"), product9));
        variantRepository.save(new ProductVariant("M", "Black", "SKU-TSHIRT-002", 90L, new BigDecimal("29.99"), product9));
        imageRepository.save(new ProductImage(product9, "/images/corethreads_t-shirt_white.png", 0));
        imageRepository.save(new ProductImage(product9, "/images/corethreads_t-shirt_black.png", 1));

        System.out.println("✓ Seeded products 1-9 successfully!");
    }
}
