import express from 'express';
import {
    createPaymentIntent,
    confirmPayment,
    handleStripeWebhook,
    getStripeConfig
} from '../controllers/paymentController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get Stripe publishable key (public route)
router.get('/config', getStripeConfig);

// Create payment intent (requires authentication)
router.post('/create-payment-intent', authenticateToken, createPaymentIntent);

// Confirm payment (requires authentication)
router.post('/confirm-payment', authenticateToken, confirmPayment);

// Stripe webhook (raw body, no authentication)
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

export default router;
