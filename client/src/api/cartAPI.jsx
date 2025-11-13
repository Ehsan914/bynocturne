import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Get user's cart
export const getCart = () => {
    const token = localStorage.getItem('token');
    return instance.get('/cart', {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// Add item to cart
export const addToCart = (productId, quantity = 1) => {
    const token = localStorage.getItem('token');
    return instance.post('/cart', 
        { product_id: productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

// Update cart item quantity
export const updateCartItem = (cartItemId, quantity) => {
    const token = localStorage.getItem('token');
    return instance.put(`/cart/${cartItemId}`, 
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

// Remove item from cart
export const removeFromCart = (cartItemId) => {
    const token = localStorage.getItem('token');
    return instance.delete(`/cart/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// Clear entire cart
export const clearCart = () => {
    const token = localStorage.getItem('token');
    return instance.delete('/cart/clear/all', {
        headers: { Authorization: `Bearer ${token}` }
    });
};