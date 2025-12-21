import { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api.js';

const AdminAuthContext = createContext();

/**
 * ✅ SECURITY FIX: Separate admin authentication context to prevent
 * mixing regular user sessions with admin sessions (CWE-613, CWE-639)
 */
export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [adminLoading, setAdminLoading] = useState(true);
  const [adminIsAuthenticated, setAdminIsAuthenticated] = useState(false);
  const [adminError, setAdminError] = useState(null);

  /**
   * ✅ SECURITY: Validates admin session by calling dedicated admin validation endpoint
   * This ensures regular users cannot access admin dashboard
   */
  const validateAdminSession = async () => {
    try {
      console.log('🔍 Validating admin session...');
      const response = await fetch(`${API_BASE_URL}/api/customers/validate-admin-session`, {
        method: 'GET',
        credentials: 'include'
      });

      console.log('Admin session validation - Status:', response.status);

      if (response.ok) {
        // Admin session is valid
        const userData = await response.json();
        console.log('✅ Admin session valid, user data:', userData);
        setAdminUser(userData);
        setAdminIsAuthenticated(true);
        setAdminError(null);
        return true;
      } else {
        // Session is invalid or user is not admin
        console.log('❌ Admin session invalid - status:', response.status);
        setAdminIsAuthenticated(false);
        setAdminUser(null);
        
        if (response.status === 403) {
          setAdminError('Admin privileges required');
        } else {
          setAdminError('Not authenticated');
        }
        return false;
      }
    } catch (error) {
      console.error('❌ Admin session validation error:', error);
      setAdminIsAuthenticated(false);
      setAdminUser(null);
      setAdminError('Session validation failed');
      return false;
    }
  };

  /**
   * ✅ SECURITY: Check admin session on app load
   * This runs once when the admin provider is mounted
   */
  useEffect(() => {
    const init = async () => {
      console.log('🚀 AdminAuthContext initializing - validating admin session...');
      await validateAdminSession();
      console.log('📊 Setting admin loading to false');
      setAdminLoading(false);
    };
    init();
  }, []);

  /**
   * ✅ SECURITY: Validate admin session every 5 minutes if authenticated
   * This ensures the admin session is still valid
   */
  useEffect(() => {
    if (!adminIsAuthenticated) return;

    const interval = setInterval(() => {
      console.log('🔄 Periodic admin session validation...');
      validateAdminSession();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [adminIsAuthenticated]);

  /**
   * ✅ SECURITY: Admin logout - invalidates server-side session
   */
  const adminLogout = async () => {
    try {
      console.log('🔒 Admin logout initiated...');
      // Call backend logout endpoint to invalidate session
      await fetch(`${API_BASE_URL}/api/customers/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      console.log('✅ Admin logged out');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear frontend state
      setAdminUser(null);
      setAdminIsAuthenticated(false);
      setAdminError(null);
      
      // Security: Clear browser history to prevent back navigation to authenticated pages
      // Replace all previous history entries
      window.history.pushState(null, '', window.location.href);
      window.addEventListener('popstate', () => {
        window.history.pushState(null, '', window.location.href);
      });
    }
  };

  const value = {
    adminUser,
    adminIsAuthenticated,
    adminLoading,
    adminError,
    validateAdminSession,
    adminLogout
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

/**
 * ✅ SECURITY: Custom hook to use admin authentication context
 * Ensures context is only used within AdminAuthProvider
 */
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export default AdminAuthContext;
