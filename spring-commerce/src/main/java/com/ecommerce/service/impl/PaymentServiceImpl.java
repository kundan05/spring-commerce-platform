package com.ecommerce.service.impl;

import com.ecommerce.entity.Order;
import com.ecommerce.enums.OrderStatus;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.service.PaymentService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    private final OrderRepository orderRepository;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    @Override
    public PaymentIntent createPaymentIntent(Order order) throws StripeException {
        // MOCK IMPLEMENTATION
        PaymentIntent mockIntent = new PaymentIntent();
        mockIntent.setId("pi_mock_" + order.getId() + "_" + System.currentTimeMillis());
        mockIntent.setClientSecret("pi_mock_secret_" + order.getId());
        mockIntent.setStatus("requires_payment_method");
        return mockIntent;
    }

    @Override
    @Transactional
    public Order confirmPayment(String paymentIntentId) throws StripeException {
        // MOCK IMPLEMENTATION
        // Extract order ID from the mock intent ID (pi_mock_{orderId}_{timestamp})
        try {
            String[] parts = paymentIntentId.split("_");
            // Expecting pi_mock_ORDERID_TIMESTAMP
            if (parts.length < 3)
                throw new RuntimeException("Invalid mock intent ID");

            Long orderId = Long.parseLong(parts[2]);

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

            order.setStatus(OrderStatus.PAID);
            order.setPaymentId(paymentIntentId);
            return orderRepository.save(order);
        } catch (Exception e) {
            throw new RuntimeException("Failed to confirm mock payment: " + e.getMessage());
        }
    }
}
