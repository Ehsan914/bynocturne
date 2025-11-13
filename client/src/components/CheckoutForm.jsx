import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';

const CheckoutForm = ({ amount, onSuccess, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        try {
            // Submit the form to validate fields
            const { error: submitError } = await elements.submit();
            
            if (submitError) {
                toast.error(submitError.message);
                setIsProcessing(false);
                return;
            }

            // Confirm payment
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: window.location.origin + '/payment/success',
                },
                redirect: 'if_required',
            });

            if (error) {
                toast.error(error.message);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                toast.success('Payment successful!');
                onSuccess(paymentIntent);
            }
        } catch (error) {
            console.error('Payment error:', error);
            toast.error('Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="checkout-form">
            <PaymentElement />
            <div className="checkout-actions">
                <button
                    type="button"
                    onClick={onCancel}
                    className="cancel-payment-btn"
                    disabled={isProcessing}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isProcessing || !stripe || !elements}
                    className="pay-btn"
                >
                    {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
                </button>
            </div>
        </form>
    );
};

export default CheckoutForm;
