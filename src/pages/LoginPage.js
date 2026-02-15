import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../api/authService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

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
            if (!email || !password) {
                throw new Error('Please enter both email and password');
            }

            const response = await authService.login({ email, password });

            if (!response.token || !response.userId) {
                throw new Error('Invalid response from server');
            }

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
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <LoadingSpinner message="Logging you in..." />
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.logoSection}>
                    <div style={styles.logo}>💰</div>
                    <h2 style={styles.appName}>Expense Sharing</h2>
                    <p style={styles.tagline}>Split bills, not friendships</p>
                </div>

                <h3 style={styles.formTitle}>Welcome Back</h3>

                <ErrorAlert error={error} onClose={() => setError('')} />

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            style={styles.input}
                            required
                            disabled={loading}
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
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        style={styles.button}
                        disabled={loading}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div style={styles.footer}>
                    <p style={styles.footerText}>
                        Don't have an account?{' '}
                        <Link to="/register" style={styles.link}>
                            Create one now
                        </Link>
                    </p>
                </div>
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
    },
    card: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '420px',
    },
    logoSection: {
        textAlign: 'center',
        marginBottom: '30px',
    },
    logo: {
        fontSize: '48px',
        marginBottom: '10px',
    },
    appName: {
        margin: '10px 0 5px 0',
        color: '#333',
        fontSize: '24px',
    },
    tagline: {
        margin: 0,
        color: '#666',
        fontSize: '14px',
    },
    formTitle: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '25px',
        fontSize: '20px',
        fontWeight: '500',
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
        padding: '12px 16px',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        fontSize: '14px',
        boxSizing: 'border-box',
        transition: 'border-color 0.3s',
        outline: 'none',
    },
    button: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '14px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'background-color 0.3s',
        marginTop: '10px',
    },
    footer: {
        marginTop: '25px',
        textAlign: 'center',
    },
    footerText: {
        color: '#666',
        fontSize: '14px',
        margin: 0,
    },
    link: {
        color: '#007bff',
        textDecoration: 'none',
        fontWeight: '500',
    },
};

export default LoginPage;