import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/common/Button';
import { FaArrowLeft, FaBox, FaCalendarAlt, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';

const STATUS_COLORS = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PAID: 'bg-green-100 text-green-800',
    SHIPPED: 'bg-indigo-100 text-indigo-800',
    DELIVERED: 'bg-emerald-100 text-emerald-800',
    CANCELLED: 'bg-red-100 text-red-800',
};

const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'PAID', 'SHIPPED', 'DELIVERED'];

const OrderDetailPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await api.get(`/orders/${id}`);
                setOrder(res.data.data);
            } catch (err) {
                console.error('Failed to fetch order', err);
                setError('Failed to load order details. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
    );

    if (error || !order) return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 text-center">
            <FaBox className="text-gray-300 text-5xl mb-4" />
            <p className="text-red-500 mb-4">{error || 'Order not found'}</p>
            <Link to="/order-history">
                <Button variant="secondary">Back to Orders</Button>
            </Link>
        </div>
    );

    const currentStepIdx = STATUS_STEPS.indexOf(order.status);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link to="/order-history" className="inline-flex items-center text-gray-500 hover:text-primary-600 mb-8 transition-colors">
                <FaArrowLeft className="mr-2" /> Back to Orders
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-display text-gray-900">Order Details</h1>
                    <p className="text-gray-500 text-sm mt-1">#{order.orderNumber?.substring(0, 12) || order.id}</p>
                </div>
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}>
                    {order.status}
                </span>
            </div>

            {/* Order Progress */}
            {order.status !== 'CANCELLED' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <h2 className="text-base font-semibold text-gray-900 mb-6">Order Progress</h2>
                    <div className="flex items-center">
                        {STATUS_STEPS.map((step, idx) => (
                            <React.Fragment key={step}>
                                <div className="flex flex-col items-center">
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                        idx <= currentStepIdx
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-100 text-gray-400'
                                    }`}>
                                        {idx < currentStepIdx ? <FaCheckCircle size={16} /> : idx + 1}
                                    </div>
                                    <p className={`mt-2 text-xs font-medium hidden sm:block ${
                                        idx <= currentStepIdx ? 'text-primary-600' : 'text-gray-400'
                                    }`}>
                                        {step.charAt(0) + step.slice(1).toLowerCase()}
                                    </p>
                                </div>
                                {idx < STATUS_STEPS.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-2 ${idx < currentStepIdx ? 'bg-primary-600' : 'bg-gray-200'}`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Order Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FaCalendarAlt className="text-primary-600" size={14} /> Order Information
                    </h2>
                    <dl className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-gray-500">Order Date</dt>
                            <dd className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-gray-500">Order Status</dt>
                            <dd className="font-medium text-gray-900">{order.status}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-gray-500">Order Total</dt>
                            <dd className="font-bold text-lg text-primary-700">${Number(order.totalAmount).toFixed(2)}</dd>
                        </div>
                    </dl>
                </div>

                {/* Shipping Address */}
                {order.shippingAddress && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <FaMapMarkerAlt className="text-primary-600" size={14} /> Shipping Address
                        </h2>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                            {order.shippingAddress.phoneNumber && (
                                <p>{order.shippingAddress.phoneNumber}</p>
                            )}
                            <p>{order.shippingAddress.street}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                            <p>{order.shippingAddress.country}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-gray-900">Items Ordered ({order.items?.length || 0})</h2>
                </div>
                <ul className="divide-y divide-gray-100">
                    {(order.items || []).map(item => (
                        <li key={item.id} className="p-6 flex items-center gap-4">
                            <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                    src={item.imageUrl || 'https://placehold.co/100?text=Product'}
                                    alt={item.productName}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <Link
                                    to={`/products/${item.productId}`}
                                    className="text-sm font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                                >
                                    {item.productName}
                                </Link>
                                <p className="text-sm text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-500">${Number(item.price).toFixed(2)} each</p>
                                <p className="text-base font-bold text-gray-900">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Shipping</span>
                        <span className="text-sm font-medium text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-base font-bold text-gray-900">Total</span>
                        <span className="text-xl font-bold text-primary-700">${Number(order.totalAmount).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
