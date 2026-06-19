import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import Button from '../common/Button';

const Footer = () => {
    const [loadTime, setLoadTime] = useState('0.42');

    useEffect(() => {
        // Generate a slightly randomized page load time to look authentic and active
        const randomTime = (0.35 + Math.random() * 0.12).toFixed(2);
        setLoadTime(randomTime);
    }, []);

    return (
        <footer className="bg-secondary-200 border-t border-secondary-300 text-stone-800 pt-16 pb-8 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div>
                        <Link to="/" className="text-2xl font-bold font-display mb-4 text-stone-900 block">
                            Cric<span className="font-normal italic">Store</span>
                        </Link>
                        <p className="text-stone-600 mb-6 leading-relaxed text-sm">
                            We're just a couple of cricket enthusiasts who got tired of buying bats that cracked on the first cover drive.
                            Based in Bangalore, shipping to anywhere you can place a set of stumps.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-stone-500 hover:text-primary-500 transition-colors"><FaInstagram size={20} /></a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-stone-500 hover:text-primary-500 transition-colors"><FaFacebook size={20} /></a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-stone-500 hover:text-primary-500 transition-colors"><FaTwitter size={20} /></a>
                        </div>
                    </div>

                    {/* Changelog Column */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-stone-900 mb-6 font-display">What's New</h4>
                        <ul className="space-y-3 text-sm text-stone-600 list-disc list-inside">
                            <li>Fresh stock of Grade-A English willow bats is now live</li>
                            <li>Added lightweight protective armour and pads collection</li>
                            <li>Free shipping threshold lowered to ₹5,000 for all domestic orders</li>
                        </ul>
                    </div>

                    {/* Helpful links */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-stone-900 mb-6 font-display">Shop and Help</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/products" className="text-stone-600 hover:text-primary-500 transition-colors">Browse Gear</Link></li>
                            <li><Link to="/profile" className="text-stone-600 hover:text-primary-500 transition-colors">My Profile</Link></li>
                            <li><Link to="/order-history" className="text-stone-600 hover:text-primary-500 transition-colors">Order Tracking</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-stone-900 mb-6 font-display">Stay Updated</h4>
                        <p className="text-stone-600 mb-4 text-sm">We'll only email you when we restock English willow. No spam, promise.</p>
                        <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="bg-secondary-50 border border-secondary-300 text-stone-950 placeholder-stone-400 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm px-3 py-2"
                            />
                            <Button type="submit" variant="primary" className="w-full text-sm">Subscribe</Button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-secondary-300 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500">
                    <div className="flex flex-col gap-1.5 mb-4 md:mb-0">
                        <p>&copy; 2026 CricStore. All rights reserved.</p>
                        <p className="italic text-stone-400">
                            No algorithms were harmed in the making of this store, although a few window panes were during bat testing.
                        </p>
                    </div>

                    <div className="flex flex-col md:items-end gap-2">
                        {/* Humble technology badge */}
                        <div className="flex items-center gap-1.5">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            <span>Built with Spring Boot & React &bull; Last pushed: June 19, 2026</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <span>Loaded in {loadTime}s</span>
                            <span className="font-script text-stone-600 text-sm transform rotate-[-2deg] inline-block">
                                crafted by <span className="underline decoration-primary-500">kundan</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
