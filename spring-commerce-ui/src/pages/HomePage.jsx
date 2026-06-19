import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTruck, FaShieldAlt, FaUndo } from 'react-icons/fa';
import Button from '../components/common/Button';
import ProductCard from '../components/products/ProductCard';
import HeroSection from '../components/home/HeroSection';
import CategoryGrid from '../components/home/CategoryGrid';
import api from '../services/api';

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                const data = response?.data?.data;
                const products = data ? (Array.isArray(data) ? data : (data.content || [])) : [];
                setFeaturedProducts(products.slice(0, 4));
            } catch (err) {
                console.error("Failed to load featured products", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="flex flex-col gap-12 select-none">
            {/* Hero Section */}
            <HeroSection />

            {/* Category Grid */}
            <CategoryGrid />

            {/* Features Row - Uneven & Off-grid with Negative Margin */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-25 -mt-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { 
                            icon: FaTruck, 
                            title: 'No-Nonsense Shipping', 
                            desc: "We ship free on orders over ₹5,000. We don't hide extra fees in the checkout.",
                            rotate: 'rotate-1'
                        },
                        { 
                            icon: FaShieldAlt, 
                            title: 'Actually Secure Payments', 
                            desc: 'We use fully encrypted Stripe routing. Your details are safe — we never store your card.',
                            rotate: '-rotate-1.5'
                        },
                        { 
                            icon: FaUndo, 
                            title: 'The "It\'s Not For Me" Return', 
                            desc: "If you don't love the balance or weight, send it back within 30 days. No hard feelings.",
                            rotate: 'rotate-[0.8deg]'
                        },
                    ].map((feature, idx) => (
                        <div 
                            key={idx} 
                            className={`p-6 bg-white border border-secondary-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform ${feature.rotate} hover:-translate-y-1`}
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <div className="p-3 rounded-lg bg-primary-100 text-primary-500">
                                    <feature.icon size={20} />
                                </div>
                                <h3 className="font-display font-[570] text-lg text-stone-900">{feature.title}</h3>
                            </div>
                            {/* Intentional mismatch line height bonus for first card description */}
                            <p className={`text-stone-500 text-sm font-[450] ${idx === 0 ? 'leading-[1.8]' : 'leading-relaxed'}`}>
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full section-padding-b">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                    <div>
                        <span className="text-xs uppercase font-bold tracking-widest text-primary-500">Curated Selects</span>
                        <h2 className="text-3xl md:text-4xl font-display font-[570] text-stone-900 mt-1">
                            What's moving right now.
                        </h2>
                        <p className="text-stone-500 text-sm mt-1">
                            The bats and leather gear our regulars are playing with this week.
                        </p>
                    </div>
                    <Link 
                        to="/products" 
                        className="text-primary-600 font-medium text-sm hover:underline hover:text-primary-700"
                    >
                        Browse entire inventory &rarr;
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map(n => (
                            <div key={n} className="h-[360px] bg-secondary-100 border border-secondary-200 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.length > 0 ? (
                            featuredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-16 bg-white border border-dashed border-secondary-300 rounded-xl text-stone-500">
                                We're temporarily fresh out of stock. Check back in a few hours!
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* Handcrafted Newsletter / Promo - Looks like a newspaper clipping or coupon */}
            <section className="max-w-5xl mx-auto w-full px-4 mb-20">
                <div className="bg-secondary-200 border-2 border-dashed border-stone-400 p-8 md:p-12 rounded-2xl relative overflow-hidden text-left shadow-sm">
                    {/* Corner badge/sticker */}
                    <div className="absolute top-4 right-4 bg-primary-500 text-white text-xs uppercase font-bold px-3 py-1.5 rounded-full transform rotate-[8deg] shadow-sm select-none">
                        Drop 02 live 💥
                    </div>
                    
                    <div className="max-w-2xl">
                        <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2">No spam, just bats.</span>
                        <h2 className="text-3xl md:text-4.5xl font-display font-[570] text-stone-900 leading-tight mb-4">
                            We don't do boring newsletters.
                        </h2>
                        <p className="text-stone-600 text-sm md:text-base mb-6 leading-relaxed">
                            Subscribe and we'll let you know when we secure fresh English willow shipments or drop rare match ball stock. No automated sales funnels, we promise.
                        </p>
                        
                        <form className="flex flex-col sm:flex-row gap-3 max-w-md" onSubmit={e => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Write your email here..."
                                className="flex-grow px-4 py-3 bg-secondary-50 border border-stone-300 rounded-lg text-sm text-stone-950 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            {/* Non-standard border radius button for bonus item 9 */}
                            <Button 
                                type="submit"
                                className="bg-stone-950 hover:bg-stone-800 text-white text-sm px-6 py-3 font-medium transition duration-200 !rounded-[6px] btn-squish"
                            >
                                Let me know
                            </Button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
export { HomePage };
