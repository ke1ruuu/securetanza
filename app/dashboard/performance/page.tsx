"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Database,
  Cpu,
  Clock,
  ShieldCheck,
  RefreshCw,
  ArrowLeft,
  Server,
  ShieldAlert,
  Layers,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import DatabaseServiceView from "./components/DatabaseServiceView";
import ProcessMemoryServiceView from "./components/ProcessMemoryServiceView";
import CronTasksServiceView from "./components/CronTasksServiceView";
import AuthCacheServiceView from "./components/AuthCacheServiceView";

interface TelemetryPayload {
  success: boolean;
  timestamp: string;
  status: {
    backendService: string;
    databasePool: string;
    cronWorker: string;
    memoryState: string;
  };
  metrics: {
    dbLatencyMs: number;
    pool: {
      max: number;
      totalCount: number;
      idleCount: number;
      waitingCount: number;
      activeCount: number;
      saturationPercent: number;
    };
    memory: {
      heapUsedMB: number;
      heapTotalMB: number;
      rssMB: number;
      externalMB: number;
      arrayBuffersMB: number;
      heapUsagePercent: number;
      heapLimitMB: number;
    };
    process: {
      uptimeFormatted: string;
      uptimeSeconds: number;
      nodeVersion: string;
      platform: string;
      arch: string;
      pid: number;
    };
    database: {
      tables: {
        crimeIncidents: number;
        users: number;
        auditLogs: number;
        notifications: number;
        exportSchedules: number;
      };
      totalRecords: number;
    };
    background: {
      cronSchedule: string;
      activeSchedules: number;
      totalSchedules: number;
      exportFilesOnDisk: number;
      exportStorageMB: number;
      retentionPolicyDays: number;
      recentImports: any[];
      recentExports: any[];
    };
    sessionCache: {
      activeEntries: number;
      maxCapacity: number;
      ttlSeconds: number;
      utilizationPercent: number;
    };
    cache?: {
      provider: string;
      hits: number;
      misses: number;
      writes: number;
      deletions: number;
      stampedePrevented: number;
      dbQueriesSaved: number;
      hitRatioPercent: number;
      activeKeysCount: number;
      memoryEstimateBytes: number;
      memoryEstimateKB: number;
      uptimeSeconds: number;
      namespaces: {
        crimes: number;
        geo: number;
        auth: number;
        config: number;
      };
      activeKeys: string[];
      recentEvents: Array<{
        timestamp: string;
        type: string;
        key: string;
        latencyMs?: number;
        details?: string;
      }>;
    };
  };
}

const SERVICES = [
  { id: "database", label: "Database & Pool", icon: Database },
  { id: "process", label: "Process & Memory", icon: Cpu },
  { id: "cron", label: "Cron & Tasks", icon: Clock },
  { id: "cache", label: "Auth & Cache", icon: ShieldCheck },
] as const;

type ServiceKey = (typeof SERVICES)[number]["id"];

function PerformanceDashboardContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentServiceParam = searchParams.get("service") as ServiceKey | null;
  const activeService: ServiceKey =
    currentServiceParam && SERVICES.some((s) => s.id === currentServiceParam)
      ? currentServiceParam
      : "database";

  const [data, setData] = useState<TelemetryPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<number>(10000); // 10s default
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [isPruning, setIsPruning] = useState(false);

  // Rolling history for single-metric charts (25 samples max)
  const [dbHistory, setDbHistory] = useState<Array<{ time: string; dbLatencyMs: number }>>([]);
  const [heapHistory, setHeapHistory] = useState<Array<{ time: string; heapUsedMB: number }>>([]);

  const isAuthorized =
    user && (user.permissions.includes("admin_operational_officer") || user.permissions.includes("admin"));

  // Auth guard
  useEffect(() => {
    if (!authLoading && !isAuthorized) {
      router.replace("/dashboard/overview");
    }
  }, [authLoading, isAuthorized, router]);

  // Telemetry fetcher
  const fetchTelemetry = useCallback(async (manual = false) => {
    if (manual) setIsRefreshing(true);
    try {
      const res = await fetch("/api/system/performance", { cache: "no-store" });
      if (!res.ok) return;
      const json: TelemetryPayload = await res.json();
      if (json.success) {
        setData(json);

        const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

        setDbHistory((prev) => {
          const next = [...prev, { time: nowTime, dbLatencyMs: json.metrics.dbLatencyMs }];
          return next.slice(-25);
        });

        setHeapHistory((prev) => {
          const next = [...prev, { time: nowTime, heapUsedMB: json.metrics.memory.heapUsedMB }];
          return next.slice(-25);
        });
      }
    } catch (err) {
      console.error("Telemetry fetch error:", err);
    } finally {
      setLoading(false);
      if (manual) setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (isAuthorized) {
      fetchTelemetry();
    }
  }, [isAuthorized, fetchTelemetry]);

  // Polling timer
  useEffect(() => {
    if (!isAuthorized || refreshInterval === 0) return;

    const interval = setInterval(() => {
      fetchTelemetry();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [isAuthorized, refreshInterval, fetchTelemetry]);

  // Ping action
  const handleLivePing = async () => {
    setIsPinging(true);
    try {
      const res = await fetch("/api/system/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ping" }),
      });
      const result = await res.json();
      if (result.success && data) {
        setData({
          ...data,
          metrics: {
            ...data.metrics,
            dbLatencyMs: result.dbLatencyMs,
          },
        });
      }
    } catch (err) {
      console.error("Ping error:", err);
    } finally {
      setIsPinging(false);
    }
  };

  // Clear cache action
  const handleClearCache = async () => {
    setIsClearingCache(true);
    try {
      await fetch("/api/system/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear_cache" }),
      });
      await fetchTelemetry();
    } finally {
      setIsClearingCache(false);
    }
  };

  // Prune exports action
  const handlePruneExports = async () => {
    setIsPruning(true);
    try {
      await fetch("/api/system/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "prune_exports" }),
      });
      await fetchTelemetry();
    } finally {
      setIsPruning(false);
    }
  };

  // Service switch
  const selectService = (serviceId: ServiceKey) => {
    router.replace(`/dashboard/performance?service=${serviceId}`, { scroll: false });
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B0F17]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0EA5E9] border-t-transparent mx-auto mb-3" />
          <p className="text-xs font-mono text-slate-400">Loading service telemetry...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized || !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B0F17] text-slate-300">
        <div className="text-center p-8 bg-[#111726] border border-slate-800 rounded-md max-w-md">
          <ShieldAlert className="h-10 w-10 text-amber-400 mx-auto mb-3" />
          <h2 className="text-base font-semibold text-white">Administrative Access Required</h2>
          <p className="text-xs text-slate-400 mt-2">
            The Backend Process Service Monitor is restricted to authorized administrative personnel.
          </p>
          <Link
            href="/dashboard/overview"
            className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0EA5E9] text-white rounded-md text-xs font-medium hover:bg-[#0EA5E9]/90 transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { metrics } = data;

  // Live sidebar badges
  const serviceBadges: Record<ServiceKey, string> = {
    database: `${metrics.dbLatencyMs}ms`,
    process: `${metrics.memory.heapUsedMB} MB`,
    cron: `${metrics.background.activeSchedules} Active`,
    cache: `${metrics.sessionCache.activeEntries}/${metrics.sessionCache.maxCapacity}`,
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col md:flex-row">
      {/* Supabase-style Persistent Left Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800 bg-[#0F141F] flex flex-col shrink-0 md:sticky md:top-0 md:h-screen z-20">
        {/* Brand & Breadcrumbs */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <h1 className="text-sm font-semibold text-white tracking-tight">
                SecureTanza
              </h1>
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">
              Backend Service Monitor
            </p>
          </div>

          <Link
            href="/dashboard/overview"
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Return to Main Dashboard"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        {/* Services Navigation List */}
        <div className="p-3 flex-1 overflow-y-auto">
          <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 px-3 py-2">
            Backend Services
          </div>

          <nav className="space-y-1">
            {SERVICES.map((item) => {
              const Icon = item.icon;
              const isSelected = activeService === item.id;
              const badgeValue = serviceBadges[item.id];

              return (
                <button
                  key={item.id}
                  onClick={() => selectService(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-colors cursor-pointer text-left ${
                    isSelected
                      ? "bg-[#162032] text-white border border-slate-700/80"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isSelected ? "text-[#0EA5E9]" : "text-slate-500"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${
                      isSelected
                        ? "bg-[#0EA5E9]/10 text-[#0EA5E9] border-[#0EA5E9]/30"
                        : "bg-slate-900 text-slate-500 border-slate-800"
                    }`}
                  >
                    {badgeValue}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Refresh Controls */}
        <div className="p-4 border-t border-slate-800 bg-[#0B0F17]/60 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500">Auto-Refresh</span>
            <button
              onClick={() => fetchTelemetry(true)}
              disabled={isRefreshing}
              className="p-1 hover:text-[#0EA5E9] text-slate-400 transition-colors disabled:opacity-50"
              title="Refresh now"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#0EA5E9]" : ""}`} />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1 text-[11px] font-mono">
            {[
              { label: "Off", val: 0 },
              { label: "5s", val: 5000 },
              { label: "10s", val: 10000 },
              { label: "30s", val: 30000 },
            ].map((opt) => (
              <button
                key={opt.val}
                onClick={() => setRefreshInterval(opt.val)}
                className={`py-1 rounded text-center transition-colors cursor-pointer ${
                  refreshInterval === opt.val
                    ? "bg-[#0EA5E9] text-white font-medium"
                    : "bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Single-Service View Canvas */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-6xl">
        {activeService === "database" && (
          <DatabaseServiceView
            metrics={metrics}
            history={dbHistory}
            onLivePing={handleLivePing}
            isPinging={isPinging}
          />
        )}

        {activeService === "process" && (
          <ProcessMemoryServiceView
            metrics={metrics}
            history={heapHistory}
          />
        )}

        {activeService === "cron" && (
          <CronTasksServiceView
            metrics={metrics}
            onPruneExports={handlePruneExports}
            isPruning={isPruning}
          />
        )}

        {activeService === "cache" && (
          <AuthCacheServiceView
            metrics={metrics}
            onClearCache={handleClearCache}
            isClearingCache={isClearingCache}
          />
        )}
      </main>
    </div>
  );
}

export default function PerformanceDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#0B0F17]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0EA5E9] border-t-transparent mx-auto" />
        </div>
      }
    >
      <PerformanceDashboardContent />
    </Suspense>
  );
}
