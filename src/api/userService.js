import API from './axios';

export const userService = {
    getAllUsers: async () => {
        try {
            const response = await API.get('/api/users');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch users';
        }
    },

    getUserById: async (userId) => {
        try {
            if (!userId) throw new Error('User ID is required');
            const response = await API.get(`/api/users/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch user';
        }
    },
};