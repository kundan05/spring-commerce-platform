package com.ecommerce.controller;

import com.ecommerce.dto.request.CartItemRequest;
import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.dto.response.CartResponse;
import com.ecommerce.entity.User;
import com.ecommerce.service.CartService;
import com.ecommerce.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final UserService userService; // Helper to get User entity from UserDetails

    // Helper method to resolve User from UserDetails
    private User getUser(UserDetails userDetails) {
        return userService.getUserByEmail(userDetails.getUsername());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        CartResponse cart = cartService.getCart(user);
        return ResponseEntity.ok(new ApiResponse<>("Cart retrieved successfully", cart));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CartItemRequest request) {
        User user = getUser(userDetails);
        CartResponse cart = cartService.addToCart(user, request);
        return ResponseEntity.ok(new ApiResponse<>("Item added to cart", cart));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeFromCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long itemId) {
        User user = getUser(userDetails);
        CartResponse cart = cartService.removeFromCart(user, itemId);
        return ResponseEntity.ok(new ApiResponse<>("Item removed from cart", cart));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> updateCartItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long itemId,
            @RequestBody com.ecommerce.dto.request.CartItemUpdateRequest request) {
        User user = getUser(userDetails);
        CartResponse cart = cartService.updateCartItemQuantity(user, itemId, request.getQuantity());
        return ResponseEntity.ok(new ApiResponse<>("Cart item updated", cart));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<CartResponse>> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        CartResponse cart = cartService.clearCart(user);
        return ResponseEntity.ok(new ApiResponse<>("Cart cleared", cart));
    }
}
