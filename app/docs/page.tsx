"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useTour } from "@/context/TourContext";
import {
  DOCS_SECTIONS,
  DocsHeader,
  DocsSidebar,
} from "@/components/docs";

export default function DocsPage() {
  const { replayTour } = useTour();
  const [activeSection, setActiveSection] = useState("intro");
  const [activeSubSection, setActiveSubSection] = useState<string | undefined>();

  const currentSection = useMemo(() => {
    return DOCS_SECTIONS.find((s) => s.id === activeSection) || DOCS_SECTIONS[0];
  }, [activeSection]);

  const ActiveComponent = currentSection.component;

  const handleSelectSection = useCallback((sectionId: string, subSectionId?: string) => {
    setActiveSection(sectionId);
    setActiveSubSection(subSectionId);

    if (subSectionId) {
      setTimeout(() => {
        const el = document.getElementById(subSectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 60);
    } else {
      const mainEl = document.querySelector('[data-tour="docs-content"]');
      if (mainEl) {
        mainEl.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-500">
      {/* Top Header */}
      <DocsHeader onReplayTour={() => replayTour()} />

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Tree View Navigation */}
        <DocsSidebar
          sections={DOCS_SECTIONS}
          activeSection={activeSection}
          activeSubSection={activeSubSection}
          onSelectSection={handleSelectSection}
        />

        {/* Right Content Area */}
        <main
          data-tour="docs-content"
          className="flex-1 overflow-y-auto bg-white dark:bg-slate-950 custom-scrollbar p-6 lg:p-10 scroll-smooth"
        >
          <div className="max-w-3xl mx-auto pb-20">
            <ActiveComponent onReplayTour={replayTour} />
          </div>
        </main>
      </div>
    </div>
  );
}
