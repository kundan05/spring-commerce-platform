import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-bold font-display text-gray-900 mb-6">About CricStore</h1>

            <div className="prose prose-lg text-gray-600 space-y-6">
                <p>
                    CricStore started in 2024 out of a simple frustration — it was way too hard to find
                    decent cricket gear online without wading through a sea of no-name brands and fake reviews.
                </p>
                <p>
                    We're based in Bangalore and we're a small team of people who actually play the game.
                    Every product on this site is something we've either used ourselves or tested in the nets
                    before listing it. If it doesn't hold up, it doesn't make the cut.
                </p>
                <p>
                    We stock equipment from brands we trust — from English willow bats to proper leather balls
                    and protective gear that actually fits. No generic alibaba imports, no inflated MRPs.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">What we care about</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li><strong>Honest descriptions</strong> — we tell you exactly what you're getting</li>
                    <li><strong>Real stock counts</strong> — if it says "in stock", it ships today</li>
                    <li><strong>Fair pricing</strong> — no games with fake discounts</li>
                    <li><strong>Quick support</strong> — email us and a human responds, usually within a few hours</li>
                </ul>

                <div className="mt-10 pt-8 border-t border-gray-200">
                    <p className="text-gray-500">
                        Got questions? Reach out at{' '}
                        <Link to="/contact" className="text-primary-600 hover:underline">our contact page</Link> or
                        drop us an email at <a href="mailto:hello@cricstore.in" className="text-primary-600 hover:underline">hello@cricstore.in</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
