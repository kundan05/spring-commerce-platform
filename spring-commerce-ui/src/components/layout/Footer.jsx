import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaPinterest } from 'react-icons/fa';
import Button from '../common/Button';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div>
                        <Link to="/" className="text-2xl font-bold font-display mb-4 text-white block">CricStore</Link>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Premium cricket equipment for professionals and enthusiasts.
                            Elevate your game with our curated selection.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><FaInstagram size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><FaPinterest size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><FaFacebook size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><FaTwitter size={20} /></a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 font-display">Shop</h4>
                        <ul className="space-y-3">
                            <li><Link to="/products" className="text-gray-400 hover:text-white transition-colors">All Products</Link></li>
                            <li><Link to="/products?category=cricket%20equipment" className="text-gray-400 hover:text-white transition-colors">Cricket Equipment</Link></li>
                            <li><Link to="/products?category=apparel" className="text-gray-400 hover:text-white transition-colors">Apparel</Link></li>
                            <li><Link to="/products?category=accessories" className="text-gray-400 hover:text-white transition-colors">Accessories</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6 font-display">Support</h4>
                        <ul className="space-y-3">
                            <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Shipping & Returns</Link></li>
                            <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Size Guide</Link></li>
                            <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 font-display">Stay Updated</h4>
                        <p className="text-gray-400 mb-4 text-sm">Subscribe to our newsletter for new gear drops and exclusive offers.</p>
                        <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            />
                            <Button type="submit" variant="primary" className="w-full">Subscribe</Button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center bg-transparent">
                    <p className="text-gray-500 text-sm mb-4 md:mb-0">&copy; {new Date().getFullYear()} CricStore. All rights reserved.</p>
                    <div className="flex space-x-6 text-sm text-gray-500">
                        <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
