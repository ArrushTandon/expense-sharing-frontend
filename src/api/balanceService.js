import API from './axios';

export const balanceService = {
    getUserBalances: async (userId) => {
        try {
            if (!userId) throw new Error('User ID is required');
            const response = await API.get(`/api/users/${userId}/balances`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch user balances';
        }
    },

    getGroupBalances: async (groupId) => {
        try {
            if (!groupId) throw new Error('Group ID is required');
            const response = await API.get(`/api/groups/${groupId}/balances`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch group balances';
        }
    },
};