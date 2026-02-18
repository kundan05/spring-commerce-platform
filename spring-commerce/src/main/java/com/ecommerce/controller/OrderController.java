package com.ecommerce.controller;

import com.ecommerce.dto.request.OrderRequest;
import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.dto.response.OrderResponse;
import com.ecommerce.entity.User;
import com.ecommerce.service.OrderService;
import com.ecommerce.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    private User getUser(UserDetails userDetails) {
        return userService.getUserByEmail(userDetails.getUsername());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody OrderRequest request) {
        User user = getUser(userDetails);
        OrderResponse order = orderService.createOrder(user, request);
        return ResponseEntity.ok(new ApiResponse<>("Order placed successfully", order));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getUserOrders(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        List<OrderResponse> orders = orderService.getUserOrders(user);
        return ResponseEntity.ok(new ApiResponse<>("Orders retrieved successfully", orders));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long orderId) {
        User user = getUser(userDetails);
        OrderResponse order = orderService.getOrder(user, orderId);
        return ResponseEntity.ok(new ApiResponse<>("Order details", order));
    }
}
