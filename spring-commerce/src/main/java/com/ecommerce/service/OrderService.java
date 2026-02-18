package com.ecommerce.service;

import com.ecommerce.dto.request.OrderRequest;
import com.ecommerce.dto.response.OrderResponse;
import com.ecommerce.entity.User;

import java.util.List;

public interface OrderService {
    OrderResponse createOrder(User user, OrderRequest orderRequest);
    List<OrderResponse> getUserOrders(User user);
    OrderResponse getOrder(User user, Long orderId);
    
    // Admin methods
    List<OrderResponse> getAllOrders();
    OrderResponse updateOrderStatus(Long orderId, String status);
}
