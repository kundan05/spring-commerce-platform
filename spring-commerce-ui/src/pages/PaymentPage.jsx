import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../services/api';
import { FaLock, FaShieldAlt } from 'react-icons/fa';
import Button from '../components/common/Button';

// Replace with your publishable key
const stripePromise = loadStripe('pk_test_placeholder_key_here');

const CheckoutForm = ({ orderId, clientSecret }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsProcessing(true);

        if (clientSecret.startsWith('pi_mock')) {
            // Mock Payment Flow
            setTimeout(async () => {
                try {
                    // Simulate API call to confirm
                    await api.post('/payments/confirm', { paymentIntentId: "pi_mock_" + orderId + "_" + Date.now() });
                    navigate('/order-history');
                } catch (err) {
                    setMessage("Mock payment failed: " + err.message);
                } finally {
                    setIsProcessing(false);
                }
            }, 1000);
            return;
        }

        if (!stripe || !elements) return;

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin + `/payment/success`,
            },
            redirect: 'if_required',
        });

        if (error) {
            setMessage(error.message);
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            try {
                await api.post('/payments/confirm', { paymentIntentId: paymentIntent.id });
                navigate('/order-history');
            } catch (err) {
                setMessage("Payment succeeded but failed to update order. Please contact support.");
            }
            setIsProcessing(false);
        } else {
            setMessage("Payment status: " + paymentIntent.status);
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {!clientSecret.startsWith('pi_mock') && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                    <PaymentElement />
                </div>
            )}

            {clientSecret.startsWith('pi_mock') && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6 text-yellow-800 text-sm">
                    <strong>Demo Mode:</strong> No actual payment will be processed. Click "Pay Now" to simulate a successful transaction.
                </div>
            )}

            <Button
                type="submit"
                fullWidth
                size="lg"
                disabled={isProcessing || (!clientSecret.startsWith('pi_mock') && (!stripe || !elements))}
                isLoading={isProcessing}
                className="shadow-lg shadow-primary-500/20"
            >
                {isProcessing ? "Processing..." : "Pay Now"}
            </Button>

            {message && (
                <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md text-red-700 text-sm">
                    {message}
                </div>
            )}

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                <FaLock className="text-gray-400" />
                <span>Payments are secure and encrypted.</span>
            </div>
        </form>
    );
};

const PaymentPage = () => {
    const { orderId } = useParams();
    const [clientSecret, setClientSecret] = useState('');
    const location = useLocation();

    useEffect(() => {
        api.post('/payments/create-intent', { orderId: Number(orderId) })
            .then((res) => setClientSecret(res.data.data.clientSecret))
            .catch((err) => console.error("Failed to init payment", err));
    }, [orderId]);

    const options = {
        clientSecret,
        appearance: {
            theme: 'stripe',
            labels: 'floating',
            variables: {
                colorPrimary: '#059669',
                fontFamily: 'Inter, system-ui, sans-serif',
            },
        },
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gray-900 px-8 py-6 text-white text-center">
                    <div className="mx-auto h-12 w-12 bg-gray-800 rounded-full flex items-center justify-center text-primary-400 mb-3 border border-gray-700">
                        <FaShieldAlt size={20} />
                    </div>
                    <h1 className="text-2xl font-bold font-display">Secure Checkout</h1>
                    <p className="text-gray-400 text-sm mt-1">Complete your purchase safely</p>
                </div>

                <div className="p-8">
                    {clientSecret ? (
                        clientSecret.startsWith('pi_mock') ? (
                            <CheckoutForm orderId={orderId} clientSecret={clientSecret} />
                        ) : (
                            <Elements options={options} stripe={stripePromise}>
                                <CheckoutForm orderId={orderId} clientSecret={clientSecret} />
                            </Elements>
                        )
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mb-4"></div>
                            <p className="text-gray-500">Initializing secure payment...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
