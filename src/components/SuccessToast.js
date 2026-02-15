import React, { useEffect } from 'react';

const SuccessToast = ({ message, onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onClose) onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration]);

    if (!message) return null;

    return (
        <div style={styles.container}>
            <div style={styles.icon}>✓</div>
            <p style={styles.message}>{message}</p>
        </div>
    );
};

const styles = {
    container: {
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: '#d4edda',
        border: '1px solid #c3e6cb',
        borderRadius: '8px',
        padding: '15px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 1000,
        animation: 'slideInRight 0.3s ease-out',
    },
    icon: {
        width: '24px',
        height: '24px',
        backgroundColor: '#28a745',
        color: 'white',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
    },
    message: {
        margin: 0,
        color: '#155724',
        fontSize: '14px',
        fontWeight: '500',
    },
};

export default SuccessToast;