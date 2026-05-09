"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { 
  ArrowLeft, 
  BookOpen, 
  Map, 
  BarChart3, 
  FileText, 
  Brain, 
  Settings, 
  Upload, 
  Search,
  ChevronRight,
  Home,
  Lightbulb,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

function DocsContent() {
  const router = useRouter();
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      icon: BookOpen,
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Welcome to SecureTanza</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            SecureTanza is a comprehensive crime mapping and analytics system designed for Tanza, Cavite. 
            It provides real-time visualization, statistical analysis, and predictive insights to help law 
            enforcement and local government make data-driven decisions for public safety.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className={`p-6 rounded-xl border ${
              theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"
            }`}>
              <Map className="h-8 w-8 text-blue-500 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Interactive Crime Map</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Visualize crime incidents across all barangays with real-time data and interactive filters.
              </p>
            </div>
            
            <div className={`p-6 rounded-xl border ${
              theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"
            }`}>
              <BarChart3 className="h-8 w-8 text-purple-500 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Comprehensive statistical analysis with charts, trends, and detailed breakdowns.
              </p>
            </div>
            
            <div className={`p-6 rounded-xl border ${
              theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"
            }`}>
              <Brain className="h-8 w-8 text-emerald-500 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Predictive Forecasting</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                AI-powered crime prediction using ARIMA models with validation and confidence intervals.
              </p>
            </div>
            
            <div className={`p-6 rounded-xl border ${
              theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"
            }`}>
              <FileText className="h-8 w-8 text-amber-500 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Report Generation</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Export professional PDF reports with analytics, charts, and recommendations.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "map",
      title: "Interactive Crime Map",
      icon: Map,
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Interactive Crime Map</h2>
          <p className="text-slate-600 dark:text-slate-400">
            The crime map is your primary interface for visualizing crime data geographically.
          </p>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Map Controls</h3>
            
            <div className={`p-4 rounded-lg border ${
              theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"
            }`}>
              <h4 className="font-semibold mb-2">Top Left Controls</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 mt-0.5 shrink-0" />
                  <span><strong>Barangay Filter</strong> - Select specific barangays to view</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 mt-0.5 shrink-0" />
                  <span><strong>Crime Type Filter</strong> - Filter by crime categories</span>
                </li>
              </ul>
            </div>

            <div className={`p-4 rounded-lg border ${
              theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"
            }`}>
              <h4 className="font-semibold mb-2">Threat Levels</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                  <span><strong>Secure</strong> - 0-5 crimes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <span><strong>Low</strong> - 6-10 crimes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                  <span><strong>Moderate</strong> - 11-20 crimes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                  <span><strong>High</strong> - 21-30 crimes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span><strong>Critical</strong> - 31+ crimes</span>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg border ${
              theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"
            }`}>
              <h4 className="font-semibold mb-2">Time-Based Filtering</h4>
              <ol className="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-decimal list-inside">
                <li>Click the clock icon (bottom left)</li>
                <li>Time filter panel appears at bottom</li>
                <li>Choose filter mode: Quarter, Half-Year, Month, or Day</li>
                <li>Select time periods (multi-select supported)</li>
                <li>Click Play to animate or Apply to filter</li>
              </ol>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "analytics",
      title: "Dashboard & Analytics",
      icon: BarChart3,
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Dashboard & Analytics</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Comprehensive statistical analysis and visualizations for crime data.
          </p>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Overview Tab</h3>
            <div className={`p-4 rounded-lg border ${
              theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"
            }`}>
              <h4 className="font-semibold mb-3">Key Metrics</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-500 shrink-0" />
                  <span><strong>Total Crimes</strong> - All-time crime count</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-500 shrink-0" />
                  <span><strong>Most Frequent Crime Type</strong> - Top crime category</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-500 shrink-0" />
                  <span><strong>Critical Area</strong> - Barangay with highest crime rate</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-500 shrink-0" />
                  <span><strong>Crime Trend Chart</strong> - Monthly activity visualization</span>
                </li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold mt-6">Analytics Tab</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg border ${
                theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"
              }`}>
                <h4 className="font-semibold mb-2">Historical Mode</h4>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Crime trends & patterns</li>
                  <li>• Time pattern analysis (24-hour)</li>
                  <li>• Crime type distribution</li>
                  <li>• Monthly trends</li>
                  <li>• Barangay comparison</li>
                  <li>• Modus operandi breakdown</li>
                  <li>• Location type analysis</li>
                  <li>• Crime matrix heatmap</li>
                </ul>
              </div>

              <div className={`p-4 rounded-lg border ${
                theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"
              }`}>
                <h4 className="font-semibold mb-2">Predictive Mode</h4>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>• 12-month crime forecast</li>
                  <li>• Confidence intervals (95%)</li>
                  <li>• Model accuracy metrics</li>
                  <li>• Validation results</li>
                  <li>• Training period info</li>
                  <li>• Month-by-month comparison</li>
                  <li>• Error analysis</li>
                  <li>• Accuracy indicators</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "predictive",
      title: "Predictive Analytics",
      icon: Brain,
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Predictive Analytics</h2>
          <p className="text-slate-600 dark:text-slate-400">
            AI-powered crime forecasting using advanced statistical models.
          </p>

          <div className={`p-6 rounded-xl border-2 ${
            theme === "dark" ? "bg-purple-500/10 border-purple-500/30" : "bg-purple-50 border-purple-200"
          }`}>
            <div className="flex items-start gap-4">
              <Brain className="h-8 w-8 text-purple-500 shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-2">How It Works</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  The system uses ARIMA (AutoRegressive Integrated Moving Average) models trained on 
                  historical crime data from 2023-2025 to predict future crime patterns with 95% confidence intervals.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Understanding the Metrics</h3>
            
            <div className={`p-4 rounded-lg border ${
              theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"
            }`}>
              <h4 className="font-semibold mb-2">MAPE (Mean Absolute Percentage Error)</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Measures average prediction error. Lower is better.
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span>&lt; 15%: Excellent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>15-25%: Good</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>25-40%: Moderate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>&gt; 40%: Poor</span>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg border ${
              theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"
            }`}>
              <h4 className="font-semibold mb-2">Using Predictions</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 mt-0.5 text-yellow-500 shrink-0" />
                  <span><strong>For Planning:</strong> Allocate resources based on predicted hotspots</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 mt-0.5 text-yellow-500 shrink-0" />
                  <span><strong>For Prevention:</strong> Implement measures in high-risk areas</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 mt-0.5 text-yellow-500 shrink-0" />
                  <span><strong>For Budgeting:</strong> Forecast resource needs and staffing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "reports",
      title: "Reports & Export",
      icon: FileText,
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Reports & Export</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Generate comprehensive PDF reports with analytics and recommendations.
          </p>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Available Report Sections</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { icon: "📋", title: "Executive Summary", desc: "Key findings overview" },
                { icon: "📊", title: "Overview", desc: "Current statistics" },
                { icon: "📈", title: "Trends", desc: "Historical patterns" },
                { icon: "⏰", title: "Time Patterns", desc: "Peak hours analysis" },
                { icon: "🔍", title: "Classification", desc: "Crime type breakdown" },
                { icon: "📍", title: "Comparison", desc: "Cross-barangay data" },
                { icon: "🔥", title: "Heatmap", desc: "Monthly distribution" },
                { icon: "💡", title: "Recommendations", desc: "Strategic insights" },
              ].map((section, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"
                }`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{section.icon}</span>
                    <div>
                      <h4 className="font-semibold text-sm">{section.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{section.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={`p-4 rounded-lg border ${
              theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"
            }`}>
              <h4 className="font-semibold mb-2">Generating a Report</h4>
              <ol className="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-decimal list-inside">
                <li>Navigate to Dashboard → Reports</li>
                <li>Select sections to include (click cards to toggle)</li>
                <li>Review summary in right panel</li>
                <li>Click "Export Report" button</li>
                <li>Wait for generation (progress bar shows status)</li>
                <li>PDF downloads automatically when complete</li>
              </ol>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      icon: AlertCircle,
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Troubleshooting</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Common issues and their solutions.
          </p>

          <div className="space-y-4">
            {[
              {
                problem: "Map Not Loading",
                solutions: [
                  "Check internet connection",
                  "Refresh the page (F5 or Cmd+R)",
                  "Clear browser cache",
                  "Try a different browser",
                  "Check if database is accessible"
                ]
              },
              {
                problem: "Forecast Not Available",
                solutions: [
                  "Verify forecast API is running (port 8000)",
                  "Check .env.local has correct API URL",
                  "Ensure training data exists (2023-2025)",
                  "Review browser console for errors",
                  "Contact system administrator"
                ]
              },
              {
                problem: "Charts Not Displaying",
                solutions: [
                  "Wait for data to load completely",
                  "Check if time range has data",
                  "Try different barangay selection",
                  "Refresh the page",
                  "Check browser console for errors"
                ]
              },
              {
                problem: "Report Export Fails",
                solutions: [
                  "Ensure at least one section is selected",
                  "Wait for analytics data to load",
                  "Check browser allows downloads",
                  "Try exporting fewer sections",
                  "Check available disk space"
                ]
              }
            ].map((issue, index) => (
              <div key={index} className={`p-4 rounded-lg border ${
                theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"
              }`}>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  {issue.problem}
                </h4>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400 ml-6">
                  {issue.solutions.map((solution, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>{solution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  const activeContent = sections.find(s => s.id === activeSection);

  return (
    <div className={`flex flex-col h-screen transition-colors duration-700 overflow-hidden font-sans ${
      theme === "dark" ? "bg-[#0f172a] text-slate-100" : "bg-[#f1f5f9] text-slate-900"
    }`}>
      {/* Header */}
      <header className={`w-full bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/[0.06] z-50`}>
        <div className="flex items-center justify-between h-16 px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
            
            <div className="h-5 w-px bg-white/10"></div>
            
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-[#0EA5E9]" />
              <h1 className="text-lg font-semibold text-white">User Guide</h1>
            </div>
          </div>

          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0EA5E9]/10 text-[#0EA5E9] hover:bg-[#0EA5E9]/20 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="text-sm font-medium">Home</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className={`w-64 border-r overflow-y-auto ${
          theme === "dark" ? "bg-[#0f172a]/80 border-white/[0.04]" : "bg-white/60 border-slate-200/60"
        }`}>
          <div className="p-4 space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    isActive
                      ? "bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/20"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="text-sm font-medium">{section.title}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content Area */}
        <main className={`flex-1 overflow-y-auto ${
          theme === "dark" ? "bg-[#0f172a]" : "bg-[#f1f5f9]"
        }`}>
          <div className="max-w-4xl mx-auto p-8">
            {activeContent && activeContent.content}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DocsPage() {
  return (
    <ThemeProvider>
      <DocsContent />
    </ThemeProvider>
  );
}
