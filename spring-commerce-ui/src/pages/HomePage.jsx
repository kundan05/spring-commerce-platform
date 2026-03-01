import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaTruck, FaShieldAlt, FaUndo } from 'react-icons/fa';
import Button from '../components/common/Button';
import ProductCard from '../components/products/ProductCard';
import HeroSection from '../components/home/HeroSection';
import CategoryGrid from '../components/home/CategoryGrid';
import api from '../services/api';

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch featured products (mocking with standard fetch for now or use specific endpoint)
        const fetchBufferedProducts = async () => {
            try {
                const response = await api.get('/products');
                // Just take first 4 for display
                const data = response.data.data;
                const products = Array.isArray(data) ? data : (data.content || []);
                setFeaturedProducts(products.slice(0, 4));
            } catch (err) {
                console.error("Failed to load featured products", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBufferedProducts();
    }, []);

    return (
        <div className="flex flex-col gap-16">
            {/* Hero Section */}
            <HeroSection />

            {/* Category Grid */}
            <CategoryGrid />

            {/* Features Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: FaTruck, title: 'Free Delivery', desc: 'On orders over ₹5,000 — no catches' },
                        { icon: FaShieldAlt, title: 'Safe Checkout', desc: 'UPI, cards, net banking — all encrypted' },
                        { icon: FaUndo, title: 'Hassle-free Returns', desc: 'Changed your mind? 30 days, no questions' },
                    ].map((feature, idx) => (
                        <div key={idx} className="flex items-start p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-3 rounded-lg bg-primary-50 text-primary-600 mr-4">
                                <feature.icon size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 mb-1">{feature.title}</h3>
                                <p className="text-gray-500 text-sm">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 font-display">What's Moving Right Now</h2>
                        <p className="text-gray-500 mt-2">The stuff people are actually buying this week</p>
                    </div>
                    <Link to="/products" className="text-primary-600 font-medium hover:text-primary-700 hover:underline">
                        View All
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map(n => (
                            <div key={n} className="h-80 bg-gray-100 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.length > 0 ? (
                            featuredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                No featured products found.
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* Newsletter / CTA */}
            <section className="bg-secondary-900 text-white py-16 px-4 mb-16 rounded-3xl mx-4 lg:mx-0 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-800 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-900 rounded-full blur-3xl opacity-50 -translate-x-1/3 translate-y-1/3"></div>

                <div className="relative z-10 max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Don't Miss Restocks</h2>
                    <p className="text-gray-300 mb-8 text-lg">
                        Get notified about new drops and restocks. No spam — we hate it too.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={e => e.preventDefault()}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-grow px-5 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <Button size="lg" className="bg-primary-600 hover:bg-primary-500 text-white">Subscribe</Button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
