"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { DocsSectionItem } from "./docs-types";

interface DocsSidebarProps {
  sections: DocsSectionItem[];
  activeSection: string;
  onSelectSection: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function DocsSidebar({
  sections,
  activeSection,
  onSelectSection,
  searchQuery,
  onSearchChange,
}: DocsSidebarProps) {
  return (
    <aside data-tour="docs-sidebar" className="w-80 border-r border-slate-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-slate-900/40 flex flex-col overflow-hidden">
      {/* Search Box */}
      <div data-tour="docs-search" className="p-4 border-b border-slate-200/80 dark:border-white/[0.08]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search topics, modules, keywords..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Item List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
        {sections.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs">
            No matching documentation topics found for "{searchQuery}".
          </div>
        ) : (
          sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => onSelectSection(sec.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all cursor-pointer ${
                  isActive
                    ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 font-semibold shadow-sm"
                    : "hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 font-medium"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      isActive
                        ? "bg-sky-500/20 text-sky-600 dark:text-sky-400"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs truncate">{sec.title}</span>
                </div>
                {sec.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold shrink-0 ml-2 ${
                      isActive
                        ? "bg-sky-500/20 text-sky-700 dark:text-sky-300"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {sec.badge}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
