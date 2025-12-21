import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

/**
 * ✅ SECURITY FIX: Enhanced ProtectedRoute component
 * - Validates session on every route access
 * - Prevents authentication bypass vulnerabilities
 * - Redirects unauthenticated users to login with return URL
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, validateSession } = useAuth();
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);

  // Revalidate session when accessing protected route
  useEffect(() => {
    const revalidate = async () => {
      console.log('🔒 ProtectedRoute: Revalidating session for', location.pathname);
      setIsValidating(true);
      await validateSession();
      setIsValidating(false);
    };
    revalidate();
  }, [location.pathname]);

  // Show loading while initial auth check or revalidation is in progress
  if (loading || isValidating) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        🔐 Verifying authentication...
      </div>
    );
  }

  // Redirect to login if not authenticated, preserving intended destination
  if (!isAuthenticated) {
    console.log('❌ ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render the protected component
  console.log('✅ ProtectedRoute: Authenticated, rendering protected content');
  return children;
};

export default ProtectedRoute;
