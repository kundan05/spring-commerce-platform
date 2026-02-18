package com.ecommerce.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class AdminStatsResponse {
    private BigDecimal totalSales;
    private Long totalOrders;
    private Long totalUsers;
    private Long totalProducts;
}
