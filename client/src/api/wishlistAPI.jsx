import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/wishlist`;

// Get user's wishlist
export const getWishlist = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(API_URL, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Get wishlist error:', error.response?.data || error);
        throw error;
    }
};

// Add product to wishlist
export const addToWishlist = async (productId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            API_URL,
            { productId },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Add to wishlist error:', error.response?.data || error);
        throw error;
    }
};

// Remove product from wishlist
export const removeFromWishlist = async (wishlistItemId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/${wishlistItemId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Remove from wishlist error:', error.response?.data || error);
        throw error;
    }
};

// Clear entire wishlist
export const clearWishlist = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/clear/all`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Clear wishlist error:', error.response?.data || error);
        throw error;
    }
};

// Check if product is in wishlist
export const isInWishlist = async (productId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/check/${productId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Check wishlist error:', error.response?.data || error);
        throw error;
    }
};
