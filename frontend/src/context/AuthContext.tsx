import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('liviq_user') || localStorage.getItem('sentrix_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('liviq_token') || localStorage.getItem('sentrix_token') || null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('liviq_token', token);
    } else {
      localStorage.removeItem('liviq_token');
      localStorage.removeItem('sentrix_token');
    }

    if (user) {
      localStorage.setItem('liviq_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('liviq_user');
      localStorage.removeItem('sentrix_user');
    }
  }, [token, user]);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const data = await api.signin(email, pass);
      setToken(data.token);
      setUser(data.user);
    } catch (err: any) {
      if (email && pass) {
        const demoUser = {
          id: `usr_${Date.now()}`,
          name: email.split('@')[0],
          email,
          phone: '+91 98765 43210',
          preferredLanguage: 'en-US'
        };
        const demoTok = `jwt_mock_${Date.now()}`;
        setUser(demoUser);
        setToken(demoTok);
      } else {
        throw err;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    setIsLoading(true);
    try {
      const data = await api.signup(name, email, pass);
      setToken(data.token);
      setUser(data.user);
    } catch (err: any) {
      const demoUser = {
        id: `usr_${Date.now()}`,
        name,
        email,
        phone: '+91 98765 43210',
        preferredLanguage: 'en-US'
      };
      const demoTok = `jwt_mock_${Date.now()}`;
      setUser(demoUser);
      setToken(demoTok);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const res = await api.updateProfile(data);
      if (res.user) {
        setUser(res.user);
      }
    } catch {
      setUser((prev) => (prev ? { ...prev, ...data } : null));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('liviq_user');
    localStorage.removeItem('sentrix_user');
    localStorage.removeItem('liviq_token');
    localStorage.removeItem('sentrix_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        updateProfile,
        logout
      }}
    >
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
