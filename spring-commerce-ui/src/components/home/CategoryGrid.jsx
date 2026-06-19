import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
    {
        id: 1,
        name: 'English Willow Bats',
        image: '/images/products/bat.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1608248597983-10eb2c101598?auto=format&fit=crop&q=80&w=600',
        slug: 'bats',
        desc: 'Handcrafted clefts with superb ping.',
        rotation: '-1.5deg',
        uglyAccent: false,
    },
    {
        id: 2,
        name: 'Premium Leather Balls',
        image: '/images/products/ball.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1594470117754-e347c2ae1ee7?auto=format&fit=crop&q=80&w=600',
        slug: 'balls',
        desc: 'Alum tanned leather, hand stitched.',
        rotation: '2deg',
        uglyAccent: true, // Pop of ugly yellow border!
    },
    {
        id: 3,
        name: 'Elite Body Armour',
        image: '/images/products/equipment.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=80&w=600',
        slug: 'protection',
        desc: 'Lightweight protection that moves with you.',
        rotation: '-1deg',
        uglyAccent: false,
    },
    {
        id: 4,
        name: 'Matchday Accessories',
        image: '/images/products/equipment.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=600',
        slug: 'accessories',
        desc: 'Grips, tape, and kit bags designed to last.',
        rotation: '1deg',
        uglyAccent: false,
    }
];

const CategoryGrid = () => {
    return (
        <section className="section-padding-b bg-secondary-50 relative overflow-hidden select-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Provocative Header & Misaligned Title (2px offset to the right) */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                    <div className="transform translate-x-[2px]"> {/* Intentional misalignment mistake */}
                        <h2 className="text-3xl md:text-4xl font-display font-[570] text-stone-900 leading-tight">
                            Choose your weapon.
                        </h2>
                        <p className="text-stone-500 mt-2 font-[450] text-sm">
                            Gear tested and approved by Sunday league legends.
                        </p>
                    </div>
                    <Link 
                        to="/products" 
                        className="text-primary-600 font-medium text-sm hover:underline hover:text-primary-700 flex items-center gap-1 group"
                    >
                        Browse all collections <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </Link>
                </div>

                {/* Asymmetrical 2x2 Grid with Offset and Bleeding Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
                    {categories.map((cat, idx) => (
                        <div 
                            key={cat.id}
                            style={{ transform: `rotate(${cat.rotation})` }}
                            className={`polaroid-frame bg-white p-4 pb-12 shadow-sm border ${
                                cat.uglyAccent ? 'border-[#e8b830] ring-2 ring-[#e8b830]/10' : 'border-secondary-200'
                            } transition-transform duration-300 hover:scale-[1.01]`}
                        >
                            <Link to={`/products?category=${cat.slug}`} className="block group">
                                <div className="aspect-[16/10] overflow-hidden rounded bg-stone-100 relative">
                                    {/* Muted category label in corner */}
                                    <span className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded z-20">
                                        Collection 0{cat.id}
                                    </span>
                                    
                                    <img 
                                        src={cat.image} 
                                        alt={cat.name} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => {
                                            e.target.src = cat.fallbackImage;
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-300"></div>
                                </div>
                                
                                <div className="mt-4 flex justify-between items-start">
                                    <div>
                                        <h3 className="font-display font-[570] text-xl text-stone-900 group-hover:text-primary-500 transition-colors">
                                            {cat.name}
                                        </h3>
                                        <p className="text-stone-500 text-xs mt-1 font-[450] max-w-sm">
                                            {cat.desc}
                                        </p>
                                    </div>
                                    <span className="text-xs uppercase font-bold tracking-wider text-primary-500 border-b border-primary-200 pb-0.5 group-hover:border-primary-500 transition-all">
                                        Shop &rarr;
                                    </span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Background SVG illustration (looks hand-drawn/imperfect) */}
            <div className="absolute right-[-80px] bottom-[-80px] w-64 h-64 opacity-5 pointer-events-none z-0">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
                    <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="1" />
                    <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="1" />
                </svg>
            </div>
        </section>
    );
};

export default CategoryGrid;
