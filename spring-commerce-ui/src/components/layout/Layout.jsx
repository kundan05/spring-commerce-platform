import React, { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
    const cursorDotRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const mousePos = useRef({ x: 0, y: 0 });
    const dotPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            mousePos.current.x = e.clientX;
            mousePos.current.y = e.clientY;
        };

        const handleMouseOver = (e) => {
            const target = e.target;
            const isClickable = target.closest('a') || target.closest('button') || target.closest('select') || target.closest('input') || target.closest('.clickable-element');
            setIsHovered(!!isClickable);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseover', handleMouseOver);

        let animationFrameId;
        const updateDot = () => {
            // Apply a slight lag (lerp factor 0.15)
            dotPos.current.x += (mousePos.current.x - dotPos.current.x) * 0.15;
            dotPos.current.y += (mousePos.current.y - dotPos.current.y) * 0.15;

            if (cursorDotRef.current) {
                cursorDotRef.current.style.left = `${dotPos.current.x}px`;
                cursorDotRef.current.style.top = `${dotPos.current.y}px`;
            }
            animationFrameId = requestAnimationFrame(updateDot);
        };
        updateDot();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-secondary-50 relative selection:bg-primary-300 selection:text-primary-950">
            {/* Skip to Content Link (Accessibility) */}
            <a 
                href="#main-content" 
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-500 text-white px-4 py-2 rounded-md z-50 text-sm font-medium transition-all"
            >
                Skip to main content
            </a>

            {/* Custom Cursor */}
            <div 
                ref={cursorDotRef} 
                className={`custom-cursor hidden md:block ${isHovered ? 'custom-cursor-hover' : ''}`}
            />

            <Navbar />
            <main id="main-content" className="flex-grow pt-24 pb-12 transition-all duration-300">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
