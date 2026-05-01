"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { TimeFilterState } from "@/components/layout/time-filter";

interface TimeFilterContextType {
  isFilterActive: boolean;
  isPlaying: boolean;
  timeFilters: TimeFilterState;
  setIsFilterActive: (isActive: boolean) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setTimeFilters: (filters: TimeFilterState) => void;
  toggleFilter: () => void;
  togglePlayPause: () => void;
}

const TimeFilterContext = createContext<TimeFilterContextType | undefined>(undefined);

export function TimeFilterProvider({ children }: { children: ReactNode }) {
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeFilters, setTimeFilters] = useState<TimeFilterState>({
    selectedDate: new Date(),
    timeRange: "24h",
    selectedHour: null,
  });

  const toggleFilter = useCallback(() => {
    setIsFilterActive((prev) => !prev);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  return (
    <TimeFilterContext.Provider
      value={{
        isFilterActive,
        isPlaying,
        timeFilters,
        setIsFilterActive,
        setIsPlaying,
        setTimeFilters,
        toggleFilter,
        togglePlayPause,
      }}
    >
      {children}
    </TimeFilterContext.Provider>
  );
}

export function useTimeFilterContext() {
  const context = useContext(TimeFilterContext);
  if (context === undefined) {
    throw new Error("useTimeFilterContext must be used within a TimeFilterProvider");
  }
  return context;
}
