"use client";

import React from "react";
import { 
  MoreVertical 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMapContext } from "@/context/MapContext";
import { useTheme } from "@/context/ThemeContext";

import { Incident } from "@/constants/dummy";

interface IncidentsTabProps {
  incidents: Incident[];
}

export default function IncidentsTab({ incidents }: IncidentsTabProps) {
  const { theme } = useTheme();

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className={`flex items-end justify-between border-b pb-6 ${
        theme === 'dark' ? 'border-white/5' : 'border-slate-200'
      }`}>
        <div>
          <h2 className={`text-xl font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Active Cases</h2>
          <p className="text-slate-500 text-base mt-1 font-bold uppercase tracking-wider">Management protocols & dispatch</p>
        </div>
        <button className="text-base font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-400 transition-colors">
          View Archive →
        </button>
      </div>

      <div className="space-y-1">
        {incidents.map((incident) => (
          <div 
            key={incident.id} 
            className={`flex items-center justify-between p-4 rounded-xl transition-all group ${
              theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className={`text-base font-black uppercase tracking-tighter leading-none mb-1 ${
                   theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                }`}>{incident.id}</span>
                <span className={`text-lg font-bold transition-colors ${
                  theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                }`}>{incident.type}</span>
              </div>
            </div>

            <div className="flex items-center gap-12">
               <div className="flex flex-col items-end">
                 <span className={`text-base font-bold uppercase tracking-widest mb-1 ${
                   theme === 'dark' ? 'text-slate-600' : 'text-slate-400'
                 }`}>Status</span>
                 <div className="flex items-center gap-1.5">
                   <div className={`w-1 h-1 rounded-full ${incident.status === 'Solved' ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                   <span className={`text-base font-bold uppercase tracking-widest ${
                     theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                   }`}>{incident.status}</span>
                 </div>
               </div>
               
               <div className="flex flex-col items-end min-w-[60px]">
                 <span className={`text-base font-bold uppercase tracking-widest mb-1 ${
                   theme === 'dark' ? 'text-slate-600' : 'text-slate-400'
                 }`}>Time</span>
                 <span className={`text-base font-bold uppercase tracking-widest ${
                   theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                 }`}>{incident.date}</span>
               </div>

               <Button variant="ghost" size="icon" className={`h-8 w-8 opacity-0 group-hover:opacity-100 transition-all ${
                 theme === 'dark' ? 'text-slate-700' : 'text-slate-400'
               }`}>
                 <MoreVertical className="h-4 w-4" />
               </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
