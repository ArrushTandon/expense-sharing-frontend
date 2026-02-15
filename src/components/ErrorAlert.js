import React from 'react';

const ErrorAlert = ({ error, onClose }) => {
    if (!error) return null;

    return (
        <div style={styles.container}>
            <div style={styles.icon}>⚠️</div>
            <div style={styles.content}>
                <h3 style={styles.title}>Oops! Something went wrong</h3>
                <p style={styles.message}>{error}</p>
            </div>
            {onClose && (
                <button onClick={onClose} style={styles.closeButton}>
                    ✕
                </button>
            )}
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#fee',
        border: '1px solid #fcc',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '15px',
        animation: 'slideIn 0.3s ease-out',
    },
    icon: {
        fontSize: '24px',
    },
    content: {
        flex: 1,
    },
    title: {
        margin: '0 0 5px 0',
        color: '#c33',
        fontSize: '16px',
    },
    message: {
        margin: 0,
        color: '#c33',
        fontSize: '14px',
    },
    closeButton: {
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '20px',
        color: '#c33',
        cursor: 'pointer',
        padding: '0',
        width: '24px',
        height: '24px',
    },
};

export default ErrorAlert;