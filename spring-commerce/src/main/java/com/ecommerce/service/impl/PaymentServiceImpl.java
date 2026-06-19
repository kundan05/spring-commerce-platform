package com.ecommerce.service.impl;

import com.ecommerce.entity.Order;
import com.ecommerce.enums.OrderStatus;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.service.PaymentService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
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
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(order.getTotalAmount().multiply(BigDecimal.valueOf(100)).longValue())
                .setCurrency("usd")
                .putMetadata("order_id", order.getId().toString())
                .putMetadata("order_number", order.getOrderNumber())
                .build();

        return PaymentIntent.create(params);
    }

    @Override
    @Transactional
    public Order confirmPayment(String paymentIntentId) throws StripeException {
        PaymentIntent intent = PaymentIntent.retrieve(paymentIntentId);

        if (!"succeeded".equals(intent.getStatus())) {
            throw new BadRequestException("Payment not successful. Status: " + intent.getStatus());
        }

        String orderIdStr = intent.getMetadata().get("order_id");
        if (orderIdStr == null) {
            throw new BadRequestException("No order_id in payment metadata");
        }

        Long orderId = Long.parseLong(orderIdStr);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BadRequestException("Order not found with ID: " + orderId));

        order.setStatus(OrderStatus.PAID);
        order.setPaymentId(paymentIntentId);
        return orderRepository.save(order);
    }

    @Transactional
    public void handlePaymentSuccess(PaymentIntent intent) {
        String orderIdStr = intent.getMetadata().get("order_id");
        if (orderIdStr == null) return;

        Long orderId = Long.parseLong(orderIdStr);
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null || order.getStatus() == OrderStatus.PAID) return;

        order.setStatus(OrderStatus.PAID);
        order.setPaymentId(intent.getId());
        orderRepository.save(order);
    }
}
