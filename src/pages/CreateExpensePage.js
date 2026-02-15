import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { groupService } from '../api/groupService';
import { expenseService } from '../api/expenseService';

const CreateExpensePage = () => {
    const { groupId } = useParams();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [group, setGroup] = useState(null);
    const [formData, setFormData] = useState({
        description: '',
        totalAmount: '',
        paidBy: user.id,
        splitType: 'EQUAL',
    });

    const [splits, setSplits] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingGroup, setLoadingGroup] = useState(true);

    useEffect(() => {
        fetchGroup();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupId]);

    const fetchGroup = async () => {
        try {
            const groupData = await groupService.getGroupById(groupId);
            setGroup(groupData);

            // Pre-select all members
            const memberIds = groupData.members.map(m => m.id);
            setSelectedMembers(memberIds);

            // Initialize splits for EQUAL type
            initializeSplits(groupData.members, 'EQUAL');
        } catch (err) {
            console.error('Error fetching group:', err);
            setError('Failed to load group');
        } finally {
            setLoadingGroup(false);
        }
    };

    const initializeSplits = (members, splitType) => {
        if (splitType === 'EQUAL') {
            setSplits(members.map(m => ({
                userId: m.id,
                userName: m.name,
            })));
        } else if (splitType === 'EXACT') {
            setSplits(members.map(m => ({
                userId: m.id,
                userName: m.name,
                amount: 0,
            })));
        } else if (splitType === 'PERCENTAGE') {
            setSplits(members.map(m => ({
                userId: m.id,
                userName: m.name,
                percentage: 0,
            })));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === 'splitType') {
            initializeSplits(group.members, value);
        }
    };

    const handleMemberToggle = (memberId) => {
        if (selectedMembers.includes(memberId)) {
            setSelectedMembers(selectedMembers.filter(id => id !== memberId));
            setSplits(splits.filter(s => s.userId !== memberId));
        } else {
            setSelectedMembers([...selectedMembers, memberId]);
            const member = group.members.find(m => m.id === memberId);

            if (formData.splitType === 'EQUAL') {
                setSplits([...splits, { userId: member.id, userName: member.name }]);
            } else if (formData.splitType === 'EXACT') {
                setSplits([...splits, { userId: member.id, userName: member.name, amount: 0 }]);
            } else if (formData.splitType === 'PERCENTAGE') {
                setSplits([...splits, { userId: member.id, userName: member.name, percentage: 0 }]);
            }
        }
    };

    const handleSplitChange = (userId, field, value) => {
        setSplits(splits.map(split =>
            split.userId === userId
                ? { ...split, [field]: parseFloat(value) || 0 }
                : split
        ));
    };

    const calculateSplitPreview = () => {
        const total = parseFloat(formData.totalAmount) || 0;

        if (formData.splitType === 'EQUAL') {
            const perPerson = total / selectedMembers.length;
            return splits.map(s => ({ ...s, calculatedAmount: perPerson }));
        } else if (formData.splitType === 'EXACT') {
            return splits.map(s => ({ ...s, calculatedAmount: s.amount }));
        } else if (formData.splitType === 'PERCENTAGE') {
            return splits.map(s => ({
                ...s,
                calculatedAmount: (total * s.percentage) / 100
            }));
        }
        return splits;
    };

    const validateSplits = () => {
        const total = parseFloat(formData.totalAmount) || 0;

        if (formData.splitType === 'EXACT') {
            const sum = splits.reduce((acc, s) => acc + (s.amount || 0), 0);
            if (Math.abs(sum - total) > 0.01) {
                return `Split amounts (${sum.toFixed(2)}) must equal total amount (${total.toFixed(2)})`;
            }
        } else if (formData.splitType === 'PERCENTAGE') {
            const sum = splits.reduce((acc, s) => acc + (s.percentage || 0), 0);
            if (Math.abs(sum - 100) > 0.01) {
                return `Percentages (${sum.toFixed(2)}%) must sum to 100%`;
            }
        }

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate
            if (!formData.description.trim()) {
                throw new Error('Description is required');
            }

            if (!formData.totalAmount || parseFloat(formData.totalAmount) <= 0) {
                throw new Error('Amount must be greater than 0');
            }

            if (selectedMembers.length === 0) {
                throw new Error('Select at least one member');
            }

            const validationError = validateSplits();
            if (validationError) {
                throw new Error(validationError);
            }

            // Prepare expense data
            const expenseData = {
                description: formData.description,
                totalAmount: parseFloat(formData.totalAmount),
                paidBy: formData.paidBy,
                splitType: formData.splitType,
                splits: splits.map(s => {
                    if (formData.splitType === 'EQUAL') {
                        return { userId: s.userId };
                    } else if (formData.splitType === 'EXACT') {
                        return { userId: s.userId, amount: s.amount };
                    } else if (formData.splitType === 'PERCENTAGE') {
                        return { userId: s.userId, percentage: s.percentage };
                    }
                    return { userId: s.userId };
                }),
            };

            await expenseService.createExpense(groupId, expenseData);

            // Navigate back to group detail page
            navigate(`/groups/${groupId}`);
        } catch (err) {
            console.error('Create expense error:', err);
            setError(err.message || 'Failed to create expense');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loadingGroup) {
        return (
            <div style={styles.container}>
                <p>Loading...</p>
            </div>
        );
    }

    const splitPreview = calculateSplitPreview();

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <button onClick={() => navigate(`/groups/${groupId}`)} style={styles.backButton}>
                        ← Back to {group?.name}
                    </button>
                    <h1 style={styles.title}>Add Expense</h1>
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

            <div style={styles.content}>
                <div style={styles.formCard}>
                    {error && (
                        <div style={styles.error}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={styles.form}>
                        {/* Description */}
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Description *</label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="e.g., Dinner at Italian Restaurant"
                                style={styles.input}
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Amount */}
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Total Amount *</label>
                            <input
                                type="number"
                                name="totalAmount"
                                value={formData.totalAmount}
                                onChange={handleChange}
                                placeholder="0.00"
                                step="0.01"
                                min="0.01"
                                style={styles.input}
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Paid By */}
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Paid By *</label>
                            <select
                                name="paidBy"
                                value={formData.paidBy}
                                onChange={handleChange}
                                style={styles.select}
                                required
                                disabled={loading}
                            >
                                {group?.members?.map((member) => (
                                    <option key={member.id} value={member.id}>
                                        {member.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Split Type */}
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Split Type *</label>
                            <select
                                name="splitType"
                                value={formData.splitType}
                                onChange={handleChange}
                                style={styles.select}
                                disabled={loading}
                            >
                                <option value="EQUAL">Equal - Split evenly</option>
                                <option value="EXACT">Exact - Specify exact amounts</option>
                                <option value="PERCENTAGE">Percentage - Specify percentages</option>
                            </select>
                        </div>

                        {/* Select Members */}
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Split Between *</label>
                            <div style={styles.membersList}>
                                {group?.members?.map((member) => (
                                    <div
                                        key={member.id}
                                        style={styles.memberItem}
                                        onClick={() => handleMemberToggle(member.id)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedMembers.includes(member.id)}
                                            onChange={() => handleMemberToggle(member.id)}
                                            style={styles.checkbox}
                                        />
                                        <span>{member.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Split Details */}
                        {formData.splitType !== 'EQUAL' && (
                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    {formData.splitType === 'EXACT' ? 'Amounts' : 'Percentages'}
                                </label>
                                <div style={styles.splitInputs}>
                                    {splits.map((split) => (
                                        <div key={split.userId} style={styles.splitRow}>
                                            <span style={styles.splitName}>{split.userName}</span>
                                            <input
                                                type="number"
                                                value={formData.splitType === 'EXACT' ? split.amount : split.percentage}
                                                onChange={(e) => handleSplitChange(
                                                    split.userId,
                                                    formData.splitType === 'EXACT' ? 'amount' : 'percentage',
                                                    e.target.value
                                                )}
                                                placeholder={formData.splitType === 'EXACT' ? '0.00' : '0'}
                                                step={formData.splitType === 'EXACT' ? '0.01' : '0.01'}
                                                min="0"
                                                style={styles.splitInput}
                                                disabled={loading}
                                            />
                                            <span style={styles.splitUnit}>
                        {formData.splitType === 'EXACT' ? '$' : '%'}
                      </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Split Preview */}
                        {formData.totalAmount && selectedMembers.length > 0 && (
                            <div style={styles.previewSection}>
                                <h3 style={styles.previewTitle}>Split Preview</h3>
                                <div style={styles.previewList}>
                                    {splitPreview.map((split) => (
                                        <div key={split.userId} style={styles.previewRow}>
                                            <span>{split.userName}</span>
                                            <span style={styles.previewAmount}>
                        ${(split.calculatedAmount || 0).toFixed(2)}
                                                {formData.splitType === 'PERCENTAGE' &&
                                                    ` (${split.percentage || 0}%)`
                                                }
                      </span>
                                        </div>
                                    ))}
                                </div>
                                <div style={styles.previewTotal}>
                                    <strong>Total:</strong>
                                    <strong>
                                        ${splitPreview.reduce((sum, s) => sum + (s.calculatedAmount || 0), 0).toFixed(2)}
                                    </strong>
                                </div>
                            </div>
                        )}

                        <div style={styles.buttonGroup}>
                            <button
                                type="button"
                                onClick={() => navigate(`/groups/${groupId}`)}
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
                                {loading ? 'Creating...' : 'Create Expense'}
                            </button>
                        </div>
                    </form>
                </div>

                <div style={styles.helpCard}>
                    <h3 style={styles.helpTitle}>💡 Split Types</h3>
                    <div style={styles.helpSection}>
                        <h4>Equal</h4>
                        <p>Splits the amount evenly among all selected members.</p>
                    </div>
                    <div style={styles.helpSection}>
                        <h4>Exact</h4>
                        <p>Specify exact amount for each person. Must add up to total.</p>
                    </div>
                    <div style={styles.helpSection}>
                        <h4>Percentage</h4>
                        <p>Specify percentage for each person. Must add up to 100%.</p>
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
        margin: '10px 0',
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
    select: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
        boxSizing: 'border-box',
        backgroundColor: 'white',
    },
    membersList: {
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '10px',
        maxHeight: '200px',
        overflowY: 'auto',
    },
    memberItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        cursor: 'pointer',
        borderRadius: '4px',
    },
    checkbox: {
        marginRight: '10px',
        cursor: 'pointer',
    },
    splitInputs: {
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '15px',
    },
    splitRow: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
        gap: '10px',
    },
    splitName: {
        flex: 1,
        fontWeight: '500',
    },
    splitInput: {
        width: '120px',
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '4px',
    },
    splitUnit: {
        color: '#666',
        fontSize: '14px',
    },
    previewSection: {
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
    },
    previewTitle: {
        margin: '0 0 15px 0',
        fontSize: '16px',
        color: '#333',
    },
    previewList: {
        marginBottom: '15px',
    },
    previewRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px 0',
        fontSize: '14px',
    },
    previewAmount: {
        fontWeight: '500',
        color: '#007bff',
    },
    previewTotal: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: '15px',
        borderTop: '2px solid #ddd',
        fontSize: '16px',
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
    helpSection: {
        marginBottom: '20px',
    },
};

export default CreateExpensePage;