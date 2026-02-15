import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../api/authService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!formData.name || !formData.email || !formData.password) {
                throw new Error('Please fill in all required fields');
            }

            if (formData.password !== formData.confirmPassword) {
                throw new Error('Passwords do not match');
            }

            if (formData.password.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                throw new Error('Please enter a valid email address');
            }

            const response = await authService.register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
            });

            const success = login(response.token, {
                id: response.userId,
                email: response.email,
                name: response.name,
            });

            if (success) {
                navigate('/dashboard');
            } else {
                throw new Error('Registration successful but login failed');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <LoadingSpinner message="Creating your account..." />
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.logoSection}>
                    <div style={styles.logo}>💰</div>
                    <h2 style={styles.appName}>Expense Sharing</h2>
                    <p style={styles.tagline}>Join thousands managing expenses</p>
                </div>

                <h3 style={styles.formTitle}>Create Your Account</h3>

                <ErrorAlert error={error} onClose={() => setError('')} />

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Full Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            style={styles.input}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email Address *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            style={styles.input}
                            required
                            disabled={loading}
                            autoComplete="email"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Phone Number (Optional)</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            style={styles.input}
                            disabled={loading}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password *</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="At least 6 characters"
                            style={styles.input}
                            required
                            disabled={loading}
                            autoComplete="new-password"
                        />
                        <small style={styles.hint}>
                            {formData.password.length > 0 && formData.password.length < 6 && (
                                <span style={{ color: '#dc3545' }}>
                  Password too short ({formData.password.length}/6)
                </span>
                            )}
                            {formData.password.length >= 6 && (
                                <span style={{ color: '#28a745' }}>✓ Strong password</span>
                            )}
                        </small>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Confirm Password *</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Re-enter your password"
                            style={styles.input}
                            required
                            disabled={loading}
                            autoComplete="new-password"
                        />
                        <small style={styles.hint}>
                            {formData.confirmPassword.length > 0 && (
                                formData.password === formData.confirmPassword ? (
                                    <span style={{ color: '#28a745' }}>✓ Passwords match</span>
                                ) : (
                                    <span style={{ color: '#dc3545' }}>✗ Passwords don't match</span>
                                )
                            )}
                        </small>
                    </div>

                    <button
                        type="submit"
                        style={styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div style={styles.footer}>
                    <p style={styles.footerText}>
                        Already have an account?{' '}
                        <Link to="/login" style={styles.link}>
                            Sign in here
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
        maxWidth: '480px',
        animation: 'fadeIn 0.5s ease-out',
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
        marginBottom: '18px',
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
    hint: {
        display: 'block',
        marginTop: '5px',
        fontSize: '12px',
    },
    button: {
        backgroundColor: '#28a745',
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

// Responsive styles
if (window.innerWidth <= 768) {
    styles.card.padding = '30px 20px';
    styles.card.maxWidth = '100%';
}

export default RegisterPage;