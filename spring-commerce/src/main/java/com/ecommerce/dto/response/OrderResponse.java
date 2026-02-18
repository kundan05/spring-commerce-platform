package com.ecommerce.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private Long id;
    private String orderNumber;
    private BigDecimal totalAmount;
    private String status;
    private LocalDateTime createdAt;
    private AddressDto shippingAddress;
    private List<OrderItemDto> items;

    @Data
    public static class AddressDto {
        private String fullName;
        private String phoneNumber;
        private String street;
        private String city;
        private String state;
        private String zipCode;
        private String country;
    }

    @Data
    public static class OrderItemDto {
        private Long id;
        private Long productId;
        private String productName;
        private String imageUrl;
        private Integer quantity;
        private BigDecimal price;
    }
}
