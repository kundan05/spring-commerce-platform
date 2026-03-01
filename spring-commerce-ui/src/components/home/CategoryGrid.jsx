import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryGrid.css';

const categories = [
    {
        id: 1,
        name: 'Cricket Bats',
        image: '/images/products/bat.jpg',
        slug: 'bats'
    },
    {
        id: 2,
        name: 'Cricket Balls',
        image: '/images/products/ball.jpg',
        slug: 'balls'
    },
    {
        id: 3,
        name: 'Protection',
        image: '/images/products/equipment.jpg',
        slug: 'protection'
    },
    {
        id: 4,
        name: 'Accessories',
        image: '/images/products/equipment.jpg',
        slug: 'accessories'
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
