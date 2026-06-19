import React from 'react';
import { Outlet, Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { FiHome, FiShoppingBag, FiBox, FiLogOut } from 'react-icons/fi';

const AdminLayout = () => {
    const { user, loading } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-secondary-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
            </div>
        );
    }

    // Role check must match 'ROLE_ADMIN'
    if (!user || user.role !== 'ROLE_ADMIN') {
        return <Navigate to="/login" replace />;
    }

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: <FiHome className="w-4 h-4" /> },
        { path: '/admin/orders', label: 'Orders', icon: <FiShoppingBag className="w-4 h-4" /> },
        { path: '/admin/products', label: 'Products', icon: <FiBox className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen flex bg-secondary-50 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-secondary-200 flex flex-col justify-between p-6">
                <div>
                    <div className="mb-8">
                        <Link to="/" className="text-xl font-bold font-display tracking-tight text-stone-900">
                            Cric<span className="font-normal italic">Store</span> Admin
                        </Link>
                        <p className="text-[10px] text-stone-400 mt-1 uppercase tracking-widest font-bold">
                            Internal Dashboard
                        </p>
                    </div>
                    
                    <nav className="space-y-1.5">
                        {navItems.map(item => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition duration-200 ${
                                        isActive 
                                            ? 'bg-primary-50 text-primary-700' 
                                            : 'text-stone-600 hover:bg-secondary-100 hover:text-stone-900'
                                    }`}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                
                <div className="border-t border-secondary-200 pt-6">
                    <div className="flex items-center gap-2 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700">
                            A
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-bold text-stone-850 truncate">{user.email.split('@')[0]}</p>
                            <p className="text-[10px] text-stone-400 truncate">Store Manager</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleLogout} 
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-650 hover:bg-red-50 transition duration-200 btn-squish"
                    >
                        <FiLogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
            
            {/* Content Area */}
            <main className="flex-grow p-8 md:p-10 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
export { AdminLayout };
