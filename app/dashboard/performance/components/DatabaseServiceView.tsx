"use client";

import React from "react";
import {
  Database,
  Zap,
  Server,
  Layers,
  CheckCircle,
  Clock,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

interface Props {
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
  };
  history: Array<{ time: string; dbLatencyMs: number }>;
  onLivePing: () => void;
  isPinging: boolean;
}

export default function DatabaseServiceView({
  metrics,
  history,
  onLivePing,
  isPinging,
}: Props) {
  const { pool, database, dbLatencyMs } = metrics;
  const maxSlots = pool.max || 10;
  const activeSlots = pool.activeCount;
  const idleSlots = pool.idleCount;
  const freeSlots = Math.max(0, maxSlots - activeSlots - idleSlots);

  const tables = [
    {
      name: "crime_incidents",
      label: "Crime Incidents",
      count: database.tables.crimeIncidents,
      description: "Police blotters, crime categories, geospatial coordinates, and case statuses.",
    },
    {
      name: "notifications",
      label: "Notifications & Alerts",
      count: database.tables.notifications,
      description: "Automated crime surge warnings, threshold triggers, and system dispatches.",
    },
    {
      name: "audit_logs",
      label: "Audit Logs",
      count: database.tables.auditLogs,
      description: "Historical record of batch uploads, authentication events, and data exports.",
    },
    {
      name: "users",
      label: "System Users",
      count: database.tables.users,
      description: "Authorized police personnel accounts and permission mappings.",
    },
    {
      name: "export_schedules",
      label: "Export Schedules",
      count: database.tables.exportSchedules,
      description: "Recurring cron export configurations for municipal crime reporting.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Service Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-semibold text-white tracking-tight">
              Database & Connection Pool
            </h2>
            <span className="px-2 py-0.5 text-xs font-mono font-medium rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Optimal
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Supabase PostgreSQL transaction pooler (PgBouncer) on port 6543.
          </p>
        </div>

        <button
          onClick={onLivePing}
          disabled={isPinging}
          className="px-3.5 py-1.5 bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          <Zap className="h-3.5 w-3.5" />
          {isPinging ? "Executing Ping..." : "Test Query Ping"}
        </button>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111726] border border-slate-800 rounded-md p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Query Round-Trip Latency</span>
            <Clock className="h-3.5 w-3.5 text-[#0EA5E9]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-semibold text-white">
              {dbLatencyMs}
            </span>
            <span className="text-xs font-mono text-slate-400">ms</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            SELECT 1 ping execution time to database server.
          </p>
        </div>

        <div className="bg-[#111726] border border-slate-800 rounded-md p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Pool Allocation</span>
            <Layers className="h-3.5 w-3.5 text-[#0EA5E9]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-semibold text-white">
              {activeSlots + idleSlots}
            </span>
            <span className="text-xs font-mono text-slate-400">/ {maxSlots} slots</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {activeSlots} active client, {idleSlots} idle in pool.
          </p>
        </div>

        <div className="bg-[#111726] border border-slate-800 rounded-md p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Pool Saturation</span>
            <Server className="h-3.5 w-3.5 text-[#0EA5E9]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-semibold text-white">
              {pool.saturationPercent}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {pool.waitingCount} queued requests waiting for client.
          </p>
        </div>

        <div className="bg-[#111726] border border-slate-800 rounded-md p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Total Table Records</span>
            <Database className="h-3.5 w-3.5 text-[#0EA5E9]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-semibold text-white">
              {database.totalRecords.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Across 5 primary relational tables.
          </p>
        </div>
      </div>

      {/* Dedicated Query Latency Chart */}
      <div className="bg-[#111726] border border-slate-800 rounded-md p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Query Latency Timeline (ms)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Round-trip execution response times over recent polling intervals.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0EA5E9]" />
              Measured Latency
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Target Floor (&lt;100ms)
            </span>
          </div>
        </div>

        <div className="h-56 w-full">
          {history.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="dbLatencyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit="ms" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0b0f17",
                    border: "1px solid #1e293b",
                    borderRadius: "0.375rem",
                    fontSize: "0.75rem",
                  }}
                  itemStyle={{ color: "#f8fafc" }}
                />
                <ReferenceLine y={100} stroke="#10b981" strokeDasharray="4 4" label={{ value: "Target (<100ms)", fill: "#10b981", fontSize: 10, position: "insideTopRight" }} />
                <Area
                  type="monotone"
                  dataKey="dbLatencyMs"
                  name="Latency (ms)"
                  stroke="#0EA5E9"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#dbLatencyGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-slate-500 font-mono">
              Collecting latency timeline data...
            </div>
          )}
        </div>
      </div>

      {/* Connection Pool Slots Visualizer */}
      <div className="bg-[#111726] border border-slate-800 rounded-md p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Connection Pool Slots ({activeSlots + idleSlots} / {maxSlots})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Current allocation of client connections inside the PgBouncer pooler.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              Active ({activeSlots})
            </span>
            <span className="flex items-center gap-1.5 text-indigo-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
              Idle ({idleSlots})
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-2.5 h-2.5 rounded-sm border border-slate-700 bg-slate-800/40" />
              Free ({freeSlots})
            </span>
          </div>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {Array.from({ length: maxSlots }).map((_, i) => {
            let state = "free";
            if (i < activeSlots) state = "active";
            else if (i < activeSlots + idleSlots) state = "idle";

            return (
              <div
                key={i}
                className={`p-3 rounded-md border text-center transition-colors ${
                  state === "active"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : state === "idle"
                    ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                    : "bg-slate-900/50 border-slate-800 text-slate-600"
                }`}
              >
                <div className="text-[11px] font-mono font-medium">Slot {i + 1}</div>
                <div className="text-[10px] uppercase font-mono mt-1 opacity-80">{state}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
          <span>Max Pool Size: {maxSlots}</span>
          <span>Idle Timeout: 30,000ms</span>
          <span>Connection Timeout: 5,000ms</span>
          <span>Error Handler: Active</span>
        </div>
      </div>

      {/* Database Tables & Volume Breakdown */}
      <div className="bg-[#111726] border border-slate-800 rounded-md p-5">
        <h3 className="text-sm font-semibold text-white mb-4">
          Database Tables & Volumes
        </h3>

        <div className="divide-y divide-slate-800">
          {tables.map((tbl) => {
            const percentage = Math.round((tbl.count / Math.max(database.totalRecords, 1)) * 100);
            return (
              <div key={tbl.name} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono font-semibold text-white">
                      {tbl.name}
                    </code>
                    <span className="text-xs text-slate-400">({tbl.label})</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{tbl.description}</p>
                </div>

                <div className="flex items-center gap-6 shrink-0 font-mono text-xs">
                  <div className="w-24 hidden md:block">
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#0EA5E9] h-full rounded-full"
                        style={{ width: `${Math.max(percentage, 2)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-slate-400 text-right w-10">{percentage}%</span>
                  <span className="text-white font-medium text-right w-20">
                    {tbl.count.toLocaleString()} rows
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
