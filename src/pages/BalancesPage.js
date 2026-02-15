import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { balanceService } from '../api/balanceService';

const BalancesPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [balances, setBalances] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBalances();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchBalances = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await balanceService.getUserBalances(user.id);
            setBalances(data);
        } catch (err) {
            console.error('Error fetching balances:', err);
            setError('Failed to load balances');
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
                <p>Loading balances...</p>
            </div>
        );
    }

    const totalOwing = balances?.owes?.reduce((sum, b) => sum + b.amount, 0) || 0;
    const totalOwed = balances?.owedBy?.reduce((sum, b) => sum + b.amount, 0) || 0;

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>My Balances</h1>
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

            {error && (
                <div style={styles.error}>
                    {error}
                </div>
            )}

            {/* Summary Cards */}
            <div style={styles.summarySection}>
                <div style={styles.summaryCard}>
                    <div style={styles.summaryIcon}>💸</div>
                    <div style={styles.summaryContent}>
                        <div style={styles.summaryLabel}>You Owe</div>
                        <div style={{ ...styles.summaryAmount, color: '#dc3545' }}>
                            ${totalOwing.toFixed(2)}
                        </div>
                        <div style={styles.summaryCount}>
                            {balances?.owes?.length || 0} person(s)
                        </div>
                    </div>
                </div>

                <div style={styles.summaryCard}>
                    <div style={styles.summaryIcon}>💰</div>
                    <div style={styles.summaryContent}>
                        <div style={styles.summaryLabel}>You Are Owed</div>
                        <div style={{ ...styles.summaryAmount, color: '#28a745' }}>
                            ${totalOwed.toFixed(2)}
                        </div>
                        <div style={styles.summaryCount}>
                            {balances?.owedBy?.length || 0} person(s)
                        </div>
                    </div>
                </div>

                <div style={styles.summaryCard}>
                    <div style={styles.summaryIcon}>
                        {balances?.netBalance >= 0 ? '📈' : '📉'}
                    </div>
                    <div style={styles.summaryContent}>
                        <div style={styles.summaryLabel}>Net Balance</div>
                        <div style={{
                            ...styles.summaryAmount,
                            color: balances?.netBalance >= 0 ? '#28a745' : '#dc3545'
                        }}>
                            {balances?.netBalance >= 0 ? '+' : '-'}${Math.abs(balances?.netBalance || 0).toFixed(2)}
                        </div>
                        <div style={styles.summaryCount}>
                            {balances?.netBalance >= 0 ? 'You get back' : 'You owe overall'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Balances */}
            <div style={styles.detailsSection}>
                {/* You Owe Section */}
                <div style={styles.balanceSection}>
                    <h2 style={styles.sectionTitle}>
                        <span style={styles.sectionIcon}>💸</span>
                        You Owe
                    </h2>

                    {balances?.owes?.length === 0 ? (
                        <div style={styles.emptyState}>
                            <p>✅ You don't owe anyone!</p>
                        </div>
                    ) : (
                        <div style={styles.balancesList}>
                            {balances?.owes?.map((balance) => (
                                <div key={balance.userId} style={styles.balanceCard}>
                                    <div style={styles.balanceInfo}>
                                        <div style={styles.balanceName}>{balance.userName}</div>
                                        <div style={styles.balanceSubtext}>You owe them</div>
                                    </div>
                                    <div style={{ ...styles.balanceAmount, color: '#dc3545' }}>
                                        ${balance.amount.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* You Are Owed Section */}
                <div style={styles.balanceSection}>
                    <h2 style={styles.sectionTitle}>
                        <span style={styles.sectionIcon}>💰</span>
                        You Are Owed
                    </h2>

                    {balances?.owedBy?.length === 0 ? (
                        <div style={styles.emptyState}>
                            <p>No one owes you money</p>
                        </div>
                    ) : (
                        <div style={styles.balancesList}>
                            {balances?.owedBy?.map((balance) => (
                                <div key={balance.userId} style={styles.balanceCard}>
                                    <div style={styles.balanceInfo}>
                                        <div style={styles.balanceName}>{balance.userName}</div>
                                        <div style={styles.balanceSubtext}>They owe you</div>
                                    </div>
                                    <div style={{ ...styles.balanceAmount, color: '#28a745' }}>
                                        ${balance.amount.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* All Settled State */}
            {totalOwing === 0 && totalOwed === 0 && (
                <div style={styles.allSettledCard}>
                    <div style={styles.allSettledIcon}>🎉</div>
                    <h2 style={styles.allSettledTitle}>All Settled Up!</h2>
                    <p style={styles.allSettledText}>
                        You don't owe anyone and no one owes you. Time to add some expenses!
                    </p>
                    <button
                        onClick={() => navigate('/groups')}
                        style={styles.groupsButton}
                    >
                        Go to Groups
                    </button>
                </div>
            )}

            {/* Info Section */}
            <div style={styles.infoSection}>
                <h3 style={styles.infoTitle}>📊 How Balances Work</h3>
                <ul style={styles.infoList}>
                    <li>
                        <strong>You Owe:</strong> Money you need to pay to others for shared expenses
                    </li>
                    <li>
                        <strong>You Are Owed:</strong> Money others need to pay you back
                    </li>
                    <li>
                        <strong>Net Balance:</strong> Your overall position (positive = you get back, negative = you owe)
                    </li>
                    <li>
                        Balances update automatically when expenses are added or settlements are recorded
                    </li>
                    <li>
                        To settle up, go to the group and click "Settle Up" button
                    </li>
                </ul>
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
    error: {
        backgroundColor: '#fee',
        color: '#c33',
        padding: '15px',
        borderRadius: '4px',
        marginBottom: '20px',
        border: '1px solid #fcc',
    },
    summarySection: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        marginBottom: '40px',
    },
    summaryCard: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    summaryIcon: {
        fontSize: '48px',
    },
    summaryContent: {
        flex: 1,
    },
    summaryLabel: {
        color: '#666',
        fontSize: '14px',
        marginBottom: '5px',
    },
    summaryAmount: {
        fontSize: '28px',
        fontWeight: 'bold',
        marginBottom: '5px',
    },
    summaryCount: {
        color: '#999',
        fontSize: '13px',
    },
    detailsSection: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '30px',
        marginBottom: '40px',
    },
    balanceSection: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    sectionTitle: {
        margin: '0 0 20px 0',
        color: '#333',
        fontSize: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    sectionIcon: {
        fontSize: '24px',
    },
    emptyState: {
        textAlign: 'center',
        padding: '40px 20px',
        color: '#666',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
    },
    balancesList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    balanceCard: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
    },
    balanceInfo: {
        flex: 1,
    },
    balanceName: {
        fontSize: '16px',
        fontWeight: '500',
        color: '#333',
        marginBottom: '3px',
    },
    balanceSubtext: {
        fontSize: '13px',
        color: '#666',
    },
    balanceAmount: {
        fontSize: '20px',
        fontWeight: 'bold',
    },
    allSettledCard: {
        backgroundColor: '#d4edda',
        border: '2px solid #c3e6cb',
        borderRadius: '8px',
        padding: '40px',
        textAlign: 'center',
        marginBottom: '40px',
    },
    allSettledIcon: {
        fontSize: '64px',
        marginBottom: '15px',
    },
    allSettledTitle: {
        color: '#155724',
        margin: '0 0 10px 0',
    },
    allSettledText: {
        color: '#155724',
        marginBottom: '20px',
    },
    groupsButton: {
        backgroundColor: '#28a745',
        color: 'white',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        fontWeight: '500',
    },
    infoSection: {
        backgroundColor: '#f8f9fa',
        padding: '25px',
        borderRadius: '8px',
    },
    infoTitle: {
        margin: '0 0 15px 0',
        color: '#333',
    },
    infoList: {
        margin: 0,
        paddingLeft: '20px',
        color: '#666',
        lineHeight: '1.8',
    },
};

export default BalancesPage;