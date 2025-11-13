import axios from 'axios';

const API_URL = 'http://localhost:5000/api/orders';

// Create new order
export const createOrder = async (orderData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(API_URL, orderData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Create order error:', error.response?.data || error);
        throw error;
    }
};

// Get user's orders
export const getUserOrders = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(API_URL, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Get orders error:', error.response?.data || error);
        throw error;
    }
};

// Get order by ID
export const getOrderById = async (orderId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Get order error:', error.response?.data || error);
        throw error;
    }
};
