package com.ecommerce.controller;

import com.ecommerce.dto.response.AdminStatsResponse;
import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.dto.response.OrderResponse;
import com.ecommerce.entity.User;
import com.ecommerce.service.AdminService;
import com.ecommerce.service.OrderService;
import com.ecommerce.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final OrderService orderService;
    // user service for listing users if needed, or we can add method to AdminService
    
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AdminStatsResponse>> getStats() {
        AdminStatsResponse stats = adminService.getStats();
        return ResponseEntity.ok(new ApiResponse<>("Admin stats retrieved", stats));
    }
    
    @GetMapping("/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders() {
        List<OrderResponse> orders = orderService.getAllOrders();
        return ResponseEntity.ok(new ApiResponse<>("All orders retrieved", orders));
    }
    
    @PutMapping("/orders/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {
        OrderResponse order = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(new ApiResponse<>("Order status updated", order));
    }
}
