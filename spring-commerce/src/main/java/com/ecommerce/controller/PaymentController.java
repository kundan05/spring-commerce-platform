package com.ecommerce.controller;

import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.dto.response.OrderResponse;
import com.ecommerce.entity.Order;
import com.ecommerce.entity.User;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.service.OrderService;
import com.ecommerce.service.PaymentService;
import com.ecommerce.service.UserService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final OrderService orderService;
    private final UserService userService;
    private final OrderRepository orderRepository; // Direct access for simplicity in intent creation

    @PostMapping("/create-intent")
    public ResponseEntity<ApiResponse<Map<String, String>>> createPaymentIntent(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Long> request) {
        
        try {
            Long orderId = request.get("orderId");
            User user = userService.getUserByEmail(userDetails.getUsername());
            
            // Re-fetch order to ensure it belongs to user and get total
            // Ideally should use OrderService but for now direct repo or a specific method in service
            // Let's use getOrder from OrderService which checks ownership
            OrderResponse orderResp = orderService.getOrder(user, orderId);
            
            // We need the entity for PaymentService for amount calculation logic encapsulation
            // For now, let's just fetch it again or assume we can trust the ID if service validated ownership
             Order order = orderRepository.findById(orderId).orElseThrow();
            
            PaymentIntent intent = paymentService.createPaymentIntent(order);
            
            Map<String, String> responseData = new HashMap<>();
            responseData.put("clientSecret", intent.getClientSecret());
            
            return ResponseEntity.ok(new ApiResponse<>("Payment Intent created", responseData));
        } catch (StripeException e) {
            return ResponseEntity.internalServerError().body(new ApiResponse<>("Stripe error: " + e.getMessage(), null));
        }
    }

    @PostMapping("/confirm")
    public ResponseEntity<ApiResponse<String>> confirmPayment(
            @RequestBody Map<String, String> request) {
        try {
            String paymentIntentId = request.get("paymentIntentId");
            paymentService.confirmPayment(paymentIntentId);
            return ResponseEntity.ok(new ApiResponse<>("Payment confirmed and Order updated", "Success"));
        } catch (StripeException e) {
            return ResponseEntity.internalServerError().body(new ApiResponse<>("Stripe error: " + e.getMessage(), null));
        } catch (RuntimeException e) {
             return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }
}
