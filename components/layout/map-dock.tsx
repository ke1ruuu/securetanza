"use client";

import React from "react";
import { Map as MapIcon, FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface MapDockProps {
  onDashboard: () => void;
}

export default function MapDock({ onDashboard }: MapDockProps) {
  return (
    <div className="pointer-events-auto">
      <Card className="glass flex-row items-center gap-1.5 p-2 rounded-2xl border-white/5 backdrop-blur-3xl shadow-2xl">
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500/25 border border-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
          <MapIcon className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onDashboard}
          className="h-10 w-10 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-all"
        >
          <FileText className="h-5 w-5" />
        </Button>
        <div className="w-[1px] h-6 bg-white/10 mx-1" />
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-all">
          <Settings className="h-5 w-5" />
        </Button>
      </Card>
    </div>
  );
}
