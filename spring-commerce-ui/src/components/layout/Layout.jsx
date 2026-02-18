import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow pt-24 pb-12 transition-all duration-300">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
