import API from './axios';

export const authService = {
    register: async (userData) => {
        try {
            if (!userData.email || !userData.password || !userData.name) {
                throw new Error('Missing required fields: name, email, and password are required');
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email)) {
                throw new Error('Please enter a valid email address');
            }

            if (userData.password.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }

            const response = await API.post('/api/auth/register', userData);
            return response.data;
        } catch (error) {
            if (error.response) {
                // Server responded with error
                if (error.response.status === 409 || error.response.data?.message?.includes('already')) {
                    throw new Error('This email is already registered. Please login instead.');
                }
                if (error.response.status === 400) {
                    throw new Error(error.response.data?.message || 'Invalid registration data. Please check your inputs.');
                }
                if (error.response.status === 500) {
                    throw new Error('Server error. Please try again later.');
                }
                throw new Error(error.response.data?.message || 'Registration failed. Please try again.');
            } else if (error.request) {
                // Request made but no response
                throw new Error('Unable to connect to server. Please check your internet connection.');
            } else {
                // Other errors
                throw error;
            }
        }
    },

    login: async (credentials) => {
        try {
            if (!credentials.email || !credentials.password) {
                throw new Error('Email and password are required');
            }

            const response = await API.post('/api/auth/login', credentials);
            return response.data;
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    throw new Error('Invalid email or password. Please try again.');
                }
                if (error.response.status === 404) {
                    throw new Error('No account found with this email. Please register first.');
                }
                if (error.response.status === 500) {
                    throw new Error('Server error. Please try again later.');
                }
                throw new Error(error.response.data?.message || 'Login failed. Please try again.');
            } else if (error.request) {
                throw new Error('Unable to connect to server. Please check your internet connection.');
            } else {
                throw error;
            }
        }
    },
};