"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
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
        if (data.success && data.user && data.user.permissions?.length > 0) {
          setUser(data.user);
          return;
        }
      }

      // If user session is invalid, account was deleted, or all permissions were revoked
      setUser(null);

      // If currently on a dashboard route, immediately boot user to /login
      if (typeof window !== "undefined" && window.location.pathname.startsWith("/dashboard")) {
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Session check error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkSession();

    // Check session on window focus (e.g. when user switches tabs after an admin made changes)
    const handleFocus = () => {
      checkSession();
    };

    // Heartbeat check every 10 seconds to detect deleted or revoked accounts in real-time
    const interval = setInterval(() => {
      checkSession();
    }, 10000);

    window.addEventListener("focus", handleFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
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
