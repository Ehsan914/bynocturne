import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const getAllCategories = () => instance.get('/categories');