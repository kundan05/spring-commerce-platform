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
                    <span className="hero-eyebrow">Est. 2024 · Bangalore</span>
                    <h1 className="hero-title">
                        Your Next Innings Starts Here
                    </h1>
                    <p className="hero-subtitle">
                        We pick what we'd actually play with — bats with proper grains,
                        balls that swing, pads that don't weigh you down.
                    </p>
                    <div className="hero-actions">
                        <Link to="/products">
                            <Button size="lg" variant="primary">Browse the Kit</Button>
                        </Link>
                        <Link to="/about">
                            <Button size="lg" variant="outline">Our Story</Button>
                        </Link>
                    </div>
                </div>

                <div className="hero-image-wrapper">
                    <div
                        className="hero-image"
                        style={{ transform: `translateY(${offset * 0.1}px)` }} // Subtle Parallax
                    >
                        <img
                            src="/images/hero/cricket-stadium.jpg"
                            alt="Cricket Stadium"
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
