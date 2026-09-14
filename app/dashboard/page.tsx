"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

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
    const landing = user.defaultLandingPage || (typeof window !== "undefined" ? localStorage.getItem("landingPage") : null);
    const isAdmin = user.permissions.includes("admin_operational_officer") || user.permissions.includes("admin");

    if (landing === "map" && (isAdmin || user.permissions.includes("privileged_map_view"))) {
      router.replace(`/${qs}`);
      return;
    }

    if (landing === "analytics" && (isAdmin || user.permissions.includes("privileged_analytics_view"))) {
      router.replace(`/dashboard/analytics${qs}`);
      return;
    }

    if ((landing === "overview" || landing === "dashboard") && (isAdmin || user.permissions.includes("privileged_map_view"))) {
      router.replace(`/dashboard/overview${qs}`);
      return;
    }

    // Default fallback based on permissions:
    if (isAdmin || user.permissions.includes("privileged_map_view")) {
      router.replace(`/dashboard/overview${qs}`);
    } else if (user.permissions.includes("privileged_cases_view")) {
      router.replace(`/dashboard/cases${qs}`);
    } else if (user.permissions.includes("privileged_analytics_view")) {
      router.replace(`/dashboard/analytics${qs}`);
    } else {
      router.replace(`/dashboard/overview${qs}`);
    }
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
