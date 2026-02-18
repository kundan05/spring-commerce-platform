import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './AdminOrdersPage.css';

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/admin/orders');
            setOrders(response.data.data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await api.put(`/admin/orders/${orderId}/status`, null, {
                params: { status: newStatus }
            });
            // Optimistic update or refetch
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status");
        }
    };

    if (loading) return <div>Loading orders...</div>;

    return (
        <div className="admin-page">
            <div className="page-header">
                <h1>Order Management</h1>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>#{order.orderNumber?.substring(0, 8)}</td>
                                <td>
                                    <div>{order.shippingAddress?.fullName}</div>
                                    <div className="sub-text">{order.shippingAddress?.city}</div>
                                </td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>${order.totalAmount?.toFixed(2)}</td>
                                <td>
                                    <span className={`status-badge ${order.status}`}>{order.status}</span>
                                </td>
                                <td>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                        className="status-select"
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="CONFIRMED">Confirmed</option>
                                        <option value="SHIPPED">Shipped</option>
                                        <option value="DELIVERED">Delivered</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrdersPage;
