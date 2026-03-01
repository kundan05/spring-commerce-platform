package com.ecommerce.config;

import com.ecommerce.entity.Category;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.repository.CartItemRepository;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Always re-seed for this transformation
        seedData();
    }

    private void seedData() {
        // Clear existing data to ensure clean rebranding
        // Delete dependent data first to avoid foreign key constraints
        cartItemRepository.deleteAll();
        orderRepository.deleteAll();

        productRepository.deleteAll();
        categoryRepository.deleteAll();

        Category equipment = new Category();
        equipment.setName("Cricket Equipment");
        equipment.setDescription("Professional gear for the game");

        Category apparel = new Category();
        apparel.setName("Apparel");
        apparel.setDescription("Jerseys and training wear");

        Category accessories = new Category();
        accessories.setName("Accessories");
        accessories.setDescription("Protective gear and extras");

        categoryRepository.saveAll(Arrays.asList(equipment, apparel, accessories));

        Product bat = new Product();
        bat.setName("Pro Grade English Willow Bat");
        bat.setDescription(
                "Grade 1 English Willow — good grains, balanced pickup, ready to play after a light knock-in.");
        bat.setPrice(new BigDecimal("350.00"));
        bat.setStockQuantity(15);
        bat.setCategory(equipment);
        bat.setImageUrl("/images/products/bat.jpg");

        Product ball = new Product();
        ball.setName("Match Quality Leather Ball");
        ball.setDescription("4-piece alum-tanned leather, holds its seam well. Good for both practice and match days.");
        ball.setPrice(new BigDecimal("35.00"));
        ball.setStockQuantity(100);
        ball.setCategory(equipment);
        ball.setImageUrl("/images/products/ball.jpg");

        Product pads = new Product();
        pads.setName("Elite Batting Pads");
        pads.setDescription(
                "High-density foam with a comfortable fit. Light enough that they don't slow you down between wickets.");
        pads.setPrice(new BigDecimal("75.00"));
        pads.setStockQuantity(25);
        pads.setCategory(accessories);
        pads.setImageUrl("/images/products/equipment.jpg");

        Product kit = new Product();
        kit.setName("Junior Cricket Kit");
        kit.setDescription(
                "Everything a beginner needs — bat, ball, stumps, and a bag to carry it all. Makes a great gift.");
        kit.setPrice(new BigDecimal("120.00"));
        kit.setStockQuantity(10);
        kit.setCategory(equipment);
        kit.setImageUrl("/images/products/equipment.jpg");

        productRepository.saveAll(Arrays.asList(bat, ball, pads, kit));

        System.out.println("Database seeded with Cricket products.");

        seedAdminUser();
    }

    private void seedAdminUser() {
        if (!userRepository.existsByEmail("admin@cricstore.com")) {
            User admin = new User();
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setEmail("admin@cricstore.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(com.ecommerce.enums.UserRole.ROLE_ADMIN);

            userRepository.save(admin);
            System.out.println("Admin user created: admin@cricstore.com / admin123");
        }
    }
}
