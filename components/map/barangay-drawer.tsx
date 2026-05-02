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
  const riskColor = threatLevel === "critical" ? "text-red-400" : 
                   threatLevel === "high" ? "text-orange-400" :
                   threatLevel === "moderate" ? "text-yellow-400" : 
                   threatLevel === "low" ? "text-emerald-400" : "text-blue-400";
  
  const statusText = threatLevel === "critical" || threatLevel === "high" ? "Alert" : 
                     threatLevel === "moderate" ? "Nominal" : "Secure";

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="bg-slate-900/95 backdrop-blur-xl border-l-white/10 text-slate-100 h-full w-[400px] sm:max-w-[400px]">
        <div className="flex flex-col h-full">
          {loading ? (
            // Loading state
            <>
              <DrawerHeader className="border-b border-white/5 pb-6">
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
              <DrawerHeader className="border-b border-white/5 pb-6">
                <VisuallyHidden>
                  <DrawerTitle>Select Barangay</DrawerTitle>
                </VisuallyHidden>
              </DrawerHeader>
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-sm font-semibold text-slate-400">
                    {barangayName ? "No crime data available" : "Select a barangay to view details"}
                  </p>
                </div>
              </div>
            </>
          ) : (
            // Data loaded state
            <>
              <DrawerHeader className="border-b border-white/5 pb-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                        <MapPin className="h-4 w-4 text-indigo-400" />
                      </div>
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                        Crime Statistics
                      </span>
                    </div>
                    <DrawerTitle className="text-2xl font-black text-white tracking-tight">
                      {barangayName}
                    </DrawerTitle>
                    <DrawerDescription className="text-slate-400 font-medium">
                      Real-time security and crime data
                    </DrawerDescription>
                  </div>
                  <DrawerClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-white/10"
                    >
                      <X className="h-4 w-4 text-slate-400" />
                    </Button>
                  </DrawerClose>
                </div>
              </DrawerHeader>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Total Crimes
                    </p>
                    <div className="flex items-center gap-2">
                      <Activity className="h-3.5 w-3.5 text-indigo-400" />
                      <span className="text-lg font-black text-white">
                        {totalCrimes}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Risk Level
                    </p>
                    <div className="flex items-center gap-2">
                      <Shield className="h-3.5 w-3.5" />
                      <span className={`text-lg font-black ${riskColor}`}>
                        {riskLevel}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Status
                    </p>
                    <div className="flex items-center gap-2">
                      <Activity className={`h-3.5 w-3.5 ${statusText === 'Secure' ? 'text-emerald-400' : statusText === 'Alert' ? 'text-red-400' : 'text-indigo-400'}`} />
                      <span className={`text-sm font-bold ${statusText === 'Secure' ? 'text-emerald-400' : statusText === 'Alert' ? 'text-red-400' : 'text-indigo-400'}`}>
                        {statusText}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Safety Index
                    </p>
                    <div className="flex items-center gap-2">
                      <Shield className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-lg font-black text-emerald-400">
                        {stats.safetyIndex}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Crime Distribution */}
                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
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
                          <div key={crime.type} className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg border border-white/5">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div 
                                className="w-3 h-3 rounded-full flex-shrink-0" 
                                style={{ backgroundColor: color }}
                              />
                              <span className="text-xs font-medium text-slate-200 truncate">
                                {crime.type}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs font-bold text-white">
                                {crime.count}
                              </span>
                              <span className="text-xs font-medium text-slate-400">
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
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
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
                        className="flex justify-between items-center py-2 border-b border-white/5"
                      >
                        <span className="text-xs text-slate-400 font-medium">
                          {item.label}
                        </span>
                        <span className="text-xs text-slate-100 font-bold">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DrawerFooter className="border-t border-white/5 p-6 bg-slate-950/50">
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
