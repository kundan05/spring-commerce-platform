import React, { useState } from 'react';
import Button from '../components/common/Button';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const ContactPage = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-bold font-display text-gray-900 mb-2">Get in Touch</h1>
            <p className="text-gray-500 mb-12">We usually reply within a few hours during business days.</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-primary-50 text-primary-600">
                            <FaEnvelope size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                            <a href="mailto:hello@cricstore.in" className="text-gray-600 hover:text-primary-600">hello@cricstore.in</a>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-primary-50 text-primary-600">
                            <FaPhone size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-1">Phone</h3>
                            <p className="text-gray-600">+91 80 1234 5678</p>
                            <p className="text-sm text-gray-400">Mon–Sat, 10am–7pm IST</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-primary-50 text-primary-600">
                            <FaMapMarkerAlt size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-1">Office</h3>
                            <p className="text-gray-600">
                                CricStore HQ<br />
                                Koramangala, Bangalore<br />
                                Karnataka 560034
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    {submitted ? (
                        <div className="text-center py-12">
                            <div className="text-4xl mb-4">✓</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Message sent!</h3>
                            <p className="text-gray-500">We'll get back to you soon.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 sm:text-sm"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 sm:text-sm"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    rows={4}
                                    required
                                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 sm:text-sm"
                                    placeholder="What can we help with?"
                                />
                            </div>
                            <Button type="submit" fullWidth size="lg">Send Message</Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
