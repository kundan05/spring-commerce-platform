import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { FaLock, FaArrowLeft } from 'react-icons/fa';

const CheckoutPage = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/orders', data);
            clearCart();
            const orderId = response.data.data.id;
            navigate(`/payment/${orderId}`);
        } catch (err) {
            console.error("Order failed", err);
            setError(err.response?.data?.message || "Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-2xl font-bold font-display text-gray-900 mb-4">Your cart is empty</h2>
                <Link to="/products">
                    <Button variant="primary">Continue Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold font-display text-gray-900">Checkout</h1>
                <Link to="/cart" className="text-sm text-gray-500 hover:text-primary-600 flex items-center">
                    <FaArrowLeft className="mr-2" /> Back to Cart
                </Link>
            </div>

            <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start">
                {/* Checkout Form */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                            <FaLock className="text-primary-600" />
                            <h2 className="text-xl font-bold font-display text-gray-900">Shipping Information</h2>
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} id="checkout-form" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Full Name"
                                    placeholder="John Doe"
                                    error={errors.fullName}
                                    {...register('fullName', { required: 'Full Name is required' })}
                                />
                                <Input
                                    label="Phone Number"
                                    placeholder="+1 234 567 890"
                                    error={errors.phoneNumber}
                                    {...register('phoneNumber', { required: 'Phone Number is required' })}
                                />
                            </div>

                            <Input
                                label="Street Address"
                                placeholder="123 Main St"
                                error={errors.street}
                                {...register('street', { required: 'Street Address is required' })}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="City"
                                    placeholder="New York"
                                    error={errors.city}
                                    {...register('city', { required: 'City is required' })}
                                />
                                <Input
                                    label="State / Province"
                                    placeholder="NY"
                                    error={errors.state}
                                    {...register('state', { required: 'State is required' })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Zip / Postal Code"
                                    placeholder="10001"
                                    error={errors.zipCode}
                                    {...register('zipCode', { required: 'Zip Code is required' })}
                                />
                                <Input
                                    label="Country"
                                    placeholder="United States"
                                    error={errors.country}
                                    {...register('country', { required: 'Country is required' })}
                                />
                            </div>
                        </form>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-4 mt-8 lg:mt-0">
                    <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 sticky top-24">
                        <h2 className="text-xl font-bold font-display text-gray-900 mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex gap-4 items-start">
                                    <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                                        <img
                                            src={item.imageUrl || 'https://placehold.co/100?text=Product'}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 pt-4 space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium text-gray-900">${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Shipping</span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold">
                                <span className="text-gray-900">Total</span>
                                <span className="text-primary-700">${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            size="lg"
                            form="checkout-form"
                            isLoading={loading}
                            className="mt-6 shadow-lg shadow-primary-500/20"
                        >
                            Place Order
                        </Button>

                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                            <FaLock size={10} /> Secure SSL Encryption
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
