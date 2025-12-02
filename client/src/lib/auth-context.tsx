import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userType: 'architect' | 'editor' | null;
  token: string | null;
  login: (type: 'architect' | 'editor', token?: string) => void;
  logout: () => void;
  getAuthHeader: () => { Authorization: string } | {};
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'architect' | 'editor' | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedType = localStorage.getItem('authType') as 'architect' | 'editor' | null;
    if (savedToken && savedType) {
      setToken(savedToken);
      setUserType(savedType);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (type: 'architect' | 'editor', authToken?: string) => {
    setIsAuthenticated(true);
    setUserType(type);
    if (authToken) {
      setToken(authToken);
      localStorage.setItem('authToken', authToken);
    }
    localStorage.setItem('authType', type);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    setToken(null);
    localStorage.removeItem('authType');
    localStorage.removeItem('authToken');
  };

  const getAuthHeader = () => {
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, token, login, logout, getAuthHeader }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
