import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const HeroSection = () => {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5; // range: -0.5 to 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5; // range: -0.5 to 0.5
        setTilt({ x: x * 10, y: y * -10 }); // scale up tilt
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    return (
        <section 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative min-h-[85vh] flex items-center overflow-hidden bg-secondary-100 section-padding-a select-none"
        >
            {/* Grainy Noise Overlay */}
            <div className="absolute inset-0 bg-transparent opacity-[0.03] pointer-events-none mix-blend-overlay"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
                {/* Asymmetrical 45%/55% Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Content Column (5 columns out of 12) */}
                    <div className="lg:col-span-5 space-y-6 text-left fade-in-staggered">
                        <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary-500 border-b border-primary-200 pb-1">
                            Est. 2026 &bull; Bangalore
                        </span>
                        
                        <h1 className="text-4xl md:text-5.5xl leading-[1.05] text-stone-900 font-display font-[570] -tracking-[0.03em] relative">
                            Your next innings <br />
                            starts right here.
                            
                            {/* Hand-drawn sticky note annotating the margin */}
                            <span className="absolute -top-6 -right-6 md:-right-12 font-script text-xs text-primary-500 transform rotate-[6deg] border border-dashed border-primary-300 bg-primary-50 px-2 py-1 shadow-sm rounded-md block">
                                we ship same day! 🚀
                            </span>
                        </h1>
                        
                        <p className="text-base text-stone-600 max-w-md font-[450] leading-relaxed">
                            We don't sell generic gear. We hand-select professional-grade English willow bats with perfect grains, premium leather balls that actually swing, and lightweight protective kit designed to make you feel free at the crease. 
                        </p>
                        
                        <div className="flex flex-row gap-4 pt-2">
                            <Link to="/products">
                                <Button size="lg" className="bg-primary-500 hover:bg-primary-600 text-white font-medium shadow-sm hover:shadow-md transform transition active:scale-95 duration-200">
                                    Grab Your Kit
                                </Button>
                            </Link>
                            <Link to="/products?category=bats">
                                <Button size="lg" variant="outline" className="border-secondary-300 text-stone-700 hover:bg-secondary-200 font-medium">
                                    View Bats
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Image Column (7 columns out of 12) */}
                    <div className="lg:col-span-7 flex justify-center lg:justify-end">
                        <div 
                            style={{ 
                                transform: `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
                                transition: 'transform 0.1s ease-out'
                            }}
                            className="relative max-w-md md:max-w-xl transition-transform duration-300"
                        >
                            {/* Polaroid style container with uneven aspect ratio */}
                            <div className="polaroid-frame bg-white p-4 pb-14 shadow-lg border border-secondary-200 transform hover:scale-[1.02] duration-300">
                                <div className="relative aspect-[4/3] overflow-hidden rounded bg-stone-100">
                                    {/* Dust/scratch texture overlay */}
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05),rgba(0,0,0,0.05))] pointer-events-none z-10 mix-blend-overlay"></div>
                                    <img 
                                        src="/images/products/bat.jpg" 
                                        alt="Crafting a premium willow bat"
                                        className="w-full h-full object-cover object-[75%_20%]" // Unexpected crop position
                                        onError={(e) => {
                                            // Fallback image if local image fails
                                            e.target.src = "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800";
                                        }}
                                    />
                                </div>
                                {/* Handwritten caption in Polaroid bottom */}
                                <div className="mt-4 text-center">
                                    <p className="font-script text-stone-700 text-lg">
                                        Hand-pressed grade A English willow
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
