import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

/**
 * ✅ SECURITY FIX: AdminProtectedRoute component that checks admin-specific authentication
 * Uses dedicated AdminAuthContext to prevent regular users from accessing admin dashboard
 * 
 * Security checks:
 * 1. Validates admin session is active
 * 2. Checks user has ADMIN role
 * 3. Redirects unauthorized access to /admin-login
 * 4. Prevents race conditions with proper loading state handling
 */
export const AdminProtectedRoute = ({ children }) => {
  const { adminIsAuthenticated, adminLoading, adminUser } = useAdminAuth();

  // While loading, avoid redirect flicker/races
  if (adminLoading) {
    return null;
  }

  const isAuthorized = adminIsAuthenticated && adminUser?.role === 'ADMIN';
  if (!isAuthorized) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
