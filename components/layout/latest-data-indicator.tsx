"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronUp,
  ChevronDown,
  RefreshCw,
  MapPin,
  Clock,
  FileSpreadsheet,
  ArrowUpRight,
  X
} from "lucide-react";
import { useMapContext } from "@/context/MapContext";
import { getCrimeTypeColor } from "@/hooks/useCrimeTypes";

interface LatestCrimeData {
  latestIncident: {
    id: string;
    incidentType: string;
    barangay: string;
    dateCommitted: string;
    timeCommitted: string;
    dateReported?: string;
    timeReported?: string;
    caseStatus?: string;
    blotterNo?: string;
    modus?: string;
    stageOfFelony?: string;
    latitude?: number;
    longitude?: number;
    createdAt?: string;
  } | null;
  totalCount: number;
  lastUpload: {
    fileName?: string;
    recordsImported?: number;
    createdAt: string;
  } | null;
  serverTime: string;
}

export default function LatestDataIndicator() {
  const router = useRouter();
  const { selectedBarangay, setSelectedBarangay, barangayNames } = useMapContext();
  const [data, setData] = useState<LatestCrimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close popup card on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded]);

  const fetchLatestData = useCallback(async (showRefreshingState = false) => {
    if (showRefreshingState) setRefreshing(true);
    try {
      const params = new URLSearchParams();
      if (selectedBarangay && selectedBarangay !== "General Dashboard") {
        params.append("barangay", selectedBarangay);
      }
      const res = await fetch(`/api/crimes/latest?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      }
    } catch (err) {
      console.error("Error fetching latest crime data:", err);
    } finally {
      setLoading(false);
      if (showRefreshingState) {
        setTimeout(() => setRefreshing(false), 600);
      }
    }
  }, [selectedBarangay]);

  useEffect(() => {
    fetchLatestData();
    const interval = setInterval(() => {
      fetchLatestData();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchLatestData]);

  if (!mounted) return null;

  // Helper to format relative time
  const formatTimeAgo = (dateString?: string, timeString?: string) => {
    if (!dateString) return "Unknown";
    try {
      const incidentDate = new Date(dateString);
      if (timeString) {
        const [hours, minutes] = timeString.split(":").map(Number);
        if (!isNaN(hours) && !isNaN(minutes)) {
          incidentDate.setHours(hours, minutes, 0, 0);
        }
      }
      const now = new Date();
      const diffMs = now.getTime() - incidentDate.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 5) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 30) return `${diffDays}d ago`;

      return incidentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const incident = data?.latestIncident;
  const crimeColor = incident ? getCrimeTypeColor(incident.incidentType) : "#0EA5E9";

  // Handle focusing / zooming on barangay
  const handleSelectIncidentBarangay = (bName: string) => {
    // Match exact GeoJSON barangay name (e.g. "Bucal" for "BUCAL")
    const matched = barangayNames.find(
      (b) => b.toLowerCase().trim() === bName.toLowerCase().trim() ||
             bName.toLowerCase().trim().includes(b.toLowerCase().trim())
    ) || bName;

    setSelectedBarangay(matched);
    setIsExpanded(false);
  };

  const isCurrentBarangaySelected = Boolean(
    incident &&
    selectedBarangay &&
    (selectedBarangay.toLowerCase().trim() === incident.barangay.toLowerCase().trim() ||
     incident.barangay.toLowerCase().trim().includes(selectedBarangay.toLowerCase().trim()))
  );

  return (
    <div
      ref={containerRef}
      data-tour="latest-data-indicator"
      className="pointer-events-auto relative flex flex-col items-end max-w-[calc(100vw-24px)]"
    >
      {/* ── POPUP CARD WHEN CLICKED ── */}
      {isExpanded && (
        <div className="mb-2 w-[320px] sm:w-[360px] max-w-[calc(100vw-24px)] rounded-2xl border border-slate-200 dark:border-white/[0.09] bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.75)] overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-200 origin-bottom-right">
          {/* Top glow accent */}
          <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500 via-[#0EA5E9] to-[#6366F1]" />

          {/* Card Header */}
          <div className="flex items-center justify-between p-3.5 border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                Latest Incident Feed
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => fetchLatestData(true)}
                disabled={refreshing}
                className="p-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-50"
                title="Refresh latest data"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-[#0EA5E9]" : ""}`} />
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                title="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-4 space-y-3">
            {loading ? (
              <div className="py-6 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
                <div className="w-5 h-5 border-2 border-[#0EA5E9] border-t-transparent rounded-full animate-spin" />
                <span>Checking latest records…</span>
              </div>
            ) : incident ? (
              <>
                {/* Main Incident Card */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.05] space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: crimeColor }}
                      />
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {incident.incidentType}
                      </span>
                    </div>

                    {incident.caseStatus && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#0EA5E9]/10 text-[#0284C7] dark:text-[#38BDF8] border border-[#0EA5E9]/20">
                        {incident.caseStatus}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[12px] text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-medium">{incident.barangay}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{formatTimeAgo(incident.dateCommitted, incident.timeCommitted)}</span>
                    </div>
                  </div>

                  {/* Date details */}
                  <div className="pt-2 border-t border-slate-200/60 dark:border-white/[0.04] text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span>Committed:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200 tabular-nums">
                      {new Date(incident.dateCommitted).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      at {incident.timeCommitted}
                    </span>
                  </div>
                </div>

                {/* Upload metadata - Clickable to redirect to raw data table */}
                {data?.lastUpload && (
                  <button
                    onClick={() => {
                      setIsExpanded(false);
                      router.push("/dashboard/cases");
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-50/80 dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/[0.07] border border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between text-[11px] transition-all cursor-pointer group text-left shadow-sm"
                    title="Click to view raw data table in Cases"
                  >
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 truncate pr-2">
                      <div className="p-1.5 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
                        <FileSpreadsheet className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-[#0EA5E9] transition-colors">
                          {data.lastUpload.fileName || "Excel Dataset"}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {data.lastUpload.recordsImported ? `${data.lastUpload.recordsImported.toLocaleString()} records • ` : ""}Click to view raw data
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 group-hover:text-[#0EA5E9] shrink-0">
                      <span className="text-[10px]">
                        {formatTimeAgo(data.lastUpload.createdAt)}
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </button>
                )}

                {/* Action button: Focus / Zoom on this barangay */}
                {!isCurrentBarangaySelected && (
                  <button
                    onClick={() => handleSelectIncidentBarangay(incident.barangay)}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#0EA5E9]/10 hover:bg-[#0EA5E9] text-[#0284C7] hover:text-white dark:text-[#38BDF8] dark:hover:text-white transition-all text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Filter map to {incident.barangay}</span>
                  </button>
                )}
              </>
            ) : (
              <div className="py-6 text-center text-slate-400 text-xs">
                No recent incidents found for the selected filter.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TRIGGER BUTTON PILL ── */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2.5 sm:gap-3 h-11 pl-3 pr-3.5 rounded-2xl bg-white/95 dark:bg-[#0F172A]/90 backdrop-blur-2xl border border-slate-200/90 dark:border-white/[0.09] shadow-lg dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 cursor-pointer group hover:border-slate-300 dark:hover:border-[#0EA5E9]/30 ${
          isExpanded ? "ring-2 ring-[#0EA5E9]/30 border-[#0EA5E9]/40" : ""
        }`}
        title="Click to view latest crime data details"
      >
        {/* Glowing pulse indicator */}
        <div className="relative flex items-center justify-center">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>

        {/* Incident Message Info */}
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 dark:text-slate-500">
              Latest Incident
            </span>
            {incident && (
              <span className="text-[10px] text-slate-400 dark:text-slate-500">•</span>
            )}
            {incident && (
              <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                {formatTimeAgo(incident.dateCommitted, incident.timeCommitted)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
            {loading ? (
              <span className="text-slate-400 font-normal">Loading updates…</span>
            ) : incident ? (
              <div className="flex items-center gap-1.5 truncate max-w-[200px] sm:max-w-[260px]">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: crimeColor }}
                />
                <span className="truncate">{incident.incidentType}</span>
                <span className="text-slate-400 font-normal">in</span>
                <span className="text-[#0EA5E9] truncate">{incident.barangay}</span>
              </div>
            ) : (
              <span className="text-slate-500">Database Synchronized</span>
            )}
          </div>
        </div>

        {/* Chevron toggle icon */}
        <div className="ml-1 text-slate-400 group-hover:text-[#0EA5E9] transition-colors">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </div>
      </button>
    </div>
  );
}
