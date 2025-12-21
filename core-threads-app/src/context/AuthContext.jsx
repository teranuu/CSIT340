import { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const validateSession = async () => {
    try {
      console.log('🔍 Validating session...');
      const response = await fetch(`${API_BASE_URL}/api/customers/validate-session?t=${Date.now()}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });

      if (response.ok) {
        // Session is valid - fetch user data including role
        const userData = await response.json();
        console.log('✅ Session valid, user data:', userData);
        setUser(userData);
        setIsAuthenticated(true);
        
        // Try to enrich with seller profile (store name) if present
        try {
          const sellerRes = await fetch(`${API_BASE_URL}/api/sellers/me`, {
            method: 'GET',
            credentials: 'include'
          });
          if (sellerRes.ok) {
            const seller = await sellerRes.json();
            setUser((prev) => ({ ...prev, storeName: seller.storeName, sellerId: seller.sellerId }));
          }
        } catch (e) {
          console.warn('Unable to fetch seller profile for session user');
        }
        return true;
      } else {
        // Session is invalid, clear frontend state
        console.log('❌ Session invalid - status:', response.status);
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('❌ Session validation error:', error);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  };

  // Validate on app load
  useEffect(() => {
    const init = async () => {
      console.log('🚀 App loading - validating session...');
      await validateSession();
      console.log('📊 Setting loading to false');
      setLoading(false);
    };
    init();
  }, []);

  // Validate session every 5 minutes
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(validateSession, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/customers/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        // Store user data including role
        setUser(data);
        // Enrich login payload with seller profile if available
        try {
          const sellerRes = await fetch(`${API_BASE_URL}/api/sellers/me`, {
            method: 'GET',
            credentials: 'include'
          });
          if (sellerRes.ok) {
            const seller = await sellerRes.json();
            setUser((prev) => ({ ...prev, storeName: seller.storeName, sellerId: seller.sellerId }));
          }
        } catch (e) {
          console.warn('Unable to fetch seller profile after login');
        }
        setIsAuthenticated(true);
        return { success: true };
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Login failed' }));
        return { success: false, error: errorData.error || 'Invalid username or password' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Unable to reach server. Please try again.' };
    }
  };

  const register = async (customerData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/customers/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(customerData)
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Registration failed' }));
        return { success: false, error: errorData.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Unable to reach server. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint to invalidate session
      await fetch(`${API_BASE_URL}/api/customers/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear frontend state - no localStorage to clean up
      setUser(null);
      setIsAuthenticated(false);
      
      // Security: Clear browser history to prevent back navigation to authenticated pages
      // Replace all previous history entries with the login page
      window.history.pushState(null, '', window.location.href);
      window.addEventListener('popstate', () => {
        window.history.pushState(null, '', window.location.href);
      });
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    validateSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
