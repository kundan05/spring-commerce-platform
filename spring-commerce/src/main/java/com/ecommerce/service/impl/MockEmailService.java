package com.ecommerce.service.impl;

import com.ecommerce.entity.Order;
import com.ecommerce.entity.User;
import com.ecommerce.service.EmailService;
import org.springframework.stereotype.Service;

@Service
public class MockEmailService implements EmailService {

    @Override
    public void sendWelcomeEmail(User user) {
        System.out.println("----- EMAIL NOTIFICATION -----");
        System.out.println("To: " + user.getEmail());
        System.out.println("Subject: Welcome to CricStore!");
        System.out.println("Body:");
        System.out.println("Hello " + user.getFirstName() + ",");
        System.out.println("Welcome to CricStore - Your one-stop shop for premium cricket gear.");
        System.out.println("We are excited to have you on board!");
        System.out.println("-----------------------------");
    }

    @Override
    public void sendOrderConfirmation(User user, Order order) {
        System.out.println("----- EMAIL NOTIFICATION -----");
        System.out.println("To: " + user.getEmail());
        System.out.println("Subject: Order Confirmation - #" + order.getOrderNumber());
        System.out.println("Body:");
        System.out.println("Hello " + user.getFirstName() + ",");
        System.out.println("Thank you for your order! We have received your order #" + order.getOrderNumber());
        System.out.println("Total Amount: $" + order.getTotalAmount());
        System.out.println("We will notify you when your items are shipped.");
        System.out.println("-----------------------------");
    }

    @Override
    public void sendOrderShipped(User user, Order order) {
        System.out.println("----- EMAIL NOTIFICATION -----");
        System.out.println("To: " + user.getEmail());
        System.out.println("Subject: Your CricStore Order #" + order.getOrderNumber() + " has Shipped!");
        System.out.println("Body:");
        System.out.println("Hello " + user.getFirstName() + ",");
        System.out.println("Good news! Your order #" + order.getOrderNumber() + " has been shipped.");
        System.out.println("It is on its way to: " + order.getShippingAddress().getCity() + ", "
                + order.getShippingAddress().getCountry());
        System.out.println("-----------------------------");
    }
}
