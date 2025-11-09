import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { registerUser, loginUser, getUserProfile } from '../api/authAPI'; 

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => {
        const saved = localStorage.getItem('token');
        return saved || '';
    })

    useEffect(() => {
        localStorage.setItem("token", token);
    }, [token]);

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            getUserProfile()
                .then(res => {
                    setUser(res.data.user);
                    setLoading(false);
                })
                // eslint-disable-next-line no-unused-vars
                .catch(err => {
                    setUser(null);
                    setToken('');
                    setLoading(false);
                })
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (credentials) => {
        const response = await loginUser(credentials);
        setToken(response.data.token);
        setUser(response.data.user);
    }

    const logout = () => {
        setToken('');
        setUser(null);
    }

    const register = async (userData) => {
        const response = await registerUser(userData);
        setToken(response.data.token);
        setUser(response.data.user);
    }
    
    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{user, token, isAuthenticated, loading, login, logout, register}}>
            { children }
        </AuthContext.Provider>
    )
};