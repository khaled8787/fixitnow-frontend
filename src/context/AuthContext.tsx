
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import api from "@/lib/axios";
import {
  getAccessToken,
  removeAccessToken,
} from "@/lib/auth";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  image?: string | null;
  role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
  status?: "ACTIVE" | "BANNED";
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  setAuthenticatedUser: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<
  AuthContextValue | undefined
>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    const token = getAccessToken();

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get(
        "/api/api/auth/me",
      );

      setUser(response.data?.data ?? null);
    } catch {
      removeAccessToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const setAuthenticatedUser = (authenticatedUser: User) => {
    setUser(authenticatedUser);
  };

  const logout = () => {
    removeAccessToken();
    setUser(null);
  };

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    refreshUser,
    setAuthenticatedUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
}
