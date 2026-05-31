"use client";

import React from "react";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerDescription, 
  DrawerFooter, 
  DrawerClose 
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { MapPin, Info, Shield, Users, Activity, X, AlertTriangle } from "lucide-react";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { useCrimeHoverStats } from "@/hooks/useCrimeHoverStats";
import { useThreatLevels, getThreatLevelFromCount } from "@/hooks/useThreatLevels";
import { getCrimeTypeColor } from "@/hooks/useCrimeTypes";
import { useTheme } from "@/context/ThemeContext";

import { BarangayData } from "@/constants/dummy";

interface BarangayDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barangayName: string | null;
  onMoreInfo: (name: string) => void;
}

export default function BarangayDrawer({ open, onOpenChange, barangayName, onMoreInfo }: BarangayDrawerProps) {
  const { stats, loading } = useCrimeHoverStats(barangayName);
  const { barangayCrimeCounts } = useThreatLevels();
  const { theme } = useTheme();

  // Calculate threat level and risk
  const totalCrimes = stats?.crimesByType.reduce((sum, crime) => sum + crime.count, 0) || 0;
  const normalizedName = barangayName?.toUpperCase() || '';
  const actualCrimeCount = barangayCrimeCounts[normalizedName] || barangayCrimeCounts[barangayName || ''] || totalCrimes;
  
  const threatLevel = getThreatLevelFromCount(actualCrimeCount, {
    low: 2,
    moderate: 5,
    high: 10,
    critical: 15
  });
  
  const riskLevel = threatLevel.charAt(0).toUpperCase() + threatLevel.slice(1);
  const riskColor = threatLevel === "critical"
    ? (theme === 'dark' ? 'text-red-400' : 'text-red-600')
    : threatLevel === "high"
    ? (theme === 'dark' ? 'text-orange-400' : 'text-orange-600')
    : threatLevel === "moderate"
    ? (theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600')
    : threatLevel === "low"
    ? (theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600')
    : (theme === 'dark' ? 'text-blue-400' : 'text-blue-600');
  
  const statusText = threatLevel === "critical" || threatLevel === "high" ? "Alert" : 
                     threatLevel === "moderate" ? "Nominal" : "Secure";

  const statusColor = statusText === 'Secure'
    ? (theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600')
    : statusText === 'Alert'
    ? (theme === 'dark' ? 'text-red-400' : 'text-red-600')
    : (theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600');

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className={`backdrop-blur-xl border-l h-full w-[400px] sm:max-w-[400px] transition-colors duration-500 ${
        theme === 'dark' 
          ? 'bg-slate-900/95 border-l-white/10 text-slate-100' 
          : 'bg-white/95 border-l-slate-200 text-slate-800'
      }`}>
        <div className="flex flex-col h-full">
          {loading ? (
            // Loading state
            <>
              <DrawerHeader className={`border-b pb-6 ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                <VisuallyHidden>
                  <DrawerTitle>Loading Barangay Data</DrawerTitle>
                </VisuallyHidden>
              </DrawerHeader>
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                  <p className="text-sm font-semibold text-slate-400">Loading barangay data...</p>
                </div>
              </div>
            </>
          ) : !barangayName || !stats ? (
            // No data state
            <>
              <DrawerHeader className={`border-b pb-6 ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                <VisuallyHidden>
                  <DrawerTitle>Select Barangay</DrawerTitle>
                </VisuallyHidden>
              </DrawerHeader>
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className={`h-12 w-12 mx-auto mb-4 ${theme === 'dark' ? 'text-slate-600' : 'text-slate-300'}`} />
                  <p className="text-sm font-semibold text-slate-400">
                    {barangayName ? "No crime data available" : "Select a barangay to view details"}
                  </p>
                </div>
              </div>
            </>
          ) : (
            // Data loaded state
            <>
              <DrawerHeader className={`border-b pb-6 ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${theme === 'dark' ? 'bg-indigo-500/20' : 'bg-indigo-50'}`}>
                        <MapPin className={`h-4 w-4 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
                        Crime Statistics
                      </span>
                    </div>
                    <DrawerTitle className={`text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {barangayName}
                    </DrawerTitle>
                    <DrawerDescription className={`font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      Real-time security and crime data
                    </DrawerDescription>
                  </div>
                  <DrawerClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 rounded-full ${theme === 'dark' ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </DrawerClose>
                </div>
              </DrawerHeader>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className={`rounded-2xl p-4 border transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200/60'}`}>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Total Crimes
                    </p>
                    <div className="flex items-center gap-2">
                      <Activity className={`h-3.5 w-3.5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                      <span className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {totalCrimes}
                      </span>
                    </div>
                  </div>
                  <div className={`rounded-2xl p-4 border transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200/60'}`}>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Risk Level
                    </p>
                    <div className="flex items-center gap-2">
                      <Shield className={`h-3.5 w-3.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-500'}`} />
                      <span className={`text-lg font-black ${riskColor}`}>
                        {riskLevel}
                      </span>
                    </div>
                  </div>
                  <div className={`rounded-2xl p-4 border transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200/60'}`}>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Status
                    </p>
                    <div className="flex items-center gap-2">
                      <Activity className={`h-3.5 w-3.5 ${statusColor}`} />
                      <span className={`text-sm font-bold ${statusColor}`}>
                        {statusText}
                      </span>
                    </div>
                  </div>
                  <div className={`rounded-2xl p-4 border transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200/60'}`}>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Safety Index
                    </p>
                    <div className="flex items-center gap-2">
                      <Shield className={`h-3.5 w-3.5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      <span className={`text-lg font-black ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        {stats.safetyIndex}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Crime Distribution */}
                <div className="space-y-4">
                  <h4 className={`text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'}`}>
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Crime Distribution
                  </h4>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {stats.crimesByType
                      .filter(crime => crime.count > 0)
                      .sort((a, b) => b.count - a.count)
                      .map((crime) => {
                        const percentage = totalCrimes > 0 ? Math.round((crime.count / totalCrimes) * 100) : 0;
                        const color = getCrimeTypeColor(crime.type);
                        
                        return (
                          <div key={crime.type} className={`flex items-center justify-between py-2 px-3 rounded-lg border transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200/60'}`}>
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div 
                                className="w-3 h-3 rounded-full flex-shrink-0" 
                                style={{ backgroundColor: color }}
                              />
                              <span className={`text-xs font-medium truncate ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                                {crime.type}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                {crime.count}
                              </span>
                              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                ({percentage}%)
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Administrative Info */}
                <div className="space-y-4">
                  <h4 className={`text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'}`}>
                    <Users className="h-3.5 w-3.5" />
                    Administrative Info
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: "Municipality", value: "Tanza" },
                      { label: "Province", value: "Cavite" },
                      { label: "Region", value: "IV-A (CALABARZON)" },
                      { label: "Country", value: "Philippines" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={`flex justify-between items-center py-2 border-b transition-colors ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}
                      >
                        <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          {item.label}
                        </span>
                        <span className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DrawerFooter className={`border-t p-6 transition-colors ${theme === 'dark' ? 'border-white/5 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
                <Button 
                  onClick={() => onMoreInfo(barangayName)}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-11 rounded-xl shadow-lg shadow-indigo-500/20"
                >
                  View Full Dashboard
                </Button>
              </DrawerFooter>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
