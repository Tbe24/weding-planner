import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for authentication state and operations
 * @returns {Object} Authentication state and methods
 */
const useAuth = () => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = () => {
      setIsLoading(true);
      
      // Check both localStorage and sessionStorage for auth data
      const storageToken = localStorage.getItem('token') || sessionStorage.getItem('token');
      const storageUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      
      if (storageToken) {
        setToken(storageToken);
        setIsAuthenticated(true);
        
        if (storageUser) {
          try {
            setUser(JSON.parse(storageUser));
          } catch (error) {
            console.error('Error parsing user data:', error);
          }
        }
      }
      
      setIsLoading(false);
    };
    
    initAuth();
  }, []);

  /**
   * Log out the current user
   */
  const logout = useCallback(() => {
    // Clear auth data from both storage types
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('userRole');
    
    // Update state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  /**
   * Update auth state after login
   * @param {Object} authData - Authentication data from login response
   * @param {boolean} rememberMe - Whether to store in localStorage (true) or sessionStorage (false)
   */
  const login = useCallback((authData, rememberMe = false) => {
    if (!authData || !authData.token) {
      console.error('Invalid auth data provided to login');
      return;
    }
    
    // Choose storage based on rememberMe
    const storage = rememberMe ? localStorage : sessionStorage;
    
    // Store auth data
    storage.setItem('token', authData.token);
    if (authData.user) {
      storage.setItem('user', JSON.stringify(authData.user));
      storage.setItem('userRole', authData.user.role);
    }
    
    // Update state
    setToken(authData.token);
    setUser(authData.user || null);
    setIsAuthenticated(true);
  }, []);

  /**
   * Check if the current user has a specific role
   * @param {string|Array} roles - Role or array of roles to check
   * @returns {boolean} Whether the user has the specified role
   */
  const hasRole = useCallback((roles) => {
    if (!user || !user.role) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    
    return user.role === roles;
  }, [user]);

  return {
    token,
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    hasRole
  };
};

export default useAuth;
