import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  position: string;
  companyName: string;
  phone: string;
  avatar: string | null;
  bio: string;
  department: string;
  employeeId: string;
  location: string;
  linkedin: string;
  joinedDate: string;
  loginProvider?: 'email' | 'google' | 'linkedin';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  socialLogin: (provider: 'google' | 'linkedin', profile: { fullName: string; email: string; avatar?: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  register: (userData: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('claritas_user');
      const savedAuth = localStorage.getItem('claritas_auth');
      if (savedUser && savedAuth === 'true') {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      }
    } catch {
      // Corrupted storage — clear it
      localStorage.removeItem('claritas_user');
      localStorage.removeItem('claritas_auth');
    }
  }, []);

  const persistUser = (userData: UserProfile, remember: boolean) => {
    try {
      const json = JSON.stringify(userData);
      if (remember) {
        localStorage.setItem('claritas_user', json);
        localStorage.setItem('claritas_auth', 'true');
      } else {
        sessionStorage.setItem('claritas_user', json);
        sessionStorage.setItem('claritas_auth', 'true');
      }
    } catch {
      // Storage full or blocked — continue without persistence
    }
  };

  const buildProfile = (overrides: Partial<UserProfile>): UserProfile => ({
    id: crypto.randomUUID(),
    fullName: '',
    email: '',
    position: 'HR Manager',
    companyName: '',
    phone: '',
    avatar: null,
    bio: '',
    department: 'Human Resources',
    employeeId: `CV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    location: 'India',
    linkedin: '',
    joinedDate: new Date().toISOString(),
    loginProvider: 'email',
    ...overrides,
  });

  /* ── Standard email + password login ── */
  const login = async (email: string, password: string, rememberMe: boolean): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 1000));

    if (email && password.length === 6) {
      let userData: UserProfile;
      try {
        const saved = localStorage.getItem('claritas_user');
        if (saved) {
          userData = { ...JSON.parse(saved), email, loginProvider: 'email' as const };
        } else {
          const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
          userData = buildProfile({ fullName: name, email, loginProvider: 'email' });
        }
      } catch {
        const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        userData = buildProfile({ fullName: name, email, loginProvider: 'email' });
      }

      setUser(userData);
      setIsAuthenticated(true);
      persistUser(userData, rememberMe);
      return true;
    }
    return false;
  };

  /* ── Social (Google / LinkedIn) login ── */
  const socialLogin = async (
    provider: 'google' | 'linkedin',
    profile: { fullName: string; email: string; avatar?: string },
  ): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 800));

    try {
      if (!profile.email) return false;

      const userData = buildProfile({
        fullName: profile.fullName || profile.email.split('@')[0],
        email: profile.email,
        avatar: profile.avatar || null,
        loginProvider: provider,
        companyName: provider === 'linkedin' ? 'Via LinkedIn' : '',
      });

      setUser(userData);
      setIsAuthenticated(true);
      persistUser(userData, true); // social logins always remembered
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('claritas_user');
      localStorage.removeItem('claritas_auth');
      sessionStorage.removeItem('claritas_user');
      sessionStorage.removeItem('claritas_auth');
    } catch {
      // ignore
    }
  };

  const register = (userData: Partial<UserProfile>) => {
    try {
      const newUser = buildProfile(userData);
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('claritas_user', JSON.stringify(newUser));
      localStorage.setItem('claritas_auth', 'true');
    } catch {
      // ignore
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      try {
        localStorage.setItem('claritas_user', JSON.stringify(updatedUser));
      } catch {
        // ignore
      }
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, socialLogin, logout, updateProfile, register }}>
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
