import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../api/userService';
import { groupService } from '../api/groupService';
import { balanceService } from '../api/balanceService';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [userData, setUserData] = useState(null);
    const [groups, setGroups] = useState([]);
    const [balances, setBalances] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfileData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            setError('');

            const [userDetails, groupsData, balancesData] = await Promise.all([
                userService.getUserById(user.id),
                groupService.getAllGroups(),
                balanceService.getUserBalances(user.id),
            ]);

            setUserData(userDetails);
            setGroups(groupsData);
            setBalances(balancesData);
        } catch (err) {
            console.error('Error fetching profile data:', err);
            setError('Failed to load profile data');
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
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>My Profile</h1>
                <div style={styles.headerRight}>
                    <button onClick={() => navigate('/dashboard')} style={styles.navButton}>
                        Dashboard
                    </button>
                    <button onClick={() => navigate('/groups')} style={styles.navButton}>
                        Groups
                    </button>
                    <button onClick={() => navigate('/balances')} style={styles.navButton}>
                        Balances
                    </button>
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

            <div style={styles.content}>
                {/* Profile Card */}
                <div style={styles.profileCard}>
                    <div style={styles.avatarSection}>
                        <div style={styles.avatar}>
                            {userData?.name?.charAt(0).toUpperCase()}
                        </div>
                        <h2 style={styles.profileName}>{userData?.name}</h2>
                        <p style={styles.profileEmail}>{userData?.email}</p>
                        {userData?.phone && (
                            <p style={styles.profilePhone}>{userData?.phone}</p>
                        )}
                        <p style={styles.memberSince}>
                            Member since {new Date(userData?.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                    <div style={styles.statsSection}>
                        <div style={styles.statItem}>
                            <div style={styles.statValue}>{groups.length}</div>
                            <div style={styles.statLabel}>Groups</div>
                        </div>
                        <div style={styles.statItem}>
                            <div style={styles.statValue}>
                                {(balances?.owes?.length || 0) + (balances?.owedBy?.length || 0)}
                            </div>
                            <div style={styles.statLabel}>Active Balances</div>
                        </div>
                        <div style={styles.statItem}>
                            <div style={styles.statValue}>
                                ${Math.abs(balances?.netBalance || 0).toFixed(2)}
                            </div>
                            <div style={styles.statLabel}>Net Balance</div>
                        </div>
                    </div>
                </div>

                {/* Activity Summary */}
                <div style={styles.activityCard}>
                    <h3 style={styles.cardTitle}>📊 Activity Summary</h3>

                    <div style={styles.activitySection}>
                        <h4 style={styles.activitySubtitle}>Your Groups</h4>
                        {groups.length === 0 ? (
                            <p style={styles.emptyText}>Not a member of any groups yet</p>
                        ) : (
                            <div style={styles.groupsList}>
                                {groups.map((group) => (
                                    <div
                                        key={group.id}
                                        style={styles.groupItem}
                                        onClick={() => navigate(`/groups/${group.id}`)}
                                    >
                                        <div>
                                            <div style={styles.groupItemName}>{group.name}</div>
                                            <div style={styles.groupItemInfo}>
                                                {group.members?.length} members
                                            </div>
                                        </div>
                                        <button style={styles.viewButton}>View →</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={styles.activitySection}>
                        <h4 style={styles.activitySubtitle}>Financial Summary</h4>
                        <div style={styles.financialGrid}>
                            <div style={styles.financialItem}>
                                <div style={styles.financialLabel}>You Owe</div>
                                <div style={{ ...styles.financialValue, color: '#dc3545' }}>
                                    ${balances?.owes?.reduce((sum, b) => sum + b.amount, 0).toFixed(2) || '0.00'}
                                </div>
                            </div>
                            <div style={styles.financialItem}>
                                <div style={styles.financialLabel}>You Are Owed</div>
                                <div style={{ ...styles.financialValue, color: '#28a745' }}>
                                    ${balances?.owedBy?.reduce((sum, b) => sum + b.amount, 0).toFixed(2) || '0.00'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Info */}
                <div style={styles.infoCard}>
                    <h3 style={styles.cardTitle}>👤 Account Information</h3>

                    <div style={styles.infoGrid}>
                        <div style={styles.infoItem}>
                            <div style={styles.infoLabel}>Full Name</div>
                            <div style={styles.infoValue}>{userData?.name}</div>
                        </div>

                        <div style={styles.infoItem}>
                            <div style={styles.infoLabel}>Email Address</div>
                            <div style={styles.infoValue}>{userData?.email}</div>
                        </div>

                        <div style={styles.infoItem}>
                            <div style={styles.infoLabel}>Phone Number</div>
                            <div style={styles.infoValue}>
                                {userData?.phone || 'Not provided'}
                            </div>
                        </div>

                        <div style={styles.infoItem}>
                            <div style={styles.infoLabel}>Account Created</div>
                            <div style={styles.infoValue}>
                                {new Date(userData?.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </div>
                        </div>
                    </div>

                    <div style={styles.accountActions}>
                        <button style={styles.actionButton} disabled>
                            Edit Profile (Coming Soon)
                        </button>
                        <button style={styles.actionButton} disabled>
                            Change Password (Coming Soon)
                        </button>
                    </div>
                </div>

                {/* Quick Actions */}
                <div style={styles.quickActionsCard}>
                    <h3 style={styles.cardTitle}>⚡ Quick Actions</h3>
                    <div style={styles.quickActionsGrid}>
                        <button
                            onClick={() => navigate('/groups/new')}
                            style={styles.quickActionButton}
                        >
                            <span style={styles.quickActionIcon}>➕</span>
                            Create Group
                        </button>
                        <button
                            onClick={() => navigate('/groups')}
                            style={styles.quickActionButton}
                        >
                            <span style={styles.quickActionIcon}>👥</span>
                            View Groups
                        </button>
                        <button
                            onClick={() => navigate('/balances')}
                            style={styles.quickActionButton}
                        >
                            <span style={styles.quickActionIcon}>💰</span>
                            Check Balances
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            style={styles.quickActionButton}
                        >
                            <span style={styles.quickActionIcon}>🏠</span>
                            Dashboard
                        </button>
                    </div>
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
    content: {
        display: 'grid',
        gridTemplateColumns: '350px 1fr',
        gap: '30px',
    },
    profileCard: {
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden',
    },
    avatarSection: {
        padding: '40px 30px',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #e0e0e0',
    },
    avatar: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        backgroundColor: '#007bff',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px',
        fontWeight: 'bold',
        margin: '0 auto 20px',
    },
    profileName: {
        margin: '0 0 5px 0',
        color: '#333',
        fontSize: '24px',
    },
    profileEmail: {
        color: '#666',
        margin: '0 0 5px 0',
        fontSize: '14px',
    },
    profilePhone: {
        color: '#999',
        margin: '0 0 10px 0',
        fontSize: '13px',
    },
    memberSince: {
        color: '#999',
        fontSize: '12px',
        margin: '10px 0 0 0',
    },
    statsSection: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        padding: '20px 0',
    },
    statItem: {
        textAlign: 'center',
        padding: '10px',
        borderRight: '1px solid #e0e0e0',
    },
    statValue: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: '5px',
    },
    statLabel: {
        fontSize: '12px',
        color: '#666',
    },
    activityCard: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '20px',
    },
    cardTitle: {
        margin: '0 0 20px 0',
        color: '#333',
        fontSize: '20px',
    },
    activitySection: {
        marginBottom: '30px',
    },
    activitySubtitle: {
        margin: '0 0 15px 0',
        color: '#333',
        fontSize: '16px',
    },
    emptyText: {
        color: '#666',
        fontStyle: 'italic',
    },
    groupsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    groupItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        cursor: 'pointer',
        border: '1px solid #e0e0e0',
    },
    groupItemName: {
        fontWeight: '500',
        color: '#333',
        marginBottom: '3px',
    },
    groupItemInfo: {
        fontSize: '13px',
        color: '#666',
    },
    viewButton: {
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    financialGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '15px',
    },
    financialItem: {
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        textAlign: 'center',
    },
    financialLabel: {
        fontSize: '13px',
        color: '#666',
        marginBottom: '8px',
    },
    financialValue: {
        fontSize: '24px',
        fontWeight: 'bold',
    },
    infoCard: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '20px',
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        marginBottom: '30px',
    },
    infoItem: {
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
    },
    infoLabel: {
        fontSize: '12px',
        color: '#666',
        marginBottom: '5px',
        textTransform: 'uppercase',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: '16px',
        color: '#333',
    },
    accountActions: {
        display: 'flex',
        gap: '15px',
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#6c757d',
        color: 'white',
        padding: '12px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'not-allowed',
        opacity: 0.6,
    },
    quickActionsCard: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    quickActionsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '15px',
    },
    quickActionButton: {
        padding: '20px',
        backgroundColor: '#f8f9fa',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '500',
        color: '#333',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        transition: 'all 0.2s',
    },
    quickActionIcon: {
        fontSize: '32px',
    },
};

export default ProfilePage;