# Stripe Payment Integration Setup

## 🎯 Get Your Stripe API Keys

1. **Sign up for Stripe** (if you don't have an account):
   - Go to https://stripe.com
   - Click "Sign up" and create a free account

2. **Get your API keys**:
   - Login to Stripe Dashboard: https://dashboard.stripe.com
   - Go to: **Developers** → **API keys**
   - You'll see two keys:
     - **Publishable key** (starts with `pk_test_`)
     - **Secret key** (starts with `sk_test_`) - Click "Reveal test key"

3. **Add keys to your `.env` file**:
   ```
   STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
   ```

4. **Restart your server** after adding the keys:
   ```
   cd server
   npm run dev
   ```

## 🧪 Testing Payments

Use these test card numbers in Stripe's test mode:

### ✅ Successful Payment
- **Card Number**: `4242 4242 4242 4242`
- **Expiry**: Any future date (e.g., `12/34`)
- **CVC**: Any 3 digits (e.g., `123`)
- **ZIP**: Any 5 digits (e.g., `12345`)

### ❌ Payment Declined
- **Card Number**: `4000 0000 0000 0002`
- **Expiry**: Any future date
- **CVC**: Any 3 digits
- **ZIP**: Any 5 digits

### 🔐 Requires Authentication (3D Secure)
- **Card Number**: `4000 0025 0000 3155`
- **Expiry**: Any future date
- **CVC**: Any 3 digits
- **ZIP**: Any 5 digits

More test cards: https://stripe.com/docs/testing

## 🚀 How It Works

1. User adds items to cart
2. Clicks "Proceed to Payment"
3. Stripe checkout modal appears
4. User enters card details
5. Payment is processed through Stripe
6. On success, order is created with payment_status = 'paid'
7. Cart is cleared and user is redirected to orders page

## ⚠️ Important Notes

- **Test Mode**: You're using test keys, so no real money is charged
- **Live Mode**: To accept real payments, get your **live keys** from Stripe dashboard
- **Never commit** your secret keys to Git - they're in `.env` which is in `.gitignore`

## 🎨 Current Implementation

✅ Payment Intent creation
✅ Stripe Elements integration
✅ Payment confirmation
✅ Order creation with payment info
✅ Payment status tracking
✅ Webhook handler (for production use)
