"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function DashboardRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) return;

    const params = searchParams.toString();
    const qs = params ? `?${params}` : "";

    // Admin goes to overview by default
    if (user.permissions.includes("admin_operational_officer") || user.permissions.includes("admin")) {
      router.replace(`/dashboard/overview${qs}`);
      return;
    }

    // Privileged users redirect based on their first available permission
    if (user.permissions.includes("privileged_map_view")) {
      router.replace(`/dashboard/overview${qs}`);
    } else if (user.permissions.includes("privileged_cases_view")) {
      router.replace(`/dashboard/cases${qs}`);
    } else if (user.permissions.includes("privileged_analytics_view")) {
      router.replace(`/dashboard/analytics${qs}`);
    } else {
      // If no module permissions, maybe they only have config?
      router.replace(`/dashboard/overview${qs}`);
    }
  }, [router, searchParams, user]);

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
