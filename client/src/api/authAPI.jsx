import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000/api/',
});

export const registerUser = (userData) => instance.post('/auth/register', userData);

export const loginUser = (credentials) => instance.post('/auth/login', credentials);

export const getUserProfile = () => {
    const token = localStorage.getItem('token');
    
    return instance.get('/auth/profile', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}