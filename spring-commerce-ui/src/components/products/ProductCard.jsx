import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addToLocalCart } from '../../store/slices/cartSlice';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(state => state.auth);
    const { addToast } = useToast() || {};

    const handleQuickAdd = async (e) => {
        e.preventDefault();
        if (isAuthenticated) {
            try {
                await api.post('/cart/items', { productId: product.id, quantity: 1 });
                if (addToast) addToast('Added to cart', 'success');
            } catch (err) {
                if (addToast) addToast(err.response?.data?.message || 'Failed to add', 'error');
            }
        } else {
            dispatch(addToLocalCart(product));
            if (addToast) addToast('Added to cart', 'success');
        }
    };

    // Fallback images matching cricket equipment
    const getFallbackImage = (name) => {
        const lower = name.toLowerCase();
        if (lower.includes('bat')) return 'https://images.unsplash.com/photo-1608248597983-10eb2c101598?auto=format&fit=crop&q=80&w=600';
        if (lower.includes('ball')) return 'https://images.unsplash.com/photo-1594470117754-e347c2ae1ee7?auto=format&fit=crop&q=80&w=600';
        return 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=80&w=600';
    };

    return (
        <div className="group relative bg-white p-3 pb-8 rounded-lg shadow-sm border border-secondary-200 transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex flex-col h-full transform rotate-[0.5deg] hover:rotate-[0deg]">
            <Link to={`/products/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-stone-50 rounded border border-secondary-100">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover object-[75%_20%] transition-transform duration-500 group-hover:scale-103"
                    onError={(e) => {
                        e.target.src = getFallbackImage(product.name);
                    }}
                />

                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
                    {product.stockQuantity < 5 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
                            Almost Gone
                        </span>
                    )}
                </div>
            </Link>

            <div className="pt-4 flex flex-col flex-grow">
                {product.categoryName && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary-500 mb-1 block">
                        {product.categoryName}
                    </span>
                )}

                <h3 className="text-base font-display font-[570] text-stone-900 mb-2 line-clamp-2 flex-grow">
                    <Link to={`/products/${product.id}`} className="hover:text-primary-500 transition-colors">
                        {product.name}
                    </Link>
                </h3>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-secondary-100">
                    <span className="text-lg font-bold text-stone-950 font-display">
                        ${product.price.toFixed(2)}
                    </span>
                    
                    {/* Handcrafted quick add button with squish effect */}
                    <button
                        onClick={handleQuickAdd}
                        className="bg-primary-500 hover:bg-primary-600 text-white font-medium p-2.5 rounded-lg shadow-sm hover:shadow flex items-center justify-center gap-1.5 text-xs transition duration-200 active:scale-95 btn-squish"
                        aria-label="Add product to cart"
                    >
                        <FaShoppingCart className="w-3.5 h-3.5" />
                        <span>Add</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
export { ProductCard };
