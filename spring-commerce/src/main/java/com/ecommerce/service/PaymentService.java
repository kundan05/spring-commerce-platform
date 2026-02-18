package com.ecommerce.service;

import com.ecommerce.entity.Order;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface PaymentService {
    PaymentIntent createPaymentIntent(Order order) throws StripeException;
    Order confirmPayment(String paymentIntentId) throws StripeException;
}
