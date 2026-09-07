"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  ChevronRight,
  FolderTree,
  Search,
  X,
  ChevronsUpDown,
  Hash,
  BookOpen,
} from "lucide-react";
import { DocsSectionItem, DocsSubSectionItem } from "./docs-types";

export interface DocsSidebarProps {
  sections: DocsSectionItem[];
  activeSection: string;
  activeSubSection?: string;
  onSelectSection: (sectionId: string, subSectionId?: string) => void;
}

export function DocsSidebar({
  sections,
  activeSection,
  activeSubSection,
  onSelectSection,
}: DocsSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Flat two-level tree: Map of section expanded states (all expanded by default)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    sections.forEach((sec) => {
      initial[sec.id] = true;
    });
    return initial;
  });

  // Keep expanded state up to date when sections change or activeSection changes
  useEffect(() => {
    if (!activeSection) return;
    setExpandedSections((prev) => ({
      ...prev,
      [activeSection]: true,
    }));
  }, [activeSection]);

  // Toggle section expand/collapse
  const toggleSection = useCallback((sectionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  }, []);

  // Check if all expandable sections are currently expanded
  const areAllExpanded = useMemo(() => {
    const expandable = sections.filter((s) => s.subsections && s.subsections.length > 0);
    if (expandable.length === 0) return true;
    return expandable.every((s) => expandedSections[s.id]);
  }, [sections, expandedSections]);

  // Toggle expand all / collapse all
  const handleToggleAll = useCallback(() => {
    if (areAllExpanded) {
      // Collapse all
      const collapsed: Record<string, boolean> = {};
      sections.forEach((s) => {
        collapsed[s.id] = false;
      });
      setExpandedSections(collapsed);
    } else {
      // Expand all
      const expanded: Record<string, boolean> = {};
      sections.forEach((s) => {
        expanded[s.id] = true;
      });
      setExpandedSections(expanded);
    }
  }, [areAllExpanded, sections]);

  // Search filtering logic
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredSections = useMemo(() => {
    if (!normalizedQuery) return sections;

    return sections.filter((sec) => {
      const titleMatch = sec.title.toLowerCase().includes(normalizedQuery);
      const tagMatch = sec.tags?.some((t) => t.toLowerCase().includes(normalizedQuery));
      const subMatch = sec.subsections?.some(
        (sub) =>
          sub.title.toLowerCase().includes(normalizedQuery) ||
          sub.tags?.some((t) => t.toLowerCase().includes(normalizedQuery))
      );
      return titleMatch || tagMatch || Boolean(subMatch);
    });
  }, [sections, normalizedQuery]);

  // Auto-expand all matching sections when searching
  useEffect(() => {
    if (normalizedQuery) {
      const newExpanded: Record<string, boolean> = {};
      filteredSections.forEach((sec) => {
        newExpanded[sec.id] = true;
      });
      setExpandedSections((prev) => ({ ...prev, ...newExpanded }));
    }
  }, [normalizedQuery, filteredSections]);

  // Handle section row click
  const handleSectionClick = (sectionId: string) => {
    onSelectSection(sectionId);
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: true,
    }));
  };

  // Handle subsection click
  const handleSubSectionClick = (sectionId: string, subSectionId: string) => {
    onSelectSection(sectionId, subSectionId);
  };

  return (
    <aside
      data-tour="docs-sidebar"
      className="w-68 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col overflow-hidden shrink-0 select-none"
    >
      {/* Sidebar Header with Tree Label and Expand All Action */}
      <div className="px-3.5 pt-3.5 pb-2 flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800/70">
        <div className="flex items-center gap-2">
          <FolderTree className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            User Manual
          </span>
        </div>

        <button
          onClick={handleToggleAll}
          title={areAllExpanded ? "Collapse all topics" : "Expand all topics"}
          className="flex items-center gap-1 px-1.5 py-1 text-[10px] font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
        >
          <ChevronsUpDown className="h-3 w-3" />
          <span>{areAllExpanded ? "Collapse All" : "Expand All"}</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="px-3 py-2.5 border-b border-slate-200/70 dark:border-slate-800/70 bg-white/40 dark:bg-slate-950/20">
        <div className="relative flex items-center">
          <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          <input
            data-tour="docs-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter topics..."
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-100/80 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-md placeholder-slate-400 dark:placeholder-slate-500 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded cursor-pointer"
              title="Clear filter"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Flat Two-Level Tree Navigation List */}
      <div
        role="tree"
        aria-label="Documentation Topics Tree"
        className="flex-1 overflow-y-auto px-2.5 py-2 space-y-1 custom-scrollbar"
      >
        {filteredSections.length === 0 ? (
          <div className="p-6 text-center">
            <BookOpen className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-600 mb-2 stroke-[1.5]" />
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              No topics found
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              No matching topics for &ldquo;{searchQuery}&rdquo;
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-3 inline-flex items-center px-2.5 py-1 text-xs font-medium text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900/50 rounded cursor-pointer transition-colors"
            >
              Clear filter
            </button>
          </div>
        ) : (
          filteredSections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            const hasSubSections = Boolean(sec.subsections && sec.subsections.length > 0);
            const isExpanded = Boolean(expandedSections[sec.id]);

            return (
              <div
                key={sec.id}
                role="treeitem"
                aria-selected={isActive}
                aria-expanded={hasSubSections ? isExpanded : undefined}
                className="space-y-0.5"
              >
                {/* Level 1: Topic Row */}
                <div
                  className={`group relative flex items-center rounded-md text-xs transition-all ${
                    isActive
                      ? "bg-sky-500/10 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300 font-medium shadow-xs"
                      : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/50"
                  }`}
                >
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-sky-600 dark:bg-sky-400 rounded-r" />
                  )}

                  {/* Level 1 Chevron toggle */}
                  {hasSubSections ? (
                    <button
                      type="button"
                      onClick={(e) => toggleSection(sec.id, e)}
                      title={isExpanded ? "Collapse subtopics" : "Expand subtopics"}
                      className="p-1.5 ml-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer shrink-0 rounded transition-colors"
                    >
                      <ChevronRight
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${
                          isExpanded
                            ? "rotate-90 text-sky-600 dark:text-sky-400"
                            : "text-slate-400"
                        }`}
                      />
                    </button>
                  ) : (
                    <div className="w-5 shrink-0" />
                  )}

                  {/* Level 1 Main button click */}
                  <button
                    type="button"
                    onClick={() => handleSectionClick(sec.id)}
                    className="flex-1 flex items-center justify-between py-1.5 pr-2 min-w-0 text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          isActive
                            ? "text-sky-600 dark:text-sky-400"
                            : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                        }`}
                      />
                      <span className="truncate">{sec.title}</span>
                    </div>

                    {hasSubSections && (
                      <span className="ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200/50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 shrink-0">
                        {sec.subsections?.length}
                      </span>
                    )}
                  </button>
                </div>

                {/* Level 2: Subsections (Visible when Level 1 is expanded) */}
                {hasSubSections && isExpanded && (
                  <div
                    role="group"
                    className="ml-4 pl-3 my-0.5 border-l border-slate-200 dark:border-slate-800 space-y-0.5"
                  >
                    {sec.subsections?.map((sub: DocsSubSectionItem) => {
                      const isSubActive = isActive && activeSubSection === sub.id;

                      return (
                        <button
                          key={sub.id}
                          type="button"
                          role="treeitem"
                          aria-selected={isSubActive}
                          onClick={() => handleSubSectionClick(sec.id, sub.id)}
                          className={`w-full flex items-center gap-1.5 px-2 py-1 rounded text-left text-[11px] transition-colors cursor-pointer ${
                            isSubActive
                              ? "text-sky-600 dark:text-sky-400 font-semibold bg-sky-50 dark:bg-sky-950/40"
                              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/40"
                          }`}
                        >
                          <Hash
                            className={`h-2.5 w-2.5 shrink-0 ${
                              isSubActive
                                ? "text-sky-600 dark:text-sky-400"
                                : "text-slate-300 dark:text-slate-600"
                            }`}
                          />
                          <span className="truncate">{sub.title}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Sidebar Footer */}
      <div className="px-3.5 py-2 border-t border-slate-200/70 dark:border-slate-800/70 bg-white/40 dark:bg-slate-950/20 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
        <span>{sections.length} topics</span>
        <span>SecureTanza Manual</span>
      </div>
    </aside>
  );
}
