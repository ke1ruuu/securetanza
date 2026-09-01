"use client";

import React from "react";
import Link from "next/link";
import { Lightbulb, ArrowRight } from "lucide-react";

export interface DocsCtaAction {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: "primary" | "secondary";
}

export interface DocsCtaProps {
  title?: string;
  suggestion: string;
  actions: DocsCtaAction[];
}

export function DocsCta({
  title = "Operational Recommendation & Next Steps",
  suggestion,
  actions,
}: DocsCtaProps) {
  return (
    <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-sky-500/[0.08] via-indigo-500/[0.04] to-purple-500/[0.08] border border-sky-200/80 dark:border-sky-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-semibold text-sm">
          <Lightbulb className="w-4 h-4 shrink-0" />
          <span>{title}</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
          {suggestion}
        </p>
      </div>
      <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          const isPrimary = act.variant !== "secondary";
          const btnClass = isPrimary
            ? "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs shadow-md hover:shadow-sky-500/20 transition-all no-underline cursor-pointer"
            : "inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs border border-slate-200 dark:border-slate-700 shadow-sm transition-all no-underline cursor-pointer";

          if (act.href) {
            return (
              <Link key={idx} href={act.href} className={btnClass}>
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{act.label}</span>
                {isPrimary && <ArrowRight className="w-3.5 h-3.5" />}
              </Link>
            );
          }

          return (
            <button key={idx} onClick={act.onClick} className={btnClass}>
              {Icon && <Icon className="w-3.5 h-3.5" />}
              <span>{act.label}</span>
              {isPrimary && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
