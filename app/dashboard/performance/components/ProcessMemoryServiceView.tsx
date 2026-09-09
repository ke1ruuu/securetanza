"use client";

import React from "react";
import {
  Cpu,
  Server,
  Activity,
  CheckCircle,
  HardDrive,
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
  };
  history: Array<{ time: string; heapUsedMB: number }>;
}

export default function ProcessMemoryServiceView({ metrics, history }: Props) {
  const { memory, process: proc } = metrics;
  const isHealthy = memory.heapUsagePercent < 85;

  const protections = [
    {
      title: "Global Connection Pool Bound",
      description: "Postgres pool attached to globalThis across dev and production to prevent connection socket leaks.",
      status: "Active",
    },
    {
      title: "Bounded Session Validation Cache",
      description: "In-memory cache capped at 500 entries with 20-second automatic eviction to prevent heap accumulation.",
      status: "Active",
    },
    {
      title: "Stream Batch Ingestion",
      description: "Bulk data uploads processed in 250-row database chunks to release intermediate row memory promptly.",
      status: "Active",
    },
    {
      title: "Stdout Blocking Remediation",
      description: "Removed synchronous loops writing thousands of console log lines to the Node.js event loop.",
      status: "Active",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Service Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-semibold text-white tracking-tight">
              Node Process & Memory
            </h2>
            <span
              className={`px-2 py-0.5 text-xs font-mono font-medium rounded-md border ${
                isHealthy
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }`}
            >
              {isHealthy ? "Stable" : "Elevated"}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            V8 runtime memory allocations, resident physical memory, and leak detection.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <span>PID: {proc.pid}</span>
          <span>•</span>
          <span>Uptime: {proc.uptimeFormatted}</span>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111726] border border-slate-800 rounded-md p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>V8 Heap Used</span>
            <Cpu className="h-3.5 w-3.5 text-[#0EA5E9]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-semibold text-white">
              {memory.heapUsedMB}
            </span>
            <span className="text-xs font-mono text-slate-400">MB</span>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
              <span>{memory.heapUsagePercent}% of Heap Total</span>
              <span>{memory.heapTotalMB} MB Total</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div
                className="bg-[#0EA5E9] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(memory.heapUsagePercent, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-[#111726] border border-slate-800 rounded-md p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Resident Set Size (RSS)</span>
            <Server className="h-3.5 w-3.5 text-[#0EA5E9]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-semibold text-white">
              {memory.rssMB}
            </span>
            <span className="text-xs font-mono text-slate-400">MB</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Total physical RAM held by the Node.js process.
          </p>
        </div>

        <div className="bg-[#111726] border border-slate-800 rounded-md p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>External & Buffers</span>
            <HardDrive className="h-3.5 w-3.5 text-[#0EA5E9]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-semibold text-white">
              {memory.externalMB}
            </span>
            <span className="text-xs font-mono text-slate-400">MB</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            ArrayBuffers: {memory.arrayBuffersMB} MB (C++ bindings).
          </p>
        </div>

        <div className="bg-[#111726] border border-slate-800 rounded-md p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Memory Leak Status</span>
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xl font-semibold text-emerald-400">
              {isHealthy ? "No Leak Detected" : "Under Observation"}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Heap allocations within standard garbage collection limits.
          </p>
        </div>
      </div>

      {/* Dedicated V8 Heap Allocation Chart */}
      <div className="bg-[#111726] border border-slate-800 rounded-md p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">
              V8 Heap Allocation Timeline (MB)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live progression of JavaScript heap memory in the active Node.js runtime.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0EA5E9]" />
              Heap Used
            </span>
            <span className="text-slate-500">
              (Total Limit: {memory.heapLimitMB} MB)
            </span>
          </div>
        </div>

        <div className="h-56 w-full">
          {history.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="heapGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit="MB" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0b0f17",
                    border: "1px solid #1e293b",
                    borderRadius: "0.375rem",
                    fontSize: "0.75rem",
                  }}
                  itemStyle={{ color: "#f8fafc" }}
                />
                <Area
                  type="monotone"
                  dataKey="heapUsedMB"
                  name="Heap Used (MB)"
                  stroke="#0EA5E9"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#heapGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-slate-500 font-mono">
              Collecting heap memory timeline data...
            </div>
          )}
        </div>
      </div>

      {/* Memory Allocations Table */}
      <div className="bg-[#111726] border border-slate-800 rounded-md p-5">
        <h3 className="text-sm font-semibold text-white mb-4">
          Memory Breakdown & Runtime Host Details
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs font-mono mb-6">
          <div className="p-3 bg-slate-900/60 rounded-md border border-slate-800">
            <span className="text-slate-500 block">Node.js</span>
            <span className="text-white font-medium mt-1 block">{proc.nodeVersion}</span>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-md border border-slate-800">
            <span className="text-slate-500 block">Architecture</span>
            <span className="text-white font-medium mt-1 block">{proc.arch}</span>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-md border border-slate-800">
            <span className="text-slate-500 block">Platform</span>
            <span className="text-white font-medium mt-1 block">{proc.platform}</span>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-md border border-slate-800">
            <span className="text-slate-500 block">Process ID</span>
            <span className="text-white font-medium mt-1 block">{proc.pid}</span>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-md border border-slate-800">
            <span className="text-slate-500 block">Heap Total</span>
            <span className="text-white font-medium mt-1 block">{memory.heapTotalMB} MB</span>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-md border border-slate-800">
            <span className="text-slate-500 block">Max Limit</span>
            <span className="text-white font-medium mt-1 block">{memory.heapLimitMB} MB</span>
          </div>
        </div>

        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Applied Memory Leak Protections
        </h4>
        <div className="space-y-2.5">
          {protections.map((item, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-900/40 border border-slate-800 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <span className="text-xs font-medium text-white block">{item.title}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">{item.description}</span>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 self-start sm:self-auto shrink-0">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
