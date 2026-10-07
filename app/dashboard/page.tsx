"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getDefaultRouteForUser } from "@/lib/auth-routes";

function DashboardRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { user, loading: authLoading } = useAuth();
  
  useEffect(() => {
    if (authLoading) return;

    if (!user || !user.permissions || user.permissions.length === 0) {
      router.replace("/login");
      return;
    }

    const params = searchParams.toString();
    const qs = params ? `?${params}` : "";
    const baseTarget = getDefaultRouteForUser(user);
    const target = baseTarget.includes("?")
      ? `${baseTarget}${qs ? `&${qs.slice(1)}` : ""}`
      : `${baseTarget}${qs}`;

    router.replace(target);
  }, [router, searchParams, user, authLoading]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#0f172a]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <p className="text-lg font-semibold text-white">Redirecting...</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#0f172a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-white">Loading...</p>
        </div>
      </div>
    }>
      <DashboardRedirect />
    </Suspense>
  );
}
