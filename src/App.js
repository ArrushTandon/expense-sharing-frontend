import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import GroupsPage from './pages/GroupsPage';
import CreateGroupPage from './pages/CreateGroupPage';
import GroupDetailPage from './pages/GroupDetailPage';
import CreateExpensePage from './pages/CreateExpensePage';
import BalancesPage from './pages/BalancesPage';
import ProfilePage from './pages/ProfilePage';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Protected Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/groups"
                        element={
                            <ProtectedRoute>
                                <GroupsPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/groups/new"
                        element={
                            <ProtectedRoute>
                                <CreateGroupPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/groups/:groupId"
                        element={
                            <ProtectedRoute>
                                <GroupDetailPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/groups/:groupId/expenses/new"
                        element={
                            <ProtectedRoute>
                                <CreateExpensePage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/balances"
                        element={
                            <ProtectedRoute>
                                <BalancesPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Redirect root to dashboard */}
                    <Route
                        path="/"
                        element={<Navigate to="/dashboard" replace />}
                    />

                    {/* 404 - Route not found */}
                    <Route
                        path="*"
                        element={
                            <div style={styles.notFound}>
                                <h1>404</h1>
                                <p>Page Not Found</p>
                                <a href="/dashboard" style={styles.link}>Go to Dashboard</a>
                            </div>
                        }
                    />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

const styles = {
    notFound: {
        textAlign: 'center',
        padding: '100px 20px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    link: {
        color: '#007bff',
        textDecoration: 'none',
        fontSize: '18px',
        marginTop: '20px',
    },
};

export default App;