import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaArrowLeft, FaArrowRight, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="bg-gray-100 p-6 rounded-full mb-6">
                    <FaShoppingBag className="text-gray-400 text-4xl" />
                </div>
                <h2 className="text-2xl font-bold font-display text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven't added any items to your cart yet. Browse our products to find something you love.</p>
                <Link to="/products">
                    <Button size="lg">
                        Start Shopping <FaArrowRight className="ml-2" />
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold font-display text-gray-900 mb-8">Shopping Cart</h1>

            <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start">
                {/* Cart Items List */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <ul className="divide-y divide-gray-100">
                            {cartItems.map((item) => (
                                <li key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-6">
                                    <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                                        <img
                                            src={item.imageUrl || 'https://placehold.co/100?text=Product'}
                                            alt={item.name}
                                            className="w-full h-full object-cover object-center"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-gray-900 font-display hover:text-primary-600 transition-colors">
                                            <Link to={`/products/${item.id}`}>{item.name}</Link>
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">Price: ${item.price.toFixed(2)}</p>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center border border-gray-200 rounded-lg">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                                                disabled={item.quantity <= 1}
                                            >
                                                <FaMinus size={10} />
                                            </button>
                                            <span className="w-8 text-center text-sm font-medium text-gray-900">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                <FaPlus size={10} />
                                            </button>
                                        </div>

                                        <div className="text-right min-w-[5rem]">
                                            <p className="text-lg font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                            title="Remove item"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-sm">
                            <Link to="/products" className="flex items-center text-gray-600 hover:text-primary-600 font-medium transition-colors">
                                <FaArrowLeft className="mr-2" size={12} /> Continue Shopping
                            </Link>
                            <button onClick={clearCart} className="text-red-500 hover:text-red-700 font-medium transition-colors">
                                Clear Cart
                            </button>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-4 mt-8 lg:mt-0">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 font-display mb-6">Order Summary</h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-medium text-gray-900">${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Shipping</span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                            <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                                <span className="text-base font-bold text-gray-900">Total</span>
                                <span className="text-xl font-bold text-primary-700">${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mt-8">
                            <Button
                                fullWidth
                                size="lg"
                                onClick={() => navigate('/checkout')}
                                className="shadow-lg shadow-primary-500/30"
                            >
                                Proceed to Checkout
                            </Button>
                            <p className="mt-4 text-xs text-center text-gray-500">
                                Taxes and shipping calculated at checkout
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
