import API from './axios';

export const expenseService = {
    createExpense: async (groupId, expenseData) => {
        try {
            // Security: Validate required fields
            if (!groupId) throw new Error('Group ID is required');
            if (!expenseData.description || !expenseData.totalAmount || !expenseData.paidBy) {
                throw new Error('Missing required expense fields');
            }

            // Security: Validate amount is positive
            if (expenseData.totalAmount <= 0) {
                throw new Error('Amount must be greater than 0');
            }

            const response = await API.post(`/api/groups/${groupId}/expenses`, expenseData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to create expense';
        }
    },

    getGroupExpenses: async (groupId, page = 0, size = 20) => {
        try {
            if (!groupId) throw new Error('Group ID is required');
            const response = await API.get(`/api/groups/${groupId}/expenses`, {
                params: { page, size },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch expenses';
        }
    },

    getExpenseById: async (groupId, expenseId) => {
        try {
            if (!groupId || !expenseId) {
                throw new Error('Group ID and Expense ID are required');
            }
            const response = await API.get(`/api/groups/${groupId}/expenses/${expenseId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch expense';
        }
    },
};