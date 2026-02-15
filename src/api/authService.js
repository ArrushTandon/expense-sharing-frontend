import API from './axios';

export const authService = {
    register: async (userData) => {
        try {
            // Security: Validate input before sending
            if (!userData.email || !userData.password || !userData.name) {
                throw new Error('Missing required fields');
            }

            // Security: Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email)) {
                throw new Error('Invalid email format');
            }

            // Security: Password strength check
            if (userData.password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }

            const response = await API.post('/api/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'Registration failed';
        }
    },

    login: async (credentials) => {
        try {
            // Security: Validate input
            if (!credentials.email || !credentials.password) {
                throw new Error('Email and password are required');
            }

            const response = await API.post('/api/auth/login', credentials);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'Login failed';
        }
    },
};