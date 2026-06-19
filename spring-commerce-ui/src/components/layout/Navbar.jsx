import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const LOGO_COLORS = [
  'text-primary-800',
  'text-yellow-600',
  'text-purple-600',
  'text-teal-600',
  'text-blue-600',
  'text-red-600'
];

const Navbar = () => {
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const { items } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [logoHoverCount, setLogoHoverCount] = useState(0);
    const [logoColorIndex, setLogoColorIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogoHover = () => {
        setLogoHoverCount(prev => {
            const next = prev + 1;
            if (next >= 5) {
                setLogoColorIndex(curr => (curr + 1) % LOGO_COLORS.length);
                return 0;
            }
            return next;
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?keyword=${encodeURIComponent(searchQuery)}`);
            setIsMenuOpen(false);
        }
    };

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-secondary-100/90 backdrop-blur-md border-b border-secondary-200 py-3' : 'bg-transparent py-5'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Brand */}
                    <div className="flex-shrink-0">
                        <Link 
                            to="/" 
                            onMouseEnter={handleLogoHover}
                            className={`text-2xl font-bold font-display tracking-tight transition-colors duration-300 ${LOGO_COLORS[logoColorIndex]}`}
                        >
                            Cric<span className="text-gray-900 font-normal italic">Store</span>
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
                                className="block w-full pl-10 pr-3 py-2 border border-secondary-200 rounded-lg leading-5 bg-secondary-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                                placeholder="Search cricket equipment..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/products" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors py-1 px-2 hover:bg-secondary-100 rounded-md">
                            Shop
                        </Link>
                        {isAuthenticated ? (
                            <div className="relative group">
                                <button className="text-gray-600 hover:text-primary-600 transition-colors flex items-center gap-1.5 py-1 px-2 hover:bg-secondary-100 rounded-md">
                                    <FaUser className="h-4 w-4" />
                                    <span className="text-sm font-medium">{user?.email ? user.email.split('@')[0] : 'Account'}</span>
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-secondary-50 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-secondary-200">
                                    <div className="py-1">
                                        <span className="block px-4 py-2 text-xs text-gray-500 border-b border-secondary-200">{user?.email}</span>
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-secondary-100">My Profile</Link>
                                        <Link to="/order-history" className="block px-4 py-2 text-sm text-gray-700 hover:bg-secondary-100">My Orders</Link>
                                        {user?.role === 'ROLE_ADMIN' && (
                                            <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-secondary-100">Admin Dashboard</Link>
                                        )}
                                        <button onClick={() => dispatch(logout())} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="text-gray-600 hover:text-primary-600 transition-colors py-1 px-2 hover:bg-secondary-100 rounded-md">
                                Sign In
                            </Link>
                        )}
                        <Link to="/cart" className="relative text-gray-600 hover:text-primary-600 transition-colors p-2 hover:bg-secondary-100 rounded-full flex items-center justify-center">
                            <FaShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary-500 text-xs font-bold text-white ring-2 ring-secondary-50">
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
                <div className="md:hidden bg-secondary-50 border-t border-secondary-200 absolute w-full left-0 shadow-lg">
                    <div className="px-4 pt-4 pb-2">
                        <form onSubmit={handleSearch}>
                            <input
                                type="text"
                                className="block w-full pl-4 pr-3 py-2 border border-secondary-200 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
                    </div>
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link to="/products" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-secondary-100">Shop</Link>
                        <Link to="/cart" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-secondary-100">Cart ({cartCount})</Link>
                        {isAuthenticated ? (
                            <>
                                <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-secondary-100">My Profile</Link>
                                <button onClick={() => dispatch(logout())} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-secondary-100">Logout</button>
                            </>
                        ) : (
                            <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-secondary-100">Account</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
