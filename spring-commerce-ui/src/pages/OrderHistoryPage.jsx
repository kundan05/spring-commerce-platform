import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/common/Button';
import { FaBox, FaChevronRight, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get('/orders');
            setOrders(response.data.data);
        } catch (err) {
            console.error("Failed to fetch orders", err);
            setError("Failed to load order history");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchOrders} variant="secondary">Try Again</Button>
        </div>
    );

    if (orders.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="bg-gray-100 p-6 rounded-full mb-6">
                    <FaBox className="text-gray-400 text-4xl" />
                </div>
                <h2 className="text-2xl font-bold font-display text-gray-900 mb-2">No orders yet</h2>
                <p className="text-gray-500 mb-8 max-w-sm">You haven't placed any orders yet. Start shopping to create your first order.</p>
                <Link to="/products">
                    <Button size="lg">Start Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold font-display text-gray-900 mb-8">Order History</h1>

            <div className="space-y-6">
                {orders.map(order => (
                    <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex flex-col sm:flex-row sm:gap-6">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Order Placed</p>
                                    <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                        <FaCalendarAlt className="text-gray-400" size={12} />
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="mt-2 sm:mt-0">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Order Number</p>
                                    <p className="text-sm font-medium text-gray-900">#{order.orderNumber ? order.orderNumber.substring(0, 8) : order.id}</p>
                                </div>
                                <div className="mt-2 sm:mt-0">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Total Amount</p>
                                    <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                        <FaDollarSign className="text-gray-400" size={12} />
                                        {order.totalAmount}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                                    ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>

                        <div className="px-6 py-6">
                            <ul className="divide-y divide-gray-100">
                                {order.items.map(item => (
                                    <li key={item.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                                <img src="https://placehold.co/100?text=Product" alt="Product" className="h-full w-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">${item.price}</p>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
                                {/* Placeholder for detail view link */}
                                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
                                    View Order Details <FaChevronRight size={12} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistoryPage;
