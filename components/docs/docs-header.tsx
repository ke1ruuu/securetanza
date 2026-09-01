"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Sparkles, Home } from "lucide-react";

interface DocsHeaderProps {
  onReplayTour?: () => void;
  onBack?: () => void;
  onHome?: () => void;
}

export function DocsHeader({ onReplayTour, onBack, onHome }: DocsHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleHome = () => {
    if (onHome) {
      onHome();
    } else {
      router.push("/");
    }
  };

  return (
    <header className="w-full backdrop-blur-xl border-b z-50 flex-none bg-white/90 border-slate-200/80 dark:bg-[#0F172A]/90 dark:border-white/[0.08] shadow-sm">
      <div className="flex items-center justify-between h-16 px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-sm font-medium cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>

          <div className="h-5 w-px bg-slate-200 dark:bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Documentation & User Manual
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Complete operational manual for SecureTanza
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {onReplayTour && (
            <button
              onClick={onReplayTour}
              data-tour="docs-tour-btn"
              className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 font-medium text-xs border border-sky-500/20 transition-colors cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Start Tour</span>
            </button>
          )}

          <button
            onClick={handleHome}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs shadow-sm hover:shadow-sky-500/20 transition-all cursor-pointer"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Home Map</span>
          </button>
        </div>
      </div>
    </header>
  );
}
