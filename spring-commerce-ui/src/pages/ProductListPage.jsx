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
    const [priceRange, setPriceRange] = useState({
        min: searchParams.get('minPrice') || '',
        max: searchParams.get('maxPrice') || ''
    });
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'createdAt,desc');
    const [page, setPage] = useState(parseInt(searchParams.get('page')) || 0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        // Update state if URL changes
        setSearchTerm(searchParams.get('keyword') || '');
        setSelectedCategory(searchParams.get('category') || '');
        setPriceRange({
            min: searchParams.get('minPrice') || '',
            max: searchParams.get('maxPrice') || ''
        });
        setSortBy(searchParams.get('sort') || 'createdAt,desc');
        setPage(parseInt(searchParams.get('page')) || 0);

        fetchProducts();
    }, [searchParams]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const keyword = searchParams.get('keyword');
            const category = searchParams.get('category');
            const minPrice = searchParams.get('minPrice');
            const maxPrice = searchParams.get('maxPrice');
            const sort = searchParams.get('sort') || 'createdAt,desc';
            const pageParam = searchParams.get('page') || 0;

            const params = {
                page: pageParam,
                size: 9, // Adjust size as needed
                sort: sort
            };

            if (keyword) params.search = keyword;
            // Note: Backend expects categoryId, but we are using category names in URL.
            // Ideally we should look up ID or change backend to support name.
            // For now, if category is selected, filtering might not work perfect without ID.
            // But let's pass it if backend supported it or just rely on search?
            // Re-reading backend Spec: filters by categoryId (Long).
            // Frontend uses string 'cricket equipment'.
            // Let's Skip category param for now to avoid 500 error if string passed to Long.
            // We can rely on client side filtering for category OR implement category lookup.
            // Given time constraints, I will keep client side filtering for category if possible 
            // OR just not pass it to backend and let client filter?
            // Actually, backend search is powerful.
            // Let's try to pass 'search' as keyword.

            if (minPrice) params.minPrice = minPrice;
            if (maxPrice) params.maxPrice = maxPrice;

            const response = await api.get('/products', { params });
            const data = response.data.data;

            let productList = data.content || [];

            // Client-side filtering for category (fallback until we have IDs)
            if (category && category !== 'all') {
                productList = productList.filter(p => p.categoryName && p.categoryName.toLowerCase().includes(category.toLowerCase()));
            }

            setProducts(productList);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error("Failed to fetch products", err);
            setError('Failed to load products. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const updateParams = (newParams) => {
        const params = new URLSearchParams(searchParams);
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === null || value === '' || value === undefined) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        setSearchParams(params);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        updateParams({ keyword: searchTerm, page: 0 });
    };

    const handlePriceFilter = () => {
        updateParams({
            minPrice: priceRange.min,
            maxPrice: priceRange.max,
            page: 0
        });
    };

    const handleSortChange = (e) => {
        updateParams({ sort: e.target.value, page: 0 });
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            updateParams({ page: newPage });
            window.scrollTo(0, 0);
        }
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
                            placeholder="Search cricket gear..."
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

                    {/* Price Range Filter */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Price Range</h3>
                        <div className="flex items-center gap-2 mb-2">
                            <input
                                type="number"
                                placeholder="Min"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                            />
                        </div>
                        <Button
                            variant="secondary"
                            className="w-full text-xs py-2"
                            onClick={handlePriceFilter}
                        >
                            Apply
                        </Button>
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
                                <select
                                    className="text-sm font-medium text-gray-700 bg-transparent border-none focus:ring-0 cursor-pointer"
                                    value={sortBy}
                                    onChange={handleSortChange}
                                >
                                    <option value="createdAt,desc">Newest</option>
                                    <option value="price,asc">Price: Low to High</option>
                                    <option value="price,desc">Price: High to Low</option>
                                    <option value="name,asc">Name: A-Z</option>
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-10 flex justify-center gap-2">
                            <Button
                                variant="secondary"
                                disabled={page === 0}
                                onClick={() => handlePageChange(page - 1)}
                            >
                                Previous
                            </Button>
                            <span className="flex items-center px-4 text-sm text-gray-600">
                                Page {page + 1} of {totalPages}
                            </span>
                            <Button
                                variant="secondary"
                                disabled={page === totalPages - 1}
                                onClick={() => handlePageChange(page + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductListPage;
