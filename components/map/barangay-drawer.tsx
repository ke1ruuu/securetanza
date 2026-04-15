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
import { MapPin, Info, Shield, Users, Activity, X } from "lucide-react";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

import { BarangayData } from "@/constants/dummy";

interface BarangayDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: BarangayData | null;
  loading?: boolean;
  onMoreInfo: (name: string) => void;
}

export default function BarangayDrawer({ open, onOpenChange, data, loading = false, onMoreInfo }: BarangayDrawerProps) {
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
          ) : !data ? (
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
                  <p className="text-sm font-semibold text-slate-400">Select a barangay to view details</p>
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
                        Sector Analysis
                      </span>
                    </div>
                    <DrawerTitle className="text-2xl font-black text-white tracking-tight">
                      {data.name}
                    </DrawerTitle>
                    <DrawerDescription className="text-slate-400 font-medium">
                      Real-time security and administrative data
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

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Security Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Active Cases
                    </p>
                    <div className="flex items-center gap-2">
                      <Shield className="h-3.5 w-3.5 text-indigo-400" />
                      <span className="text-lg font-black text-white">
                        {data.stats.activeCases}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Safety Index
                    </p>
                    <div className="flex items-center gap-2">
                      <Activity className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-lg font-black text-emerald-400">
                        {data.stats.safetyIndex}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Status
                    </p>
                    <div className="flex items-center gap-2">
                      <Activity className={`h-3.5 w-3.5 ${data.stats.status === 'Secure' ? 'text-emerald-400' : data.stats.status === 'Alert' ? 'text-red-400' : 'text-indigo-400'}`} />
                      <span className={`text-sm font-bold ${data.stats.status === 'Secure' ? 'text-emerald-400' : data.stats.status === 'Alert' ? 'text-red-400' : 'text-indigo-400'}`}>
                        {data.stats.status}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Risk Level
                    </p>
                    <div className="flex items-center gap-2">
                      <Shield className={`h-3.5 w-3.5 ${data.stats.risk === 'Low' ? 'text-emerald-400' : data.stats.risk === 'High' ? 'text-red-400' : 'text-yellow-400'}`} />
                      <span className={`text-sm font-bold ${data.stats.risk === 'Low' ? 'text-emerald-400' : data.stats.risk === 'High' ? 'text-red-400' : 'text-yellow-400'}`}>
                        {data.stats.risk}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recent Incidents */}
                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Info className="h-3.5 w-3.5" />
                    Recent Incidents
                  </h4>
                  <div className="space-y-2">
                    {data.incidents.slice(0, 3).map((incident) => (
                      <div
                        key={incident.id}
                        className="flex justify-between items-center py-2 px-3 bg-white/5 rounded-lg border border-white/5"
                      >
                        <div>
                          <span className="text-xs text-slate-100 font-medium">
                            {incident.type}
                          </span>
                          <p className="text-[10px] text-slate-400">
                            {incident.date}
                          </p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                          incident.status === 'Solved' ? 'bg-emerald-500/20 text-emerald-400' :
                          incident.status === 'Active' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {incident.status}
                        </span>
                      </div>
                    ))}
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
                  onClick={() => onMoreInfo(data.name)}
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
