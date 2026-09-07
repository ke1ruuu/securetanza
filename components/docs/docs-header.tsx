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
    <header className="w-full border-b z-50 flex-none bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800">
      <div className="flex items-center justify-between h-14 px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 px-2 py-1 rounded text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-medium cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back</span>
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <BookOpen className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            <div>
              <h1 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">
                Documentation & User Manual
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onReplayTour && (
            <button
              onClick={onReplayTour}
              data-tour="docs-tour-btn"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs transition-colors cursor-pointer"
            >
              <Sparkles className="h-3 w-3" />
              <span>Start Tour</span>
            </button>
          )}

          <button
            onClick={handleHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 font-medium text-xs transition-colors cursor-pointer"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Home Map</span>
          </button>
        </div>
      </div>
    </header>
  );
}
