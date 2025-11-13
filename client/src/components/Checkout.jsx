import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { getStripeConfig, createPaymentIntent } from '../api/paymentAPI';
import toast from 'react-hot-toast';
import './checkout.css';

const Checkout = ({ amount, onSuccess, onCancel }) => {
    const [stripePromise, setStripePromise] = useState(null);
    const [clientSecret, setClientSecret] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializePayment = async () => {
            try {
                // Load Stripe publishable key
                const config = await getStripeConfig();
                const stripe = await loadStripe(config.publishableKey);
                setStripePromise(stripe);

                // Create payment intent
                const { clientSecret: newClientSecret } = await createPaymentIntent(amount);
                setClientSecret(newClientSecret);
            } catch (error) {
                console.error('Error initializing payment:', error);
                toast.error('Failed to initialize payment system');
            } finally {
                setLoading(false);
            }
        };

        initializePayment();
    }, [amount]);

    if (loading) {
        return (
            <div className="checkout-loading">
                <p>Loading payment system...</p>
            </div>
        );
    }

    if (!stripePromise || !clientSecret) {
        return (
            <div className="checkout-error">
                <p>Payment system unavailable</p>
                <button onClick={onCancel} className="cancel-btn">Go Back</button>
            </div>
        );
    }

    const options = {
        clientSecret,
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
