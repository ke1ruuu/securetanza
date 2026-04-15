"use client";

import React from "react";
import { 
  Shield, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Activity
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTheme } from "@/context/ThemeContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useThreatLevels } from "@/hooks/useThreatLevels";

interface OverviewTabProps {
  barangayName: string;
}

export default function OverviewTab({ barangayName }: OverviewTabProps) {
  const { theme } = useTheme();
  const { stats, activity, incidents, loading } = useDashboardData(barangayName);
  const { stats: threatStats } = useThreatLevels();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
              <div className="h-4 bg-gray-300 rounded mb-4"></div>
              <div className="h-8 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalBarangays = Object.values(threatStats).reduce((sum, count) => sum + count, 0);
  const criticalBarangays = threatStats.critical + threatStats.high;
  const safeBarangays = threatStats.secure + threatStats.low;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className={`border-0 shadow-lg ${theme === 'dark' ? 'bg-gradient-to-br from-red-500/10 to-red-600/5' : 'bg-gradient-to-br from-red-50 to-red-100'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                  Active Cases
                </p>
                <p className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {stats.activeCases}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Requires attention
                </p>
              </div>
              <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-red-500/20' : 'bg-red-100'}`}>
                <AlertTriangle className={`h-6 w-6 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`border-0 shadow-lg ${theme === 'dark' ? 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/5' : 'bg-gradient-to-br from-emerald-50 to-emerald-100'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  Resolved Today
                </p>
                <p className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {stats.resolvedToday}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Cases closed
                </p>
              </div>
              <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                <CheckCircle className={`h-6 w-6 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`border-0 shadow-lg ${theme === 'dark' ? 'bg-gradient-to-br from-blue-500/10 to-blue-600/5' : 'bg-gradient-to-br from-blue-50 to-blue-100'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                  Safety Index
                </p>
                <p className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {stats.safetyIndex}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Overall security
                </p>
              </div>
              <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                <Shield className={`h-6 w-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`border-0 shadow-lg ${theme === 'dark' ? 'bg-gradient-to-br from-indigo-500/10 to-indigo-600/5' : 'bg-gradient-to-br from-indigo-50 to-indigo-100'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
                  Active Patrols
                </p>
                <p className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {stats.activePatrols}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  On duty now
                </p>
              </div>
              <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                <Users className={`h-6 w-6 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Chart */}
        <Card className={`lg:col-span-2 border-0 shadow-lg ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-white'}`}>
          <CardHeader>
            <CardTitle className={`text-lg font-black uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Crime Activity Trend
            </CardTitle>
            <p className="text-sm text-slate-500">Last 12 months incident pattern</p>
          </CardHeader>
          <CardContent>
            <div className="h-64 relative">
              {/* Activity Chart */}
              <div className="absolute inset-0 flex items-end justify-between px-4">
                {activity.map((value, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div 
                      className="w-8 bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-lg transition-all duration-1000 hover:from-indigo-400 hover:to-indigo-300"
                      style={{ height: `${Math.max(value * 2, 8)}px` }}
                    />
                    <span className="text-xs text-slate-500 font-medium">
                      {index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-slate-500">Peak: {Math.max(...activity)}%</span>
              <span className="text-slate-500">Avg: {Math.round(activity.reduce((a, b) => a + b, 0) / activity.length)}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Threat Distribution */}
        <Card className={`border-0 shadow-lg ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-white'}`}>
          <CardHeader>
            <CardTitle className={`text-lg font-black uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Threat Distribution
            </CardTitle>
            <p className="text-sm text-slate-500">Barangay risk levels</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm font-medium">Critical</span>
                </div>
                <span className="text-sm font-bold">{threatStats.critical}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm font-medium">High</span>
                </div>
                <span className="text-sm font-bold">{threatStats.high}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm font-medium">Moderate</span>
                </div>
                <span className="text-sm font-bold">{threatStats.moderate}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-sm font-medium">Low</span>
                </div>
                <span className="text-sm font-bold">{threatStats.low}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium">Secure</span>
                </div>
                <span className="text-sm font-bold">{threatStats.secure}</span>
              </div>
            </div>
            
            <div className={`mt-6 p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-50'}`}>
              <div className="text-center">
                <p className="text-2xl font-black text-emerald-500">
                  {totalBarangays > 0 ? Math.round((safeBarangays / totalBarangays) * 100) : 0}%
                </p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                  Areas Secure
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Incidents */}
      <Card className={`border-0 shadow-lg ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-white'}`}>
        <CardHeader>
          <CardTitle className={`text-lg font-black uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Recent Incidents
          </CardTitle>
          <p className="text-sm text-slate-500">Latest security events requiring attention</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {incidents.slice(0, 5).map((incident) => (
              <div key={incident.id} className={`flex items-center justify-between p-4 rounded-xl transition-all hover:scale-[1.02] ${
                theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-50 hover:bg-slate-100'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    incident.severity === 'High' ? 'bg-red-500/20 text-red-400' :
                    incident.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {incident.type}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <MapPin className="h-3 w-3" />
                      <span>{incident.location}</span>
                      <Clock className="h-3 w-3 ml-2" />
                      <span>{incident.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    incident.status === 'Solved' ? 'bg-emerald-500/20 text-emerald-400' :
                    incident.status === 'Active' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {incident.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
