"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function RootRedirect() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      router.replace("/login");
      return;
    }

    const pref = user.defaultLandingPage;
    if (pref === "dashboard") {
      router.replace("/dashboard/overview");
    } else if (pref === "analytics") {
      router.replace("/dashboard/analytics");
    } else {
      router.replace("/map");
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#0f172a] flex-col gap-6">
      <div className="w-16 h-16 bg-[#0EA5E9]/10 rounded-2xl flex items-center justify-center animate-pulse">
        <Image
          src="/SC LOGO W 1.png"
          alt="SecureTanza Logo"
          width={40}
          height={40}
          className="object-contain"
          priority
        />
      </div>
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0EA5E9] mx-auto mb-4"></div>
        <p className="text-sm font-medium text-slate-400">Loading your secure workspace...</p>
      </div>
    </div>
  );
}
