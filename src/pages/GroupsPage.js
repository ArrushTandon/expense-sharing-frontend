import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { groupService } from '../api/groupService';

const GroupsPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchGroups();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchGroups = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await groupService.getAllGroups();
            setGroups(data);
        } catch (err) {
            console.error('Error fetching groups:', err);
            setError('Failed to load groups');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <p>Loading groups...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>My Groups</h1>
                <div style={styles.headerRight}>
                    <button onClick={() => navigate('/dashboard')} style={styles.navButton}>
                        Dashboard
                    </button>
                    <button onClick={() => navigate('/balances')} style={styles.navButton}>
                        Balances
                    </button>
                    <span style={styles.userName}>{user.name}</span>
                    <button onClick={handleLogout} style={styles.logoutButton}>
                        Logout
                    </button>
                </div>
            </div>

            {error && (
                <div style={styles.error}>
                    {error}
                </div>
            )}

            {/* Create Group Button */}
            <div style={styles.actionBar}>
                <button
                    onClick={() => navigate('/groups/new')}
                    style={styles.createButton}
                >
                    + Create New Group
                </button>
            </div>

            {/* Groups List */}
            {groups.length === 0 ? (
                <div style={styles.emptyState}>
                    <h3>No groups yet</h3>
                    <p>Create a group to start tracking shared expenses!</p>
                    <button
                        onClick={() => navigate('/groups/new')}
                        style={styles.createButton}
                    >
                        Create Your First Group
                    </button>
                </div>
            ) : (
                <div style={styles.groupsGrid}>
                    {groups.map((group) => (
                        <div
                            key={group.id}
                            style={styles.groupCard}
                            onClick={() => navigate(`/groups/${group.id}`)}
                        >
                            <div style={styles.groupHeader}>
                                <h3 style={styles.groupName}>{group.name}</h3>
                                <span style={styles.memberBadge}>
                  {group.members?.length || 0} members
                </span>
                            </div>

                            <p style={styles.groupDesc}>
                                {group.description || 'No description'}
                            </p>

                            <div style={styles.groupFooter}>
                <span style={styles.createdBy}>
                  Created by: {group.createdByName}
                </span>
                                <span style={styles.createdAt}>
                  {new Date(group.createdAt).toLocaleDateString()}
                </span>
                            </div>

                            <div style={styles.groupMembers}>
                                <strong>Members:</strong>
                                <div style={styles.membersList}>
                                    {group.members?.slice(0, 3).map((member) => (
                                        <span key={member.id} style={styles.memberTag}>
                      {member.name}
                    </span>
                                    ))}
                                    {group.members?.length > 3 && (
                                        <span style={styles.memberTag}>
                      +{group.members.length - 3} more
                    </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
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
    error: {
        backgroundColor: '#fee',
        color: '#c33',
        padding: '15px',
        borderRadius: '4px',
        marginBottom: '20px',
        border: '1px solid #fcc',
    },
    actionBar: {
        marginBottom: '30px',
    },
    createButton: {
        backgroundColor: '#28a745',
        color: 'white',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        fontWeight: '500',
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        marginTop: '40px',
    },
    groupsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px',
        marginTop: '20px',
    },
    groupCard: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        border: '1px solid #e0e0e0',
    },
    groupHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
    },
    groupName: {
        margin: 0,
        color: '#333',
        fontSize: '20px',
    },
    memberBadge: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '500',
    },
    groupDesc: {
        color: '#666',
        margin: '10px 0',
        minHeight: '40px',
    },
    groupFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '15px',
        paddingTop: '15px',
        borderTop: '1px solid #eee',
        fontSize: '13px',
    },
    createdBy: {
        color: '#666',
    },
    createdAt: {
        color: '#999',
    },
    groupMembers: {
        marginTop: '15px',
        paddingTop: '15px',
        borderTop: '1px solid #eee',
        fontSize: '14px',
    },
    membersList: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginTop: '8px',
    },
    memberTag: {
        backgroundColor: '#e9ecef',
        padding: '4px 10px',
        borderRadius: '4px',
        fontSize: '13px',
        color: '#495057',
    },
};

export default GroupsPage;