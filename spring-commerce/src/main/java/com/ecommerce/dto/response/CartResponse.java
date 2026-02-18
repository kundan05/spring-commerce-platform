package com.ecommerce.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CartResponse {
    private Long id;
    private BigDecimal totalPrice;
    private Integer totalItems;
    private List<CartItemDto> items;

    @Data
    public static class CartItemDto {
        private Long id;
        private Long productId;
        private String productName;
        private String imageUrl;
        private BigDecimal price;
        private Integer quantity;
        private BigDecimal subtotal;
    }
}
