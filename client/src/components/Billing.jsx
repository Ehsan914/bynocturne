import './billing.css'
import { useContext } from 'react';
import { CountContext } from '../context/CountContext';
import { PromoContext } from '../context/PromoContext';

const Billing = () => {
    const { cartItems } = useContext(CountContext);
    const { promoDiscount, promoUsed } = useContext(PromoContext);

    // Calculate subtotal (price × quantity for each item)
    const subtotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
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

        <button className="checkout-btn">
            Proceed to Checkout
        </button>

        <p className="shipping-note">Free shipping on orders over $100</p>
        </div>
    );
};

export default Billing;
