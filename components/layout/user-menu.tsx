"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LogOut, User as UserIcon, Shield, Settings, BookOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    setShowMenu(false);
  };

  const getPermissionLabel = (permission: string) => {
    switch (permission) {
      case "admin":
      case "admin_operational_officer":
        return "Admin Operational Officer";
      case "operational_officer":
        return "Operational Officer";
      case "privileged_user":
        return "Privileged User";
      default:
        // Handle granular privileged permissions
        if (permission.startsWith("privileged_")) {
          return permission
            .replace("privileged_", "")
            .replace("_view", "")
            .replace(/_/g, " ")
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ") + " Access";
        }
        return permission;
    }
  };

  const primaryPermission = user.permissions.includes("admin")
    ? "admin"
    : user.permissions[0] || "";

  return (
    <div className="relative">
      {/* User Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.06]"
        title={user.fullName}
      >
        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${
          "bg-[#4e86fd]/10 border-[#4e86fd]/20 dark:bg-[#0EA5E9]/10 dark:border-[#0EA5E9]/20"
        }`}>
          <UserIcon className={`h-4 w-4 ${"text-[#4e86fd] dark:text-[#0EA5E9]"}`} />
        </div>
        <div className="hidden lg:block text-left">
          <p className={`text-sm font-medium leading-none ${"text-slate-900 dark:text-white"}`}>{user.fullName}</p>
          <p className={`text-xs leading-none mt-1 ${"text-slate-500 dark:text-slate-400"}`}>
            {getPermissionLabel(primaryPermission)}
          </p>
        </div>
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />

          {/* Menu */}
          <div className={`absolute right-0 mt-2 w-72 backdrop-blur-xl border rounded-xl shadow-2xl z-50 overflow-hidden ${
            "bg-white/95 border-slate-200 dark:bg-slate-900/95 dark:border-white/10"
          }`}>
            {/* User Info */}
            <div className={`p-4 border-b ${"border-slate-200 dark:border-white/10"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${
                  "bg-[#4e86fd]/10 border-[#4e86fd]/20 dark:bg-[#0EA5E9]/10 dark:border-[#0EA5E9]/20"
                }`}>
                  <UserIcon className={`h-6 w-6 ${"text-[#4e86fd] dark:text-[#0EA5E9]"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${"text-slate-900 dark:text-white"}`}>
                    {user.fullName}
                  </p>
                  <p className={`text-xs truncate ${"text-slate-500 dark:text-slate-400"}`}>
                    {user.accountNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className={`p-4 border-b ${"border-slate-200 dark:border-white/10"}`}>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${"text-slate-500 dark:text-slate-400"}`}>
                Permissions
              </p>
              <div className="flex flex-wrap gap-2">
                {user.permissions.map((permission) => (
                  <div
                    key={permission}
                    className={`flex items-center gap-1.5 px-2.5 py-1 border rounded-lg ${
                      "bg-[#4e86fd]/10 border-[#4e86fd]/20 dark:bg-[#0EA5E9]/10 dark:border-[#0EA5E9]/20"
                    }`}
                  >
                    <Shield className={`h-3 w-3 ${"text-[#4e86fd] dark:text-[#0EA5E9]"}`} />
                    <span className={`text-xs font-medium ${"text-[#4e86fd] dark:text-[#0EA5E9]"}`}>
                      {getPermissionLabel(permission)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Menu Items */}
            <div className={`p-2 border-b space-y-1 ${"border-slate-200 dark:border-white/10"}`}>
              {(user.permissions.includes("admin_operational_officer") || user.permissions.includes("admin")) && (
                <Link
                  href="/dashboard/config"
                  onClick={() => setShowMenu(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline ${
                    "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/[0.06]"
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  System Settings
                </Link>
              )}
              <Link
                href="/docs"
                onClick={() => setShowMenu(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline ${
                  "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/[0.06]"
                }`}
              >
                <BookOpen className="h-4 w-4" />
                User Guide
              </Link>
            </div>

            {/* Actions */}
            <div className="p-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
