"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function RealTimeClock() {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col items-center pointer-events-auto opacity-0">
        <div className="glass px-5 py-2.5 rounded-2xl flex items-center gap-4 bg-slate-950/20" />
      </div>
    );
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric"
    });
  };

  return (
    <div className="flex flex-col items-center pointer-events-auto">
      <div className="glass px-5 py-2.5 rounded-2xl flex items-center gap-4 bg-slate-950/20 backdrop-blur-3xl border border-white/5 shadow-2xl">
        <div className="flex items-center gap-2 pr-4 border-r border-white/10">
          <Clock className="h-3.5 w-3.5 text-indigo-400" />
          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{formatTime(time)}</span>
        </div>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{formatDate(time)}</span>
      </div>
      <div className="h-4 w-[1px] bg-gradient-to-b from-indigo-500/50 to-transparent" />
    </div>
  );
}
