package com.ecommerce;

import com.ecommerce.dto.request.CategoryRequest;
import com.ecommerce.dto.request.LoginRequest;
import com.ecommerce.dto.request.ProductRequest;
import com.ecommerce.dto.request.RegisterRequest;
import com.ecommerce.enums.UserRole;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.entity.User;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@org.springframework.transaction.annotation.Transactional
public class ProductIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String adminToken;

    @BeforeEach
    public void setup() throws Exception {
        // Create Admin User
        String email = "admin." + UUID.randomUUID() + "@example.com";
        User admin = User.builder()
                .firstName("Admin")
                .lastName("User")
                .email(email)
                .password(passwordEncoder.encode("admin123"))
                .role(UserRole.ROLE_ADMIN)
                .build();
        userRepository.save(admin);

        // Login as Admin
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(email);
        loginRequest.setPassword("admin123");

        MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        JsonNode jsonNode = objectMapper.readTree(response);
        adminToken = jsonNode.get("data").get("token").asText();
    }

    @Test
    public void testCreateAndGetProduct() throws Exception {
        // 1. Create Category
        CategoryRequest categoryRequest = new CategoryRequest();
        categoryRequest.setName("Electronics " + UUID.randomUUID());
        categoryRequest.setDescription("Gadgets");

        MvcResult categoryResult = mockMvc.perform(post("/api/v1/categories")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(categoryRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode categoryNode = objectMapper.readTree(categoryResult.getResponse().getContentAsString());
        Long categoryId = categoryNode.get("data").get("id").asLong();

        // 2. Create Product
        ProductRequest productRequest = new ProductRequest();
        productRequest.setName("Smartphone " + UUID.randomUUID());
        productRequest.setDescription("Flagship phone");
        productRequest.setPrice(new BigDecimal("999.99"));
        productRequest.setStockQuantity(100);
        productRequest.setCategoryId(categoryId);

        MvcResult productResult = mockMvc.perform(post("/api/v1/products")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(productRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.name").value(productRequest.getName()))
                .andReturn();
        
        JsonNode productNode = objectMapper.readTree(productResult.getResponse().getContentAsString());
        Long productId = productNode.get("data").get("id").asLong();

        // 3. Get Product
        mockMvc.perform(get("/api/v1/products/" + productId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value(productRequest.getName()));
    }
}
