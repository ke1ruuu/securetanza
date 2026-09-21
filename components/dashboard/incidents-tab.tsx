"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  MapPin,
  Calendar,
  Filter
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/context/ThemeContext";
import { useMapContext } from "@/context/MapContext";
import { useTimeRangeData } from "@/hooks/useTimeRangeData";
import { fetchCrimes, CrimeIncident } from "@/lib/api";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
interface IncidentsTabProps {
  barangayName?: string;
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

  // Get status color based on caseStatus
  const getStatusColor = (caseStatus?: string) => {
    if (!caseStatus) return "bg-yellow-500";
    const statusLower = caseStatus.toLowerCase();
    if (statusLower.includes("cleared") || statusLower.includes("solved")) {
      return "bg-green-500";
    }
    if (statusLower.includes("investigation") || statusLower.includes("investigating")) {
      return "bg-blue-500";
    }
    if (statusLower.includes("filed") || statusLower.includes("court")) {
      return "bg-purple-500";
    }
    if (statusLower.includes("archived") || statusLower.includes("closed")) {
      return "bg-slate-500";
    }
    return "bg-yellow-500";
  };

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

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto space-y-6 animate-pulse">
        {/* Search Bar Skeleton */}
        <div className={`h-12 rounded-xl ${theme === "dark" ? "bg-white/5" : "bg-slate-200"}`}></div>

        {/* Filters Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-10 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-slate-200"}`}></div>
          ))}
        </div>

        {/* Cases Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cases List Skeleton */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`p-4 rounded-xl ${theme === "dark" ? "bg-white/5" : "bg-white"}`}
              >
                <div className={`h-4 rounded mb-3 ${theme === "dark" ? "bg-white/10" : "bg-slate-300"}`} style={{ width: '60%' }}></div>
                <div className={`h-3 rounded mb-2 ${theme === "dark" ? "bg-white/10" : "bg-slate-300"}`} style={{ width: '40%' }}></div>
                <div className={`h-3 rounded ${theme === "dark" ? "bg-white/10" : "bg-slate-300"}`} style={{ width: '50%' }}></div>
              </div>
            ))}
          </div>

          {/* Case Details Skeleton */}
          <div className={`p-6 rounded-xl ${theme === "dark" ? "bg-white/5" : "bg-white"}`}>
            <div className={`h-6 rounded mb-4 ${theme === "dark" ? "bg-white/10" : "bg-slate-300"}`} style={{ width: '70%' }}></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i}>
                  <div className={`h-3 rounded mb-2 ${theme === "dark" ? "bg-white/10" : "bg-slate-300"}`} style={{ width: '30%' }}></div>
                  <div className={`h-4 rounded ${theme === "dark" ? "bg-white/10" : "bg-slate-300"}`} style={{ width: '80%' }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Search & Filters Controls */}
      <div data-tour="cases-controls" className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search cases by ID, type, location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-12 pr-4 py-3 rounded-xl border ${theme === "dark"
              ? "bg-[#1e293b] border-white/10 text-white placeholder-slate-500"
              : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Crime Type Filter */}
          <div>
            <label className={`text-sm font-medium mb-2 block ${theme === "dark" ? "text-slate-400" : "text-slate-600"
              }`}>
              Crime Type
            </label>
            <select
              value={crimeTypeFilter}
              onChange={(e) => setCrimeTypeFilter(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${theme === "dark"
                ? "bg-[#1e293b] border-white/10 text-white"
                : "bg-white border-slate-200 text-slate-900"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {crimeTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className={`text-sm font-medium mb-2 block ${theme === "dark" ? "text-slate-400" : "text-slate-600"
              }`}>
              Date Range
            </label>
            <select
              value={dateRangeFilter}
              onChange={(e) => setDateRangeFilter(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${theme === "dark"
                ? "bg-[#1e293b] border-white/10 text-white"
                : "bg-white border-slate-200 text-slate-900"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option>(All)</option>
              <option>(Last 7 Days)</option>
              <option>(Last 30 Days)</option>
              <option>(Last 90 Days)</option>
            </select>
          </div>

          {/* Barangay Filter - Only show for general dashboard */}
          {isGeneralDashboard && (
            <div>
              <label className={`text-sm font-medium mb-2 block ${theme === "dark" ? "text-slate-400" : "text-slate-600"
                }`}>
                Barangay
              </label>
              <select
                value={barangayFilter}
                onChange={(e) => setBarangayFilter(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${theme === "dark"
                  ? "bg-[#1e293b] border-white/10 text-white"
                  : "bg-white border-slate-200 text-slate-900"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {barangays.map((barangay) => (
                  <option key={barangay} value={barangay}>
                    {barangay}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Status Filter */}
          <div>
            <label className={`text-sm font-medium mb-2 block ${theme === "dark" ? "text-slate-400" : "text-slate-600"
              }`}>
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${theme === "dark"
                ? "bg-[#1e293b] border-white/10 text-white"
                : "bg-white border-slate-200 text-slate-900"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cases List */}
        <Card data-tour="cases-list" className={`lg:col-span-2 border-0 shadow-lg ${theme === "dark" ? "bg-[#1e293b]" : "bg-white"
          }`}>
          <CardContent className="p-0">
            {/* Table Header */}
            <div className={`grid grid-cols-5 gap-4 px-6 py-4 border-b ${theme === "dark" ? "border-white/10" : "border-slate-200"
              }`}>
              <div className={`text-sm font-semibold ${theme === "dark" ? "text-slate-400" : "text-slate-600"
                }`}>
                Case ID
              </div>
              <div className={`text-sm font-semibold ${theme === "dark" ? "text-slate-400" : "text-slate-600"
                }`}>
                Type
              </div>
              <div className={`text-sm font-semibold ${theme === "dark" ? "text-slate-400" : "text-slate-600"
                }`}>
                Location
              </div>
              <div className={`text-sm font-semibold ${theme === "dark" ? "text-slate-400" : "text-slate-600"
                }`}>
                Date
              </div>
              <div className={`text-sm font-semibold ${theme === "dark" ? "text-slate-400" : "text-slate-600"
                }`}>
                Status
              </div>
            </div>

            {/* Table Body */}
            <div className="max-h-[600px] overflow-y-auto">
              {filteredCases.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <p className="text-slate-500">No cases found</p>
                </div>
              ) : (
                currentCases.map((crime) => (
                  <div
                    key={crime.id}
                    onClick={() => setSelectedCase(crime)}
                    className={`grid grid-cols-5 gap-4 px-6 py-4 border-b cursor-pointer transition-colors ${theme === "dark"
                      ? "border-white/5 hover:bg-white/5"
                      : "border-slate-100 hover:bg-slate-50"
                      } ${selectedCase?.id === crime.id
                        ? theme === "dark"
                          ? "bg-blue-500/10"
                          : "bg-blue-50"
                        : ""
                      }`}
                  >
                    <div className={`text-sm font-medium ${theme === "dark" ? "text-slate-300" : "text-slate-700"
                      }`}>
                      {getCaseId(crime)}
                    </div>
                    <div className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"
                      }`}>
                      {crime.incidentType}
                    </div>
                    <div className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"
                      }`}>
                      {crime.street ? `${crime.street}, ${crime.barangay}` : crime.barangay}
                    </div>
                    <div className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"
                      }`}>
                      {formatDate(crime.dateCommitted)}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(crime.caseStatus)}`} />
                      <span className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"
                        }`}>
                        {getStatusLabel(crime.caseStatus)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {filteredCases.length > 0 && (
              <div className={`flex items-center justify-between px-6 py-4 border-t ${theme === "dark" ? "border-white/10" : "border-slate-200"
                }`}>
                <div className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"
                  }`}>
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredCases.length)} of {filteredCases.length} cases
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${currentPage === 1
                      ? theme === "dark"
                        ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : theme === "dark"
                        ? "bg-slate-700 text-white hover:bg-slate-600"
                        : "bg-slate-200 text-slate-900 hover:bg-slate-300"
                      }`}
                  >
                    Previous
                  </button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1">
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
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                            ? theme === "dark"
                              ? "bg-blue-500 text-white"
                              : "bg-blue-500 text-white"
                            : theme === "dark"
                              ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${currentPage === totalPages
                      ? theme === "dark"
                        ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : theme === "dark"
                        ? "bg-slate-700 text-white hover:bg-slate-600"
                        : "bg-slate-200 text-slate-900 hover:bg-slate-300"
                      }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Case Details Panel */}
        <Card
          data-tour="cases-details-panel"
          onClick={() => {
            if (selectedCase) setIsModalOpen(true);
          }}
          className={`border-0 shadow-lg cursor-pointer transition-all hover:ring-2 hover:ring-blue-500/50 ${theme === "dark" ? "bg-[#1e293b]" : "bg-white"
            }`}
        >
          <CardContent className="p-6">
            {selectedCase ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-bold mb-2 ${theme === "dark" ? "text-white" : "text-slate-900"
                      }`}>
                      Case Details: {getCaseId(selectedCase)}
                    </h3>
                  </div>
                  <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"
                    }`}>
                    {selectedCase.incidentType}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className={`text-sm font-semibold mb-2 ${theme === "dark" ? "text-slate-400" : "text-slate-600"
                      }`}>
                      Description
                    </h4>
                    <p className={`text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-700"
                      }`}>
                      {selectedCase.offense || "No description available"}
                    </p>
                  </div>

                  <div>
                    <h4 className={`text-sm font-semibold mb-2 ${theme === "dark" ? "text-slate-400" : "text-slate-600"
                      }`}>
                      Location
                    </h4>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-slate-500 mt-0.5" />
                      <div>
                        <p className={`text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-700"
                          }`}>
                          {selectedCase.street || "Street not specified"}
                        </p>
                        <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"
                          }`}>
                          Brgy. {selectedCase.barangay}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className={`text-sm font-semibold mb-2 ${theme === "dark" ? "text-slate-400" : "text-slate-600"
                      }`}>
                      Date & Time
                    </h4>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <p className={`text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-700"
                        }`}>
                        {formatDate(selectedCase.dateCommitted)} at {formatTime(selectedCase.timeCommitted)}
                      </p>
                    </div>
                  </div>

                  {selectedCase.modus && (
                    <div>
                      <h4 className={`text-sm font-semibold mb-2 ${theme === "dark" ? "text-slate-400" : "text-slate-600"
                        }`}>
                        Modus Operandi
                      </h4>
                      <p className={`text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-700"
                        }`}>
                        {selectedCase.modus}
                      </p>
                    </div>
                  )}

                  {selectedCase.suspectMotive && (
                    <div>
                      <h4 className={`text-sm font-semibold mb-2 ${theme === "dark" ? "text-slate-400" : "text-slate-600"
                        }`}>
                        Suspect Motive
                      </h4>
                      <p className={`text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-700"
                        }`}>
                        {selectedCase.suspectMotive}
                      </p>
                    </div>
                  )}

                  {selectedCase.latitude && selectedCase.longitude && (
                    <div>
                      <h4 className={`text-sm font-semibold mb-2 ${theme === "dark" ? "text-slate-400" : "text-slate-600"
                        }`}>
                        Location Map
                      </h4>
                      <div className={`w-full h-48 rounded-lg overflow-hidden ${theme === "dark" ? "bg-slate-800" : "bg-slate-200"
                        }`}>
                        <iframe
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedCase.longitude - 0.01},${selectedCase.latitude - 0.01},${selectedCase.longitude + 0.01},${selectedCase.latitude + 0.01}&layer=mapnik&marker=${selectedCase.latitude},${selectedCase.longitude}`}
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <Button onClick={() => setIsModalOpen(true)} className="w-full">
                      View Full Details
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-slate-500">Select a case to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Full Details Modal */}
      {selectedCase && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className={`w-full max-w-5xl sm:max-w-4xl md:max-w-5xl lg:max-w-6xl max-h-[85vh] overflow-y-auto p-6 md:p-8 ${theme === "dark" ? "bg-[#1e293b] text-slate-100" : "bg-white text-slate-900"}`}>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold border-b pb-4">Case Details: {getCaseId(selectedCase)}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-lg border-b pb-2 mb-3 text-blue-500">Basic Information</h4>
                  <div className="grid grid-cols-[1fr_2fr] gap-3 text-sm">
                    <span className="text-slate-500 font-medium">Case ID:</span> <span>{getCaseId(selectedCase)}</span>
                    <span className="text-slate-500 font-medium">Incident Type:</span> <span>{selectedCase.incidentType}</span>
                    <span className="text-slate-500 font-medium">Blotter No:</span> <span>{selectedCase.blotterNo || "N/A"}</span>
                    <span className="text-slate-500 font-medium">Date Committed:</span> <span>{formatDate(selectedCase.dateCommitted)}</span>
                    <span className="text-slate-500 font-medium">Time Committed:</span> <span>{formatTime(selectedCase.timeCommitted)}</span>
                    <span className="text-slate-500 font-medium">Date Reported:</span> <span>{formatDate(selectedCase.dateReported)}</span>
                    <span className="text-slate-500 font-medium">Time Reported:</span> <span>{formatTime(selectedCase.timeReported)}</span>
                    <span className="text-slate-500 font-medium">Date Encoded:</span> <span>{selectedCase.dateEncoded ? formatDate(selectedCase.dateEncoded) : "N/A"}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg border-b pb-2 mt-8 mb-3 text-blue-500">Location</h4>
                  <div className="grid grid-cols-[1fr_2fr] gap-3 text-sm">
                    <span className="text-slate-500 font-medium">Barangay:</span> <span>{selectedCase.barangay}</span>
                    <span className="text-slate-500 font-medium">Street:</span> <span>{selectedCase.street || "N/A"}</span>
                    <span className="text-slate-500 font-medium">City/Municipality:</span> <span>{selectedCase.municipal || "N/A"}</span>
                    <span className="text-slate-500 font-medium">Province:</span> <span>{selectedCase.province || "N/A"}</span>
                    <span className="text-slate-500 font-medium">Region:</span> <span>{selectedCase.region || "N/A"}</span>
                    <span className="text-slate-500 font-medium">Type of Place:</span> <span>{selectedCase.typeOfPlace || "N/A"}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg border-b pb-2 mt-8 mb-3 text-blue-500">Police Unit</h4>
                  <div className="grid grid-cols-[1fr_2fr] gap-3 text-sm">
                    <span className="text-slate-500 font-medium">PCP:</span> <span>{selectedCase.pcp || "N/A"}</span>
                    <span className="text-slate-500 font-medium">Station:</span> <span>{selectedCase.stn || "N/A"}</span>
                    <span className="text-slate-500 font-medium">PPO:</span> <span>{selectedCase.ppo || "N/A"}</span>
                    <span className="text-slate-500 font-medium">PRO:</span> <span>{selectedCase.pro || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-lg border-b pb-2 mb-3 text-blue-500">Case Status & Legal</h4>
                  <div className="grid grid-cols-[1fr_2fr] gap-3 text-sm items-center">
                    <span className="text-slate-500 font-medium">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold w-max ${getStatusColor(selectedCase.caseStatus)} text-white shadow-sm`}>{getStatusLabel(selectedCase.caseStatus)}</span>
                    <span className="text-slate-500 font-medium">Offense:</span> <span>{selectedCase.offense || "N/A"}</span>
                    <span className="text-slate-500 font-medium">Offense Type:</span> <span>{selectedCase.offenseType || "N/A"}</span>
                    <span className="text-slate-500 font-medium">Section:</span> <span>{selectedCase.section || "N/A"}</span>
                    <span className="text-slate-500 font-medium">Stage of Felony:</span> <span>{selectedCase.stageOfFelony || "N/A"}</span>
                    <span className="text-slate-500 font-medium">Is Crime:</span> <span>{selectedCase.isCrime ? "Yes" : "No"}</span>
                    <span className="text-slate-500 font-medium">Heinous:</span> <span>{selectedCase.heinous ? "Yes" : "No"}</span>
                    <span className="text-slate-500 font-medium">Sensational:</span> <span>{selectedCase.sensational ? "Yes" : "No"}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg border-b pb-2 mt-8 mb-3 text-blue-500">Details & Suspects</h4>
                  <div className="grid grid-cols-[1fr_2fr] gap-3 text-sm">
                    <span className="text-slate-500 font-medium">Modus:</span> <span className="break-words leading-relaxed">{selectedCase.modus || "N/A"}</span>
                    <span className="text-slate-500 font-medium">Suspect Motive:</span> <span className="break-words leading-relaxed">{selectedCase.suspectMotive || "N/A"}</span>
                    <span className="text-slate-500 font-medium">Sub-Motive:</span> <span className="break-words leading-relaxed">{selectedCase.suspectSubMotive || "N/A"}</span>
                    <span className="text-slate-500 font-medium">No. of Suspects:</span> <span>{selectedCase.suspectCount ?? "N/A"}</span>
                    <span className="text-slate-500 font-medium">Suspect Arrested:</span> <span>{selectedCase.suspectArrested !== undefined ? (selectedCase.suspectArrested ? "Yes" : "No") : "N/A"}</span>
                    <span className="text-slate-500 font-medium">No. of Victims:</span> <span>{selectedCase.victimCount ?? "N/A"}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg border-b pb-2 mt-8 mb-3 text-blue-500">Management</h4>
                  <div className="grid grid-cols-[1fr_2fr] gap-3 text-sm">
                    <span className="text-slate-500 font-medium">Investigator:</span> <span>{selectedCase.investigator || "N/A"}</span>
                    <span className="text-slate-500 font-medium">Head Investigator:</span> <span>{selectedCase.headInves || "N/A"}</span>
                    <span className="text-slate-500 font-medium">Threat Group:</span> <span>{selectedCase.threatGrp ? "Yes" : "No"}</span>
                    <span className="text-slate-500 font-medium">Group Affiliation:</span> <span>{selectedCase.grpAffiliation || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
