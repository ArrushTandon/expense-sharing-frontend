import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
    return (
        <div style={styles.container}>
            <div style={styles.spinner}></div>
            <p style={styles.message}>{message}</p>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
    },
    spinner: {
        width: '50px',
        height: '50px',
        border: '5px solid #f3f3f3',
        borderTop: '5px solid #007bff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    message: {
        marginTop: '20px',
        color: '#666',
        fontSize: '16px',
    },
};

// Add keyframe animation
const styleSheet = document.styleSheets[0];
const keyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

export default LoadingSpinner;