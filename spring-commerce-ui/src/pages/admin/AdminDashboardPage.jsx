import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './AdminDashboardPage.css';
import { FiDollarSign, FiShoppingBag, FiUsers, FiBox } from 'react-icons/fi';

const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/stats');
            setStats(response.data.data);
        } catch (error) {
            console.error("Failed to fetch admin stats", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading dashboard...</div>;
    if (!stats) return <div>Failed to load stats.</div>;

    const cards = [
        { label: 'Total Sales', value: `$${stats.totalSales.toFixed(2)}`, icon: <FiDollarSign />, color: 'green' },
        { label: 'Total Orders', value: stats.totalOrders, icon: <FiShoppingBag />, color: 'blue' },
        { label: 'Total Users', value: stats.totalUsers, icon: <FiUsers />, color: 'purple' },
        { label: 'Total Products', value: stats.totalProducts, icon: <FiBox />, color: 'orange' },
    ];

    return (
        <div className="admin-dashboard">
            <h1>Dashboard Overview</h1>

            <div className="stats-grid">
                {cards.map((card, index) => (
                    <div key={index} className="stat-card">
                        <div className={`stat-icon-wrapper ${card.color}`}>
                            {card.icon}
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">{card.label}</span>
                            <span className="stat-value">{card.value}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboardPage;
