import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaShoppingCart, FaArrowLeft, FaStar, FaCheck, FaTruck, FaShieldAlt } from 'react-icons/fa';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${id}`);
                setProduct(response.data.data);
            } catch (err) {
                console.error("Failed to fetch product details", err);
                setError('Failed to load product details.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center text-red-600">
                <p className="text-xl font-semibold">{error}</p>
                <Link to="/products" className="text-primary-600 hover:underline mt-4 block">Return to Shop</Link>
            </div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <p className="text-xl font-semibold text-gray-900">Product not found</p>
                <Link to="/products" className="text-primary-600 hover:underline mt-4 block">Return to Shop</Link>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link to="/products" className="inline-flex items-center text-gray-500 hover:text-primary-600 mb-8 transition-colors">
                <FaArrowLeft className="mr-2" /> Back to Products
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                {/* Product Image */}
                <div className="space-y-4">
                    <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-square relative group">
                        <img
                            src={product.imageUrl || 'https://placehold.co/600x600?text=No+Image'}
                            alt={product.name}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                        {product.stockQuantity < 5 && product.stockQuantity > 0 && (
                            <div className="absolute top-4 left-4 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                                Low Stock: Only {product.stockQuantity} left
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col">
                    <div className="mb-2">
                        <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full inline-block">
                            {product.categoryName || 'Furniture'}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-4">
                        {product.name}
                    </h1>

                    <div className="flex items-center space-x-4 mb-6">
                        <span className="text-3xl font-bold text-gray-900">
                            ${product.price.toFixed(2)}
                        </span>
                        <div className="flex items-center text-yellow-400 text-sm">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar key={star} />
                            ))}
                            <span className="text-gray-500 ml-2 text-sm">(4.8/5)</span>
                        </div>
                    </div>

                    <div className="prose prose-gray mb-8 text-gray-600 leading-relaxed">
                        <p>{product.description}</p>
                    </div>

                    {/* Stock Status & Quantity */}
                    <div className="border-t border-b border-gray-100 py-6 mb-8 space-y-6">
                        <div>
                            <span className={`flex items-center text-sm font-medium ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                <FaCheck className="mr-2" />
                                {product.stockQuantity > 0 ? 'In Stock & Ready to Ship' : 'Out of Stock'}
                            </span>
                        </div>

                        {product.stockQuantity > 0 && (
                            <div className="flex items-center space-x-4">
                                <label htmlFor="quantity" className="sr-only">Quantity</label>
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                                    >-</button>
                                    <span className="px-4 py-2 font-medium text-gray-900 min-w-[3rem] text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                                    >+</button>
                                </div>
                                <span className="text-sm text-gray-500">
                                    Total: <strong className="text-gray-900">${(product.price * quantity).toFixed(2)}</strong>
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <Button
                            size="lg"
                            disabled={product.stockQuantity <= 0}
                            onClick={() => {
                                for (let i = 0; i < quantity; i++) addToCart(product);
                            }}
                            className="flex-1 py-4 text-lg"
                        >
                            <FaShoppingCart className="mr-2" /> Add to Cart
                        </Button>
                        <Button
                            variant="secondary"
                            size="lg"
                            disabled={product.stockQuantity <= 0}
                            className="flex-1 py-4 text-lg bg-gray-50 border-gray-200"
                        >
                            Buy Now
                        </Button>
                    </div>

                    {/* Features/Trust */}
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <FaTruck className="text-primary-600" />
                            <span>Free Shipping over $500</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaShieldAlt className="text-primary-600" />
                            <span>2 Year Warranty</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
