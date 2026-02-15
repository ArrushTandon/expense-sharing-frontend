import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
    // Security: Prevent CSRF attacks
    withCredentials: false,
    // Security: Set timeout to prevent hanging requests
    timeout: 10000,
});

// Request interceptor - Automatically add JWT token to requests
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle common errors
API.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Security: Handle unauthorized access
        if (error.response && error.response.status === 401) {
            // Token expired or invalid - clear storage and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        // Security: Handle forbidden access
        if (error.response && error.response.status === 403) {
            alert('Access denied. You do not have permission to perform this action.');
        }

        return Promise.reject(error);
    }
);

export default API;