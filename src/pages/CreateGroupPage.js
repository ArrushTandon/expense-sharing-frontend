import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { groupService } from '../api/groupService';
import { userService } from '../api/userService';

const CreateGroupPage = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        memberIds: [],
    });

    const [allUsers, setAllUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(true);

    useEffect(() => {
        // Only admins can see all users for adding to groups
        if (isAdmin()) {
            fetchAllUsers();
        } else {
            setLoadingUsers(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchAllUsers = async () => {
        try {
            const users = await userService.getAllUsers();
            // Filter out current user
            setAllUsers(users.filter(u => u.id !== user.id));
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleUserSelect = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!formData.name.trim()) {
                throw new Error('Group name is required');
            }

            const groupData = {
                name: formData.name,
                description: formData.description,
                createdBy: user.id,
                memberIds: selectedUsers,
            };

            const newGroup = await groupService.createGroup(groupData);

            // Navigate to the newly created group
            navigate(`/groups/${newGroup.id}`);
        } catch (err) {
            console.error('Create group error:', err);
            setError(err.message || 'Failed to create group');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>Create New Group</h1>
                <div style={styles.headerRight}>
                    <button onClick={() => navigate('/dashboard')} style={styles.navButton}>
                        Dashboard
                    </button>
                    <button onClick={() => navigate('/groups')} style={styles.navButton}>
                        Groups
                    </button>
                    <span style={styles.userName}>{user.name}</span>
                    <button onClick={handleLogout} style={styles.logoutButton}>
                        Logout
                    </button>
                </div>
            </div>

            <div style={styles.content}>
                <div style={styles.formCard}>
                    {error && (
                        <div style={styles.error}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Group Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Weekend Trip, Office Lunch, Apartment Rent"
                                style={styles.input}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Optional: Add details about this group"
                                style={styles.textarea}
                                rows="3"
                                disabled={loading}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Add Members (Optional)</label>

                            {loadingUsers ? (
                                <p style={styles.info}>Loading users...</p>
                            ) : !isAdmin() ? (
                                <div style={styles.info}>
                                    <p>You can add members after creating the group.</p>
                                    <p style={styles.note}>
                                        Note: Only admins can see all users. You'll need to know the user IDs
                                        to add members, or ask them to join using the group link.
                                    </p>
                                </div>
                            ) : allUsers.length === 0 ? (
                                <p style={styles.info}>No other users found. Create the group and add members later.</p>
                            ) : (
                                <div style={styles.usersList}>
                                    {allUsers.map((u) => (
                                        <div
                                            key={u.id}
                                            style={{
                                                ...styles.userItem,
                                                backgroundColor: selectedUsers.includes(u.id) ? '#e3f2fd' : 'white',
                                            }}
                                            onClick={() => handleUserSelect(u.id)}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(u.id)}
                                                onChange={() => handleUserSelect(u.id)}
                                                style={styles.checkbox}
                                            />
                                            <div>
                                                <div style={styles.userName2}>{u.name}</div>
                                                <div style={styles.userEmail}>{u.email}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {selectedUsers.length > 0 && (
                                <p style={styles.selectedCount}>
                                    {selectedUsers.length} member(s) selected
                                </p>
                            )}
                        </div>

                        <div style={styles.buttonGroup}>
                            <button
                                type="button"
                                onClick={() => navigate('/groups')}
                                style={styles.cancelButton}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                style={styles.submitButton}
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create Group'}
                            </button>
                        </div>
                    </form>
                </div>

                <div style={styles.helpCard}>
                    <h3 style={styles.helpTitle}>💡 Tips</h3>
                    <ul style={styles.helpList}>
                        <li>Choose a descriptive name for your group</li>
                        <li>You can add members later if you're not sure yet</li>
                        <li>As the creator, you cannot be removed from the group</li>
                        <li>All members will be able to add expenses to the group</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '2px solid #eee',
    },
    title: {
        margin: 0,
        color: '#333',
    },
    headerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    navButton: {
        backgroundColor: '#f8f9fa',
        color: '#333',
        padding: '8px 16px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    userName: {
        color: '#666',
        marginLeft: '10px',
    },
    logoutButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    content: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '30px',
    },
    formCard: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    error: {
        backgroundColor: '#fee',
        color: '#c33',
        padding: '15px',
        borderRadius: '4px',
        marginBottom: '20px',
        border: '1px solid #fcc',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    formGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        color: '#333',
        fontWeight: '500',
        fontSize: '14px',
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
        boxSizing: 'border-box',
    },
    textarea: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
        resize: 'vertical',
    },
    info: {
        color: '#666',
        fontSize: '14px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        border: '1px solid #e0e0e0',
    },
    note: {
        fontSize: '13px',
        color: '#999',
        marginTop: '10px',
    },
    usersList: {
        maxHeight: '300px',
        overflowY: 'auto',
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '10px',
    },
    userItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px',
        borderRadius: '4px',
        marginBottom: '8px',
        cursor: 'pointer',
        border: '1px solid #e0e0e0',
    },
    checkbox: {
        marginRight: '12px',
        cursor: 'pointer',
    },
    userName2: {
        fontWeight: '500',
        color: '#333',
        marginBottom: '4px',
    },
    userEmail: {
        fontSize: '13px',
        color: '#666',
    },
    selectedCount: {
        marginTop: '10px',
        fontSize: '14px',
        color: '#007bff',
        fontWeight: '500',
    },
    buttonGroup: {
        display: 'flex',
        gap: '15px',
        marginTop: '30px',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#6c757d',
        color: 'white',
        padding: '12px',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
    },
    submitButton: {
        flex: 2,
        backgroundColor: '#28a745',
        color: 'white',
        padding: '12px',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        fontWeight: '500',
    },
    helpCard: {
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        height: 'fit-content',
    },
    helpTitle: {
        margin: '0 0 15px 0',
        color: '#333',
    },
    helpList: {
        margin: 0,
        paddingLeft: '20px',
        color: '#666',
        lineHeight: '1.8',
    },
};

export default CreateGroupPage;