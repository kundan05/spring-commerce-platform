package com.ecommerce.controller;

import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.dto.response.OrderResponse;
import com.ecommerce.entity.Order;
import com.ecommerce.entity.User;
import com.ecommerce.enums.OrderStatus;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.service.OrderService;
import com.ecommerce.service.PaymentService;
import com.ecommerce.service.UserService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;
    private final OrderService orderService;
    private final UserService userService;
    private final OrderRepository orderRepository;

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    private boolean isMockMode() {
        return stripeApiKey == null || stripeApiKey.startsWith("sk_test_placeholder");
    }

    @PostMapping("/create-intent")
    public ResponseEntity<ApiResponse<Map<String, String>>> createPaymentIntent(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Long> request) {

        try {
            Long orderId = request.get("orderId");
            User user = userService.getUserByEmail(userDetails.getUsername());

            // Validate order ownership
            OrderResponse orderResp = orderService.getOrder(user, orderId);
            Order order = orderRepository.findById(orderId).orElseThrow();

            Map<String, String> responseData = new HashMap<>();

            if (isMockMode()) {
                // Demo mode: return a mock client secret so the frontend can simulate payment
                String mockClientSecret = "pi_mock_" + orderId + "_" + System.currentTimeMillis() + "_secret_demo";
                responseData.put("clientSecret", mockClientSecret);
                log.info("Mock payment intent created for order {}", orderId);
            } else {
                PaymentIntent intent = paymentService.createPaymentIntent(order);
                responseData.put("clientSecret", intent.getClientSecret());
            }

            return ResponseEntity.ok(new ApiResponse<>("Payment Intent created", responseData));
        } catch (StripeException e) {
            log.error("Stripe error creating payment intent: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse<>("Stripe error: " + e.getMessage(), null));
        } catch (Exception e) {
            log.error("Error creating payment intent: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse<>("Error creating payment intent: " + e.getMessage(), null));
        }
    }

    @PostMapping("/confirm")
    public ResponseEntity<ApiResponse<String>> confirmPayment(
            @RequestBody Map<String, String> request) {
        try {
            String paymentIntentId = request.get("paymentIntentId");

            if (paymentIntentId != null && paymentIntentId.startsWith("pi_mock_")) {
                // Demo mode: extract order ID from mock payment intent and mark as paid
                String[] parts = paymentIntentId.split("_");
                if (parts.length >= 3) {
                    Long orderId = Long.parseLong(parts[2]);
                    Order order = orderRepository.findById(orderId).orElseThrow(
                            () -> new RuntimeException("Order not found with ID: " + orderId));
                    order.setStatus(OrderStatus.PAID);
                    order.setPaymentId(paymentIntentId);
                    orderRepository.save(order);
                    log.info("Mock payment confirmed for order {}", orderId);
                }
                return ResponseEntity.ok(new ApiResponse<>("Mock payment confirmed and Order updated", "Success"));
            }

            paymentService.confirmPayment(paymentIntentId);
            return ResponseEntity.ok(new ApiResponse<>("Payment confirmed and Order updated", "Success"));
        } catch (StripeException e) {
            log.error("Stripe error confirming payment: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse<>("Stripe error: " + e.getMessage(), null));
        } catch (RuntimeException e) {
            log.error("Error confirming payment: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getMessage(), null));
        }
    }
}
