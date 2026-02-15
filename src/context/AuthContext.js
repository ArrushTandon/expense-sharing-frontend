import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            try {
                // Security: Validate token hasn't expired
                const decoded = jwtDecode(storedToken);
                const currentTime = Date.now() / 1000;

                if (decoded.exp > currentTime) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                } else {
                    // Token expired - clear storage
                    logout();
                }
            } catch (error) {
                // Invalid token - clear storage
                console.error('Invalid token:', error);
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = (token, userData) => {
        // Security: Validate token before storing
        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decoded.exp <= currentTime) {
                throw new Error('Token already expired');
            }

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setToken(token);
            setUser(userData);
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const logout = () => {
        // Security: Clear all sensitive data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = () => {
        return !!token && !!user;
    };

    const isAdmin = () => {
        return user && user.role === 'ADMIN';
    };

    const value = {
        user,
        token,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};