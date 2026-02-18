import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaEye } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleQuickAdd = (e) => {
        e.preventDefault(); // Prevent navigation
        addToCart(product);
    };

    return (
        <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            <Link to={`/products/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-gray-100">
                <img
                    src={product.imageUrl || 'https://placehold.co/300x400?text=No+Image'}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.stockQuantity < 5 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Low Stock
                        </span>
                    )}
                    {product.id % 2 === 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                            New
                        </span>
                    )}
                </div>

                {/* Hover Actions Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-t from-black/50 to-transparent flex justify-center">
                    <button
                        onClick={handleQuickAdd}
                        className="w-full bg-white text-gray-900 font-medium py-2.5 px-4 rounded-lg shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center justify-center gap-2 transform transition-transform active:scale-95"
                    >
                        <FaShoppingCart className="w-4 h-4" />
                        Quick Add
                    </button>
                </div>
            </Link>

            <div className="p-4 flex flex-col flex-grow">
                {product.categoryName && (
                    <span className="text-xs font-medium text-primary-600 mb-1 block">
                        {product.categoryName}
                    </span>
                )}

                <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 flex-grow font-display">
                    <Link to={`/products/${product.id}`} className="hover:text-primary-600 transition-colors">
                        {product.name}
                    </Link>
                </h3>

                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
                    <span className="text-lg font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                    </span>
                    {/* <div className="text-yellow-400 text-sm">★★★★☆</div> */}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
