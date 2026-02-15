import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { groupService } from '../api/groupService';
import { expenseService } from '../api/expenseService';
import { balanceService } from '../api/balanceService';

const GroupDetailPage = () => {
    const { groupId } = useParams();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [group, setGroup] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [balances, setBalances] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('expenses'); // expenses, members, balances

    useEffect(() => {
        fetchGroupData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupId]);

    const fetchGroupData = async () => {
        try {
            setLoading(true);
            setError('');

            const [groupData, expensesData, balancesData] = await Promise.all([
                groupService.getGroupById(groupId),
                expenseService.getGroupExpenses(groupId, 0, 20),
                balanceService.getGroupBalances(groupId),
            ]);

            setGroup(groupData);
            setExpenses(expensesData);
            setBalances(balancesData);
        } catch (err) {
            console.error('Error fetching group data:', err);
            setError(err.message || 'Failed to load group data');
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
                <p>Loading group...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.container}>
                <div style={styles.error}>{error}</div>
                <button onClick={() => navigate('/groups')} style={styles.backButton}>
                    Back to Groups
                </button>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <button onClick={() => navigate('/groups')} style={styles.backButton}>
                        ← Back to Groups
                    </button>
                    <h1 style={styles.title}>{group?.name}</h1>
                    <p style={styles.description}>{group?.description || 'No description'}</p>
                </div>
                <div style={styles.headerRight}>
                    <button onClick={() => navigate('/dashboard')} style={styles.navButton}>
                        Dashboard
                    </button>
                    <span style={styles.userName}>{user.name}</span>
                    <button onClick={handleLogout} style={styles.logoutButton}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Group Stats */}
            <div style={styles.statsBar}>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>{group?.members?.length || 0}</div>
                    <div style={styles.statLabel}>Members</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>{expenses.length}</div>
                    <div style={styles.statLabel}>Expenses</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>
                        ${expenses.reduce((sum, e) => sum + e.totalAmount, 0).toFixed(2)}
                    </div>
                    <div style={styles.statLabel}>Total Spent</div>
                </div>
            </div>

            {/* Action Buttons */}
            <div style={styles.actionBar}>
                <button
                    onClick={() => navigate(`/groups/${groupId}/expenses/new`)}
                    style={styles.addExpenseButton}
                >
                    + Add Expense
                </button>
                <button
                    onClick={() => navigate(`/groups/${groupId}/settle`)}
                    style={styles.settleButton}
                >
                    💰 Settle Up
                </button>
            </div>

            {/* Tabs */}
            <div style={styles.tabs}>
                <button
                    onClick={() => setActiveTab('expenses')}
                    style={activeTab === 'expenses' ? styles.tabActive : styles.tab}
                >
                    Expenses
                </button>
                <button
                    onClick={() => setActiveTab('balances')}
                    style={activeTab === 'balances' ? styles.tabActive : styles.tab}
                >
                    Balances
                </button>
                <button
                    onClick={() => setActiveTab('members')}
                    style={activeTab === 'members' ? styles.tabActive : styles.tab}
                >
                    Members
                </button>
            </div>

            {/* Tab Content */}
            <div style={styles.tabContent}>
                {activeTab === 'expenses' && (
                    <div>
                        <h2 style={styles.sectionTitle}>Recent Expenses</h2>
                        {expenses.length === 0 ? (
                            <div style={styles.emptyState}>
                                <p>No expenses yet</p>
                                <button
                                    onClick={() => navigate(`/groups/${groupId}/expenses/new`)}
                                    style={styles.addExpenseButton}
                                >
                                    Add First Expense
                                </button>
                            </div>
                        ) : (
                            <div style={styles.expensesList}>
                                {expenses.map((expense) => (
                                    <div key={expense.id} style={styles.expenseCard}>
                                        <div style={styles.expenseHeader}>
                                            <div>
                                                <h3 style={styles.expenseTitle}>{expense.description}</h3>
                                                <p style={styles.expenseDate}>
                                                    {new Date(expense.createdAt).toLocaleDateString()} •
                                                    Paid by {expense.paidByName}
                                                </p>
                                            </div>
                                            <div style={styles.expenseAmount}>
                                                ${expense.totalAmount.toFixed(2)}
                                            </div>
                                        </div>

                                        <div style={styles.expenseSplits}>
                                            <strong>Split ({expense.splitType}):</strong>
                                            <div style={styles.splitsList}>
                                                {expense.splits.map((split) => (
                                                    <div key={split.userId} style={styles.splitItem}>
                                                        <span>{split.userName}</span>
                                                        <span style={{
                                                            ...styles.splitAmount,
                                                            color: split.paid ? '#28a745' : '#dc3545',
                                                        }}>
                              ${split.amountOwed.toFixed(2)}
                                                            {split.paid && ' ✓'}
                            </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'balances' && (
                    <div>
                        <h2 style={styles.sectionTitle}>Simplified Balances</h2>
                        {balances?.transactions?.length === 0 ? (
                            <div style={styles.emptyState}>
                                <p>✅ All settled up! No outstanding balances.</p>
                            </div>
                        ) : (
                            <div style={styles.balancesList}>
                                {balances?.transactions?.map((transaction, index) => (
                                    <div key={index} style={styles.balanceCard}>
                                        <div style={styles.balanceFlow}>
                                            <span style={styles.fromUser}>{transaction.fromUserName}</span>
                                            <span style={styles.arrow}>→</span>
                                            <span style={styles.toUser}>{transaction.toUserName}</span>
                                        </div>
                                        <div style={styles.balanceAmount}>
                                            ${transaction.amount.toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'members' && (
                    <div>
                        <h2 style={styles.sectionTitle}>Group Members</h2>
                        <div style={styles.membersList}>
                            {group?.members?.map((member) => (
                                <div key={member.id} style={styles.memberCard}>
                                    <div>
                                        <div style={styles.memberName}>
                                            {member.name}
                                            {member.id === group.createdBy && (
                                                <span style={styles.creatorBadge}>Creator</span>
                                            )}
                                        </div>
                                        <div style={styles.memberEmail}>{member.email}</div>
                                        {member.phone && (
                                            <div style={styles.memberPhone}>{member.phone}</div>
                                        )}
                                    </div>
                                    {member.id !== group.createdBy && member.id !== user.id && (
                                        <button
                                            onClick={() => {
                                                if (window.confirm(`Remove ${member.name} from group?`)) {
                                                    // TODO: Implement remove member
                                                    alert('Remove member feature - to be implemented');
                                                }
                                            }}
                                            style={styles.removeButton}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
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
        alignItems: 'flex-start',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '2px solid #eee',
    },
    backButton: {
        backgroundColor: 'transparent',
        border: 'none',
        color: '#007bff',
        cursor: 'pointer',
        fontSize: '14px',
        marginBottom: '10px',
        padding: '5px 0',
    },
    title: {
        margin: '10px 0 5px 0',
        color: '#333',
    },
    description: {
        color: '#666',
        margin: '5px 0',
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
    statsBar: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        marginBottom: '30px',
    },
    statCard: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center',
    },
    statValue: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: '5px',
    },
    statLabel: {
        color: '#666',
        fontSize: '14px',
    },
    actionBar: {
        display: 'flex',
        gap: '15px',
        marginBottom: '30px',
    },
    addExpenseButton: {
        backgroundColor: '#28a745',
        color: 'white',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        fontWeight: '500',
    },
    settleButton: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
    },
    tabs: {
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        borderBottom: '2px solid #eee',
    },
    tab: {
        backgroundColor: 'transparent',
        border: 'none',
        padding: '12px 24px',
        fontSize: '16px',
        cursor: 'pointer',
        color: '#666',
        borderBottom: '2px solid transparent',
        marginBottom: '-2px',
    },
    tabActive: {
        backgroundColor: 'transparent',
        border: 'none',
        padding: '12px 24px',
        fontSize: '16px',
        cursor: 'pointer',
        color: '#007bff',
        borderBottom: '2px solid #007bff',
        marginBottom: '-2px',
        fontWeight: '500',
    },
    tabContent: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    sectionTitle: {
        margin: '0 0 20px 0',
        color: '#333',
    },
    emptyState: {
        textAlign: 'center',
        padding: '40px',
        color: '#666',
    },
    expensesList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    expenseCard: {
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: '#fafafa',
    },
    expenseHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '15px',
    },
    expenseTitle: {
        margin: '0 0 5px 0',
        color: '#333',
        fontSize: '18px',
    },
    expenseDate: {
        margin: 0,
        color: '#666',
        fontSize: '14px',
    },
    expenseAmount: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#007bff',
    },
    expenseSplits: {
        marginTop: '15px',
        paddingTop: '15px',
        borderTop: '1px solid #ddd',
    },
    splitsList: {
        marginTop: '10px',
    },
    splitItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px 0',
        fontSize: '14px',
    },
    splitAmount: {
        fontWeight: '500',
    },
    balancesList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    balanceCard: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
    },
    balanceFlow: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        fontSize: '16px',
    },
    fromUser: {
        fontWeight: '500',
        color: '#dc3545',
    },
    arrow: {
        color: '#666',
        fontSize: '20px',
    },
    toUser: {
        fontWeight: '500',
        color: '#28a745',
    },
    balanceAmount: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#007bff',
    },
    membersList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    memberCard: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
    },
    memberName: {
        fontSize: '18px',
        fontWeight: '500',
        color: '#333',
        marginBottom: '5px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    creatorBadge: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'normal',
    },
    memberEmail: {
        color: '#666',
        fontSize: '14px',
        marginBottom: '3px',
    },
    memberPhone: {
        color: '#999',
        fontSize: '13px',
    },
    removeButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
};

export default GroupDetailPage;