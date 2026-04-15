"use client";

import React from "react";
import { Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  label: string;
  value: string;
  accent?: string;
}

export default function StatsCard({ label, value, accent = "#818cf8" }: StatsCardProps) {
  return (
    <Card className="glass border-white/5 rounded-2xl overflow-hidden min-w-[100px] hover:bg-white/5 transition-colors pointer-events-auto shadow-2xl">
      <CardContent className="p-4 flex flex-col items-center">
        <div className="flex items-center gap-1.5 mb-1.5 opacity-60">
          <Activity className="h-3 w-3" style={{ color: accent }} />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{label}</span>
        </div>
        <span className="text-2xl font-black text-white" style={{ textShadow: `0 0 20px ${accent}40` }}>{value}</span>
      </CardContent>
    </Card>
  );
}
