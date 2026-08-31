"use client";

import { useState } from "react";
import { Shield, Eye, EyeOff, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface ForceChangePasswordModalProps {
  onSuccess: () => void;
}

export function ForceChangePasswordModal({ onSuccess }: ForceChangePasswordModalProps) {
  const router = useRouter();
  const { refreshSession } = useAuth();
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const requirements = [
    { label: "At least 8 characters", regex: /.{8,}/ },
    { label: "Uppercase & lowercase letters", regex: /(?=.*[a-z])(?=.*[A-Z])/ },
    { label: "At least one number", regex: /(?=.*[0-9])/ },
    { label: "At least one special character", regex: /(?=.*[^A-Za-z0-9])/ },
  ];

  const score = requirements.filter(req => req.regex.test(newPassword)).length;
  const isStrong = score === requirements.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isStrong) {
      setError("Please meet all password security requirements.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to change password");
      }

      await refreshSession();
      onSuccess();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0EA5E9]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8 relative z-10">
            <div className="w-16 h-16 bg-[#0EA5E9]/10 rounded-2xl flex items-center justify-center mb-5 rotate-3 hover:rotate-0 transition-transform duration-300">
              <Shield className="w-8 h-8 text-[#0EA5E9]" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
              Action Required
            </h1>
            <p className="text-sm text-slate-400 max-w-[280px]">
              For your security, please change your temporary password before accessing the system.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 ml-1">New Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#0EA5E9] transition-colors">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-11 pr-11 h-12 bg-slate-950/50 border-white/10 focus:border-[#0EA5E9] text-white transition-all rounded-xl"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {newPassword.length > 0 && (
                <div className="pt-2 animate-in slide-in-from-top-1 opacity-100 duration-200">
                  <div className="flex gap-1.5 h-1.5 w-full rounded-full overflow-hidden mb-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 transition-colors duration-300 ${
                          score >= i
                            ? score <= 1
                              ? "bg-red-500"
                              : score <= 2
                              ? "bg-amber-500"
                              : score <= 3
                              ? "bg-emerald-400"
                              : "bg-emerald-500"
                            : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    {requirements.map((req, i) => {
                      const passed = req.regex.test(newPassword);
                      return (
                        <div key={i} className={`flex items-center gap-2 text-xs transition-colors duration-300 ${passed ? "text-emerald-400" : "text-slate-500"}`}>
                          <CheckCircle2 className={`w-3.5 h-3.5 ${passed ? "opacity-100" : "opacity-30"}`} />
                          <span>{req.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 ml-1">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#0EA5E9] transition-colors">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pl-11 pr-11 h-12 bg-slate-950/50 text-white transition-all rounded-xl ${
                    confirmPassword.length > 0 && newPassword !== confirmPassword
                      ? "border-red-500 focus:border-red-500"
                      : "border-white/10 focus:border-[#0EA5E9]"
                  }`}
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !isStrong || confirmPassword.length === 0 || newPassword !== confirmPassword}
              className="w-full h-12 mt-4 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-semibold flex items-center justify-center gap-2 group transition-all"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-400 border-t-slate-900 rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Secure Account & Continue
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
