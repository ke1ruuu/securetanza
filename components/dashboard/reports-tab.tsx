"use client";

import React from "react";
import { 
  Calendar, 
  Download, 
  FileCheck 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMapContext } from "@/context/MapContext";
import { useTheme } from "@/context/ThemeContext";

interface ReportsTabProps {
  reports: { name: string; date: string; size: string }[];
}

export default function ReportsTab({ reports }: ReportsTabProps) {
  const { theme } = useTheme();
  
  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in zoom-in-95 duration-500">
      <div className={`flex justify-between items-end border-b pb-6 ${
        theme === 'dark' ? 'border-white/5' : 'border-slate-200'
      }`}>
        <div>
          <h2 className={`text-lg font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Archive</h2>
          <p className="text-slate-500 text-sm mt-1 font-bold uppercase tracking-wider">Official audits & data packets</p>
        </div>
      </div>

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
            <Button variant="ghost" size="icon" className={`h-10 w-10 rounded-lg transition-all ${
              theme === 'dark' ? 'text-slate-700 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-200'
            }`}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
