import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";

import { auth } from "../firebase";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  password?: string;
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
  loginProvider?: "email" | "google" | "linkedin";
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  socialLogin: (provider: "google" | "linkedin", profile: { fullName: string; email: string; avatar?: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
  register: (userData: Partial<UserProfile>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("claritas_user");
      const savedAuth = localStorage.getItem("claritas_auth");
      if (savedUser && savedAuth === "true") {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      }
    } catch {
      localStorage.removeItem("claritas_user");
      localStorage.removeItem("claritas_auth");
    }
  }, []);

  const persistUser = (userData: UserProfile, remember: boolean) => {
    const json = JSON.stringify(userData);
    if (remember) {
      localStorage.setItem("claritas_user", json);
      localStorage.setItem("claritas_auth", "true");
    } else {
      sessionStorage.setItem("claritas_user", json);
      sessionStorage.setItem("claritas_auth", "true");
    }
  };

  const buildProfile = (overrides: Partial<UserProfile>): UserProfile => ({
    id: crypto.randomUUID(),
    fullName: "",
    email: "",
    position: "HR Manager",
    companyName: "",
    phone: "",
    avatar: null,
    bio: "",
    department: "Human Resources",
    employeeId: `CV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    location: "India",
    linkedin: "",
    joinedDate: new Date().toISOString(),
    loginProvider: "email",
    ...overrides,
  });

  /* LOGIN */
  const login = async (email: string, password: string, rememberMe: boolean): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      if (!firebaseUser.emailVerified) {
        alert("Please verify your email before login.");
        await signOut(auth);
        return false;
      }

      const userData = buildProfile({
        fullName: firebaseUser.displayName || "",
        email: firebaseUser.email || "",
        loginProvider: "email",
      });

      setUser(userData);
      setIsAuthenticated(true);
      persistUser(userData, rememberMe);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  /* REGISTER */
const register = async (userData: Partial<UserProfile>): Promise<boolean> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email || "",
      userData.password || ""
    );

    await sendEmailVerification(userCredential.user);
    await signOut(auth); // turant sign out karo

    return true;

  } catch (error: any) {
    console.log(error.code, error.message);
    return false;
  }
};
  /* SOCIAL LOGIN */
  const socialLogin = async (
    provider: "google" | "linkedin",
    profile: { fullName: string; email: string; avatar?: string }
  ): Promise<boolean> => {
    try {
      const userData = buildProfile({
        fullName: profile.fullName,
        email: profile.email,
        avatar: profile.avatar || null,
        loginProvider: provider,
      });
      setUser(userData);
      setIsAuthenticated(true);
      persistUser(userData, true);
      return true;
    } catch {
      return false;
    }
  };

  /* LOGOUT */
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("claritas_user");
    localStorage.removeItem("claritas_auth");
    sessionStorage.removeItem("claritas_user");
    sessionStorage.removeItem("claritas_auth");
  };

  /* UPDATE PROFILE */
  const updateProfile = (updates: Partial<UserProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem("claritas_user", JSON.stringify(updatedUser));
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
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}