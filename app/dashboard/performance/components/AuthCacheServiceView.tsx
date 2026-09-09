"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Trash2,
  CheckCircle,
  Clock,
  Layers,
  Zap,
  Database,
  Flame,
  Activity,
  ArrowRight,
  Server,
  RefreshCw,
} from "lucide-react";

interface Props {
  metrics: {
    dbLatencyMs: number;
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
  onClearCache: (scope?: string) => Promise<void>;
  isClearingCache: boolean;
}

export default function AuthCacheServiceView({
  metrics,
  onClearCache,
  isClearingCache,
}: Props) {
  const { sessionCache, cache, dbLatencyMs } = metrics;
  const [cacheMsg, setCacheMsg] = useState<string | null>(null);
  const [activeScope, setActiveScope] = useState<string>("all");

  const hits = cache?.hits ?? 0;
  const misses = cache?.misses ?? 0;
  const hitRatio = cache?.hitRatioPercent ?? 0;
  const queriesSaved = cache?.dbQueriesSaved ?? 0;
  const stampedePrevented = cache?.stampedePrevented ?? 0;
  const activeKeysCount = cache?.activeKeysCount ?? sessionCache.activeEntries;
  const activeKeys = cache?.activeKeys ?? [];
  const recentEvents = cache?.recentEvents ?? [];

  const handleClear = async (scope: string = "all") => {
    try {
      setActiveScope(scope);
      await onClearCache(scope);
      const label =
        scope === "all"
          ? "Entire cache"
          : scope === "crimes"
          ? "Crimes cache"
          : scope === "geo"
          ? "Geospatial cache"
          : scope === "auth"
          ? "Auth & session cache"
          : `${scope} cache`;
      setCacheMsg(`${label} flushed successfully.`);
      setTimeout(() => setCacheMsg(null), 3500);
    } catch {
      setCacheMsg("Failed to flush cache.");
      setTimeout(() => setCacheMsg(null), 3500);
    }
  };

  const speedupMultiplier = dbLatencyMs > 0 ? Math.max(1, Math.round(dbLatencyMs / 0.3)) : 50;

  return (
    <div className="space-y-6">
      {/* Service Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-semibold text-white tracking-tight">
              Server-Side Caching Layer
            </h2>
            <span className="px-2 py-0.5 text-xs font-mono font-medium rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Optimal ({cache?.provider || "In-Memory LRU"})
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Read-through cache sitting between Application Services and PostgreSQL with single-flight stampede mitigation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {cacheMsg && (
            <span className="text-xs text-emerald-400 font-mono animate-fade-in">
              {cacheMsg}
            </span>
          )}

          <div className="flex items-center rounded-md bg-slate-900 border border-slate-800 p-0.5">
            <button
              onClick={() => handleClear("crimes")}
              disabled={isClearingCache}
              className="px-2.5 py-1 text-[11px] font-mono text-slate-400 hover:text-white rounded transition-colors cursor-pointer disabled:opacity-50"
              title="Invalidate crime analytics and queries"
            >
              Purge Crimes
            </button>
            <button
              onClick={() => handleClear("geo")}
              disabled={isClearingCache}
              className="px-2.5 py-1 text-[11px] font-mono text-slate-400 hover:text-white rounded transition-colors cursor-pointer disabled:opacity-50"
              title="Invalidate barangay reference data"
            >
              Purge Geo
            </button>
            <button
              onClick={() => handleClear("auth")}
              disabled={isClearingCache}
              className="px-2.5 py-1 text-[11px] font-mono text-slate-400 hover:text-white rounded transition-colors cursor-pointer disabled:opacity-50"
              title="Invalidate active user sessions"
            >
              Purge Auth
            </button>
            <button
              onClick={() => handleClear("all")}
              disabled={isClearingCache}
              className="px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 ml-1"
            >
              <Trash2 className="h-3 w-3" />
              {isClearingCache && activeScope === "all" ? "Flushing..." : "Flush All"}
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Hit Ratio */}
        <div className="bg-[#111726] border border-slate-800 rounded-md p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Cache Hit Ratio</span>
            <Zap className="h-3.5 w-3.5 text-[#0EA5E9]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-semibold text-white">
              {hitRatio}%
            </span>
            <span className="text-xs font-mono text-slate-400">
              ({hits} hits / {misses} miss)
            </span>
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-3 border border-slate-800">
            <div
              className="bg-[#0EA5E9] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(hitRatio, 2))}%` }}
            />
          </div>
        </div>

        {/* Database Queries Intercepted */}
        <div className="bg-[#111726] border border-slate-800 rounded-md p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>DB Queries Saved</span>
            <Database className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-semibold text-emerald-400">
              {queriesSaved.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-slate-400">queries</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Round-trips prevented across PostgreSQL/PgBouncer pool.
          </p>
        </div>

        {/* Stampede Mitigations */}
        <div className="bg-[#111726] border border-slate-800 rounded-md p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Stampedes Prevented</span>
            <Flame className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-semibold text-amber-400">
              {stampedePrevented}
            </span>
            <span className="text-xs font-mono text-slate-400">coalesced</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Concurrent requests collapsed into single DB executions.
          </p>
        </div>

        {/* Latency Advantage */}
        <div className="bg-[#111726] border border-slate-800 rounded-md p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Latency Advantage</span>
            <Activity className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-semibold text-cyan-400">
              {speedupMultiplier}x
            </span>
            <span className="text-xs font-mono text-slate-400">faster response</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            ~0.3ms cache hit vs {dbLatencyMs}ms database query.
          </p>
        </div>
      </div>

      {/* Latency Comparison Visualizer */}
      <div className="bg-[#111726] border border-slate-800 rounded-md p-5">
        <h3 className="text-sm font-semibold text-white mb-1">
          Execution Latency Comparison (Cache Hit vs Direct PostgreSQL)
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Visual comparison showing the round-trip latency elimination provided by the server-side cache.
        </p>

        <div className="space-y-3">
          {/* Cache Hit */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-1">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <Zap className="h-3 w-3" />
                Cache Hit (In-Memory LRU)
              </span>
              <span>0.3 ms</span>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: "3%" }} />
            </div>
          </div>

          {/* Database Round-Trip */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-1">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Database className="h-3 w-3 text-slate-500" />
                Database Query (PostgreSQL via PgBouncer Pool)
              </span>
              <span>{dbLatencyMs} ms</span>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-[#0EA5E9] h-full rounded-full" style={{ width: "85%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Active Cache Namespaces Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#111726] border border-slate-800 rounded-md p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">
              Cached Namespaces & Keys
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {activeKeysCount} Active Keys in RAM
            </span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="p-3 bg-slate-900/60 rounded border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-white font-semibold block">Crimes Analytics & Stats</span>
                <span className="text-slate-500 text-[11px]">app:crimes:* (TTL: 30s–60s)</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-[#0EA5E9] font-medium">
                {cache?.namespaces?.crimes ?? 0} keys
              </span>
            </div>

            <div className="p-3 bg-slate-900/60 rounded border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-white font-semibold block">Geospatial Reference (Barangays)</span>
                <span className="text-slate-500 text-[11px]">app:geo:* (TTL: 1 hour)</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-medium">
                {cache?.namespaces?.geo ?? 0} keys
              </span>
            </div>

            <div className="p-3 bg-slate-900/60 rounded border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-white font-semibold block">Auth Sessions & Permissions</span>
                <span className="text-slate-500 text-[11px]">app:auth:* (TTL: 30s)</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-medium">
                {cache?.namespaces?.auth ?? sessionCache.activeEntries} keys
              </span>
            </div>

            <div className="p-3 bg-slate-900/60 rounded border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-white font-semibold block">Configuration & Intelligence Rules</span>
                <span className="text-slate-500 text-[11px]">app:config:* (TTL: 10 min)</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-medium">
                {cache?.namespaces?.config ?? 0} keys
              </span>
            </div>
          </div>
        </div>

        {/* Real-time Cache Event Stream */}
        <div className="bg-[#111726] border border-slate-800 rounded-md p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">
              Real-Time Cache Event Stream
            </h3>
            <span className="text-[10px] font-mono text-slate-500 uppercase">
              Last {recentEvents.length} Events
            </span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-64 space-y-1.5 pr-1 font-mono text-xs">
            {recentEvents.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-center py-8">
                No cache events recorded yet. Trigger an API query to observe telemetry.
              </div>
            ) : (
              recentEvents.map((evt, idx) => {
                const badgeColor =
                  evt.type === "HIT"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : evt.type === "MISS"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    : evt.type === "STAMPEDE_PREVENTED"
                    ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                    : evt.type === "DELETE"
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                    : "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";

                return (
                  <div
                    key={idx}
                    className="p-2 bg-slate-900/60 rounded border border-slate-800/80 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={`px-1.5 py-0.5 text-[9px] rounded border font-semibold ${badgeColor}`}>
                        {evt.type}
                      </span>
                      <span className="text-slate-300 truncate text-[11px]" title={evt.key}>
                        {evt.key}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 text-slate-500 text-[10px]">
                      {evt.latencyMs !== undefined && (
                        <span>{evt.latencyMs}ms</span>
                      )}
                      <span>{new Date(evt.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Active Cache Key Inspector */}
      {activeKeys.length > 0 && (
        <div className="bg-[#111726] border border-slate-800 rounded-md p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">
              Active Cache Key Inspector
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Showing {Math.min(activeKeys.length, 25)} of {activeKeys.length} entries
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {activeKeys.slice(0, 24).map((key, i) => (
              <div
                key={i}
                className="p-2 bg-slate-900/60 rounded border border-slate-800/70 text-xs font-mono text-slate-300 truncate flex items-center justify-between gap-2"
              >
                <span className="truncate text-[11px]" title={key}>{key}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Architecture & Invalidation Policies Card */}
      <div className="bg-[#111726] border border-slate-800 rounded-md p-5">
        <h3 className="text-sm font-semibold text-white mb-3">
          Polysyne Architecture: Cache Pipeline & Invalidation Rules
        </h3>

        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3 bg-slate-900/40 rounded-md border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-semibold text-white block">Read-Through with Single-Flight Stampede Guard</span>
              <span className="text-slate-400 text-[11px] block mt-0.5">
                <code className="text-slate-300 font-mono">cacheService.getOrSet(key, ttl, loader)</code> coalesces concurrent callers on a cache miss into a single ongoing Promise, preventing database saturation.
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-purple-400 border border-purple-500/20 shrink-0">
              Zero-Thundering-Herd
            </span>
          </div>

          <div className="p-3 bg-slate-900/40 rounded-md border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-semibold text-white block">Excel Ingestion & Mutation-Driven Purging</span>
              <span className="text-slate-400 text-[11px] block mt-0.5">
                Uploading blotters, creating incidents, or modifying records immediately dispatches <code className="text-slate-300 font-mono">deleteByPattern(&quot;app:crimes:*&quot;)</code> so dashboard analytics always reflect current truth.
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-rose-400 border border-rose-500/20 shrink-0">
              Immediate Purge
            </span>
          </div>

          <div className="p-3 bg-slate-900/40 rounded-md border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-semibold text-white block">Graceful Database Fallback</span>
              <span className="text-slate-400 text-[11px] block mt-0.5">
                If the caching provider throws an exception or experiences degradation, requests bypass the cache seamlessly and query PostgreSQL directly without throwing 500 errors.
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-emerald-500/20 shrink-0">
              Fault Tolerant
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
