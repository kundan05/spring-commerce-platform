package com.ecommerce.service.impl;

import com.ecommerce.dto.response.AdminStatsResponse;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    public AdminStatsResponse getStats() {
        BigDecimal totalSales = orderRepository.sumTotalAmount();
        if (totalSales == null) totalSales = BigDecimal.ZERO;
        
        long totalOrders = orderRepository.count();
        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();

        return AdminStatsResponse.builder()
                .totalSales(totalSales)
                .totalOrders(totalOrders)
                .totalUsers(totalUsers)
                .totalProducts(totalProducts)
                .build();
    }
}
