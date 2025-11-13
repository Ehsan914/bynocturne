# Payment Issues Fixed - Deployment Instructions

## Issues Fixed

### 1. Mixed Content Errors (HTTP vs HTTPS)
**Problem**: The production site (HTTPS) was trying to make HTTP requests to localhost:5000, causing mixed content warnings.

**Solution**: 
- Created environment-based API URL configuration
- Updated all API files to use `import.meta.env.VITE_API_URL`
- Created `.env.development` (for local) and `.env.production` (for Vercel)

### 2. Stripe Integration Errors
**Problem**: 
- "elements.submit() must be called before stripe.confirmPayment()"
- "You must pass in a clientSecret when calling stripe.confirmPayment()"

**Solution**:
- Moved payment intent creation to the `Checkout` component
- Payment intent is created BEFORE Elements loads
- `CheckoutForm` now calls `elements.submit()` before `confirmPayment()`
- Client secret is passed to Elements via options

## Files Changed

### API Files (Updated to use environment variable):
- `client/src/api/authAPI.jsx`
- `client/src/api/cartAPI.jsx`
- `client/src/api/categoryAPI.jsx`
- `client/src/api/productAPI.jsx`
- `client/src/api/orderAPI.jsx`
- `client/src/api/paymentAPI.jsx`
- `client/src/api/wishlistAPI.jsx`

### Stripe Components (Fixed integration):
- `client/src/components/Checkout.jsx` - Creates payment intent before Elements
- `client/src/components/CheckoutForm.jsx` - Calls `elements.submit()` before confirming

### Environment Files (New):
- `client/.env.development` - Points to http://localhost:5000/api
- `client/.env.production` - Points to your Vercel backend URL

## Deployment Steps

### Step 1: Update Production Environment File
Edit `client/.env.production` and replace with your actual Vercel backend URL:
```
VITE_API_URL=https://your-backend-url.vercel.app/api
```

### Step 2: Commit and Push Changes
```powershell
git add .
git commit -m "Fix: Mixed content errors and Stripe integration issues"
git push origin main
```

### Step 3: Redeploy on Vercel
Vercel should automatically redeploy when you push. If not:
1. Go to your Vercel dashboard
2. Click "Redeploy" on your project

### Step 4: Verify Environment Variables on Vercel (Backend)
Make sure these are set in your Vercel backend project:
- `STRIPE_SECRET_KEY` = sk_test_51ST3kNPL6FbYCTu0h5KRPtMNShgAUHLv0kmkGu5yilJih1V3vELhD9TwtR3tUkxVbijbWhslskfWXacihDmUWFud00Y2vtUxL3
- `STRIPE_PUBLISHABLE_KEY` = pk_test_51ST3kNPL6FbYCTu0MQ3qJNzF0ltku3gBLLWkUuu6ZnlfEJThEoiqxxKzrRE5mniMt6HgB7vgBS646Cqh0EtVVDii00jqi0U3e5
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (your database credentials)
- `JWT_SECRET` = kalaghura_R4ND0M_T0k3n_F0R_ByN0cTUrne_W3b5ite_d0nt_t3ll_any0ne!

## Testing Locally

Before deploying, test locally:
```powershell
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm run dev
```

Test the payment flow:
1. Add items to cart
2. Click "Proceed to Payment"
3. Use test card: 4242 4242 4242 4242
4. Any future expiry, any CVC, any ZIP
5. Click "Pay"

## Expected Behavior

After these fixes:
✅ No more mixed content warnings
✅ Payment intent created when modal opens
✅ Stripe Elements loads with proper client secret
✅ `elements.submit()` validates fields before payment
✅ Payment processes successfully
✅ Order created after payment succeeds

## Notes

- The `.env.development` and `.env.production` files are already in `.gitignore`
- Local development will use `http://localhost:5000/api` automatically
- Production will use your Vercel backend URL
- Make sure to update `.env.production` with your actual backend URL before deploying
