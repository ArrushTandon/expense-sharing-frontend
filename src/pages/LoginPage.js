import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../api/authService';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Security: Client-side validation
            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            const response = await authService.login({ email, password });

            // Security: Verify response has required fields
            if (!response.token || !response.userId) {
                throw new Error('Invalid server response');
            }

            // Store token and user data
            const success = login(response.token, {
                id: response.userId,
                email: response.email,
                name: response.name,
            });

            if (success) {
                navigate('/dashboard');
            } else {
                throw new Error('Failed to authenticate');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Expense Sharing App</h2>
                <h3 style={styles.subtitle}>Login</h3>

                {error && (
                    <div style={styles.error}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            style={styles.input}
                            required
                            disabled={loading}
                            // Security: Prevent autocomplete for sensitive fields
                            autoComplete="email"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            style={styles.input}
                            required
                            disabled={loading}
                            // Security: Prevent autocomplete
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        style={styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p style={styles.link}>
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
    },
    card: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
    },
    title: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '10px',
    },
    subtitle: {
        textAlign: 'center',
        color: '#666',
        marginBottom: '30px',
        fontWeight: 'normal',
    },
    error: {
        backgroundColor: '#fee',
        color: '#c33',
        padding: '10px',
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
        marginBottom: '5px',
        color: '#333',
        fontWeight: '500',
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
        boxSizing: 'border-box',
    },
    button: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '12px',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        fontWeight: '500',
    },
    link: {
        textAlign: 'center',
        marginTop: '20px',
        color: '#666',
    },
};

export default LoginPage;