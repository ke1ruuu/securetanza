"use client";

import React, { useState, useMemo } from "react";
import { useTour } from "@/context/TourContext";
import { DOCS_SECTIONS, DocsHeader, DocsSidebar } from "@/components/docs";

export default function DocsPage() {
  const { replayTour } = useTour();
  const [activeSection, setActiveSection] = useState("intro");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return DOCS_SECTIONS;
    const q = searchQuery.toLowerCase();
    return DOCS_SECTIONS.filter((s) => {
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchTags = s.tags?.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchTags;
    });
  }, [searchQuery]);

  const currentSection = useMemo(() => {
    return DOCS_SECTIONS.find((s) => s.id === activeSection) || DOCS_SECTIONS[0];
  }, [activeSection]);

  const ActiveComponent = currentSection.component;

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans bg-[#f8fafc] text-slate-900 dark:bg-[#0b1120] dark:text-slate-100 transition-colors duration-500">
      {/* Top Header */}
      <DocsHeader onReplayTour={() => replayTour()} />

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Navigation */}
        <DocsSidebar
          sections={filteredSections}
          activeSection={activeSection}
          onSelectSection={setActiveSection}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Right Content Area */}
        <main className="flex-1 overflow-y-auto bg-white/40 dark:bg-slate-950/40 custom-scrollbar p-6 lg:p-10">
          <div className="max-w-4xl mx-auto pb-16">
            <ActiveComponent onReplayTour={() => replayTour()} />
          </div>
        </main>
      </div>
    </div>
  );
}
