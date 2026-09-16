import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  quickLogin: (email: string) => Promise<boolean>;
  updateUser: (updatedFields: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('cms_jwt_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('cms_jwt_token');
      if (savedToken) {
        try {
          const res = await api.getMe(savedToken);
          if (res.success && res.user) {
            let userData = res.user;
            const savedCustom = localStorage.getItem(`cms_user_profile_${userData.id}`);
            if (savedCustom) {
              try {
                userData = { ...userData, ...JSON.parse(savedCustom) };
              } catch {}
            }
            setUser(userData);
            setToken(savedToken);
          } else {
            localStorage.removeItem('cms_jwt_token');
            setToken(null);
            setUser(null);
          }
        } catch {
          // Token expired or server restarted
          localStorage.removeItem('cms_jwt_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const res = await api.login(email, pass);
      if (res.success && res.token && res.user) {
        let userData = res.user;
        const savedCustom = localStorage.getItem(`cms_user_profile_${userData.id}`);
        if (savedCustom) {
          try {
            userData = { ...userData, ...JSON.parse(savedCustom) };
          } catch {}
        }
        setToken(res.token);
        setUser(userData);
        localStorage.setItem('cms_jwt_token', res.token);
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error' };
    }
  };

  const quickLogin = async (email: string) => {
    const res = await login(email, 'password123');
    return res.success;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cms_jwt_token');
  };

  const updateUser = (updatedFields: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      try {
        localStorage.setItem(`cms_user_profile_${updated.id}`, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save updated profile to storage', e);
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user ? user.role : null,
        isAuthenticated: Boolean(user && token),
        isLoading,
        login,
        logout,
        quickLogin,
        updateUser,
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
