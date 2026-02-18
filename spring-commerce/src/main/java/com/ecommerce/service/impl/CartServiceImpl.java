package com.ecommerce.service.impl;

import com.ecommerce.dto.request.CartItemRequest;
import com.ecommerce.dto.response.CartResponse;
import com.ecommerce.entity.Cart;
import com.ecommerce.entity.CartItem;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.CartItemRepository;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public CartResponse getCart(User user) {
        Cart cart = getOrCreateCart(user);
        return mapToCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse addToCart(User user, CartItemRequest itemRequest) {
        Cart cart = getOrCreateCart(user);
        Product product = productRepository.findById(itemRequest.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (product.getStockQuantity() < itemRequest.getQuantity()) {
            throw new IllegalArgumentException("Insufficient stock");
        }

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + itemRequest.getQuantity());
            // Optionally check stock again for total quantity
            cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(itemRequest.getQuantity())
                    .price(product.getPrice())
                    .build();
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }
        
        // Recalculate total price not needed to persist here generally unless we store it on Cart entity, 
        // but normally calculated on read. 
        // If we stored totalPrice in DB, we'd update it here.
        
        return mapToCartResponse(cartRepository.save(cart));
    }

    @Override
    @Transactional
    public CartResponse removeFromCart(User user, Long cartItemId) {
        Cart cart = getOrCreateCart(user);
        CartItem itemToRemove = cart.getItems().stream()
                .filter(item -> item.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        cart.getItems().remove(itemToRemove);
        cartItemRepository.delete(itemToRemove);
        
        return mapToCartResponse(cartRepository.save(cart));
    }

    @Override
    @Transactional
    public CartResponse updateCartItemQuantity(User user, Long cartItemId, Integer quantity) {
        Cart cart = getOrCreateCart(user);
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        item.setQuantity(quantity);
        cartItemRepository.save(item);

        return mapToCartResponse(cartRepository.save(cart));
    }

    @Override
    @Transactional
    public CartResponse clearCart(User user) {
        Cart cart = getOrCreateCart(user);
        cart.getItems().clear();
        // Since we have orphanRemoval=true, saving the cart should delete the items.
        // But explicitly deleting might be safer/clearer sometimes. 
        // With orphanRemoval=true, clearing the list is enough.
        return mapToCartResponse(cartRepository.save(cart));
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = Cart.builder()
                            .user(user)
                            .items(new ArrayList<>())
                            .build();
                    return cartRepository.save(newCart);
                });
    }

    private CartResponse mapToCartResponse(Cart cart) {
        CartResponse response = new CartResponse();
        response.setId(cart.getId());
        
        BigDecimal total = BigDecimal.ZERO;
        int count = 0;
        
        List<CartResponse.CartItemDto> itemDtos = new ArrayList<>();
        
        if (cart.getItems() != null) {
            for (CartItem item : cart.getItems()) {
                CartResponse.CartItemDto itemDto = new CartResponse.CartItemDto();
                itemDto.setId(item.getId());
                itemDto.setProductId(item.getProduct().getId());
                itemDto.setProductName(item.getProduct().getName());
                itemDto.setImageUrl(item.getProduct().getImageUrl());
                itemDto.setPrice(item.getPrice());
                itemDto.setQuantity(item.getQuantity());
                
                BigDecimal subtotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                itemDto.setSubtotal(subtotal);
                
                total = total.add(subtotal);
                count += item.getQuantity();
                
                itemDtos.add(itemDto);
            }
        }
        
        response.setItems(itemDtos);
        response.setTotalPrice(total);
        response.setTotalItems(count);
        return response;
    }
}
