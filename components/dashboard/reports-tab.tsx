"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Calendar, 
  Download, 
  FileText,
  BarChart3,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Loader2,
  TrendingUp,
  LayoutDashboard,
  Grid,
  Lightbulb,
  Search,
  PieChart,
  ClipboardList
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMapContext } from "@/context/MapContext";
import { useTheme } from "@/context/ThemeContext";
import { fetchCrimes } from "@/lib/api";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { PDFReportGenerator } from "@/lib/pdf-generator";

interface ReportsTabProps {
  barangayName?: string;
}

interface ReportConfig {
  includeExecutiveSummary: boolean;
  includeOverview: boolean;
  includeTrends: boolean;
  includeTimePatterns: boolean;
  includeCrimeTypes: boolean;
  includeBarangayComparison: boolean;
  includeCrimeMatrix: boolean;
  includeRecommendations: boolean;
}

export default function ReportsTab({ barangayName }: ReportsTabProps) {
  const { theme } = useTheme();
  const { selectedYear, timeRange } = useMapContext();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const analyticsData = useAnalyticsData(barangayName);
  
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    includeExecutiveSummary: true,
    includeOverview: true,
    includeTrends: true,
    includeTimePatterns: true,
    includeCrimeTypes: true,
    includeBarangayComparison: true,
    includeCrimeMatrix: true,
    includeRecommendations: true,
  });

  const isGeneralDashboard = !barangayName || barangayName === "General Dashboard";

  // Get time range display text
  const getTimeRangeText = () => {
    if (timeRange.selections.length === 0) {
      return selectedYear ? `Year ${selectedYear}` : "All Time";
    }

    const count = timeRange.selections.length;
    const firstSelection = timeRange.selections[0];

    switch (timeRange.mode) {
      case 'quarter':
        return count === 1 
          ? `Q${firstSelection.quarter} ${firstSelection.year}`
          : `${count} Quarters (${firstSelection.year})`;
      case 'half-year':
        return count === 1
          ? `H${firstSelection.halfYear} ${firstSelection.year}`
          : `${count} Half-years (${firstSelection.year})`;
      case 'month':
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return count === 1
          ? `${monthNames[firstSelection.month! - 1]} ${firstSelection.year}`
          : `${count} Months (${firstSelection.year})`;
      case 'day':
        return count === 1
          ? firstSelection.day?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || ''
          : `${count} Days`;
      default:
        return selectedYear ? `Year ${selectedYear}` : "All Time";
    }
  };

  const handleExportReport = async () => {
    setLoading(true);
    setProgress(0);
    
    try {
      // Step 1: Validate analytics data
      setProgressMessage('Validating analytics data...');
      setProgress(10);
      
      if (analyticsData.loading) {
        throw new Error('Analytics data is still loading. Please wait and try again.');
      }
      
      if (analyticsData.error) {
        throw new Error(`Analytics data error: ${analyticsData.error}`);
      }

      // Step 2: Calculate total crimes
      setProgressMessage('Calculating statistics...');
      setProgress(20);
      
      const totalCrimes = analyticsData.crimesByType.reduce((sum, item) => sum + item.count, 0);

      // Step 3: No map element needed - using placeholder
      setProgressMessage('Preparing report sections...');
      setProgress(30);

      // Step 4: Initialize PDF generator
      setProgressMessage('Initializing PDF generator...');
      setProgress(40);
      
      const pdfGenerator = new PDFReportGenerator();

      // Step 5: Generate PDF
      setProgressMessage('Generating PDF document...');
      setProgress(50);
      
      const reportData = {
        barangayName: isGeneralDashboard ? 'All Barangays' : barangayName || 'Unknown',
        timeRange: getTimeRangeText(),
        analyticsData: {
          crimesByType: analyticsData.crimesByType,
          crimesByMonth: analyticsData.crimesByMonth,
          crimesByBarangay: analyticsData.crimesByBarangay,
          timePatterns: analyticsData.timePatterns,
          trends: analyticsData.trends,
        },
        totalCrimes,
      };

      setProgress(60);
      const pdfBlob = await pdfGenerator.generateReport(reportConfig, reportData);
      
      // Step 6: Download PDF
      setProgressMessage('Downloading report...');
      setProgress(90);
      
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename
      const timestamp = new Date().toISOString().split('T')[0];
      const locationName = isGeneralDashboard 
        ? 'All-Barangays' 
        : barangayName?.replace(/\s+/g, '-') || 'Unknown';
      link.download = `Crime-Report-${locationName}-${timestamp}.pdf`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setProgress(100);
      setProgressMessage('Report generated successfully!');
      
      // Show success message
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
        setProgressMessage('');
      }, 1000);
      
    } catch (error) {
      console.error('Error exporting report:', error);
      setLoading(false);
      setProgress(0);
      setProgressMessage('');
      alert(`Failed to export report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const toggleSection = (section: keyof ReportConfig) => {
    setReportConfig(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const selectAll = () => {
    setReportConfig({
      includeExecutiveSummary: true,
      includeOverview: true,
      includeTrends: true,
      includeTimePatterns: true,
      includeCrimeTypes: true,
      includeBarangayComparison: true,
      includeCrimeMatrix: true,
      includeRecommendations: true,
    });
  };

  const deselectAll = () => {
    setReportConfig({
      includeExecutiveSummary: false,
      includeOverview: false,
      includeTrends: false,
      includeTimePatterns: false,
      includeCrimeTypes: false,
      includeBarangayComparison: false,
      includeCrimeMatrix: false,
      includeRecommendations: false,
    });
  };

  const selectedCount = Object.values(reportConfig).filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
      {/* Modern Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-3xl font-bold tracking-tight mb-1 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Generate Report
          </h2>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Create comprehensive case study with analytics and recommendations
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex items-center gap-4">
          <div className={`text-right ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            <div className="text-xs uppercase tracking-wider font-semibold mb-1">Sections</div>
            <div className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`}>
              {selectedCount} / 8
            </div>
          </div>
        </div>
      </div>

      {/* Report Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Report Scope & Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Scope Card */}
          <Card className={`p-6 border ${
            theme === 'dark' 
              ? 'bg-slate-900/50 border-white/5' 
              : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-3 mb-5">
              <div className={`p-2.5 rounded-lg ${
                theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'
              }`}>
                <Filter className={`h-5 w-5 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`} />
              </div>
              <div>
                <h3 className={`text-base font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  Report Scope
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-slate-800/50 border-slate-700' 
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className={`h-4 w-4 ${
                    theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                  }`} />
                  <span className={`text-xs font-semibold uppercase tracking-wider ${
                    theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    Location
                  </span>
                </div>
                <div className={`text-sm font-semibold ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  {isGeneralDashboard ? 'All Barangays' : barangayName}
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-slate-800/50 border-slate-700' 
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className={`h-4 w-4 ${
                    theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                  }`} />
                  <span className={`text-xs font-semibold uppercase tracking-wider ${
                    theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    Time Range
                  </span>
                </div>
                <div className={`text-sm font-semibold ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  {getTimeRangeText()}
                </div>
              </div>
            </div>
          </Card>

          {/* Report Sections Card */}
          <Card className={`p-6 border ${
            theme === 'dark' 
              ? 'bg-slate-900/50 border-white/5' 
              : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${
                  theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50'
                }`}>
                  <BarChart3 className={`h-5 w-5 ${
                    theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                  }`} />
                </div>
                <div>
                  <h3 className={`text-base font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    Report Sections
                  </h3>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    theme === 'dark'
                      ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Select All
                </button>
                <button
                  onClick={deselectAll}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    theme === 'dark'
                      ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { 
                  key: 'includeExecutiveSummary', 
                  label: 'Executive Summary', 
                  desc: 'Key findings overview',
                  icon: <ClipboardList className="h-8 w-8" />
                },
                { 
                  key: 'includeOverview', 
                  label: 'Overview', 
                  desc: 'Current statistics',
                  icon: <LayoutDashboard className="h-8 w-8" />
                },
                { 
                  key: 'includeTrends', 
                  label: 'Trends', 
                  desc: 'Historical patterns',
                  icon: <TrendingUp className="h-8 w-8" />
                },
                { 
                  key: 'includeTimePatterns', 
                  label: 'Time Patterns', 
                  desc: 'Peak hours analysis',
                  icon: <Clock className="h-8 w-8" />
                },
                { 
                  key: 'includeCrimeTypes', 
                  label: 'Classification', 
                  desc: 'Crime type breakdown',
                  icon: <PieChart className="h-8 w-8" />
                },
                { 
                  key: 'includeBarangayComparison', 
                  label: 'Comparison', 
                  desc: 'Cross-barangay data',
                  icon: <MapPin className="h-8 w-8" />
                },
                { 
                  key: 'includeCrimeMatrix', 
                  label: 'Heatmap', 
                  desc: 'Monthly distribution',
                  icon: <Grid className="h-8 w-8" />
                },
                { 
                  key: 'includeRecommendations', 
                  label: 'Recommendations', 
                  desc: 'Strategic insights',
                  icon: <Lightbulb className="h-8 w-8" />
                },
              ].map((section) => (
                <button
                  key={section.key}
                  onClick={() => toggleSection(section.key as keyof ReportConfig)}
                  className={`group relative flex flex-col items-center justify-center p-4 rounded-xl transition-all text-center ${
                    reportConfig[section.key as keyof ReportConfig]
                      ? theme === 'dark'
                        ? 'bg-blue-500/10 border-2 border-blue-500/50 hover:bg-blue-500/15 shadow-lg shadow-blue-500/10'
                        : 'bg-blue-50 border-2 border-blue-400 hover:bg-blue-100 shadow-lg shadow-blue-200/50'
                      : theme === 'dark'
                        ? 'bg-slate-800/30 hover:bg-slate-800/50 border-2 border-slate-700/50 hover:border-slate-600'
                        : 'bg-slate-50/50 hover:bg-slate-100 border-2 border-slate-200/50 hover:border-slate-300'
                  }`}
                >
                  {/* Checkbox indicator */}
                  <div className={`absolute top-2 right-2 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    reportConfig[section.key as keyof ReportConfig]
                      ? theme === 'dark'
                        ? 'border-blue-400 bg-blue-400'
                        : 'border-blue-600 bg-blue-600'
                      : theme === 'dark'
                        ? 'border-slate-600 group-hover:border-slate-500'
                        : 'border-slate-300 group-hover:border-slate-400'
                  }`}>
                    {reportConfig[section.key as keyof ReportConfig] && (
                      <CheckCircle2 className="h-3 w-3 text-white" />
                    )}
                  </div>
                  
                  {/* Icon */}
                  <div className={`mb-2 transition-transform ${
                    reportConfig[section.key as keyof ReportConfig] 
                      ? 'scale-110 text-blue-500' 
                      : `group-hover:scale-105 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`
                  }`}>
                    {section.icon}
                  </div>
                  
                  {/* Label */}
                  <div className={`text-sm font-semibold mb-1 ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {section.label}
                  </div>
                  
                  {/* Description */}
                  <div className={`text-xs ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {section.desc}
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Export Panel */}
        <div className="space-y-6">
          <Card className={`p-6 border sticky top-6 ${
            theme === 'dark' 
              ? 'bg-slate-900/50 border-white/5' 
              : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-base font-semibold mb-5 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Export Summary
            </h3>

            <div className="space-y-3 mb-6">
              <div className={`p-4 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-slate-800/50 border-slate-700' 
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
                  theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  Sections
                </div>
                <div className={`text-3xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  {selectedCount} <span className={`text-lg ${
                    theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                  }`}>/ 8</span>
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-slate-800/50 border-slate-700' 
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
                  theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  Format
                </div>
                <div className={`text-base font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  PDF Document
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-slate-800/50 border-slate-700' 
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
                  theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  Est. Size
                </div>
                <div className={`text-base font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  {selectedCount > 0 ? `${(selectedCount * 0.5).toFixed(1)} - ${(selectedCount * 1.2).toFixed(1)} MB` : '0 MB'}
                </div>
              </div>
            </div>

            <Button
              onClick={handleExportReport}
              disabled={selectedCount === 0 || loading || analyticsData.loading}
              className={`w-full h-12 text-sm font-semibold ${
                selectedCount === 0 || loading || analyticsData.loading
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              {loading ? (
                <div className="flex flex-col items-center gap-2 w-full">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-xs">{progressMessage || 'Generating...'}</span>
                  </div>
                  {progress > 0 && (
                    <div className="w-full bg-white/20 rounded-full h-1 overflow-hidden">
                      <div 
                        className="bg-white h-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
              ) : analyticsData.loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading Data...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </>
              )}
            </Button>

            {selectedCount === 0 && !analyticsData.loading && (
              <p className={`text-xs text-center mt-3 ${
                theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
              }`}>
                Select at least one section
              </p>
            )}
            
            {analyticsData.loading && (
              <p className={`text-xs text-center mt-3 ${
                theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
              }`}>
                Waiting for analytics data...
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
