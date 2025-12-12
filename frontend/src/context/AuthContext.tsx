"use client";

import { UserInterface } from "@/api/generated";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { api } from "@/api/client";
import Cookies from "js-cookie";

// User type without sensitive tokens (tokens stored separately in cookies)
type UserWithoutTokens = Omit<UserInterface, "accessToken" | "refreshToken">;

interface AuthContextType {
  user: UserWithoutTokens | null;
  login: (userData: UserInterface) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

const TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
// Cookie options for security
const COOKIE_OPTIONS = {
  expires: 7, // 7 days (matches refresh token expiry)
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserWithoutTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount/refresh: Check for token and fetch user if exists
  useEffect(() => {
    const loadUser = async () => {
      if (typeof window === "undefined") {
        setIsLoading(false);
        return;
      }

      const token = Cookies.get(TOKEN_KEY);
      console.log(
        "🔍 [AuthContext] Checking for token:",
        token ? "✅ Token found" : "❌ No token"
      );

      if (!token) {
        console.log("❌ [AuthContext] No token found, skipping user load");
        setIsLoading(false);
        return;
      }

      // Token exists, validate it and fetch current user
      try {
        console.log("📞 [AuthContext] Calling /auth/me API with token...");
        // Call /auth/me to validate token and get fresh user data
        // authMeGet is a GET request, no body parameter needed
        const response = await api.auth.authMeGet();

        console.log("✅ [AuthContext] API response received:", response);
        console.log("📦 [AuthContext] Response data:", response.data);

        // Backend returns: { success: true, message: string, data: UserInterface }
        const responseData = response.data as any;
        if (responseData?.success && responseData?.data) {
          const userData = responseData.data as UserInterface;
          console.log("👤 [AuthContext] User data loaded:", userData);
          // Remove tokens from user object before storing in state
          const { accessToken, refreshToken, ...userWithoutTokens } = userData;
          setUser(userWithoutTokens);
        } else {
          console.warn(
            "⚠️ [AuthContext] Unexpected response format:",
            responseData
          );
        }
      } catch (error: any) {
        // Token is invalid or expired, remove it
        console.error("❌ [AuthContext] Failed to load user:", error);
        console.error("📋 [AuthContext] Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        Cookies.remove(TOKEN_KEY);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (userData: UserInterface) => {
    // Store accessToken in cookies

    console.log("userData.accessToken", userData.accessToken);
    if (typeof window !== "undefined" && userData.accessToken) {
      console.log("userData.accessToken sjdnanwiod");
      Cookies.set(TOKEN_KEY, userData.accessToken, COOKIE_OPTIONS);
      Cookies.set(REFRESH_TOKEN_KEY, userData.refreshToken, COOKIE_OPTIONS);
    }
    console.log("userData token storing  balal badlkasd");

    // Remove sensitive tokens from user object before storing in state
    const { accessToken, refreshToken, ...userWithoutTokens } = userData;
    setUser(userWithoutTokens);
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      Cookies.remove(TOKEN_KEY);
      Cookies.remove(REFRESH_TOKEN_KEY);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
