import stripe from '../config/stripe.js';
import db from '../config/db.js';

// Create payment intent
export const createPaymentIntent = async (req, res) => {
    try {
        const { amount, orderId } = req.body;
        const userId = req.user.id;

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects amount in cents
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                userId: userId.toString(),
                orderId: orderId || 'pending'
            }
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        console.error('Payment intent error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Confirm payment and update order
export const confirmPayment = async (req, res) => {
    try {
        const { paymentIntentId, orderId } = req.body;
        const userId = req.user.id;

        if (!paymentIntentId) {
            return res.status(400).json({ error: 'Payment intent ID is required' });
        }

        // Retrieve payment intent from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            // Update order with payment info if orderId is provided
            if (orderId) {
                const updateQuery = `
                    UPDATE orders 
                    SET payment_status = 'paid',
                        stripe_payment_intent_id = ?,
                        status = 'processing'
                    WHERE id = ? AND user_id = ?
                `;

                db.query(updateQuery, [paymentIntentId, orderId, userId], (err) => {
                    if (err) {
                        console.error('Error updating order:', err);
                        return res.status(500).json({ error: 'Failed to update order' });
                    }

                    res.json({
                        success: true,
                        message: 'Payment confirmed and order updated',
                        paymentStatus: paymentIntent.status
                    });
                });
            } else {
                res.json({
                    success: true,
                    message: 'Payment confirmed',
                    paymentStatus: paymentIntent.status
                });
            }
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment not successful',
                paymentStatus: paymentIntent.status
            });
        }
    } catch (error) {
        console.error('Confirm payment error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Webhook handler for Stripe events
export const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('PaymentIntent was successful!', paymentIntent.id);
            
            // Update order status
            const orderId = paymentIntent.metadata.orderId;
            if (orderId && orderId !== 'pending') {
                const updateQuery = `
                    UPDATE orders 
                    SET payment_status = 'paid',
                        stripe_payment_intent_id = ?,
                        status = 'processing'
                    WHERE id = ?
                `;
                
                db.query(updateQuery, [paymentIntent.id, orderId], (err) => {
                    if (err) {
                        console.error('Error updating order from webhook:', err);
                    } else {
                        console.log(`Order ${orderId} updated successfully`);
                    }
                });
            }
            break;

        case 'payment_intent.payment_failed':
            const failedIntent = event.data.object;
            console.log('PaymentIntent failed:', failedIntent.id);
            
            // Update order to failed
            const failedOrderId = failedIntent.metadata.orderId;
            if (failedOrderId && failedOrderId !== 'pending') {
                const failQuery = `
                    UPDATE orders 
                    SET payment_status = 'failed'
                    WHERE id = ?
                `;
                
                db.query(failQuery, [failedOrderId], (err) => {
                    if (err) {
                        console.error('Error updating failed order:', err);
                    }
                });
            }
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
};

// Get Stripe publishable key
export const getStripeConfig = (req, res) => {
    res.json({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
};
