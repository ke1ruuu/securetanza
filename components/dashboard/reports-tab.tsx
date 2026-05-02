"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Download, 
  FileCheck,
  FileText
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMapContext } from "@/context/MapContext";
import { useTheme } from "@/context/ThemeContext";
import { fetchCrimes } from "@/lib/api";

interface ReportsTabProps {
  barangayName?: string;
}

interface Report {
  name: string;
  date: string;
  size: string;
  barangay?: string;
}

export default function ReportsTab({ barangayName }: ReportsTabProps) {
  const { theme } = useTheme();
  const { selectedYear } = useMapContext();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const isGeneralDashboard = !barangayName || barangayName === "General Dashboard";

  // Generate reports based on crime data
  useEffect(() => {
    async function generateReports() {
      try {
        setLoading(true);

        // Fetch crimes for the barangay with year filter
        const params: any = isGeneralDashboard ? {} : { barangay: barangayName };
        if (selectedYear) {
          params.year = selectedYear;
        }
        const crimes = await fetchCrimes(params);

        // Generate monthly reports
        const monthlyReports: Report[] = [];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentYear = new Date().getFullYear();

        // Group crimes by month
        const crimesByMonth = crimes.reduce((acc: Record<string, number>, crime) => {
          const date = new Date(crime.dateCommitted);
          const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`;
          acc[monthKey] = (acc[monthKey] || 0) + 1;
          return acc;
        }, {});

        // Create reports for months with data
        Object.entries(crimesByMonth)
          .sort((a, b) => {
            const dateA = new Date(a[0]);
            const dateB = new Date(b[0]);
            return dateB.getTime() - dateA.getTime();
          })
          .forEach(([monthYear, count]) => {
            const reportName = isGeneralDashboard
              ? `Crime Report - ${monthYear} (All Barangays)`
              : `Crime Report - ${monthYear} (${barangayName})`;
            
            // Estimate file size based on crime count (rough estimate)
            const sizeInKB = Math.max(100, count * 5);
            const size = sizeInKB > 1000 
              ? `${(sizeInKB / 1024).toFixed(1)} MB` 
              : `${sizeInKB} KB`;

            monthlyReports.push({
              name: reportName,
              date: monthYear,
              size,
              barangay: isGeneralDashboard ? undefined : barangayName
            });
          });

        // Add summary reports
        if (crimes.length > 0) {
          const totalSize = crimes.length * 5;
          const summarySize = totalSize > 1000 
            ? `${(totalSize / 1024).toFixed(1)} MB` 
            : `${totalSize} KB`;

          monthlyReports.unshift({
            name: isGeneralDashboard 
              ? `Annual Crime Summary ${currentYear} (All Barangays)`
              : `Annual Crime Summary ${currentYear} (${barangayName})`,
            date: `${currentYear}`,
            size: summarySize,
            barangay: isGeneralDashboard ? undefined : barangayName
          });
        }

        setReports(monthlyReports);
      } catch (error) {
        console.error("Error generating reports:", error);
        setReports([]);
      } finally {
        setLoading(false);
      }
    }

    generateReports();
  }, [barangayName, isGeneralDashboard, selectedYear]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-sm font-semibold text-slate-400">Generating reports...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <div className={`flex justify-between items-end border-b pb-6 ${
        theme === 'dark' ? 'border-white/5' : 'border-slate-200'
      }`}>
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {barangayName && barangayName !== "General Dashboard" 
              ? `Reports - ${barangayName}` 
              : 'Reports - All Barangays'}
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            {barangayName && barangayName !== "General Dashboard"
              ? `Crime reports and statistics for ${barangayName}`
              : 'Crime reports and statistics for all barangays in Tanza, Cavite'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-slate-400" />
          <span className="text-sm font-semibold text-slate-500">
            {reports.length} {reports.length === 1 ? 'Report' : 'Reports'}
          </span>
        </div>
      </div>

      {/* Reports List */}
      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <FileText className="h-16 w-16 text-slate-400 mb-4" />
          <p className="text-lg font-semibold text-slate-500">No reports available</p>
          <p className="text-sm text-slate-400 mt-2">
            Reports will be generated based on crime data
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report, i) => (
            <div 
              key={i} 
              className={`flex items-center justify-between py-6 px-4 rounded-xl transition-all group ${
                theme === 'dark' ? 'hover:bg-white/5 border-b border-white/5' : 'hover:bg-slate-100 border-b border-slate-200'
              } last:border-0`}
            >
              <div className="flex items-center gap-8">
                <div className={`text-sm font-black uppercase tracking-tighter w-20 ${
                  theme === 'dark' ? 'text-slate-600' : 'text-slate-400'
                }`}>{report.date}</div>
                <div className="flex flex-col">
                  <span className={`text-base font-bold group-hover:text-indigo-500 transition-colors uppercase tracking-tight ${
                    theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                  }`}>{report.name}</span>
                  <span className={`text-sm font-bold uppercase tracking-widest mt-1 ${
                    theme === 'dark' ? 'text-slate-600' : 'text-slate-400'
                  }`}>{report.size} • PDF Document</span>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-10 w-10 rounded-lg transition-all ${
                  theme === 'dark' ? 'text-slate-700 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-200'
                }`}
                onClick={() => {
                  // In a real app, this would trigger a download
                  console.log(`Downloading report: ${report.name}`);
                }}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
