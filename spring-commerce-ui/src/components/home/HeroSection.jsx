import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import './HeroSection.css';

const HeroSection = () => {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setOffset(window.pageYOffset);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section className="hero-section">
            <div className="container hero-container">
                <div className="hero-content">
                    <span className="hero-eyebrow">Spring Collection 2026</span>
                    <h1 className="hero-title">
                        Minimalist Living for Modern Homes
                    </h1>
                    <p className="hero-subtitle">
                        Discover our curated collection of Scandinavian furniture and decor.
                        Designed for comfort, crafted for life.
                    </p>
                    <div className="hero-actions">
                        <Link to="/products">
                            <Button size="lg" variant="primary">Shop Collection</Button>
                        </Link>
                        <Link to="/about">
                            <Button size="lg" variant="outline">Learn More</Button>
                        </Link>
                    </div>
                </div>

                <div className="hero-image-wrapper">
                    <div
                        className="hero-image"
                        style={{ transform: `translateY(${offset * 0.1}px)` }} // Subtle Parallax
                    >
                        <img
                            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop"
                            alt="Modern Living Room"
                        />
                    </div>
                    {/* Decorative Circle */}
                    <div className="hero-shape"></div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
