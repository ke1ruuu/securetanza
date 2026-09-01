"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, User, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ForceChangePasswordModal } from "@/components/modals/ForceChangePasswordModal";

export default function LoginPage() {
  const router = useRouter();
  const { refreshSession, user, loading: authLoading } = useAuth();
  const [accountNumber, setAccountNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForceChange, setShowForceChange] = useState(false);

  // If user is already logged in but needs to change password, show modal
  React.useEffect(() => {
    if (user && user.mustChangePassword) {
      setShowForceChange(true);
    } else if (user && !user.mustChangePassword && !authLoading) {
      const pref = user.defaultLandingPage || (typeof window !== "undefined" ? localStorage.getItem("landingPage") : null);
      let target = "/";
      if (pref === "dashboard") target = "/dashboard/overview";
      if (pref === "analytics") target = "/dashboard/analytics";
      
      router.push(target);
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accountNumber, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      await refreshSession();

      if (data.mustChangePassword) {
        setShowForceChange(true);
        setLoading(false);
      } else {
        const pref = data.user?.defaultLandingPage || (typeof window !== "undefined" ? localStorage.getItem("landingPage") : null);
        let target = "/";
        if (pref === "dashboard") target = "/dashboard/overview";
        if (pref === "analytics") target = "/dashboard/analytics";
        
        router.push(target);
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-[#0EA5E9]/10 rounded-2xl flex items-center justify-center">
                <Image
                  src="/SC LOGO W 1.png"
                  alt="SecureTanza Logo"
                  width={60}
                  height={60}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              SecureTanza
            </h1>
            <p className="text-slate-400 text-sm">
              Crime Mapping & Analytics System
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Number Field */}
            <div>
              <label htmlFor="accountNumber" className="block text-sm font-medium text-slate-300 mb-2">
                Account Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="accountNumber"
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent transition-all"
                  placeholder="Enter your account number"
                  required
                  autoComplete="username"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-sm text-slate-500">
              Tanza Municipal Police Station
            </p>
            <p className="text-center text-xs text-slate-600 mt-1">
              Authorized personnel only
            </p>
          </div>
        </div>

        {/* Version Info */}
        <p className="text-center text-xs text-slate-600 mt-4">
          SecureTanza v1.0.0 • © 2026
        </p>
      </div>
      
      {showForceChange && (
        <ForceChangePasswordModal 
          onSuccess={() => {
            setShowForceChange(false);
            const pref = user?.defaultLandingPage || (typeof window !== "undefined" ? localStorage.getItem("landingPage") : null);
            let target = "/";
            if (pref === "dashboard") target = "/dashboard/overview";
            if (pref === "analytics") target = "/dashboard/analytics";
            
            router.push(target);
            router.refresh();
          }} 
        />
      )}
    </div>
  );
}
