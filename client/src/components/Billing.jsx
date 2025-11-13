import './billing.css'
import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { PromoContext } from '../context/PromoContext';
import { AuthContext } from '../context/AuthContext';
import { createOrder } from '../api/orderAPI';
import Checkout from './Checkout';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Billing = () => {
    const { cart, clearCart: clearAllCart } = useContext(CartContext);
    const { promoDiscount, promoUsed } = useContext(PromoContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);

    const handleCheckout = () => {
        if (cart.length === 0) {
            toast.error('Your cart is empty');
            return;
        }
        setShowCheckout(true);
    };

    const handlePaymentSuccess = async (paymentIntent) => {
        setIsLoading(true);

        try {
            // Calculate totals
            const subtotal = cart.reduce(
                (total, item) => total + parseFloat(item.price) * item.quantity,
                0
            );
            const discountAmount = (subtotal * promoDiscount) / 100;
            const tax = (subtotal - discountAmount) * 0.08;
            const shipping = subtotal - discountAmount > 100 ? 0 : 10;
            const totalAmount = subtotal - discountAmount + tax + shipping;

            // Prepare order data
            const orderData = {
                items: cart.map(item => ({
                    product_id: item.product_id,
                    name: item.name,
                    price: parseFloat(item.price),
                    quantity: item.quantity
                })),
                totalAmount: parseFloat(totalAmount.toFixed(2)),
                subtotal: parseFloat(subtotal.toFixed(2)),
                tax: parseFloat(tax.toFixed(2)),
                shipping: parseFloat(shipping.toFixed(2)),
                discount: parseFloat(discountAmount.toFixed(2)),
                paymentMethod: 'card',
                stripePaymentIntentId: paymentIntent.id,
                shippingAddress: {
                    street: user?.street_address || '',
                    city: user?.city || '',
                    state: user?.state || '',
                    zip: user?.zip_code || '',
                    country: user?.country || ''
                }
            };

            // Create order
            await createOrder(orderData);
            
            toast.success('Order placed successfully!');
            await clearAllCart();
            
            // Navigate to orders page
            navigate('/account?tab=orders');
            
        } catch (error) {
            console.error('Order creation error:', error);
            toast.error(error.response?.data?.error || 'Failed to create order');
        } finally {
            setIsLoading(false);
            setShowCheckout(false);
        }
    };

    const handlePaymentCancel = () => {
        setShowCheckout(false);
    };

    // Calculate subtotal (price × quantity for each item)
    const subtotal = cart.reduce(
        (total, item) => total + parseFloat(item.price) * item.quantity,
        0
    );

    const discountAmount = (subtotal * promoDiscount) / 100;

    // Define tax (e.g., 8% of (subtotal - discount))
    const taxRate = 0.08;
    const tax = (subtotal - discountAmount) * taxRate;

    // Shipping logic (free if subtotal > 100)
    const shipping = subtotal - discountAmount > 100 ? 0 : 10;

    // Final total
    const total = subtotal - discountAmount + tax + shipping;

    return (
        <>
            <div className="order-summary-card">
                <h2 className="summary-title">Order Summary</h2>

                <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>

                {promoUsed && promoDiscount > 0 && (
                    <div className="summary-row">
                        <span className="save-label">You save</span>
                        <span className="save-amount">-${discountAmount.toFixed(2)}</span>
                    </div>
                )}

                <div className="summary-row">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>

                <div className="summary-row">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                </div>

                <hr className="summary-divider" />

                <div className="summary-total">
                    <span>Total</span>
                    <span className="total-amount">${total.toFixed(2)}</span>
                </div>

                <button className="checkout-btn" onClick={handleCheckout} disabled={isLoading || cart.length === 0}>
                    {isLoading ? 'Processing...' : 'Proceed to Payment'}
                </button>

                <p className="shipping-note">Free shipping on orders over $100</p>
            </div>

            {showCheckout && (
                <div className="checkout-modal-overlay">
                    <div className="checkout-modal">
                        <Checkout
                            amount={total}
                            onSuccess={handlePaymentSuccess}
                            onCancel={handlePaymentCancel}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default Billing;
