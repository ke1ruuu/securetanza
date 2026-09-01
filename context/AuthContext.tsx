"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: number;
  accountNumber: string;
  fullName: string;
  permissions: string[];
  mustChangePassword?: boolean;
  defaultLandingPage?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Track if user was ever loaded in this browser session
  const userRef = useRef<User | null>(null);
  userRef.current = user;

  const checkSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user && Array.isArray(data.user.permissions) && data.user.permissions.length > 0) {
          setUser(data.user);
          return data.user;
        }
      }

      // If user session is invalid, account was deleted, or all permissions were revoked
      const hadPriorSession = userRef.current !== null;
      setUser(null);

      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        // If user was logged in previously OR is currently on any protected page:
        if (hadPriorSession || currentPath.startsWith("/dashboard") || currentPath === "/") {
          if (currentPath !== "/login") {
            console.warn("🔒 User access revoked or account removed. Automatically redirecting to auth page...");
            window.location.replace("/login");
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Session check error:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();

    // Check session on window focus and visibility change (e.g. when user switches tabs after admin revoked access)
    const handleFocus = () => {
      checkSession();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkSession();
      }
    };

    // Fast heartbeat check every 2.5 seconds to detect revoked access in real-time
    const interval = setInterval(() => {
      checkSession();
    }, 2500);

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [checkSession]);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      setUser(null);
      window.location.replace("/login");
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission) || user.permissions.includes("admin");
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user || !user.permissions) return false;
    if (user.permissions.includes("admin")) return true;
    return permissions.some(permission => user.permissions.includes(permission));
  };

  const isAdmin = (): boolean => {
    return hasPermission("admin") || hasPermission("admin_operational_officer");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        logout,
        refreshSession: checkSession,
        hasPermission,
        hasAnyPermission,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
