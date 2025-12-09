"use client";

import {
  AuthLoginResponse,
  AuthRegisterResponse,
  UserInterface,
} from "@/api/generated";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";

interface AuthContextType {
  user: UserInterface | null;
  login: (userData: AuthLoginResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserInterface | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
  }, []);

  const login = (userData: AuthLoginResponse) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(userData));
    }
    setUser(userData);
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
    setUser(null);
  };

  // Always provide the context, even before mount
  // This prevents the "useAuth must be used within an AuthProvider" error
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
