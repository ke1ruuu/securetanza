"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function DashboardRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Redirect to overview page with query params
    const params = searchParams.toString();
    router.replace(`/dashboard/overview${params ? `?${params}` : ""}`);
  }, [router, searchParams]);

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
