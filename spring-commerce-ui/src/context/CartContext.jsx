import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);

    // Initial load and sync on user change
    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            const storedCart = localStorage.getItem('cart');
            if (storedCart) {
                setCartItems(JSON.parse(storedCart));
            } else {
                setCartItems([]);
            }
        }
    }, [user]);

    // Save to local storage for guest users
    useEffect(() => {
        if (!user) {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        }
    }, [cartItems, user]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await api.get('/cart');
            // Backend returns CartResponse with items array
            // We map it to our internal structure if needed, or just use as is
            // Backend item: { id, productId, productName, imageUrl, price, quantity, subtotal }
            // Frontend expects similar
            setCartItems(response.data.data.items || []);
        } catch (error) {
            console.error("Failed to fetch cart", error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (product) => {
        if (user) {
            try {
                await api.post('/cart/items', {
                    productId: product.id,
                    quantity: 1
                });
                await fetchCart(); // Refresh cart
            } catch (error) {
                console.error("Failed to add to cart", error);
            }
        } else {
            setCartItems(prevItems => {
                // Determine if we are using product ID or cart item ID.
                // For guest, we use product ID as unique identifier logic
                const existingItem = prevItems.find(item => item.id === product.id || item.productId === product.id);
                if (existingItem) {
                    return prevItems.map(item =>
                        (item.id === product.id || item.productId === product.id)
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    return [...prevItems, { ...product, productId: product.id, quantity: 1 }];
                }
            });
        }
    };

    const removeFromCart = async (itemId) => {
        // itemId: For user, it's cartItemId. For guest, it's productId.
        // This is tricky. We need to ensure UI passes the right ID.
        // The cartItems state will have `id`. 
        // For Backend: `id` is CartItemId. `productId` is ProductId.
        // For Guest: `id` is ProductId (usually). 
        // To unify, we should make sure guest items also have consistent structure or handle accordingly.

        if (user) {
            try {
                await api.delete(`/cart/items/${itemId}`);
                await fetchCart();
            } catch (error) {
                console.error("Failed to remove from cart", error);
            }
        } else {
            setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
        }
    };

    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        if (user) {
            try {
                await api.put(`/cart/items/${itemId}`, { quantity: newQuantity });
                await fetchCart();
            } catch (error) {
                console.error("Failed to update cart item quantity", error);
            }
        } else {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === itemId ? { ...item, quantity: newQuantity } : item
                )
            );
        }
    };

    const clearCart = async () => {
        if (user) {
            try {
                await api.delete('/cart/clear');
                setCartItems([]);
            } catch (error) {
                console.error("Failed to clear cart", error);
            }
        } else {
            setCartItems([]);
        }
    };

    // Calculate totals
    // Backend returns total, but for instant UI updates we can calc too, 
    // or rely on backend response. Backend response has totalPrice.
    // Guest: calc locally.
    const cartTotal = user
        ? cartItems.reduce((total, item) => total + (item.price * item.quantity), 0) // or use total from response if stored
        : cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount,
            loading
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
