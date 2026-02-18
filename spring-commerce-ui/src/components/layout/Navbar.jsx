import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch, FaHeart, FaBars, FaTimes } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
    const { cartCount } = useCart();
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?keyword=${encodeURIComponent(searchQuery)}`);
            setIsMenuOpen(false);
        }
    };

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 py-3' : 'bg-transparent py-5'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Brand */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-bold font-display text-primary-800 tracking-tight">
                            Cric<span className="text-gray-900">Store</span>
                        </Link>
                    </div>

                    {/* Desktop Search */}
                    <div className="hidden md:block flex-1 max-w-md mx-8">
                        <form onSubmit={handleSearch} className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/products" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                            Shop
                        </Link>
                        <Link to="/login" className="text-gray-600 hover:text-primary-600 transition-colors">
                            <FaUser className="h-5 w-5" />
                        </Link>
                        <Link to="#" className="text-gray-600 hover:text-primary-600 transition-colors">
                            <FaHeart className="h-5 w-5" />
                        </Link>
                        <Link to="/cart" className="relative text-gray-600 hover:text-primary-600 transition-colors">
                            <FaShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary-600 text-xs font-medium text-white ring-2 ring-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
                        >
                            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-lg">
                    <div className="px-4 pt-4 pb-2">
                        <form onSubmit={handleSearch}>
                            <input
                                type="text"
                                className="block w-full pl-4 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
                    </div>
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link to="/products" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">Shop</Link>
                        <Link to="/cart" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">Cart ({cartCount})</Link>
                        <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">Account</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
