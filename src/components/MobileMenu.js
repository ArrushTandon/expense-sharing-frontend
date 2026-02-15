import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MobileMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
            navigate('/login');
        }
    };

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={styles.hamburger}
                className="show-mobile-only"
            >
                {isOpen ? '✕' : '☰'}
            </button>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div style={styles.overlay} onClick={() => setIsOpen(false)}>
                    <div style={styles.menu} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.menuHeader}>
                            <div style={styles.avatar}>{user.name.charAt(0).toUpperCase()}</div>
                            <div>
                                <div style={styles.userName}>{user.name}</div>
                                <div style={styles.userEmail}>{user.email}</div>
                            </div>
                        </div>

                        <nav style={styles.nav}>
                            <button onClick={() => handleNavigate('/dashboard')} style={styles.navItem}>
                                🏠 Dashboard
                            </button>
                            <button onClick={() => handleNavigate('/groups')} style={styles.navItem}>
                                👥 Groups
                            </button>
                            <button onClick={() => handleNavigate('/balances')} style={styles.navItem}>
                                💰 Balances
                            </button>
                            <button onClick={() => handleNavigate('/profile')} style={styles.navItem}>
                                👤 Profile
                            </button>
                            <button onClick={handleLogout} style={styles.logoutItem}>
                                🚪 Logout
                            </button>
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
};

const styles = {
    hamburger: {
        display: 'none',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '8px',
        fontSize: '24px',
        cursor: 'pointer',
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1001,
    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease-out',
    },
    menu: {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '280px',
        maxWidth: '80%',
        backgroundColor: 'white',
        boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
        animation: 'slideInRight 0.3s ease-out',
        overflowY: 'auto',
    },
    menuHeader: {
        padding: '30px 20px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
    },
    avatar: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: '#007bff',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
    },
    userName: {
        fontWeight: '600',
        color: '#333',
        fontSize: '16px',
    },
    userEmail: {
        fontSize: '13px',
        color: '#666',
        marginTop: '3px',
    },
    nav: {
        padding: '20px 0',
    },
    navItem: {
        width: '100%',
        padding: '15px 20px',
        border: 'none',
        backgroundColor: 'transparent',
        textAlign: 'left',
        fontSize: '16px',
        color: '#333',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        transition: 'background-color 0.2s',
    },
    logoutItem: {
        width: '100%',
        padding: '15px 20px',
        border: 'none',
        backgroundColor: 'transparent',
        textAlign: 'left',
        fontSize: '16px',
        color: '#dc3545',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginTop: '20px',
        borderTop: '1px solid #e0e0e0',
    },
};


export default MobileMenu;