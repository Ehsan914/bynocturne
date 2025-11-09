import { createContext } from 'react';

export const AuthContext = createContext({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    login: (userData, token) => {},
    logout: () => {},
    register: (userData, token) => {},
});