import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { getStripeConfig } from '../api/paymentAPI';
import toast from 'react-hot-toast';
import './checkout.css';

const Checkout = ({ amount, onSuccess, onCancel }) => {
    const [stripePromise, setStripePromise] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStripeKey = async () => {
            try {
                const config = await getStripeConfig();
                console.log('Stripe config from backend:', config);
                console.log('Publishable key:', config.publishableKey);
                const stripe = await loadStripe(config.publishableKey);
                setStripePromise(stripe);
            } catch (error) {
                console.error('Error loading Stripe:', error);
                toast.error('Failed to initialize payment system');
            } finally {
                setLoading(false);
            }
        };

        loadStripeKey();
    }, []);

    if (loading) {
        return (
            <div className="checkout-loading">
                <p>Loading payment system...</p>
            </div>
        );
    }

    if (!stripePromise) {
        return (
            <div className="checkout-error">
                <p>Payment system unavailable</p>
                <button onClick={onCancel} className="cancel-btn">Go Back</button>
            </div>
        );
    }

    const options = {
        mode: 'payment',
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        appearance: {
            theme: 'stripe',
            variables: {
                colorPrimary: '#18181b',
            },
        },
    };

    return (
        <div className="checkout-container">
            <div className="checkout-header">
                <h2>Complete Payment</h2>
                <p className="checkout-amount">Amount: ${amount.toFixed(2)}</p>
            </div>
            <Elements stripe={stripePromise} options={options}>
                <CheckoutForm 
                    amount={amount}
                    onSuccess={onSuccess}
                    onCancel={onCancel}
                />
            </Elements>
        </div>
    );
};

export default Checkout;
