import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryGrid.css';

const categories = [
    {
        id: 1,
        name: 'Living Room',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop',
        slug: 'living-room'
    },
    {
        id: 2,
        name: 'Dining',
        image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=1932&auto=format&fit=crop',
        slug: 'dining'
    },
    {
        id: 3,
        name: 'Bedroom',
        image: 'https://images.unsplash.com/photo-1616594039964-40891a909a1f?q=80&w=2070&auto=format&fit=crop',
        slug: 'bedroom'
    },
    {
        id: 4,
        name: 'Office',
        image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop',
        slug: 'office'
    }
];

const CategoryGrid = () => {
    return (
        <section className="category-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Shop by Category</h2>
                    <Link to="/products" className="view-all-link">View All Categories &rarr;</Link>
                </div>

                <div className="category-grid">
                    {categories.map((category) => (
                        <Link
                            to={`/products?category=${category.slug}`}
                            key={category.id}
                            className="category-card"
                        >
                            <div className="category-image-wrapper">
                                <img src={category.image} alt={category.name} className="category-image" />
                                <div className="category-overlay"></div>
                            </div>
                            <div className="category-content">
                                <h3 className="category-name">{category.name}</h3>
                                <span className="shop-now-text">Shop Now</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
