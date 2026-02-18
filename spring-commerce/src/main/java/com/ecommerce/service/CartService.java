package com.ecommerce.service;

import com.ecommerce.dto.request.CartItemRequest;
import com.ecommerce.dto.response.CartResponse;
import com.ecommerce.entity.User;

public interface CartService {
    CartResponse getCart(User user);
    CartResponse addToCart(User user, CartItemRequest itemRequest);
    CartResponse removeFromCart(User user, Long cartItemId);
    CartResponse updateCartItemQuantity(User user, Long cartItemId, Integer quantity);
    CartResponse clearCart(User user);
}
