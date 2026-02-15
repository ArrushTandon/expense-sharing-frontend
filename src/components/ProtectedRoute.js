import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <p>Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated()) {
        // Security: Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && !isAdmin()) {
        // Security: Redirect if admin access required but user is not admin
        alert('Access denied. Admin privileges required.');
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;