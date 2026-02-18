package com.ecommerce.service.impl;

import com.ecommerce.dto.request.OrderRequest;
import com.ecommerce.dto.response.OrderResponse;
import com.ecommerce.entity.*;
import com.ecommerce.enums.OrderStatus;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.AddressRepository;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.service.EmailService;
import com.ecommerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final AddressRepository addressRepository;
    private final ProductRepository productRepository;
    private final EmailService emailService;

    @Override
    @Transactional
    public OrderResponse createOrder(User user, OrderRequest request) {
        // 1. Get Cart
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        // 2. Create Address
        // In a real app, we might check if address exists or reuse it. Here we create
        // new.
        Address address = Address.builder()
                .user(user)
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .street(request.getStreet())
                .city(request.getCity())
                .state(request.getState())
                .zipCode(request.getZipCode())
                .country(request.getCountry())
                .build();

        address = addressRepository.save(address);

        // 3. Create Order
        Order order = Order.builder()
                .user(user)
                .orderNumber(UUID.randomUUID().toString())
                .status(OrderStatus.PENDING)
                .shippingAddress(address)
                .items(new ArrayList<>())
                .build();

        // 4. Create OrderItems from CartItems and Update Inventory
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();

            // Check Inventory
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new BadRequestException("Insufficient stock for product: " + product.getName());
            }

            // Decrement Stock
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .price(product.getPrice()) // Use current product price
                    .build();

            order.getItems().add(orderItem);

            BigDecimal itemTotal = orderItem.getPrice().multiply(BigDecimal.valueOf(orderItem.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
        }

        order.setTotalAmount(totalAmount);

        // 5. Save Order
        Order savedOrder = orderRepository.save(order);

        // 6. Clear Cart
        cart.getItems().clear();
        cartRepository.save(cart);

        // 7. Send Email
        try {
            emailService.sendOrderConfirmation(user, savedOrder);
        } catch (Exception e) {
            System.err.println("Failed to send order confirmation email: " + e.getMessage());
        }

        return mapToOrderResponse(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getUserOrders(User user) {
        List<Order> orders = orderRepository.findByUserOrderByCreatedAtDesc(user);
        return orders.stream().map(this::mapToOrderResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrder(User user, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Access denied");
        }

        return mapToOrderResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository
                .findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC,
                        "createdAt"))
                .stream().map(this::mapToOrderResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        try {
            OrderStatus newStatus = OrderStatus.valueOf(status.toUpperCase());
            order.setStatus(newStatus);

            Order savedOrder = orderRepository.save(order);

            // Send email if shipped
            if (newStatus == OrderStatus.SHIPPED) {
                try {
                    emailService.sendOrderShipped(savedOrder.getUser(), savedOrder);
                } catch (Exception e) {
                    System.err.println("Failed to send shipping email: " + e.getMessage());
                }
            }

            return mapToOrderResponse(savedOrder);

        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status: " + status);
        }
    }

    private OrderResponse mapToOrderResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setOrderNumber(order.getOrderNumber());
        response.setStatus(order.getStatus().name());
        response.setTotalAmount(order.getTotalAmount());
        response.setCreatedAt(order.getCreatedAt());

        OrderResponse.AddressDto addressDto = new OrderResponse.AddressDto();
        if (order.getShippingAddress() != null) {
            addressDto.setFullName(order.getShippingAddress().getFullName());
            addressDto.setPhoneNumber(order.getShippingAddress().getPhoneNumber());
            addressDto.setStreet(order.getShippingAddress().getStreet());
            addressDto.setCity(order.getShippingAddress().getCity());
            addressDto.setState(order.getShippingAddress().getState());
            addressDto.setZipCode(order.getShippingAddress().getZipCode());
            addressDto.setCountry(order.getShippingAddress().getCountry());
        }
        response.setShippingAddress(addressDto);

        List<OrderResponse.OrderItemDto> items = order.getItems().stream().map(item -> {
            OrderResponse.OrderItemDto itemDto = new OrderResponse.OrderItemDto();
            itemDto.setId(item.getId());
            itemDto.setProductId(item.getProduct().getId());
            itemDto.setProductName(item.getProduct().getName());
            itemDto.setImageUrl(item.getProduct().getImageUrl());
            itemDto.setQuantity(item.getQuantity());
            itemDto.setPrice(item.getPrice());
            return itemDto;
        }).collect(Collectors.toList());

        response.setItems(items);
        return response;
    }
}
