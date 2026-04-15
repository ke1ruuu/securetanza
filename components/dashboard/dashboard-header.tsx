"use client";

import React from "react";
import { 
  MapPin, 
  Search, 
  Bell, 
  Plus 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMapContext } from "@/context/MapContext";
import { useTheme } from "@/context/ThemeContext";

interface HeaderProps {
  barangayName: string;
}

export default function DashboardHeader({ barangayName }: HeaderProps) {
  const { theme } = useTheme();

  return (
    <header className={`h-16 border-b flex items-center justify-between px-8 shrink-0 backdrop-blur-md transition-all duration-700 ${
      theme === 'dark' ? 'bg-slate-950/20 border-white/5' : 'bg-white/40 border-slate-200'
    }`}>
      <div className="flex items-center gap-4">
        <div className={`p-1.5 border rounded-lg ${
          theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'
        }`}>
          <MapPin className="h-4 w-4 text-indigo-500" />
        </div>
        <h1 className={`text-lg font-black uppercase tracking-widest transition-colors ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>{barangayName}</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group hidden sm:block">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${
            theme === 'dark' ? "text-slate-600 group-hover:text-slate-400" : "text-slate-400 group-hover:text-slate-600"
          }`} />
          <input 
            type="text" 
            placeholder="Search…" 
            className={`bg-transparent border-b py-1.5 pl-8 pr-2 text-sm font-bold uppercase tracking-widest focus:outline-none transition-all w-48 ${
              theme === 'dark' 
                ? "border-white/5 text-slate-400 focus:border-indigo-500/50" 
                : "border-slate-200 text-slate-600 focus:border-indigo-500"
            }`}
          />
        </div>
        <Button variant="ghost" size="icon" className={`h-8 w-8 transition-all ${
          theme === 'dark' ? "text-slate-600 hover:text-white" : "text-slate-400 hover:text-slate-800"
        }`}>
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
