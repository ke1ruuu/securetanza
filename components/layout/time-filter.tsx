"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useMapContext } from "@/context/MapContext";

// Threat level colors matching the map legend
const THREAT_COLORS = {
  secure: "#0ea5e9", // Sky Blue
  low: "#10b981", // Emerald
  moderate: "#eab308", // Yellow
  high: "#f97316", // Orange
  critical: "#ef4444", // Red
};

interface TimeFilterProps {
  onFilterChange: (filters: TimeFilterState) => void;
  isPlaying: boolean;
  onPlayPauseToggle: () => void;
}

export interface TimeFilterState {
  selectedDate: Date;
  timeRange: "24h" | "7d" | "60d";
  selectedHour: number | null;
}

export default function TimeFilter({ onFilterChange, isPlaying, onPlayPauseToggle }: TimeFilterProps) {
  // Initialize with current date, will be updated with most recent crime date
  const [selectedDate, setSelectedDate] = useState(() => {
    const defaultDate = new Date();
    defaultDate.setHours(0, 0, 0, 0);
    return defaultDate;
  });
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "60d">("60d");
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [hourlyData, setHourlyData] = useState<number[]>(Array(24).fill(0));
  const [currentPlaybackHour, setCurrentPlaybackHour] = useState<number>(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [currentDateIndex, setCurrentDateIndex] = useState<number>(0);
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  
  const { setTimeFilter, selectedYear } = useMapContext();

  // Fetch available dates and the most recent crime date from database on mount
  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        console.log('🔍 Fetching available crime dates...');
        
        // Build query params with year filter if selected
        const params = new URLSearchParams();
        if (selectedYear) {
          params.set('year', selectedYear.toString());
        }
        
        const response = await fetch(`/api/crimes?${params.toString()}`);
        const result = await response.json();
        
        if (result.success && result.data.length > 0) {
          // Extract unique dates from crimes
          const uniqueDates = new Set<string>();
          result.data.forEach((crime: any) => {
            const date = new Date(crime.dateCommitted);
            date.setHours(0, 0, 0, 0);
            uniqueDates.add(date.toISOString());
          });
          
          // Convert to Date objects and sort (most recent first)
          const dates = Array.from(uniqueDates)
            .map(dateStr => new Date(dateStr))
            .sort((a, b) => b.getTime() - a.getTime());
          
          console.log('✅ Found', dates.length, 'unique crime dates');
          setAvailableDates(dates);
          
          // Set the most recent date as selected
          if (dates.length > 0) {
            const mostRecentDate = dates[0];
            console.log('✅ Most recent crime date:', mostRecentDate.toLocaleDateString());
            setSelectedDate(mostRecentDate);
            setCurrentDateIndex(0);
            
            // Initialize with hour 0
            setSelectedHour(0);
            setIsInitialized(true);
          }
        } else {
          console.log('⚠️ No crimes found, using current date');
          setSelectedHour(0);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('❌ Error fetching available dates:', error);
        setSelectedHour(0);
        setIsInitialized(true);
      }
    };

    fetchAvailableDates();
  }, [selectedYear]); // Re-fetch when year changes

  // Initialize time filter after date is loaded
  useEffect(() => {
    if (isInitialized && selectedHour !== null) {
      const initialHourCount = hourlyData[selectedHour] || 0;
      console.log('⚙️ Initializing time filter:', { 
        date: selectedDate.toLocaleDateString(), 
        hour: selectedHour, 
        count: initialHourCount 
      });
      setTimeFilter(selectedDate, selectedHour, initialHourCount);
    }
  }, [isInitialized]); // Only run when initialized

  // Fetch hourly crime data from backend
  useEffect(() => {
    const fetchHourlyData = async () => {
      try {
        // Use the EXACT selected date for hourly distribution
        const startDate = new Date(selectedDate);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(selectedDate);
        endDate.setHours(23, 59, 59, 999);

        console.log('📊 Fetching hourly data for SPECIFIC DATE:', { 
          selectedDate: selectedDate.toLocaleDateString(),
          selectedYear,
          startDate: startDate.toISOString(), 
          endDate: endDate.toISOString(),
          timestamp: new Date().toISOString()
        });

        // Build URL with year filter if selected
        const params = new URLSearchParams({
          startDateCommitted: startDate.toISOString(),
          endDateCommitted: endDate.toISOString()
        });
        
        if (selectedYear) {
          params.set('year', selectedYear.toString());
        }

        const url = `/api/crimes?${params.toString()}`;
        console.log('🌐 Timeline fetch URL:', url);
        
        const response = await fetch(url);
        const result = await response.json();

        if (result.success) {
          console.log(`📈 Found ${result.data.length} total crimes for date ${selectedDate.toLocaleDateString()}`);
          
          // Log some sample crime dates and times to help debug
          if (result.data.length > 0) {
            const samples = result.data.slice(0, 5).map((c: any) => ({
              date: new Date(c.dateCommitted).toLocaleDateString(),
              time: c.timeCommitted
            }));
            console.log('Sample crime dates/times:', samples);
          } else {
            console.log('⚠️ NO CRIMES found for this date!');
          }
          
          // Process crimes to get hourly distribution using timeCommitted field
          const hourCounts = Array(24).fill(0);
          result.data.forEach((crime: any) => {
            // Parse hour from timeCommitted string (format: "HH:MM:SS" or "HH:MM")
            const timeParts = crime.timeCommitted.split(':');
            const hour = parseInt(timeParts[0]);
            if (hour >= 0 && hour < 24) {
              hourCounts[hour]++;
            }
          });
          console.log('Hourly distribution:', hourCounts);
          console.log('Total crimes by hour:', hourCounts.reduce((a, b) => a + b, 0));
          setHourlyData(hourCounts);
        } else {
          console.error('❌ Failed to fetch crimes:', result.error);
          setHourlyData(Array(24).fill(0)); // Reset to empty
        }
      } catch (error) {
        console.error("Error fetching hourly data:", error);
        setHourlyData(Array(24).fill(0)); // Reset to empty
      }
    };

    if (isInitialized) {
      fetchHourlyData();
    }
  }, [selectedDate, isInitialized, selectedYear]); // Removed timeRange from dependencies

  // Handle real-time playback
  useEffect(() => {
    console.log('🎬 Playback effect triggered:', { 
      isPlaying, 
      currentPlaybackHour, 
      hourlyDataLength: hourlyData.length,
      hourlyData: hourlyData,
      selectedDate: selectedDate.toLocaleDateString()
    });
    
    if (isPlaying) {
      // Immediately sync the current hour when playback starts
      const initialHourCount = hourlyData[currentPlaybackHour] || 0;
      console.log('▶️ Starting playback at hour:', currentPlaybackHour, 'with', initialHourCount, 'crimes');
      setTimeFilter(selectedDate, currentPlaybackHour, initialHourCount);
      
      // Start playback from current hour
      let hour = currentPlaybackHour;
      
      playbackIntervalRef.current = setInterval(() => {
        hour = (hour + 1) % 24;
        setCurrentPlaybackHour(hour);
        setSelectedHour(hour);
        // Sync to map context with hour crime count
        const hourCount = hourlyData[hour] || 0;
        console.log(`⏰ Playback hour ${hour}: ${hourCount} crimes`);
        setTimeFilter(selectedDate, hour, hourCount);
      }, 1000); // Move to next hour every second
    } else {
      // Stop playback
      if (playbackIntervalRef.current) {
        console.log('⏸️ Stopping playback');
        clearInterval(playbackIntervalRef.current);
        playbackIntervalRef.current = null;
      }
    }

    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, [isPlaying, currentPlaybackHour, selectedDate, hourlyData, setTimeFilter]);

  // Notify parent of filter changes
  useEffect(() => {
    onFilterChange({
      selectedDate,
      timeRange,
      selectedHour,
    });
  }, [selectedDate, timeRange, selectedHour, onFilterChange]);

  // Sync selected hour to map context
  useEffect(() => {
    // Always sync the current state to map context
    const hourCount = selectedHour !== null ? (hourlyData[selectedHour] || 0) : 0;
    setTimeFilter(selectedDate, selectedHour, hourCount);
    console.log('Syncing to map:', { selectedDate, selectedHour, hourCount });
  }, [selectedDate, selectedHour, hourlyData, setTimeFilter]);

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDatePicker]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatSubDate = (date: Date) => {
    return `As of ${date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })}`;
  };

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      setSelectedDate(newDate);
      // Update current date index if this date exists in available dates
      const index = availableDates.findIndex(d => 
        d.toDateString() === newDate.toDateString()
      );
      if (index !== -1) {
        setCurrentDateIndex(index);
      }
      setShowDatePicker(false);
    }
  };

  const handlePreviousDate = () => {
    if (currentDateIndex < availableDates.length - 1) {
      const newIndex = currentDateIndex + 1;
      setCurrentDateIndex(newIndex);
      setSelectedDate(availableDates[newIndex]);
      console.log('⬅️ Previous date:', availableDates[newIndex].toLocaleDateString());
    }
  };

  const handleNextDate = () => {
    if (currentDateIndex > 0) {
      const newIndex = currentDateIndex - 1;
      setCurrentDateIndex(newIndex);
      setSelectedDate(availableDates[newIndex]);
      console.log('➡️ Next date:', availableDates[newIndex].toLocaleDateString());
    }
  };

  const hasPreviousDate = currentDateIndex < availableDates.length - 1;
  const hasNextDate = currentDateIndex > 0;

  const handleHourClick = (hour: number) => {
    // Stop playback when manually selecting an hour
    if (isPlaying) {
      onPlayPauseToggle();
    }
    setSelectedHour(selectedHour === hour ? null : hour);
    setCurrentPlaybackHour(hour);
  };

  const getHourThreatLevel = (count: number): keyof typeof THREAT_COLORS => {
    if (count === 0) return 'secure';
    if (count <= 2) return 'low';
    if (count <= 5) return 'moderate';
    if (count <= 10) return 'high';
    return 'critical';
  };

  const getHourColor = (count: number, hour: number) => {
    const level = getHourThreatLevel(count);
    
    // Map threat level to Tailwind classes
    const colorMap = {
      secure: "bg-blue-400",
      low: "bg-green-500",
      moderate: "bg-yellow-500",
      high: "bg-orange-500",
      critical: "bg-red-500"
    };
    
    let color = colorMap[level];
    
    // Highlight current playback hour with blue ring
    if (isPlaying && hour === currentPlaybackHour) {
      return color + " ring-2 ring-blue-400";
    }
    
    return color;
  };

  return (
    <div className="pointer-events-auto w-full max-w-[980px] rounded-2xl bg-[#1E293B]/95 backdrop-blur-xl border border-white/[0.08] px-6 py-5 shadow-2xl">
      <div className="flex items-center gap-6">
        {/* Play/Pause Button */}
        <button
          onClick={onPlayPauseToggle}
          className="w-14 h-14 rounded-xl bg-[#0EA5E9]/20 hover:bg-[#0EA5E9]/30 border border-[#0EA5E9]/30 flex items-center justify-center transition-colors shrink-0"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6 text-[#0EA5E9] fill-[#0EA5E9]" />
          ) : (
            <Play className="h-6 w-6 text-[#0EA5E9] fill-[#0EA5E9] ml-0.5" />
          )}
        </button>

        {/* Date Display with Navigation */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Previous Date Button */}
          <button
            onClick={handlePreviousDate}
            disabled={!hasPreviousDate}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              hasPreviousDate
                ? "bg-slate-700/80 hover:bg-slate-600 text-white"
                : "bg-slate-800/50 text-slate-600 cursor-not-allowed"
            }`}
            aria-label="Previous date"
            title={hasPreviousDate ? "Go to previous date with crimes" : "No earlier dates"}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Date Display */}
          <div className="flex flex-col min-w-[160px]">
            <span
              className="text-[19px] font-bold text-white leading-tight"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              {formatDate(selectedDate)}
            </span>
            <span
              className="text-[11px] font-medium text-slate-400 leading-tight mt-0.5"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {availableDates.length > 0 
                ? `${currentDateIndex + 1} of ${availableDates.length} dates`
                : formatSubDate(selectedDate)
              }
            </span>
          </div>

          {/* Next Date Button */}
          <button
            onClick={handleNextDate}
            disabled={!hasNextDate}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              hasNextDate
                ? "bg-slate-700/80 hover:bg-slate-600 text-white"
                : "bg-slate-800/50 text-slate-600 cursor-not-allowed"
            }`}
            aria-label="Next date"
            title={hasNextDate ? "Go to next date with crimes" : "No later dates"}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Date Picker Button */}
        <div className="relative shrink-0" ref={datePickerRef}>
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="w-14 h-14 rounded-full bg-slate-700/80 border-2 border-white/[0.08] hover:border-[#0EA5E9]/40 transition-all flex items-center justify-center group"
            aria-label="Choose date"
          >
            <Calendar className="h-6 w-6 text-slate-300 group-hover:text-[#0EA5E9] transition-colors" />
          </button>
          
          {/* Date Picker Dropdown */}
          {showDatePicker && (
            <div className="absolute top-full mt-2 left-0 bg-slate-800 rounded-xl border border-white/[0.12] shadow-2xl p-4 z-50 min-w-[280px]">
              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-inter)" }}>
                  Select Date
                </label>
                <input
                  type="date"
                  value={formatDateForInput(selectedDate)}
                  onChange={handleDateChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-700 border border-white/[0.08] text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent transition-all"
                  style={{ 
                    colorScheme: 'dark',
                    fontFamily: "var(--font-inter)"
                  }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedDate(new Date());
                      setShowDatePicker(false);
                    }}
                    className="flex-1 px-3 py-2 rounded-lg bg-[#0EA5E9]/20 hover:bg-[#0EA5E9]/30 text-[#0EA5E9] text-sm font-semibold transition-colors"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setShowDatePicker(false)}
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold transition-colors"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Info text - removed time range buttons */}
        <div className="text-sm text-slate-400 font-medium shrink-0">
          Showing crimes for selected date
        </div>
      </div>

      {/* Hourly Timeline - Pill Style */}
      <div className="mt-5 relative">
        <div className="flex items-center gap-2 h-12">
          {hourlyData.map((count, hour) => (
            <button
              key={hour}
              onClick={() => handleHourClick(hour)}
              className={`flex-1 h-full rounded-full transition-all hover:scale-105 relative group ${
                selectedHour === hour && !isPlaying ? "ring-2 ring-white ring-offset-2 ring-offset-[#1E293B]" : ""
              }`}
              title={`${hour}:00 - ${count} incidents`}
            >
              <div className={`w-full h-full rounded-full ${getHourColor(count, hour)} transition-all`} />
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-xl">
                <div className="font-semibold">{hour}:00</div>
                <div className="text-slate-400">{count} incidents</div>
              </div>
            </button>
          ))}
        </div>
        
        {/* Time Labels */}
        <div className="flex justify-between text-[11px] text-slate-500 font-semibold mt-2 px-1">
          <span>12:00</span>
          <span>21:00</span>
          <span>06:00</span>
          <span>7:00</span>
          <span>NOW</span>
        </div>
      </div>
    </div>
  );
}
