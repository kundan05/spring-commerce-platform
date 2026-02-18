import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiHome, FiShoppingBag, FiUsers, FiBox, FiLogOut } from 'react-icons/fi';
import './AdminLayout.css';

const AdminLayout = () => {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    if (loading) return <div className="loading">Loading...</div>;

    if (!user || user.role !== 'ADMIN') {
        return <Navigate to="/login" replace />;
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: <FiHome /> },
        { path: '/admin/orders', label: 'Orders', icon: <FiShoppingBag /> },
        { path: '/admin/products', label: 'Products', icon: <FiBox /> },
        { path: '/admin/users', label: 'Users', icon: <FiUsers /> },
    ];

    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <h2>Admin Panel</h2>
                </div>
                <nav className="admin-nav">
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="admin-footer">
                    <button onClick={handleLogout} className="admin-logout-btn">
                        <FiLogOut />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
