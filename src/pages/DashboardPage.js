import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { groupService } from '../api/groupService';
import { balanceService } from '../api/balanceService';

const DashboardPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [groups, setGroups] = useState([]);
    const [balances, setBalances] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError('');

                const [groupsData, balancesData] = await Promise.all([
                    groupService.getAllGroups(),
                    balanceService.getUserBalances(user.id),
                ]);

                setGroups(groupsData);
                setBalances(balancesData);
            } catch (err) {
                console.error('Dashboard error:', err);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [user.id]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <button onClick={() => navigate('/profile')} style={styles.navButton}>
                    Profile
                </button>
                <span style={styles.userName}>Welcome, {user.name}!</span>
                <button onClick={handleLogout} style={styles.logoutButton}>
                    Logout
                </button>
            </div>

            {error && (
                <div style={styles.error}>
                    {error}
                </div>
            )}

            {/* Balance Summary */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Your Balance Summary</h2>
                <div style={styles.balanceGrid}>
                    <div style={styles.balanceCard}>
                        <h3 style={styles.balanceLabel}>You Owe</h3>
                        <p style={{ ...styles.balanceAmount, color: '#dc3545' }}>
                            ${balances?.owes?.reduce((sum, b) => sum + b.amount, 0)?.toFixed(2) || '0.00'}
                        </p>
                        <small>{balances?.owes?.length || 0} person(s)</small>
                    </div>

                    <div style={styles.balanceCard}>
                        <h3 style={styles.balanceLabel}>You Are Owed</h3>
                        <p style={{ ...styles.balanceAmount, color: '#28a745' }}>
                            ${balances?.owedBy?.reduce((sum, b) => sum + b.amount, 0)?.toFixed(2) || '0.00'}
                        </p>
                        <small>{balances?.owedBy?.length || 0} person(s)</small>
                    </div>

                    <div style={styles.balanceCard}>
                        <h3 style={styles.balanceLabel}>Net Balance</h3>
                        <p style={{
                            ...styles.balanceAmount,
                            color: balances?.netBalance >= 0 ? '#28a745' : '#dc3545'
                        }}>
                            ${balances?.netBalance?.toFixed(2) || '0.00'}
                        </p>
                        <small>{balances?.netBalance >= 0 ? 'You get back' : 'You owe'}</small>
                    </div>
                </div>
            </div>

            {/* Groups */}
            <div style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Your Groups</h2>
                    <button
                        onClick={() => navigate('/groups/new')}
                        style={styles.primaryButton}
                    >
                        + Create Group
                    </button>
                </div>

                {groups.length === 0 ? (
                    <p style={styles.emptyState}>
                        No groups yet. Create one to start tracking expenses!
                    </p>
                ) : (
                    <div style={styles.groupGrid}>
                        {groups.map((group) => (
                            <div
                                key={group.id}
                                style={styles.groupCard}
                                onClick={() => navigate(`/groups/${group.id}`)}
                            >
                                <h3 style={styles.groupName}>{group.name}</h3>
                                <p style={styles.groupDesc}>{group.description || 'No description'}</p>
                                <p style={styles.groupMembers}>
                                    {group.members?.length || 0} member(s)
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Quick Actions</h2>
                <div style={styles.actionGrid}>
                    <button
                        onClick={() => navigate('/balances')}
                        style={styles.actionButton}
                    >
                        📊 View Detailed Balances
                    </button>
                    <button
                        onClick={() => navigate('/groups')}
                        style={styles.actionButton}
                    >
                        👥 Manage Groups
                    </button>
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
        gap: '15px',
    },
    userName: {
        color: '#666',
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
    section: {
        marginBottom: '40px',
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    sectionTitle: {
        color: '#333',
        marginBottom: '20px',
    },
    balanceGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
    },
    balanceCard: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center',
    },
    balanceLabel: {
        margin: '0 0 10px 0',
        color: '#666',
        fontSize: '14px',
        fontWeight: 'normal',
    },
    balanceAmount: {
        fontSize: '32px',
        fontWeight: 'bold',
        margin: '10px 0',
    },
    groupGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
    },
    groupCard: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'transform 0.2s',
    },
    groupName: {
        margin: '0 0 10px 0',
        color: '#333',
    },
    groupDesc: {
        color: '#666',
        margin: '0 0 10px 0',
    },
    groupMembers: {
        color: '#999',
        fontSize: '14px',
        margin: 0,
    },
    primaryButton: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    actionGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
    },
    actionButton: {
        backgroundColor: '#f8f9fa',
        border: '1px solid #ddd',
        padding: '15px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    emptyState: {
        textAlign: 'center',
        color: '#999',
        padding: '40px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
    },
};

export default DashboardPage;