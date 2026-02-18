package com.ecommerce.service;

import com.ecommerce.entity.Order;
import com.ecommerce.entity.User;

public interface EmailService {
    void sendWelcomeEmail(User user);

    void sendOrderConfirmation(User user, Order order);

    void sendOrderShipped(User user, Order order);
}
