import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { groupService } from '../api/groupService';
import { balanceService } from '../api/balanceService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const DashboardPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [groups, setGroups] = useState([]);
    const [balances, setBalances] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchDashboardData = async () => {
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
            setError('Failed to load dashboard data. Please try refreshing.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
            navigate('/login');
        }
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <LoadingSpinner message="Loading your dashboard..." />
            </div>
        );
    }

    const totalOwing = balances?.owes?.reduce((sum, b) => sum + b.amount, 0) || 0;
    const totalOwed = balances?.owedBy?.reduce((sum, b) => sum + b.amount, 0) || 0;

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <h1 style={styles.title}>Dashboard</h1>
                    <p style={styles.subtitle}>Welcome back, {user.name}! 👋</p>
                </div>
                <div style={styles.headerRight}>
                    <button onClick={() => navigate('/profile')} style={styles.navButton}>
                        👤 Profile
                    </button>
                    <button onClick={handleLogout} style={styles.logoutButton}>
                        Logout
                    </button>
                </div>
            </div>

            <ErrorAlert error={error} onClose={() => setError('')} />

            {/* Balance Summary */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>💰 Your Balance Summary</h2>
                <div style={styles.balanceGrid}>
                    <div style={{ ...styles.balanceCard, borderLeft: '4px solid #dc3545' }}>
                        <div style={styles.balanceIcon}>💸</div>
                        <div style={styles.balanceContent}>
                            <h3 style={styles.balanceLabel}>You Owe</h3>
                            <p style={{ ...styles.balanceAmount, color: '#dc3545' }}>
                                ${totalOwing.toFixed(2)}
                            </p>
                            <small style={styles.balanceCount}>
                                {balances?.owes?.length || 0} person(s)
                            </small>
                        </div>
                    </div>

                    <div style={{ ...styles.balanceCard, borderLeft: '4px solid #28a745' }}>
                        <div style={styles.balanceIcon}>💰</div>
                        <div style={styles.balanceContent}>
                            <h3 style={styles.balanceLabel}>You Are Owed</h3>
                            <p style={{ ...styles.balanceAmount, color: '#28a745' }}>
                                ${totalOwed.toFixed(2)}
                            </p>
                            <small style={styles.balanceCount}>
                                {balances?.owedBy?.length || 0} person(s)
                            </small>
                        </div>
                    </div>

                    <div style={{
                        ...styles.balanceCard,
                        borderLeft: `4px solid ${balances?.netBalance >= 0 ? '#28a745' : '#dc3545'}`
                    }}>
                        <div style={styles.balanceIcon}>
                            {balances?.netBalance >= 0 ? '📈' : '📉'}
                        </div>
                        <div style={styles.balanceContent}>
                            <h3 style={styles.balanceLabel}>Net Balance</h3>
                            <p style={{
                                ...styles.balanceAmount,
                                color: balances?.netBalance >= 0 ? '#28a745' : '#dc3545'
                            }}>
                                {balances?.netBalance >= 0 ? '+' : ''}${balances?.netBalance?.toFixed(2) || '0.00'}
                            </p>
                            <small style={styles.balanceCount}>
                                {balances?.netBalance >= 0 ? 'You get back' : 'You owe'}
                            </small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Groups */}
            <div style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>👥 Your Groups</h2>
                    <button
                        onClick={() => navigate('/groups/new')}
                        style={styles.primaryButton}
                    >
                        + Create Group
                    </button>
                </div>

                {groups.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>📂</div>
                        <h3>No groups yet</h3>
                        <p>Create your first group to start tracking shared expenses!</p>
                        <button
                            onClick={() => navigate('/groups/new')}
                            style={styles.primaryButton}
                        >
                            Create Your First Group
                        </button>
                    </div>
                ) : (
                    <div style={styles.groupGrid}>
                        {groups.map((group) => (
                            <div
                                key={group.id}
                                style={styles.groupCard}
                                className="card-hover"
                                onClick={() => navigate(`/groups/${group.id}`)}
                            >
                                <div style={styles.groupHeader}>
                                    <h3 style={styles.groupName}>{group.name}</h3>
                                    <span style={styles.memberBadge}>
                    {group.members?.length || 0}
                  </span>
                                </div>
                                <p style={styles.groupDesc}>{group.description || 'No description'}</p>
                                <div style={styles.groupFooter}>
                  <span style={styles.groupMembers}>
                    👥 {group.members?.length} member(s)
                  </span>
                                    <button
                                        style={styles.viewButton}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/groups/${group.id}`);
                                        }}
                                    >
                                        View →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>⚡ Quick Actions</h2>
                <div style={styles.actionGrid}>
                    <button
                        onClick={() => navigate('/balances')}
                        style={styles.actionButton}
                    >
                        <span style={styles.actionIcon}>📊</span>
                        <span>View Detailed Balances</span>
                    </button>
                    <button
                        onClick={() => navigate('/groups')}
                        style={styles.actionButton}
                    >
                        <span style={styles.actionIcon}>👥</span>
                        <span>Manage Groups</span>
                    </button>
                    <button
                        onClick={() => navigate('/profile')}
                        style={styles.actionButton}
                    >
                        <span style={styles.actionIcon}>👤</span>
                        <span>My Profile</span>
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
        animation: 'fadeIn 0.5s ease-out',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '2px solid #eee',
        flexWrap: 'wrap',
        gap: '15px',
    },
    headerLeft: {
        flex: 1,
    },
    title: {
        margin: '0 0 5px 0',
        color: '#333',
    },
    subtitle: {
        margin: 0,
        color: '#666',
        fontSize: '14px',
    },
    headerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexWrap: 'wrap',
    },
    navButton: {
        backgroundColor: '#f8f9fa',
        color: '#333',
        padding: '10px 20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
    },
    logoutButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
    },
    section: {
        marginBottom: '40px',
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '15px',
    },
    sectionTitle: {
        color: '#333',
        marginBottom: '20px',
        fontSize: '22px',
    },
    balanceGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
    },
    balanceCard: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        transition: 'all 0.3s ease',
    },
    balanceIcon: {
        fontSize: '48px',
        lineHeight: 1,
    },
    balanceContent: {
        flex: 1,
    },
    balanceLabel: {
        margin: '0 0 8px 0',
        color: '#666',
        fontSize: '14px',
        fontWeight: 'normal',
    },
    balanceAmount: {
        fontSize: '32px',
        fontWeight: 'bold',
        margin: '5px 0',
    },
    balanceCount: {
        color: '#999',
        fontSize: '13px',
    },
    primaryButton: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '500',
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 20px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    },
    emptyIcon: {
        fontSize: '64px',
        marginBottom: '20px',
    },
    groupGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
    },
    groupCard: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        border: '1px solid #e0e0e0',
    },
    groupHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
    },
    groupName: {
        margin: 0,
        color: '#333',
        fontSize: '18px',
    },
    memberBadge: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
    },
    groupDesc: {
        color: '#666',
        margin: '0 0 16px 0',
        fontSize: '14px',
        lineHeight: '1.5',
    },
    groupFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '16px',
        borderTop: '1px solid #eee',
    },
    groupMembers: {
        color: '#666',
        fontSize: '13px',
    },
    viewButton: {
        backgroundColor: 'transparent',
        color: '#007bff',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
    },
    actionGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
    },
    actionButton: {
        backgroundColor: 'white',
        border: '2px solid #e0e0e0',
        padding: '20px',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        transition: 'all 0.3s ease',
    },
    actionIcon: {
        fontSize: '24px',
    },
};

// Responsive adjustments
const mediaQuery = window.matchMedia('(max-width: 768px)');
if (mediaQuery.matches) {
    styles.header.flexDirection = 'column';
    styles.header.alignItems = 'flex-start';
    styles.balanceGrid.gridTemplateColumns = '1fr';
    styles.groupGrid.gridTemplateColumns = '1fr';
    styles.actionGrid.gridTemplateColumns = '1fr';
}

export default DashboardPage;