import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext: Checking for existing user...');
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    console.log('AuthContext: Token:', token);
    console.log('AuthContext: User data:', userData);
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('AuthContext: Setting user:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  // Monitor user state changes
  useEffect(() => {
    console.log('AuthContext: User state changed:', user);
  }, [user]);

  const login = (username: string, password: string) => {
    console.log('AuthContext login called:', { username, password });
    
    if ((username === 'admin' && password === 'admin123') || 
        (username === 'user' && password === 'user123')) {
      const userData = {
        id: 1,
        username,
        email: `${username}@example.com`,
        role: username === 'admin' ? 'ADMIN' : 'USER'
      };
      
      localStorage.setItem('token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      console.log('User set in context:', userData);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
