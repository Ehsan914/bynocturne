import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/payment`;

// Get Stripe configuration (publishable key)
export const getStripeConfig = async () => {
    try {
        const response = await axios.get(`${API_URL}/config`);
        return response.data;
    } catch (error) {
        console.error('Get Stripe config error:', error);
        throw error;
    }
};

// Create payment intent
export const createPaymentIntent = async (amount, orderId = null) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            `${API_URL}/create-payment-intent`,
            { amount, orderId },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Create payment intent error:', error);
        throw error;
    }
};

// Confirm payment
export const confirmPayment = async (paymentIntentId, orderId = null) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            `${API_URL}/confirm-payment`,
            { paymentIntentId, orderId },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Confirm payment error:', error);
        throw error;
    }
};
