import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

interface User {
  id: number;
  email: string;
  username?: string;
  fullname?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    const token = window.localStorage.getItem('accessToken');
    if (token) {
      return token.split('; ')[0];
    }
    return null;
  };

  const refreshUser = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/api/auth/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.user && data.user.sub) {
        setUser({
          id: typeof data.user.sub === 'string' ? parseInt(data.user.sub, 10) : data.user.sub,
          email: data.user.email || '',
          username: data.user.username,
          fullname: data.user.fullname,
        });
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      // Check if response is ok before trying to parse JSON
      if (!res.ok) {
        let errorMessage = 'Login failed';
        try {
          const errorBody = await res.json();
          errorMessage = errorBody?.message || errorMessage;
        } catch {
          // If JSON parsing fails, use status text
          errorMessage = res.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const body = await res.json();
      
      // Check if login was successful
      if (body.status === 'error') {
        throw new Error(body.message || 'Login failed');
      }

      // Store token from response (backend now returns token directly)
      if (body.token) {
        localStorage.setItem('accessToken', body.token);
      }

      // Refresh user to update auth state
      await refreshUser();
    } catch (err) {
      // Re-throw with better error message for network errors
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        throw new Error('Cannot connect to server. Please make sure the backend is running.');
      }
      throw err;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

