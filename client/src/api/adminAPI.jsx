import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin`;

// Get dashboard statistics
export const getDashboardStats = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/dashboard/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        throw error;
    }
};

// Get all orders with filters
export const getAdminOrders = async (filters = {}) => {
    try {
        const token = localStorage.getItem('token');
        const queryParams = new URLSearchParams(filters).toString();
        const response = await axios.get(`${API_URL}/orders?${queryParams}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Get admin orders error:', error);
        throw error;
    }
};

// Update order status
export const updateAdminOrderStatus = async (orderId, status) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.patch(
            `${API_URL}/orders/${orderId}/status`,
            { status },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Update order status error:', error);
        throw error;
    }
};

// Get all users
export const getAdminUsers = async (filters = {}) => {
    try {
        const token = localStorage.getItem('token');
        const queryParams = new URLSearchParams(filters).toString();
        const response = await axios.get(`${API_URL}/users?${queryParams}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Get admin users error:', error);
        throw error;
    }
};

// Get user details
export const getAdminUserDetails = async (userId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Get user details error:', error);
        throw error;
    }
};
