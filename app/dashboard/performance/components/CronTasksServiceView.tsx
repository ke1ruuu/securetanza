"use client";

import React, { useState } from "react";
import {
  Clock,
  HardDrive,
  Calendar,
  Trash2,
  Upload,
  FileSpreadsheet,
  CheckCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Props {
  metrics: {
    background: {
      cronSchedule: string;
      activeSchedules: number;
      totalSchedules: number;
      exportFilesOnDisk: number;
      exportStorageMB: number;
      retentionPolicyDays: number;
      recentImports: Array<{
        id: string;
        fileName: string | null;
        recordsImported: number | null;
        outcome: string | null;
        user: string | null;
        createdAt: string;
        errorMessage: string | null;
      }>;
      recentExports: Array<{
        id: string;
        details: string | null;
        user: string | null;
        outcome: string | null;
        createdAt: string;
      }>;
    };
  };
  onPruneExports: () => Promise<void>;
  isPruning: boolean;
}

export default function CronTasksServiceView({
  metrics,
  onPruneExports,
  isPruning,
}: Props) {
  const { background } = metrics;
  const [pruneMsg, setPruneMsg] = useState<string | null>(null);

  const handlePrune = async () => {
    try {
      await onPruneExports();
      setPruneMsg("Expired files purged successfully.");
      setTimeout(() => setPruneMsg(null), 3000);
    } catch {
      setPruneMsg("Failed to prune export files.");
      setTimeout(() => setPruneMsg(null), 3000);
    }
  };

  // Format data for recent ingestion batch volume chart
  const importChartData = background.recentImports
    .slice(0, 6)
    .reverse()
    .map((item, idx) => ({
      name: item.fileName ? item.fileName.slice(0, 14) : `Batch ${idx + 1}`,
      rows: item.recordsImported || 0,
      user: item.user || "System",
    }));

  return (
    <div className="space-y-6">
      {/* Service Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-semibold text-white tracking-tight">
              Cron & Background Tasks
            </h2>
            <span className="px-2 py-0.5 text-xs font-mono font-medium rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Running
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated export jobs, file generation, and asynchronous blotter ingestion pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pruneMsg && (
            <span className="text-xs text-emerald-400 font-mono">
              {pruneMsg}
            </span>
          )}
          <button
            onClick={handlePrune}
            disabled={isPruning}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5 text-slate-400" />
            {isPruning ? "Pruning Files..." : "Prune Expired Files"}
          </button>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111726] border border-slate-800 rounded-md p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Cron Worker Status</span>
            <Clock className="h-3.5 w-3.5 text-[#0EA5E9]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-semibold text-white">
              Every 1m
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Schedule: <code className="text-slate-300 font-mono">{background.cronSchedule}</code>
          </p>
        </div>

        <div className="bg-[#111726] border border-slate-800 rounded-md p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Active Export Schedules</span>
            <Calendar className="h-3.5 w-3.5 text-[#0EA5E9]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-semibold text-white">
              {background.activeSchedules}
            </span>
            <span className="text-xs font-mono text-slate-400">/ {background.totalSchedules} total</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Recurring municipal crime report dispatches.
          </p>
        </div>

        <div className="bg-[#111726] border border-slate-800 rounded-md p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Export Storage on Disk</span>
            <HardDrive className="h-3.5 w-3.5 text-[#0EA5E9]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-semibold text-white">
              {background.exportStorageMB}
            </span>
            <span className="text-xs font-mono text-slate-400">MB</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {background.exportFilesOnDisk} generated files in <code className="text-slate-300 font-mono">exports/</code>
          </p>
        </div>

        <div className="bg-[#111726] border border-slate-800 rounded-md p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Retention Policy</span>
            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-semibold text-white">
              {background.retentionPolicyDays} Days
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Daily automated pruning at 03:00 AM.
          </p>
        </div>
      </div>

      {/* Dedicated Batch Ingestion Volume Chart */}
      <div className="bg-[#111726] border border-slate-800 rounded-md p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Batch Ingestion Throughput (Records Imported)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Row counts imported per batch using optimized 250-row bulk insertions.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Recent Upload Batches
          </span>
        </div>

        <div className="h-52 w-full">
          {importChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={importChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0b0f17",
                    border: "1px solid #1e293b",
                    borderRadius: "0.375rem",
                    fontSize: "0.75rem",
                  }}
                  itemStyle={{ color: "#f8fafc" }}
                />
                <Bar dataKey="rows" name="Imported Records" fill="#0EA5E9" radius={[4, 4, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-slate-500 font-mono">
              No recent batch uploads recorded.
            </div>
          )}
        </div>
      </div>

      {/* Recent Ingestions Table */}
      <div className="bg-[#111726] border border-slate-800 rounded-md p-5">
        <h3 className="text-sm font-semibold text-white mb-4">
          Recent Data Ingestion Batches
        </h3>

        {background.recentImports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="pb-3 font-medium">FILE NAME</th>
                  <th className="pb-3 font-medium">RECORDS</th>
                  <th className="pb-3 font-medium">STATUS</th>
                  <th className="pb-3 font-medium">OPERATOR</th>
                  <th className="pb-3 font-medium">DATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {background.recentImports.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 text-white font-sans font-medium flex items-center gap-2">
                      <FileSpreadsheet className="h-3.5 w-3.5 text-[#0EA5E9]" />
                      {item.fileName || "Dataset.xlsx"}
                    </td>
                    <td className="py-3 text-slate-300">
                      {item.recordsImported ? item.recordsImported.toLocaleString() : "0"}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-medium rounded border ${
                          item.outcome === "success"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : item.outcome === "partial"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}
                      >
                        {item.outcome || "success"}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">{item.user || "System"}</td>
                    <td className="py-3 text-slate-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-500 font-mono py-4">No recent import batches found.</p>
        )}
      </div>

      {/* Recent Scheduled Exports Table */}
      <div className="bg-[#111726] border border-slate-800 rounded-md p-5">
        <h3 className="text-sm font-semibold text-white mb-4">
          Recent Scheduled Export Generations
        </h3>

        {background.recentExports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="pb-3 font-medium">DESCRIPTION</th>
                  <th className="pb-3 font-medium">RECIPIENT / OPERATOR</th>
                  <th className="pb-3 font-medium">STATUS</th>
                  <th className="pb-3 font-medium">DISPATCHED AT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {background.recentExports.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 text-white font-sans font-medium">{item.details || "Scheduled export"}</td>
                    <td className="py-3 text-slate-400">{item.user || "System"}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {item.outcome || "success"}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-500 font-mono py-4">No scheduled exports generated recently.</p>
        )}
      </div>
    </div>
  );
}
