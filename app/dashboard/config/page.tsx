"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapProvider } from "@/context/MapContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { ArrowLeft, Settings, FileSpreadsheet, CheckCircle2, XCircle, AlertCircle, Clock, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadLog {
  id: string;
  fileName: string;
  fileSize: number;
  recordsImported: number;
  status: string;
  errorMessage?: string;
  uploadedBy?: string;
  uploadedAt: string;
}

function ConfigContent() {
  const router = useRouter();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<"settings" | "upload-logs">("settings");
  
  const [logs, setLogs] = useState<UploadLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/upload-logs?limit=100');
      const data = await response.json();
      
      if (data.success) {
        setLogs(data.logs);
        setTotal(data.total);
      }
    } catch (error) {
      console.error('Error loading upload logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "upload-logs") {
      loadLogs();
    }
  }, [activeTab]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case 'partial':
        return <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
      default:
        return <FileSpreadsheet className="h-5 w-5 text-slate-600 dark:text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300';
      case 'failed':
        return 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-300';
      case 'partial':
        return 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-300';
      default:
        return 'bg-slate-50 dark:bg-slate-500/10 border-slate-200 dark:border-slate-500/20 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className={`flex flex-col h-screen transition-colors duration-700 overflow-hidden font-sans ${
      theme === "dark" ? "bg-[#0f172a] text-slate-100" : "bg-[#f1f5f9] text-slate-900"
    }`}>
      {/* Header with Back Button */}
      <header className={`w-full bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/[0.06] pointer-events-auto z-50`}>
        <div className="flex items-center h-16 px-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          
          <div className="ml-8 flex items-center gap-3">
            <Settings className="h-5 w-5 text-[#0EA5E9]" />
            <h1 className="text-lg font-semibold text-white">Settings</h1>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className={`flex items-center gap-1 px-8 py-4 border-b ${
        theme === "dark" ? "bg-[#0f172a]/80 border-white/[0.04]" : "bg-white/60 border-slate-200/60"
      }`}>
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === "settings"
              ? "bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/20"
              : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          Settings
        </button>
        <button
          onClick={() => setActiveTab("upload-logs")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === "upload-logs"
              ? "bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/20"
              : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          Upload Logs
        </button>
      </div>

      <main className={`flex-1 flex flex-col min-w-0 overflow-hidden ${
        theme === "dark" ? "bg-[#0f172a]" : "bg-[#f1f5f9]"
      }`}>
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 custom-scrollbar scroll-smooth">
          {activeTab === "settings" ? (
            <div className={`rounded-xl border p-8 ${
              theme === "dark" 
                ? "bg-slate-900/50 border-slate-800" 
                : "bg-white border-slate-200"
            }`}>
              <h2 className="text-xl font-semibold mb-4">Application Settings</h2>
              <p className="text-slate-500 dark:text-slate-400">
                Settings configuration will be available here.
              </p>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`p-6 rounded-xl border ${
                      theme === "dark" 
                        ? "bg-slate-900/50 border-slate-800" 
                        : "bg-white border-slate-200"
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg ${theme === "dark" ? "bg-white/10" : "bg-slate-300"}`}></div>
                        <div className="flex-1">
                          <div className={`h-8 w-16 rounded mb-2 ${theme === "dark" ? "bg-white/10" : "bg-slate-300"}`}></div>
                          <div className={`h-4 w-24 rounded ${theme === "dark" ? "bg-white/10" : "bg-slate-300"}`}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className={`p-6 rounded-xl border ${
                    theme === "dark" 
                      ? "bg-slate-900/50 border-slate-800" 
                      : "bg-white border-slate-200"
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
                        <FileSpreadsheet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                          {total}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          Total Uploads
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`p-6 rounded-xl border ${
                    theme === "dark" 
                      ? "bg-slate-900/50 border-slate-800" 
                      : "bg-white border-slate-200"
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                          {logs.filter(l => l.status === 'success').length}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          Successful
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`p-6 rounded-xl border ${
                    theme === "dark" 
                      ? "bg-slate-900/50 border-slate-800" 
                      : "bg-white border-slate-200"
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center">
                        <Download className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                          {logs.reduce((sum, log) => sum + log.recordsImported, 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          Total Records
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Logs Table */}
              <div className={`rounded-xl border overflow-hidden ${
                theme === "dark" 
                  ? "bg-slate-900/50 border-slate-800" 
                  : "bg-white border-slate-200"
              }`}>
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Upload History
                  </h2>
                  <Button
                    onClick={loadLogs}
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                </div>

                {loading ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className={`${
                        theme === "dark" ? "bg-slate-800/50" : "bg-slate-50"
                      }`}>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            File Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Size
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Records
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Uploaded At
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800 animate-pulse">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                          <tr key={i}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`h-5 w-5 rounded ${theme === "dark" ? "bg-white/10" : "bg-slate-300"}`}></div>
                                <div className={`h-4 w-64 rounded ${theme === "dark" ? "bg-white/10" : "bg-slate-300"}`}></div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className={`h-4 w-20 rounded ${theme === "dark" ? "bg-white/10" : "bg-slate-300"}`}></div>
                            </td>
                            <td className="px-6 py-4">
                              <div className={`h-6 w-16 rounded ${theme === "dark" ? "bg-white/10" : "bg-slate-300"}`}></div>
                            </td>
                            <td className="px-6 py-4">
                              <div className={`h-6 w-24 rounded-lg ${theme === "dark" ? "bg-white/10" : "bg-slate-300"}`}></div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className={`h-4 w-4 rounded ${theme === "dark" ? "bg-white/10" : "bg-slate-300"}`}></div>
                                <div className={`h-4 w-32 rounded ${theme === "dark" ? "bg-white/10" : "bg-slate-300"}`}></div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : logs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                      <FileSpreadsheet className="h-10 w-10 text-slate-400 dark:text-slate-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      No Upload Logs
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                      Upload history will appear here once you successfully import data files
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className={`${
                        theme === "dark" ? "bg-slate-800/50" : "bg-slate-50"
                      }`}>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            File Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Size
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Records
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Uploaded At
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {logs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {getStatusIcon(log.status)}
                                <div>
                                  <div className="font-medium text-slate-900 dark:text-white">
                                    {log.fileName}
                                  </div>
                                  {log.errorMessage && (
                                    <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                                      {log.errorMessage}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                              {formatFileSize(log.fileSize)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-lg font-semibold text-slate-900 dark:text-white">
                                {log.recordsImported.toLocaleString()}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${getStatusColor(log.status)}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                  log.status === 'success' ? 'bg-emerald-500' :
                                  log.status === 'failed' ? 'bg-red-500' :
                                  log.status === 'partial' ? 'bg-amber-500' :
                                  'bg-slate-500'
                                }`}></div>
                                {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <Clock className="h-4 w-4" />
                                {formatDate(log.uploadedAt)}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ConfigPage() {
  return (
    <ThemeProvider>
      <MapProvider>
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
          <ConfigContent />
        </Suspense>
      </MapProvider>
    </ThemeProvider>
  );
}
