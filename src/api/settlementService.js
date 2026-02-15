import API from './axios';

export const settlementService = {
    createSettlement: async (settlementData) => {
        try {
            // Security: Validate required fields
            if (!settlementData.groupId || !settlementData.fromUser ||
                !settlementData.toUser || !settlementData.amount) {
                throw new Error('Missing required settlement fields');
            }

            // Security: Validate amount is positive
            if (settlementData.amount <= 0) {
                throw new Error('Amount must be greater than 0');
            }

            // Security: Prevent self-payment
            if (settlementData.fromUser === settlementData.toUser) {
                throw new Error('Cannot settle with yourself');
            }

            const response = await API.post('/api/settlements', settlementData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to create settlement';
        }
    },
};