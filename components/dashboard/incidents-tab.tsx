"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Search, MapPin, Calendar, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/context/ThemeContext";
import { useMapContext } from "@/context/MapContext";
import { useTimeRangeData } from "@/hooks/useTimeRangeData";
import { extractCrimeType } from "@/hooks/useCrimeTypes";
import { fetchCrimes, CrimeIncident } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
interface IncidentsTabProps {
  barangayName?: string;
}

/**
 * A labelled filter dropdown on Radix Select, so the open list is a rounded,
 * themed popover instead of the browser's square native menu.
 */
function FilterSelect({
  label,
  value,
  onChange,
  options,
  dark,
  labelClass,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  dark: boolean;
  labelClass: string;
}) {
  return (
    <div>
      <span className={`${labelClass} mb-2 block`}>{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          aria-label={label}
          className={`w-full rounded-lg px-3 text-sm focus-visible:border-sky-500/50 focus-visible:ring-sky-500/30 data-[size=default]:h-10 ${
            dark
              ? "border-white/10 bg-[#0f172a] text-white hover:bg-[#0f172a] dark:bg-[#0f172a] dark:hover:bg-[#0f172a]"
              : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
          }`}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          className={`rounded-xl border p-1 shadow-lg ${
            dark ? "border-white/10 bg-[#1e293b] text-slate-100" : "border-slate-200 bg-white text-slate-900"
          }`}
        >
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
              // The chosen option is tinted sky with bold text (the check mark follows the
              // text colour); hover/keyboard focus is a neutral fill, a touch stronger on
              // the chosen one so it still reads as focused.
              // outline-none! because app/globals.css draws a sky outline on every
              // :focus-visible, which would ring the highlighted row on top of its fill.
              className={`rounded-lg py-2 text-sm data-[state=checked]:font-semibold focus-visible:outline-none! ${
                dark
                  ? "focus:bg-white/10 focus:text-white data-[state=checked]:bg-sky-400/15 data-[state=checked]:text-sky-300 data-[state=checked]:focus:bg-sky-400/25 data-[state=checked]:focus:text-sky-200"
                  : "focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-sky-50 data-[state=checked]:text-sky-700 data-[state=checked]:focus:bg-sky-100 data-[state=checked]:focus:text-sky-800"
              }`}
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default function IncidentsTab({ barangayName }: IncidentsTabProps) {
  const { theme } = useTheme();
  const { timeRange } = useMapContext();
  const dateRanges = useTimeRangeData();
  const [cases, setCases] = useState<CrimeIncident[]>([]);
  const [filteredCases, setFilteredCases] = useState<CrimeIncident[]>([]);
  const [selectedCase, setSelectedCase] = useState<CrimeIncident | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [crimeTypeFilter, setCrimeTypeFilter] = useState("(All)");
  const [dateRangeFilter, setDateRangeFilter] = useState("(All)");
  const [barangayFilter, setBarangayFilter] = useState("(All)");
  const [statusFilter, setStatusFilter] = useState("(All)");
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // 20 items per page
  const targetCaseId = useSearchParams().get("case");
  const handledCaseRef = useRef<string | null>(null);

  const isGeneralDashboard = !barangayName || barangayName === "General Dashboard";

  // Fetch cases from backend
  useEffect(() => {
    // Don't fetch until time range has selections
    if (dateRanges.length === 0) {
      console.log('⏳ Cases: Waiting for time range selections...')
      return
    }

    async function loadCases() {
      setLoading(true);
      try {
        console.log('📋 Loading Cases Data:', {
          barangayName,
          timeRange,
          dateRanges: dateRanges.map(r => ({ start: r.start.toISOString(), end: r.end.toISOString() })),
          timestamp: new Date().toISOString()
        })

        // Fetch data for all date ranges in parallel
        const fetchPromises = dateRanges.map(async ({ start, end }) => {
          const params: any = {
            startDateCommitted: start.toISOString(),
            endDateCommitted: end.toISOString()
          };

          // Only add additional date range filter if not "All"
          if (dateRangeFilter !== "(All)") {
            // Calculate additional date range filter
            const endDate = new Date();
            const startDate = new Date();

            if (dateRangeFilter === "(Last 7 Days)") {
              startDate.setDate(startDate.getDate() - 7);
            } else if (dateRangeFilter === "(Last 30 Days)") {
              startDate.setDate(startDate.getDate() - 30);
            } else if (dateRangeFilter === "(Last 90 Days)") {
              startDate.setDate(startDate.getDate() - 90);
            }

            // Use the more restrictive date range
            if (startDate > start) {
              params.startDateCommitted = startDate.toISOString();
            }
            if (endDate < end) {
              params.endDateCommitted = endDate.toISOString();
            }
          }

          // Add barangay filter for specific dashboard
          if (!isGeneralDashboard) {
            params.barangay = barangayName;
          } else if (barangayFilter !== "(All)") {
            params.barangay = barangayFilter;
          }

          // Add crime type filter
          if (crimeTypeFilter !== "(All)") {
            params.incidentType = crimeTypeFilter;
          }

          // Add status filter
          if (statusFilter !== "(All)") {
            params.caseStatus = statusFilter;
          }

          return fetchCrimes(params);
        });

        const results = await Promise.all(fetchPromises);

        // Combine all results and remove duplicates by id
        const allCases = results.flat();
        const uniqueCases = Array.from(
          new Map(allCases.map(crime => [crime.id, crime])).values()
        );

        // Sort by date committed (most recent first)
        uniqueCases.sort((a, b) =>
          new Date(b.dateCommitted).getTime() - new Date(a.dateCommitted).getTime()
        );

        setCases(uniqueCases);
        setFilteredCases(uniqueCases);

        // Auto-select first case
        if (uniqueCases.length > 0) {
          setSelectedCase(uniqueCases[0]);
        }
      } catch (error) {
        console.error("Error loading cases:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCases();
  }, [barangayName, isGeneralDashboard, crimeTypeFilter, dateRangeFilter, barangayFilter, statusFilter, timeRange, dateRanges]);

  // Filter cases based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredCases(cases);
      setCurrentPage(1); // Reset to first page when clearing search
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = cases.filter(
      (c) =>
        c.id.toLowerCase().includes(query) ||
        c.incidentType.toLowerCase().includes(query) ||
        c.barangay.toLowerCase().includes(query) ||
        (c.street && c.street.toLowerCase().includes(query))
    );
    setFilteredCases(filtered);
    setCurrentPage(1); // Reset to first page when searching
  }, [searchQuery, cases]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCases = filteredCases.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [crimeTypeFilter, dateRangeFilter, barangayFilter, statusFilter]);

  // Deep link from the analytics detail view (?case=<id>): select that case,
  // jump to the page it's on and open its details. This has to stay below the
  // effects above — they reset the page to 1 when `cases` changes, and this
  // one needs to run last in the same commit so its page wins.
  useEffect(() => {
    if (!targetCaseId || loading || handledCaseRef.current === targetCaseId) return;
    const index = cases.findIndex((c) => c.id === targetCaseId);
    if (index === -1) return;
    handledCaseRef.current = targetCaseId;
    setSelectedCase(cases[index]);
    setCurrentPage(Math.floor(index / itemsPerPage) + 1);
    setIsModalOpen(true);
  }, [targetCaseId, loading, cases, itemsPerPage]);

  // Get unique values for filters
  const crimeTypes = ["(All)", ...Array.from(new Set(cases.map((c) => c.incidentType)))];
  const barangays = ["(All)", ...Array.from(new Set(cases.map((c) => c.barangay)))];
  const statuses = ["(All)", "Cleared", "Under Investigation", "Filed in Court", "Archived", "Pending"];

  // Get status label based on caseStatus
  const getStatusLabel = (caseStatus?: string) => {
    if (!caseStatus) return "Pending";
    const statusLower = caseStatus.toLowerCase();
    if (statusLower.includes("cleared") || statusLower.includes("solved")) {
      return "Cleared";
    }
    if (statusLower.includes("investigation") || statusLower.includes("investigating")) {
      return "Under Investigation";
    }
    if (statusLower.includes("filed") || statusLower.includes("court")) {
      return "Filed in Court";
    }
    if (statusLower.includes("archived") || statusLower.includes("closed")) {
      return "Archived";
    }
    return "Pending";
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time to 12-hour with AM/PM
  const formatTime = (timeString: string) => {
    if (!timeString) return '';

    // If timeString is in HH:MM or HH:MM:SS format
    const parts = timeString.split(':');
    if (parts.length >= 2) {
      const hour = parseInt(parts[0]);
      const minute = parts[1];

      if (hour === 0) return `12:${minute} AM`;
      if (hour < 12) return `${hour}:${minute} AM`;
      if (hour === 12) return `12:${minute} PM`;
      return `${hour - 12}:${minute} PM`;
    }

    return timeString;
  };

  // Generate case ID display
  const getCaseId = (crime: CrimeIncident) => {
    const date = new Date(crime.dateCommitted);
    const year = date.getFullYear();
    const idNum = crime.id.slice(0, 8).toUpperCase();
    return `TZ-${year}-${idNum}`;
  };
  const dark = theme === "dark";
  const mutedText = dark ? "text-slate-400" : "text-slate-500";
  const surface = `rounded-xl border ${dark ? "border-white/[0.06] bg-[#1e293b]" : "border-slate-200 bg-white"}`;
  const hairline = dark ? "border-white/[0.06]" : "border-slate-100";
  const labelClass = `text-[0.68rem] font-bold uppercase tracking-[0.11em] ${mutedText}`;
  // A section heading ("Classification") reads too much like the field labels beneath it
  // ("Offense classification") when both share the same size, weight and muted color —
  // this one takes the sky accent used for section headers elsewhere so the two tiers
  // are told apart at a glance instead of by reading order alone.
  const sectionLabelClass = "text-[0.72rem] font-bold uppercase tracking-[0.11em] text-sky-600 dark:text-sky-400";
  const columns = "1.2fr 1.1fr 1.7fr 1fr 1.1fr";

  // Text-only color for a status label — no pill, for places (like the full-detail
  // header) where a badge reads as a small compact-card widget rather than part of
  // the record itself.
  const statusTextTone = (caseStatus?: string) => {
    const label = getStatusLabel(caseStatus);
    return label === "Cleared"
      ? "text-emerald-600 dark:text-emerald-400"
      : label === "Under Investigation"
        ? "text-blue-600 dark:text-blue-400"
        : label === "Filed in Court"
          ? "text-purple-600 dark:text-purple-400"
          : label === "Archived"
            ? mutedText
            : "text-amber-600 dark:text-amber-500";
  };

  const statusChip = (caseStatus?: string) => {
    const label = getStatusLabel(caseStatus);
    const tone =
      label === "Cleared"
        ? "bg-emerald-500/10 text-emerald-500"
        : label === "Under Investigation"
          ? "bg-blue-500/10 text-blue-500"
          : label === "Filed in Court"
            ? "bg-purple-500/10 text-purple-500"
            : label === "Archived"
              ? "bg-slate-500/10 text-slate-500"
              : "bg-yellow-500/10 text-yellow-600";
    return (
      <span className={`inline-flex w-max items-center rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>
        {label}
      </span>
    );
  };

  const filtersActive =
    searchQuery !== "" ||
    crimeTypeFilter !== "(All)" ||
    dateRangeFilter !== "(All)" ||
    statusFilter !== "(All)" ||
    (isGeneralDashboard && barangayFilter !== "(All)");

  const clearFilters = () => {
    setSearchQuery("");
    setCrimeTypeFilter("(All)");
    setDateRangeFilter("(All)");
    setBarangayFilter("(All)");
    setStatusFilter("(All)");
  };

  if (loading) {
    const bone = dark ? "bg-white/10" : "bg-slate-200";
    return (
      <div
        className="max-w-[1280px] mx-auto space-y-6 animate-pulse"
        role="status"
        aria-busy="true"
        aria-label="Loading cases"
      >
        <header className={`flex flex-wrap items-end justify-between gap-4 border-b pb-[22px] ${dark ? "border-white/5" : "border-slate-200"}`}>
          <div className="max-w-lg">
            <h2 className={`text-3xl font-bold tracking-tight mb-1.5 ${dark ? "text-white" : "text-slate-900"}`}>Crime Cases</h2>
            <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-600"}`}>
              {isGeneralDashboard ? "All recorded cases across Tanza, Cavite" : `Recorded cases in Brgy. ${barangayName}`}
            </p>
          </div>
          <dl className="text-right">
            <dt className={`text-[12px] font-semibold uppercase tracking-[0.14em] ${dark ? "text-slate-500" : "text-slate-400"}`}>
              Matching Cases
            </dt>
            <dd className="mt-1.5 flex justify-end">
              <div className={`h-6 w-14 rounded ${bone}`} />
            </dd>
          </dl>
        </header>

        <section>
          <div className={`${surface} space-y-4`} style={{ padding: 18 }}>
            <div className={`h-11 rounded-lg ${bone}`} />
            <div className={`grid grid-cols-1 gap-4 ${isGeneralDashboard ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
              {Array.from({ length: isGeneralDashboard ? 4 : 3 }, (_, i) => (
                <div key={i}>
                  <div className={`mb-2 h-3 w-20 rounded ${bone}`} />
                  <div className={`h-10 rounded-lg ${bone}`} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="grid grid-cols-1 xl:grid-cols-[1.7fr_1fr] gap-[18px]">
            <div className={`${surface} overflow-hidden`}>
              <div className={`grid gap-4 border-b ${hairline}`} style={{ gridTemplateColumns: columns, padding: "12px 22px" }}>
                {["Case ID", "Type", "Location", "Date", "Status"].map((h) => (
                  <span key={h} className={labelClass}>{h}</span>
                ))}
              </div>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className={`grid items-center gap-4 border-b ${hairline}`} style={{ gridTemplateColumns: columns, padding: "14px 22px" }}>
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className={`h-3.5 rounded ${bone}`} style={{ width: `${55 + ((i * j * 11) % 40)}%` }} />
                  ))}
                  <div className={`h-6 w-24 rounded-full ${bone}`} />
                </div>
              ))}
            </div>

            <div className={`${surface} space-y-5`} style={{ padding: 22 }}>
              <div>
                <div className={`h-5 w-3/4 rounded ${bone}`} />
                <div className={`mt-2 h-3 w-1/2 rounded ${bone}`} />
              </div>
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <div className={`mb-2 h-3 w-20 rounded ${bone}`} />
                  <div className={`h-4 rounded ${bone}`} style={{ width: `${60 + i * 8}%` }} />
                </div>
              ))}
              <div className={`h-40 rounded-lg ${bone}`} />
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <header
        className={`flex flex-wrap items-end justify-between gap-4 border-b pb-[22px] ${dark ? "border-white/5" : "border-slate-200"}`}
      >
        <div className="max-w-lg">
          <h2 className={`text-3xl font-bold tracking-tight mb-1.5 ${dark ? "text-white" : "text-slate-900"}`}>
            Crime Cases
          </h2>
          <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-600"}`}>
            {isGeneralDashboard ? "All recorded cases across Tanza, Cavite" : `Recorded cases in Brgy. ${barangayName}`}
          </p>
        </div>
        <dl className="text-right">
          <dt className={`text-[12px] font-semibold uppercase tracking-[0.14em] ${dark ? "text-slate-500" : "text-slate-400"}`}>
            {filtersActive ? "Matching Cases" : "Total Cases"}
          </dt>
          <dd className={`mt-1.5 text-lg font-semibold ${dark ? "text-white" : "text-slate-900"}`}>
            {filteredCases.length.toLocaleString()}
          </dd>
        </dl>
      </header>

      {/* Search & filters */}
      <section data-tour="cases-controls">
        <div className={`${surface} space-y-4`} style={{ padding: 18 }}>
          <div className="relative">
            <Search className={`absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${mutedText}`} />
            <input
              type="text"
              placeholder="Search cases by ID, type, location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white placeholder-slate-500"
                  : "border-slate-200 bg-white text-slate-900 placeholder-slate-400"
              }`}
            />
          </div>

          <div className={`grid grid-cols-1 gap-4 ${isGeneralDashboard ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
            <FilterSelect label="Crime Type" value={crimeTypeFilter} onChange={setCrimeTypeFilter} options={crimeTypes} dark={dark} labelClass={labelClass} />
            <FilterSelect
              label="Date Range"
              value={dateRangeFilter}
              onChange={setDateRangeFilter}
              options={["(All)", "(Last 7 Days)", "(Last 30 Days)", "(Last 90 Days)"]}
              dark={dark}
              labelClass={labelClass}
            />
            {/* Barangay Filter - Only show for general dashboard */}
            {isGeneralDashboard && (
              <FilterSelect label="Barangay" value={barangayFilter} onChange={setBarangayFilter} options={barangays} dark={dark} labelClass={labelClass} />
            )}
            <FilterSelect label="Status" value={statusFilter} onChange={setStatusFilter} options={statuses} dark={dark} labelClass={labelClass} />
          </div>

          {filtersActive && (
            <div className={`flex items-center justify-between border-t pt-3 text-xs ${hairline}`}>
              <span className={mutedText}>
                {filteredCases.length.toLocaleString()} of {cases.length.toLocaleString()} cases match
              </span>
              <button
                onClick={clearFilters}
                className="font-semibold text-sky-600 transition-colors hover:text-sky-500 dark:text-sky-400"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* List & details */}
      <section>
        <div className="grid grid-cols-1 xl:grid-cols-[1.7fr_1fr] gap-[18px]">
          {/* Cases List */}
          <div data-tour="cases-list" className={`${surface} overflow-hidden self-start`}>
            <div className="overflow-x-auto">
              <div className="min-w-[640px]">
                <div
                  className={`grid gap-4 border-b ${hairline}`}
                  style={{ gridTemplateColumns: columns, padding: "12px 22px" }}
                >
                  {["Case ID", "Type", "Location", "Date", "Status"].map((h) => (
                    <span key={h} className={labelClass}>{h}</span>
                  ))}
                </div>

                <div className="max-h-[640px] overflow-y-auto">
                  {filteredCases.length === 0 ? (
                    <div className={`flex h-56 flex-col items-center justify-center gap-1 text-sm ${mutedText}`}>
                      <p>No cases found</p>
                      {filtersActive && (
                        <button onClick={clearFilters} className="font-semibold text-sky-600 hover:text-sky-500 dark:text-sky-400">
                          Clear filters
                        </button>
                      )}
                    </div>
                  ) : (
                    currentCases.map((crime) => {
                      const selected = selectedCase?.id === crime.id;
                      return (
                        <div
                          key={crime.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => setSelectedCase(crime)}
                          // Double-click (or Enter on the already-selected row) opens the full view.
                          onDoubleClick={() => {
                            setSelectedCase(crime);
                            setIsModalOpen(true);
                          }}
                          title="Double-click to open full details"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              if (selected && e.key === "Enter") setIsModalOpen(true);
                              else setSelectedCase(crime);
                            }
                          }}
                          aria-pressed={selected}
                          className={`grid cursor-pointer items-center gap-4 border-b text-[0.82rem] outline-none transition-colors ${hairline} ${
                            selected
                              ? dark
                                ? "bg-sky-400/[0.08] shadow-[inset_3px_0_0_#38bdf8]"
                                : "bg-sky-50 shadow-[inset_3px_0_0_#0369a1]"
                              : dark
                                ? "hover:bg-white/[0.03] focus-visible:bg-white/[0.03]"
                                : "hover:bg-slate-50 focus-visible:bg-slate-50"
                          }`}
                          style={{ gridTemplateColumns: columns, padding: "13px 22px" }}
                        >
                          <span className={`truncate font-semibold tabular-nums ${dark ? "text-slate-100" : "text-slate-900"}`} title={getCaseId(crime)}>
                            {getCaseId(crime)}
                          </span>
                          <span className={`truncate ${dark ? "text-slate-300" : "text-slate-700"}`} title={crime.incidentType}>
                            {extractCrimeType(crime.incidentType)}
                          </span>
                          <span className={`truncate ${dark ? "text-slate-400" : "text-slate-600"}`}>
                            {crime.street ? `${crime.street}, ${crime.barangay}` : crime.barangay}
                          </span>
                          <span className={`tabular-nums ${dark ? "text-slate-400" : "text-slate-600"}`}>
                            {formatDate(crime.dateCommitted)}
                          </span>
                          {statusChip(crime.caseStatus)}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Pagination */}
            {filteredCases.length > 0 && (
              <div className={`flex flex-wrap items-center justify-between gap-3 border-t ${hairline}`} style={{ padding: "12px 22px" }}>
                <div className={`text-xs ${mutedText}`}>
                  Showing {startIndex + 1}–{Math.min(endIndex, filteredCases.length)} of {filteredCases.length.toLocaleString()} cases
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                      dark ? "text-slate-300 hover:bg-white/10" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        aria-current={currentPage === pageNum ? "page" : undefined}
                        className={`h-8 min-w-8 rounded-lg px-2 text-xs font-semibold tabular-nums transition-colors ${
                          currentPage === pageNum
                            ? "bg-sky-500/15 text-sky-600 dark:text-sky-400"
                            : dark
                              ? "text-slate-300 hover:bg-white/10"
                              : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                      dark ? "text-slate-300 hover:bg-white/10" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Case Details Panel — a compact card: map cover, headline facts, then
              short previews of the long text. Stays in view while you scroll the list. */}
          <div
            data-tour="cases-details-panel"
            className={`${surface} self-start overflow-hidden xl:sticky xl:top-0`}
          >
            {selectedCase ? (
              (() => {
                const c = selectedCase;
                const hasMap = Boolean(c.latitude && c.longitude);
                const facts = [
                  { label: "Blotter No.", value: c.blotterNo },
                  { label: "Type of place", value: c.typeOfPlace },
                  { label: "Suspects", value: c.suspectCount },
                  { label: "Victims", value: c.victimCount },
                  { label: "Investigator", value: c.investigator },
                ].filter((f) => f.value !== undefined && f.value !== null && f.value !== "");
                const previews = [
                  { label: "Description", text: c.offense },
                  { label: "Modus operandi", text: c.modus },
                  { label: "Suspect motive", text: c.suspectMotive },
                ].filter((p) => p.text);
                const body = dark ? "text-slate-300" : "text-slate-700";

                // Pinned to the top of the card so it's always in reach.
                const expand = (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    title="Open the full case record (or double-click a row)"
                    aria-label="Open full case details"
                    // Black on white in both themes, so it stands out from the card without color.
                    className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                    Full details
                  </button>
                );

                return (
                  <>
                    <div className="space-y-4" style={{ padding: 20 }}>
                      {/* Identity */}
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <p className={`${labelClass} tabular-nums`}>{getCaseId(c)}</p>
                          {expand}
                        </div>
                        <h3
                          className={`font-heading mt-1 text-lg font-bold leading-snug ${dark ? "text-white" : "text-slate-900"}`}
                        >
                          {extractCrimeType(c.incidentType)}
                        </h3>
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                          {statusChip(c.caseStatus)}
                          <span className={`flex items-center gap-1.5 text-xs ${mutedText}`}>
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(c.dateCommitted)} · {formatTime(c.timeCommitted)}
                          </span>
                        </div>
                        <p className={`mt-2 flex items-start gap-1.5 text-[0.82rem] ${body}`}>
                          <MapPin className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${mutedText}`} />
                          <span>
                            {c.street ? `${c.street}, ` : ""}Brgy. {c.barangay}
                          </span>
                        </p>
                      </div>

                      {/* Headline facts — only the ones this case actually has */}
                      {facts.length > 0 && (
                        <dl className={`grid grid-cols-2 gap-x-4 gap-y-3 border-t pt-4 ${hairline}`}>
                          {facts.map((f) => (
                            <div key={f.label} className="min-w-0">
                              <dt className={labelClass}>{f.label}</dt>
                              <dd className={`mt-0.5 truncate text-[0.82rem] font-medium ${dark ? "text-slate-100" : "text-slate-800"}`} title={String(f.value)}>
                                {f.value}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      )}

                      {/* Long text, previewed — the rest is in the full view (opened via
                          the "Full details" button pinned at the top of this panel). */}
                      {previews.length > 0 && (
                        <div className={`space-y-3 border-t pt-4 ${hairline}`}>
                          {previews.map((p) => (
                            <div key={p.label}>
                              <h4 className={`${labelClass} mb-1`}>{p.label}</h4>
                              <p className={`line-clamp-3 text-[0.82rem] leading-relaxed ${body}`}>{p.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Location map — last, so nothing competes with the header above */}
                    {hasMap && (
                      <div className={`relative h-36 border-t ${hairline}`}>
                        {/* A thumbnail, not a control: it stays inert so it never traps the
                            page scroll, and the link opens the real map. */}
                        <iframe
                          title="Case location"
                          className="pointer-events-none h-full w-full"
                          frameBorder="0"
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${c.longitude! - 0.008},${c.latitude! - 0.005},${c.longitude! + 0.008},${c.latitude! + 0.005}&layer=mapnik&marker=${c.latitude},${c.longitude}`}
                        />
                        <a
                          href={`https://www.openstreetmap.org/?mlat=${c.latitude}&mlon=${c.longitude}#map=17/${c.latitude}/${c.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="absolute bottom-2 right-3 rounded bg-white/90 px-2 py-0.5 text-[0.65rem] font-semibold text-slate-700 shadow-sm hover:bg-white dark:bg-slate-900/85 dark:text-slate-200"
                        >
                          Open map ↗
                        </a>
                      </div>
                    )}
                  </>
                );
              })()
            ) : (
              <div className={`flex h-56 items-center justify-center text-sm ${mutedText}`}>
                Select a case to view details
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Full Details Modal — reads like a case record, not a table export: only the
          fields this case actually has, human phrasing instead of database columns,
          and the same identity/map treatment as the details panel it expands from. */}
      {selectedCase && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent
            className={`sm:max-w-4xl lg:max-w-5xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 ${
              dark ? "bg-[#1e293b] border-white/[0.06]" : "bg-white border-slate-200"
            }`}
          >
            {(() => {
              const c = selectedCase;
              const hasMap = Boolean(c.latitude && c.longitude);
              const body = dark ? "text-slate-300" : "text-slate-700";
              const valueClass = `mt-0.5 text-[0.82rem] font-medium ${dark ? "text-slate-100" : "text-slate-800"}`;

              // Text-only, no pill — a full-detail header reads as part of the record,
              // not as a strip of compact-card badges.
              const flagTone: Record<"rose" | "amber" | "purple", string> = {
                rose: "text-rose-600 dark:text-rose-400",
                amber: "text-amber-600 dark:text-amber-400",
                purple: "text-purple-600 dark:text-purple-400",
              };
              const flags = (
                [
                  c.heinous && { label: "Heinous crime", tone: "rose" },
                  c.sensational && { label: "Sensational", tone: "amber" },
                  c.threatGrp && { label: "Threat group involved", tone: "purple" },
                ] as const
              ).filter((f): f is { label: string; tone: "rose" | "amber" | "purple" } => Boolean(f));

              // Long-form fields, read as prose — only the ones this case has.
              const narrative = [
                { label: "Description", text: c.offense },
                { label: "Modus operandi", text: c.modus },
                {
                  label: "Suspect motive",
                  text: [c.suspectMotive, c.suspectSubMotive].filter(Boolean).join(" — ") || undefined,
                },
              ].filter((p) => p.text);

              const classification = [
                { label: "Offense classification", value: c.offenseType },
                { label: "Legal section", value: c.section },
                { label: "Stage of felony", value: c.stageOfFelony },
              ].filter((f) => f.value);

              const people = [
                { label: "Investigator", value: c.investigator },
                { label: "Lead investigator", value: c.headInves },
                { label: "No. of suspects", value: c.suspectCount },
                { label: "No. of victims", value: c.victimCount },
                { label: "Group affiliation", value: c.grpAffiliation },
              ].filter((f) => f.value !== undefined && f.value !== null && f.value !== "");

              // Bureaucratic record-keeping fields — real, but not what a reader comes
              // for. Grouped last, in a quieter card, instead of mixed into the story.
              const filing = [
                { label: "Blotter number", value: c.blotterNo },
                { label: "Type of place", value: c.typeOfPlace },
                { label: "Police community precinct", value: c.pcp },
                { label: "Station", value: c.stn },
                { label: "Provincial police office", value: c.ppo },
                { label: "Police regional office", value: c.pro },
                { label: "Province", value: c.province },
                { label: "Region", value: c.region },
                { label: "Logged into system", value: c.dateEncoded ? formatDate(c.dateEncoded) : undefined },
              ].filter((f) => f.value);

              return (
                <>
                  <DialogHeader className={`pb-6 border-b ${hairline}`}>
                    {/* Case ID is a reference caption, not part of what the two columns
                        below should align to — kept on its own line so the row underneath
                        starts at the type and status, not at this label. */}
                    <p className={`${labelClass} tabular-nums`}>{getCaseId(c)}</p>

                    {/* Identity on the left, the when/where on the right — side by side
                        instead of one long stack, so the header uses the card's width
                        instead of just its height. */}
                    {/* pr-8 keeps this clear of the dialog's own close button, which sits
                        inset from the card's outer edge rather than this padded content
                        area — without it, the right-aligned column (and, stacked on
                        mobile, the title itself) runs straight under the X. */}
                    <div className="mt-1 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 pr-8">
                      <div className="min-w-0">
                        <DialogTitle
                          className={`font-heading text-2xl font-bold leading-snug ${dark ? "text-white" : "text-slate-900"}`}
                        >
                          {extractCrimeType(c.incidentType)}
                        </DialogTitle>
                        {/* Status and flags as plain, colored text — a pill reads like a
                            compact-card widget; this is a full record, not a table row. */}
                        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold">
                          <span className={statusTextTone(c.caseStatus)}>{getStatusLabel(c.caseStatus)}</span>
                          {flags.map((f) => (
                            <React.Fragment key={f.label}>
                              <span className={`font-normal ${mutedText}`}>·</span>
                              <span className={flagTone[f.tone]}>{f.label}</span>
                            </React.Fragment>
                          ))}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 text-[0.85rem] sm:items-end sm:text-right shrink-0">
                        <span className={`flex items-center gap-2 ${mutedText}`}>
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          Committed {formatDate(c.dateCommitted)} · {formatTime(c.timeCommitted)}
                          {c.dateReported && ` — reported ${formatDate(c.dateReported)} · ${formatTime(c.timeReported)}`}
                        </span>
                        <span className={`flex items-start gap-2 ${body}`}>
                          <MapPin className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${mutedText}`} />
                          <span>
                            {c.street ? `${c.street}, ` : ""}Brgy. {c.barangay}
                            {c.municipal ? `, ${c.municipal}` : ""}
                          </span>
                        </span>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 pt-6">
                    {/* What happened, and who's involved */}
                    <div className="space-y-5">
                      {narrative.length > 0 && (
                        <div className="space-y-4">
                          {narrative.map((p) => (
                            <div key={p.label}>
                              <h4 className={`${labelClass} mb-1.5`}>{p.label}</h4>
                              <p className={`text-[0.88rem] leading-relaxed ${body}`}>{p.text}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {classification.length > 0 && (
                        <div className={`border-t pt-4 ${hairline}`}>
                          <h4 className={`${sectionLabelClass} mb-3`}>Classification</h4>
                          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                            {classification.map((f) => (
                              <div key={f.label} className="min-w-0">
                                <dt className={labelClass}>{f.label}</dt>
                                <dd className={valueClass}>{f.value}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      )}

                      {people.length > 0 && (
                        <div className={`border-t pt-4 ${hairline}`}>
                          <h4 className={`${sectionLabelClass} mb-3`}>People & investigation</h4>
                          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                            {people.map((f) => (
                              <div key={f.label} className="min-w-0">
                                <dt className={labelClass}>{f.label}</dt>
                                <dd className={valueClass}>{f.value}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      )}
                    </div>

                    {/* Where, and the paperwork trail */}
                    <div className="space-y-4">
                      {hasMap && (
                        <div className={`relative h-48 rounded-lg border overflow-hidden ${hairline}`}>
                          <iframe
                            title="Case location"
                            className="pointer-events-none h-full w-full"
                            frameBorder="0"
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${c.longitude! - 0.008},${c.latitude! - 0.005},${c.longitude! + 0.008},${c.latitude! + 0.005}&layer=mapnik&marker=${c.latitude},${c.longitude}`}
                          />
                          <a
                            href={`https://www.openstreetmap.org/?mlat=${c.latitude}&mlon=${c.longitude}#map=17/${c.latitude}/${c.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                            className="absolute bottom-2 right-3 rounded bg-white/90 px-2 py-0.5 text-[0.65rem] font-semibold text-slate-700 shadow-sm hover:bg-white dark:bg-slate-900/85 dark:text-slate-200"
                          >
                            Open map ↗
                          </a>
                        </div>
                      )}

                      {filing.length > 0 && (
                        <div
                          className={`rounded-lg border p-4 ${
                            dark ? "border-white/[0.06] bg-white/[0.02]" : "border-slate-100 bg-slate-50"
                          }`}
                        >
                          <h4 className={`${sectionLabelClass} mb-3`}>Filing record</h4>
                          <dl className="space-y-2.5 text-[0.78rem]">
                            {filing.map((f) => (
                              <div key={f.label} className="flex items-baseline justify-between gap-3">
                                <dt className={mutedText}>{f.label}</dt>
                                <dd className={`text-right font-medium ${dark ? "text-slate-200" : "text-slate-700"}`}>
                                  {f.value}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              );
            })()}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
