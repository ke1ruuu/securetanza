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
  title = "Next Steps",
  suggestion,
  actions,
}: DocsCtaProps) {
  return (
    <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
            {title}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
            {suggestion}
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {actions.map((act, idx) => {
            const Icon = act.icon;
            const isPrimary = act.variant !== "secondary";
            const btnClass = isPrimary
              ? "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 font-medium text-xs transition-colors no-underline cursor-pointer"
              : "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs transition-colors no-underline cursor-pointer";

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
    </div>
  );
}
