'use client';

import apiService from '@/services/api';
import { usePathname, useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'driver' | 'passenger';
  busNumber?: string;
  routeAssignment?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'admin' | 'driver') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthenticationWrapper');
  }
  return context;
};

interface AuthenticationWrapperProps {
  children: React.ReactNode;
}

const AuthenticationWrapper = ({ children }: AuthenticationWrapperProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Protected routes that require authentication
  const protectedRoutes = [
    '/admin-dashboard',
    '/driver-management', 
    '/schedule-management',
    '/driver-dashboard'
  ];

  // Admin-only routes
  const adminRoutes = [
    '/admin-dashboard',
    '/driver-management',
    '/schedule-management'
  ];

  // Driver-only routes
  const driverRoutes = [
    '/driver-dashboard'
  ];

  // Public routes that don't require authentication
  const publicRoutes = [
    '/passenger-portal',
    '/admin-login'
  ];

  useEffect(() => {
    // Check for existing session on mount
    checkAuthStatus();
  }, []);

  useEffect(() => {
    // Handle route protection
    if (!isLoading) {
      handleRouteProtection();
    }
  }, [pathname, user, isLoading]);

  const checkAuthStatus = async () => {
    try {
      // Check localStorage for existing session
      const storedUser = localStorage.getItem('ethiobus_user');
      const storedToken = localStorage.getItem('ethiobus_token');

      if (storedUser && storedToken) {
        // Verify token with backend
        try {
          const response = await apiService.getCurrentUser();
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('ethiobus_user');
            localStorage.removeItem('ethiobus_token');
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          // Clear invalid session data
          localStorage.removeItem('ethiobus_user');
          localStorage.removeItem('ethiobus_token');
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRouteProtection = () => {
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute && !user) {
      // Redirect to login if accessing protected route without authentication
      router.push('/admin-login');
      return;
    }

    if (user) {
      // Check role-based access
      const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
      const isDriverRoute = driverRoutes.some(route => pathname.startsWith(route));

      if (isAdminRoute && user.role !== 'admin') {
        // Redirect admin routes to appropriate dashboard
        if (user.role === 'driver') {
          router.push('/driver-dashboard');
        } else {
          router.push('/passenger-portal');
        }
        return;
      }

      if (isDriverRoute && user.role !== 'driver') {
        // Redirect driver routes to appropriate dashboard
        if (user.role === 'admin') {
          router.push('/admin-dashboard');
        } else {
          router.push('/passenger-portal');
        }
        return;
      }

      // Redirect authenticated users away from login page
      if (pathname === '/admin-login') {
        if (user.role === 'admin') {
          router.push('/admin-dashboard');
        } else if (user.role === 'driver') {
          router.push('/driver-dashboard');
        } else {
          router.push('/passenger-portal');
        }
        return;
      }
    }
  };

  const login = async (email: string, password: string, role: 'admin' | 'driver'): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await apiService.login(email, password, role);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        
        // Redirect based on role
        if (role === 'admin') {
          router.push('/admin-dashboard');
        } else if (role === 'driver') {
          router.push('/driver-dashboard');
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      // Redirect to login or public page
      router.push('/admin-login');
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-6 h-6 bg-primary-foreground rounded opacity-75"></div>
          </div>
          <p className="text-text-secondary">Loading EthioBus...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthenticationWrapper;