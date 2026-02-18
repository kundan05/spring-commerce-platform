import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaTruck, FaShieldAlt, FaUndo } from 'react-icons/fa';
import Button from '../components/common/Button';
import ProductCard from '../components/products/ProductCard';
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
            <section className="relative bg-primary-900 text-white rounded-3xl overflow-hidden mx-4 mt-4 lg:mx-0">
                <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" style={{ backgroundImage: "url('/images/hero/cricket-stadium.jpg')" }}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-950/90 to-primary-900/40"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-start gap-6">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/20 border border-primary-400/30 text-primary-200 text-sm font-medium backdrop-blur-sm">
                        Season 2026 Gear
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold font-display leading-tight max-w-2xl">
                        Unleash Your Inner <br />
                        <span className="text-primary-300">Cricketer</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed">
                        Premium cricket equipment for professionals and enthusiasts.
                        Experience the perfect drive with our hand-picked selection.
                    </p>
                    <div className="flex gap-4 mt-4">
                        <Link to="/products">
                            <Button size="lg" className="shadow-xl shadow-primary-900/20">
                                Shop Equipment <FaArrowRight className="ml-2" />
                            </Button>
                        </Link>
                        <Link to="/products?category=apparel">
                            <Button variant="secondary" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                                Team Apparel
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: FaTruck, title: 'Free Shipping', desc: 'On all orders over $500' },
                        { icon: FaShieldAlt, title: 'Secure Payment', desc: '100% secure payment processing' },
                        { icon: FaUndo, title: 'Easy Returns', desc: '30-day return policy' },
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
                        <h2 className="text-3xl font-bold text-gray-900 font-display">Featured Products</h2>
                        <p className="text-gray-500 mt-2">Hand-picked favorites just for you</p>
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
                    <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Join Our Community</h2>
                    <p className="text-gray-300 mb-8 text-lg">
                        Sign up for our newsletter to receive exclusive offers, design tips, and first access to new collections.
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
