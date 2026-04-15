"use client";

import React from "react";
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  MapPin,
  Clock,
  Users
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTheme } from "@/context/ThemeContext";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

interface AnalyticsTabProps {
  barangayName: string;
}

export default function AnalyticsTab({ barangayName }: AnalyticsTabProps) {
  const { theme } = useTheme();
  const { 
    crimesByType, 
    crimesByMonth, 
    crimesByBarangay, 
    timePatterns, 
    trends,
    loading 
  } = useAnalyticsData(barangayName);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`p-6 rounded-2xl h-64 ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
              <div className="h-4 bg-gray-300 rounded mb-4"></div>
              <div className="h-32 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      {/* Header */}
      <div className={`border-b pb-6 ${theme === 'dark' ? 'border-white/5' : 'border-slate-200'}`}>
        <h2 className={`text-2xl font-black uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          Crime Analytics
        </h2>
        <p className="text-slate-500 text-base mt-2 font-medium">
          Comprehensive analysis and insights for {barangayName}
        </p>
      </div>

      {/* Trend Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={`border-0 shadow-lg ${theme === 'dark' ? 'bg-gradient-to-br from-blue-500/10 to-blue-600/5' : 'bg-gradient-to-br from-blue-50 to-blue-100'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                  Monthly Trend
                </p>
                <p className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {trends.monthlyChange > 0 ? '+' : ''}{trends.monthlyChange}%
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  vs last month
                </p>
              </div>
              <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                {trends.monthlyChange > 0 ? 
                  <TrendingUp className={`h-6 w-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} /> :
                  <TrendingDown className={`h-6 w-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                }
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`border-0 shadow-lg ${theme === 'dark' ? 'bg-gradient-to-br from-purple-500/10 to-purple-600/5' : 'bg-gradient-to-br from-purple-50 to-purple-100'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                  Peak Hours
                </p>
                <p className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {timePatterns.peakHour}:00
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Most incidents
                </p>
              </div>
              <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                <Clock className={`h-6 w-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`border-0 shadow-lg ${theme === 'dark' ? 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/5' : 'bg-gradient-to-br from-emerald-50 to-emerald-100'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  Resolution Rate
                </p>
                <p className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {trends.resolutionRate}%
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Cases resolved
                </p>
              </div>
              <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                <BarChart3 className={`h-6 w-6 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Crime Types Distribution */}
        <Card className={`border-0 shadow-lg ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-white'}`}>
          <CardHeader>
            <CardTitle className={`text-lg font-black uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Crime Types Distribution
            </CardTitle>
            <p className="text-sm text-slate-500">Most common incident categories</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {crimesByType.slice(0, 6).map((crime, index) => {
                const maxCount = Math.max(...crimesByType.map(c => c.count));
                const percentage = maxCount > 0 ? (crime.count / maxCount) * 100 : 0;
                
                return (
                  <div key={crime.type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                        {crime.type}
                      </span>
                      <span className="text-sm font-bold">{crime.count}</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'}`}>
                      <div 
                        className={`h-full transition-all duration-1000 ${
                          index === 0 ? 'bg-red-500' :
                          index === 1 ? 'bg-orange-500' :
                          index === 2 ? 'bg-yellow-500' :
                          index === 3 ? 'bg-blue-500' :
                          index === 4 ? 'bg-indigo-500' : 'bg-purple-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card className={`border-0 shadow-lg ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-white'}`}>
          <CardHeader>
            <CardTitle className={`text-lg font-black uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Monthly Crime Trends
            </CardTitle>
            <p className="text-sm text-slate-500">Incident patterns over time</p>
          </CardHeader>
          <CardContent>
            <div className="h-48 relative">
              <div className="absolute inset-0 flex items-end justify-between">
                {crimesByMonth.map((month, index) => {
                  const maxCount = Math.max(...crimesByMonth.map(m => m.count));
                  const height = maxCount > 0 ? (month.count / maxCount) * 160 : 0;
                  
                  return (
                    <div key={month.month} className="flex flex-col items-center gap-2">
                      <div 
                        className="w-6 bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-lg transition-all duration-1000 hover:from-indigo-400 hover:to-indigo-300 cursor-pointer"
                        style={{ height: `${Math.max(height, 4)}px` }}
                        title={`${month.count} incidents`}
                      />
                      <span className="text-xs text-slate-500 font-medium">
                        {month.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Barangay Comparison */}
        <Card className={`border-0 shadow-lg ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-white'}`}>
          <CardHeader>
            <CardTitle className={`text-lg font-black uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Barangay Comparison
            </CardTitle>
            <p className="text-sm text-slate-500">Crime distribution across areas</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {crimesByBarangay.slice(0, 8).map((barangay, index) => {
                const maxCount = Math.max(...crimesByBarangay.map(b => b.count));
                const percentage = maxCount > 0 ? (barangay.count / maxCount) * 100 : 0;
                
                return (
                  <div key={barangay.barangay} className="flex items-center gap-3">
                    <div className="w-24 text-xs font-medium text-slate-500 truncate">
                      {barangay.barangay}
                    </div>
                    <div className={`flex-1 h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'}`}>
                      <div 
                        className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-8 text-xs font-bold text-right">
                      {barangay.count}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Time Patterns */}
        <Card className={`border-0 shadow-lg ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-white'}`}>
          <CardHeader>
            <CardTitle className={`text-lg font-black uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Time Patterns
            </CardTitle>
            <p className="text-sm text-slate-500">Incident frequency by hour</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-2">
              {timePatterns.hourlyDistribution.map((hour, index) => {
                const maxCount = Math.max(...timePatterns.hourlyDistribution);
                const intensity = maxCount > 0 ? hour / maxCount : 0;
                
                return (
                  <div key={index} className="text-center">
                    <div 
                      className={`w-full h-8 rounded mb-1 transition-all duration-500 ${
                        intensity > 0.7 ? 'bg-red-500' :
                        intensity > 0.4 ? 'bg-yellow-500' :
                        intensity > 0.2 ? 'bg-blue-500' : 
                        theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'
                      }`}
                      style={{ opacity: Math.max(intensity, 0.3) }}
                      title={`${hour} incidents at ${index}:00`}
                    />
                    <span className="text-xs text-slate-500">{index}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>00:00</span>
              <span>Peak: {timePatterns.peakHour}:00</span>
              <span>23:00</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}