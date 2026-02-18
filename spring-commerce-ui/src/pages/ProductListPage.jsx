import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/products/ProductCard';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { FaSearch, FaFilter, FaSortAmountDown } from 'react-icons/fa';

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    // Filters state
    const [searchTerm, setSearchTerm] = useState(searchParams.get('keyword') || '');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');

    useEffect(() => {
        // Update searchTerm if URL changes
        setSearchTerm(searchParams.get('keyword') || '');
        setSelectedCategory(searchParams.get('category') || '');
        fetchProducts();
    }, [searchParams]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const keyword = searchParams.get('keyword');
            const category = searchParams.get('category');

            let url = '/products';
            if (keyword) {
                url = `/products/search?query=${encodeURIComponent(keyword)}`;
            } else if (category && category !== 'all') {
                // Assuming backend supports category filter, if not we might need to filter client side or add endpoint
                // For now, let's just fetch all and filter client side if backend doesn't support generic filter param
                url = `/products`;
            }

            const response = await api.get(url);
            const data = response.data.data;
            let productList = Array.isArray(data) ? data : (data.content || []);

            // Client-side filtering for category if not handled by backend search
            // (Adjust this logic based on actual backend capabilities)
            // Client-side filtering for category
            if (category && category !== 'all') {
                productList = productList.filter(p => p.categoryName && p.categoryName.toLowerCase().includes(category.toLowerCase()));
            }

            setProducts(productList);
        } catch (err) {
            console.error("Failed to fetch products", err);
            setError('Failed to load products. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const params = {};
        if (searchTerm) params.keyword = searchTerm;
        if (selectedCategory) params.category = selectedCategory;
        setSearchParams(params);
    };

    const categories = ['Cricket Equipment', 'Apparel', 'Accessories'];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header / Search Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-display text-gray-900">Shop Collection</h1>
                    <p className="text-gray-500 mt-1">Found {products.length} products</p>
                </div>

                <form onSubmit={handleSearch} className="w-full md:w-auto flex gap-2">
                    <div className="relative w-full md:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search furniture..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                    </div>
                    <Button type="submit">Search</Button>
                </form>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
                    {/* Categories */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Categories</h3>
                        <div className="space-y-2">
                            <button
                                onClick={() => {
                                    setSelectedCategory('');
                                    const params = new URLSearchParams(searchParams);
                                    params.delete('category');
                                    setSearchParams(params);
                                }}
                                className={`block w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${!selectedCategory ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                All Products
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => {
                                        setSelectedCategory(cat.toLowerCase());
                                        const params = new URLSearchParams(searchParams);
                                        params.set('category', cat.toLowerCase());
                                        if (searchTerm) params.set('keyword', searchTerm);
                                        setSearchParams(params);
                                    }}
                                    className={`block w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${selectedCategory === cat.toLowerCase() ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Range Filter (Mock UI) */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Price Range</h3>
                        <div className="flex items-center gap-2">
                            <input type="number" placeholder="Min" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                            <span className="text-gray-400">-</span>
                            <input type="number" placeholder="Max" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="flex-1">
                    {/* Sort Bar */}
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FaFilter className="lg:hidden" />
                            <span className="lg:hidden">Filters</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Sort by:</span>
                            <div className="relative inline-block text-left">
                                <select className="text-sm font-medium text-gray-700 bg-transparent border-none focus:ring-0 cursor-pointer">
                                    <option>Most Popular</option>
                                    <option>Newest</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map(n => (
                                <div key={n} className="h-96 bg-gray-100 rounded-2xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-500">{error}</p>
                            <Button onClick={() => fetchProducts()} className="mt-4" variant="secondary">Try Again</Button>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                            <p className="text-gray-500 mb-6">Try adjusting your search or filters to find what you're looking for.</p>
                            <Button onClick={() => { setSearchTerm(''); setSelectedCategory(''); setSearchParams({}); }}>Clear Filters</Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductListPage;
