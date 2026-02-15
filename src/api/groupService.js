import API from './axios';

export const groupService = {
    createGroup: async (groupData) => {
        try {
            // Security: Validate required fields
            if (!groupData.name || !groupData.createdBy) {
                throw new Error('Group name and creator are required');
            }

            const response = await API.post('/api/groups', groupData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to create group';
        }
    },

    getAllGroups: async () => {
        try {
            const response = await API.get('/api/groups');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch groups';
        }
    },

    getGroupById: async (groupId) => {
        try {
            if (!groupId) throw new Error('Group ID is required');
            const response = await API.get(`/api/groups/${groupId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch group';
        }
    },

    addMember: async (groupId, userId) => {
        try {
            if (!groupId || !userId) {
                throw new Error('Group ID and User ID are required');
            }

            const response = await API.post(`/api/groups/${groupId}/members`, {
                userId: userId,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to add member';
        }
    },

    removeMember: async (groupId, userId) => {
        try {
            if (!groupId || !userId) {
                throw new Error('Group ID and User ID are required');
            }

            const response = await API.delete(`/api/groups/${groupId}/members/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to remove member';
        }
    },
};