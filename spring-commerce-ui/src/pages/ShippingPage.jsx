import React from 'react';

const ShippingPage = () => {
    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-bold font-display text-gray-900 mb-8">Shipping & Returns</h1>

            <div className="prose prose-lg text-gray-600 space-y-8">
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Shipping</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Orders over ₹5,000 ship free across India</li>
                        <li>Standard delivery takes 3–5 business days</li>
                        <li>Express delivery (1–2 days) available for an extra ₹200</li>
                        <li>You'll get a tracking number once your order ships</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Returns</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>30-day return window from the date of delivery</li>
                        <li>Items must be unused and in original packaging</li>
                        <li>We'll arrange a pickup — no need to go to the post office</li>
                        <li>Refunds are processed within 5–7 business days after we receive the item</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Exchanges</h2>
                    <p>
                        Need a different size? Just reach out to us within 30 days and we'll sort it out.
                        If the replacement is in stock, we'll ship it the same day we receive your return.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Damaged items</h2>
                    <p>
                        If something arrives damaged, email us at{' '}
                        <a href="mailto:hello@cricstore.in" className="text-primary-600 hover:underline">hello@cricstore.in</a>{' '}
                        with a photo and we'll send a replacement right away — no return needed.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default ShippingPage;
