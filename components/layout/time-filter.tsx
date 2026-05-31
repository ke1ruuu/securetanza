"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useMapContext } from "@/context/MapContext";
import { getThreatLevelFromCount } from "@/hooks/useThreatLevels";

// Threat level colors matching the map legend
const THREAT_COLORS = {
	secure: "#0ea5e9", // Sky Blue
	low: "#10b981", // Emerald/Green
	moderate: "#eab308", // Yellow
	high: "#f97316", // Orange
	critical: "#ef4444", // Red
};

interface TimeFilterProps {
	onFilterChange: (filters: any) => void;
	isPlaying: boolean;
	onPlayPauseToggle: () => void;
}

interface HourData {
	hour: number;
	crimeCount: number;
	threatLevel: "secure" | "low" | "moderate" | "high" | "critical";
	color: string;
}

export default function TimeFilter({ onFilterChange, isPlaying, onPlayPauseToggle }: TimeFilterProps) {
	const [availableDates, setAvailableDates] = useState<Date[]>([]);
	const [currentDateIndex, setCurrentDateIndex] = useState<number>(0);
	const [currentHour, setCurrentHour] = useState<number>(0);
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 4>(1);
	const [isInitialized, setIsInitialized] = useState(false);
	const [hourlyData, setHourlyData] = useState<HourData[]>([]);
	const [isLoadingHourly, setIsLoadingHourly] = useState(false);
	const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const { setTimeFilter, selectedYear, setIsTimeFilterActive } = useMapContext();

	// Activate time filter mode when component mounts
	useEffect(() => {
		console.log("🎬 TimeFilter: Activating time filter mode");
		setIsTimeFilterActive(true);

		// Deactivate when component unmounts
		return () => {
			console.log("🎬 TimeFilter: Deactivating time filter mode");
			setIsTimeFilterActive(false);
			setTimeFilter(null, null, 0);
		};
	}, [setIsTimeFilterActive, setTimeFilter]);

	// Fetch all available dates with crimes for the selected year
	useEffect(() => {
		const fetchAvailableDates = async () => {
			try {
				console.log("📅 Fetching available crime dates for year:", selectedYear);

				const params = new URLSearchParams();
				if (selectedYear) {
					params.set("year", selectedYear.toString());
				}

				const response = await fetch(`/api/crimes?${params.toString()}`);
				const result = await response.json();

				if (result.success && result.data.length > 0) {
					// Extract unique dates
					const uniqueDates = new Set<string>();
					result.data.forEach((crime: any) => {
						const date = new Date(crime.dateCommitted);
						date.setHours(0, 0, 0, 0);
						uniqueDates.add(date.toISOString());
					});

					// Sort dates from most recent to oldest (Rebel Inc style - start from latest)
					const dates = Array.from(uniqueDates)
						.map((dateStr) => new Date(dateStr))
						.sort((a, b) => b.getTime() - a.getTime());

					console.log("✅ Found", dates.length, "unique crime dates");

					setAvailableDates(dates);
					setSelectedDate(dates[0]); // Start from most recent
					setCurrentDateIndex(0);
					setCurrentHour(0); // Start at hour 0
					setIsInitialized(true);
				}
			} catch (error) {
				console.error("❌ Error fetching dates:", error);
			}
		};

		fetchAvailableDates();
	}, [selectedYear]);

	// Fetch hourly data for the entire selected day
	useEffect(() => {
		if (!isInitialized || !selectedDate) return;

		const fetchHourlyData = async () => {
			setIsLoadingHourly(true);
			try {
				const startDate = new Date(selectedDate);
				startDate.setHours(0, 0, 0, 0);

				const endDate = new Date(selectedDate);
				endDate.setHours(23, 59, 59, 999);

				// Fetch crime counts for all 24 hours
				const hourlyPromises = Array.from({ length: 24 }, async (_, hour) => {
					const params = new URLSearchParams({
						startDateCommitted: startDate.toISOString(),
						endDateCommitted: endDate.toISOString(),
						hour: hour.toString(),
					});

					if (selectedYear) {
						params.set("year", selectedYear.toString());
					}

					const response = await fetch(`/api/crimes/barangay-counts?${params.toString()}`);
					const result = await response.json();

					return {
						hour,
						crimeCount: result.success ? result.data.totalCrimes : 0,
					};
				});

				const hourlyResults = await Promise.all(hourlyPromises);

				// Calculate dynamic thresholds for this day
				const crimeCounts = hourlyResults.map((h) => h.crimeCount).filter((c) => c > 0);
				const sortedCounts = [...crimeCounts].sort((a, b) => a - b);

				const q1Index = Math.floor(sortedCounts.length * 0.25);
				const q2Index = Math.floor(sortedCounts.length * 0.5);
				const q3Index = Math.floor(sortedCounts.length * 0.75);

				const thresholds = {
					low: Math.max(1, sortedCounts[q1Index] || 1),
					moderate: Math.max(2, sortedCounts[q2Index] || 2),
					high: Math.max(3, sortedCounts[q3Index] || 3),
					critical: Math.max(4, (sortedCounts[q3Index] || 3) + 1),
				};

				// Map to HourData with threat levels
				const hourData: HourData[] = hourlyResults.map(({ hour, crimeCount }) => {
					const threatLevel = getThreatLevelFromCount(crimeCount, thresholds);
					return {
						hour,
						crimeCount,
						threatLevel,
						color: THREAT_COLORS[threatLevel],
					};
				});

				console.log("📊 Hourly data for", selectedDate.toLocaleDateString(), ":", hourData);
				setHourlyData(hourData);
			} catch (error) {
				console.error("❌ Error fetching hourly data:", error);
			} finally {
				setIsLoadingHourly(false);
			}
		};

		fetchHourlyData();
	}, [selectedDate, selectedYear, isInitialized]);

	// Sync current hour to map
	useEffect(() => {
		if (!isInitialized || !selectedDate || hourlyData.length === 0) return;

		const currentHourData = hourlyData[currentHour];
		if (currentHourData) {
			console.log(`🔍 Syncing hour ${currentHour} to map:`, currentHourData);
			setTimeFilter(selectedDate, currentHour, currentHourData.crimeCount);
		}
	}, [currentHour, selectedDate, hourlyData, isInitialized, setTimeFilter]);

	// Auto-scroll to current hour
	useEffect(() => {
		if (scrollContainerRef.current) {
			const pillWidth = 48; // w-12 = 48px
			const scrollPosition = currentHour * pillWidth - scrollContainerRef.current.clientWidth / 2 + pillWidth / 2;
			scrollContainerRef.current.scrollTo({
				left: scrollPosition,
				behavior: "smooth",
			});
		}
	}, [currentHour]);

	// Handle playback - advance hour by hour, then move to next day
	useEffect(() => {
		if (isPlaying && availableDates.length > 0) {
			const interval = 1000 / playbackSpeed;

			playbackIntervalRef.current = setInterval(() => {
				setCurrentHour((prevHour) => {
					if (prevHour >= 23) {
						setCurrentDateIndex((prevDateIndex) => {
							const nextIndex = prevDateIndex + 1;
							if (nextIndex >= availableDates.length) {
								onPlayPauseToggle();
								return prevDateIndex;
							}
							setSelectedDate(availableDates[nextIndex]);
							return nextIndex;
						});
						return 0;
					}
					return prevHour + 1;
				});
			}, interval);
		} else {
			if (playbackIntervalRef.current) {
				clearInterval(playbackIntervalRef.current);
				playbackIntervalRef.current = null;
			}
		}

		return () => {
			if (playbackIntervalRef.current) {
				clearInterval(playbackIntervalRef.current);
			}
		};
	}, [isPlaying, playbackSpeed, availableDates, onPlayPauseToggle]);

	const handlePreviousDate = () => {
		if (currentDateIndex > 0) {
			const newIndex = currentDateIndex - 1;
			setCurrentDateIndex(newIndex);
			setSelectedDate(availableDates[newIndex]);
			setCurrentHour(0);
		}
	};

	const handleNextDate = () => {
		if (currentDateIndex < availableDates.length - 1) {
			const newIndex = currentDateIndex + 1;
			setCurrentDateIndex(newIndex);
			setSelectedDate(availableDates[newIndex]);
			setCurrentHour(0);
		}
	};

	const handleHourClick = (hour: number) => {
		setCurrentHour(hour);
	};

	const formatDate = (date: Date) => {
		return date.toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
		});
	};

	const formatTime = (hour: number) => {
		if (hour === 0) return "12:00 AM";
		if (hour < 12) return `${hour}:00 AM`;
		if (hour === 12) return "12:00 PM";
		return `${hour - 12}:00 PM`;
	};

	const currentHourData = hourlyData[currentHour];
	const totalDayCrimes = hourlyData.reduce((sum, h) => sum + h.crimeCount, 0);

	return (
		<div className="pointer-events-auto w-full max-w-[980px] rounded-2xl bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-xl border border-slate-200 dark:border-white/[0.08] px-6 py-5 shadow-2xl transition-colors duration-300">
			{/* Header Row */}
			<div className="flex items-center justify-between gap-4 mb-4">
				{/* Play Button */}
				<button
					onClick={onPlayPauseToggle}
					className="flex-shrink-0 w-16 h-16 rounded-xl bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-colors">
					{isPlaying ? <Pause className="h-7 w-7 text-white fill-white" /> : <Play className="h-7 w-7 text-white fill-white ml-0.5" />}
				</button>

				{/* Date Navigation */}
				<div className="flex items-center gap-3 flex-1">
					<button
						onClick={handlePreviousDate}
						disabled={currentDateIndex === 0}
						className="w-10 h-10 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors">
						<ChevronLeft className="h-5 w-5 text-slate-700 dark:text-white" />
					</button>

					<div className="flex-1 text-center">
						<div className="text-xl font-bold text-slate-900 dark:text-white">{formatDate(selectedDate)}</div>
						<div className="text-xs text-slate-500 dark:text-slate-400">
							{currentDateIndex + 1} of {availableDates.length} dates
						</div>
					</div>

					<button
						onClick={handleNextDate}
						disabled={currentDateIndex === availableDates.length - 1}
						className="w-10 h-10 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors">
						<ChevronRight className="h-5 w-5 text-slate-700 dark:text-white" />
					</button>
				</div>

				{/* Info Panel */}
				<div className="flex items-center gap-3 flex-shrink-0">
					<Calendar className="h-5 w-5 text-slate-500 dark:text-slate-400" />
					<div className="text-right">
						<div className="text-xs text-slate-500 dark:text-slate-400">Showing crimes for selected date</div>
						<div className="text-sm font-semibold text-slate-900 dark:text-white">
							{totalDayCrimes} crimes • {currentHourData?.crimeCount || 0} this hour
						</div>
					</div>
				</div>
			</div>

			{/* Hourly Timeline */}
			<div className="relative">
				<div
					ref={scrollContainerRef}
					className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-slate-100 dark:scrollbar-track-slate-800"
					style={{ scrollbarWidth: "thin" }}>
					{hourlyData.map((hourData) => (
						<button
							key={hourData.hour}
							onClick={() => handleHourClick(hourData.hour)}
							className={`flex-shrink-0 w-12 h-16 rounded-lg transition-all ${
								currentHour === hourData.hour
									? "ring-2 ring-slate-900 dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-slate-800 scale-110"
									: "hover:scale-105 shadow-sm dark:shadow-none"
							}`}
							style={{
								backgroundColor: hourData.color,
								opacity: currentHour === hourData.hour ? 1 : 0.7,
							}}
							title={`${formatTime(hourData.hour)} - ${hourData.crimeCount} crimes`}
						/>
					))}
				</div>

				{/* Time Labels */}
				<div className="flex justify-between mt-2 px-1">
					<span className="text-xs text-slate-500 dark:text-slate-400">12:00 AM</span>
					<span className="text-xs text-slate-500 dark:text-slate-400">6:00 AM</span>
					<span className="text-xs text-slate-500 dark:text-slate-400">12:00 PM</span>
					<span className="text-xs text-slate-500 dark:text-slate-400">6:00 PM</span>
					<span className="text-xs text-slate-900 dark:text-white font-semibold">{formatTime(currentHour)}</span>
				</div>
			</div>
		</div>
	);
}
