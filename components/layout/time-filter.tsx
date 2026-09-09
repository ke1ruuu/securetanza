"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Play, Pause, ChevronLeft, ChevronRight, ChevronDown, CalendarDays, X } from "lucide-react";
import { useMapContext } from "@/context/MapContext";
import { getThreatLevelFromCount, THREAT_COLORS } from "@/hooks/useThreatLevels";
import HourClock from "./hour-clock";

interface TimeFilterProps {
	onFilterChange: (filters: any) => void;
	isPlaying: boolean;
	onPlayPauseToggle: () => void;
	/** Dismisses the panel — this is the only way out while it is open. */
	onClose: () => void;
}

interface DayTimeline {
	/** Local calendar day key, e.g. "2026-01-05". */
	key: string;
	date: Date;
	/** 24 slots, index = hour of day. */
	hours: number[];
	/** Only the hours that actually recorded something, ascending. */
	activeHours: number[];
	total: number;
}

/** One scrubber stop: an hour on a date that recorded at least one incident. */
interface TimelineStop {
	dateIndex: number;
	hour: number;
	count: number;
}

const HOURS_PER_DAY = 24;
const PLAYBACK_SPEEDS = [1, 2, 4] as const;

function localDayKey(date: Date) {
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${date.getFullYear()}-${month}-${day}`;
}

function formatClockTime(hour: number) {
	const h = ((hour % 24) + 24) % 24;
	const display = h % 12 === 0 ? 12 : h % 12;
	return `${display}:00 ${h < 12 ? "AM" : "PM"}`;
}

function formatHourLabel(hour: number) {
	const h = hour % 12 === 0 ? 12 : hour % 12;
	return `${h} ${hour < 12 ? "AM" : "PM"}`;
}

function formatFullDate(date: Date) {
	return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function formatShortDate(date: Date) {
	return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function pluralIncidents(count: number) {
	return `${count} ${count === 1 ? "incident" : "incidents"}`;
}

/**
 * Groups the raw (dateCommitted, hour, count) buckets from the API into one day per
 * local calendar date, newest first.
 *
 * Buckets with a null hour (an unreadable `timeCommitted`) cannot be placed on the
 * clock, so they are dropped rather than inflating a day's total past what the hour
 * list can show. Days left with nothing placeable are dropped entirely.
 */
function buildTimeline(buckets: Array<{ date: string; hour: number | null; count: number }>): DayTimeline[] {
	const byDay = new Map<string, DayTimeline>();

	for (const bucket of buckets) {
		if (bucket.hour === null || bucket.hour < 0 || bucket.hour >= HOURS_PER_DAY) continue;

		const parsed = new Date(bucket.date);
		if (isNaN(parsed.getTime())) continue;

		const date = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
		const key = localDayKey(date);

		let day = byDay.get(key);
		if (!day) {
			day = { key, date, hours: new Array(HOURS_PER_DAY).fill(0), activeHours: [], total: 0 };
			byDay.set(key, day);
		}

		day.hours[bucket.hour] += bucket.count;
		day.total += bucket.count;
	}

	const days: DayTimeline[] = [];
	for (const day of byDay.values()) {
		for (let hour = 0; hour < HOURS_PER_DAY; hour++) {
			if (day.hours[hour] > 0) day.activeHours.push(hour);
		}
		if (day.activeHours.length > 0) days.push(day);
	}

	return days.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export default function TimeFilter({ onFilterChange, isPlaying, onPlayPauseToggle, onClose }: TimeFilterProps) {
	const [days, setDays] = useState<DayTimeline[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	// Index into `stops` — every position is an hour that recorded incidents
	const [cursor, setCursor] = useState(0);
	const [playbackSpeed, setPlaybackSpeed] = useState<(typeof PLAYBACK_SPEEDS)[number]>(1);
	const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

	const datePickerRef = useRef<HTMLDivElement>(null);
	const activeDateItemRef = useRef<HTMLButtonElement>(null);
	const activeHourRowRef = useRef<HTMLButtonElement>(null);

	const { setTimeFilter, selectedYear, setIsTimeFilterActive } = useMapContext();

	// Time filter mode stays on for as long as this panel is mounted
	useEffect(() => {
		setIsTimeFilterActive(true);
		return () => {
			setIsTimeFilterActive(false);
			setTimeFilter(null, null, 0);
		};
	}, [setIsTimeFilterActive, setTimeFilter]);

	// One request builds the entire date x hour histogram for the selected year
	useEffect(() => {
		let cancelled = false;

		const fetchTimeline = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const params = new URLSearchParams();
				if (selectedYear) params.set("year", selectedYear.toString());

				const response = await fetch(`/api/crimes/hourly-timeline?${params.toString()}`);
				const result = await response.json().catch(() => null);
				if (cancelled) return;

				if (!response.ok || !result?.success) {
					throw new Error(result?.details || result?.error || `Request failed with status ${response.status}`);
				}

				setDays(buildTimeline(result.data?.buckets ?? []));
				setCursor(0);
			} catch (err) {
				if (cancelled) return;
				console.error("Error fetching hourly timeline:", err);
				setError("Could not load the crime timeline.");
				setDays([]);
			} finally {
				if (!cancelled) setIsLoading(false);
			}
		};

		fetchTimeline();
		return () => {
			cancelled = true;
		};
	}, [selectedYear]);

	// Flatten every incident hour into one ordered scrub track
	const stops = useMemo(() => {
		const flattened: TimelineStop[] = [];
		days.forEach((day, dateIndex) => {
			for (const hour of day.activeHours) {
				flattened.push({ dateIndex, hour, count: day.hours[hour] });
			}
		});
		return flattened;
	}, [days]);

	// Where each date's run of stops begins, for the prev/next date jumps
	const firstStopByDate = useMemo(() => {
		const starts = new Map<number, number>();
		stops.forEach((stop, index) => {
			if (!starts.has(stop.dateIndex)) starts.set(stop.dateIndex, index);
		});
		return starts;
	}, [stops]);

	const maxCursor = Math.max(0, stops.length - 1);
	const safeCursor = Math.min(cursor, maxCursor);
	const currentStop = stops[safeCursor];
	const dateIndex = currentStop?.dateIndex ?? 0;
	const currentHour = currentStop?.hour ?? 0;
	const currentHourCount = currentStop?.count ?? 0;
	const currentDay = days[dateIndex];

	// Push the active date/hour to the map
	useEffect(() => {
		if (!currentDay) return;
		setTimeFilter(currentDay.date, currentHour, currentHourCount);
		onFilterChange({ date: currentDay.date, hour: currentHour, crimeCount: currentHourCount });
	}, [currentDay, currentHour, currentHourCount, setTimeFilter, onFilterChange]);

	// Playback hops from one incident hour to the next, rolling into older dates
	useEffect(() => {
		if (!isPlaying || stops.length === 0) return;

		const intervalId = setInterval(() => {
			setCursor((prev) => (prev >= maxCursor ? prev : prev + 1));
		}, 1000 / playbackSpeed);

		return () => clearInterval(intervalId);
	}, [isPlaying, playbackSpeed, stops.length, maxCursor]);

	// Stop at the oldest hour rather than looping
	useEffect(() => {
		if (isPlaying && stops.length > 0 && safeCursor >= maxCursor) {
			onPlayPauseToggle();
		}
	}, [isPlaying, safeCursor, maxCursor, stops.length, onPlayPauseToggle]);

	// Keep the active hour visible as playback advances
	useEffect(() => {
		activeHourRowRef.current?.scrollIntoView({ block: "nearest" });
	}, [safeCursor]);

	// Close the date picker on outside click
	useEffect(() => {
		if (!isDatePickerOpen) return;
		const handler = (event: MouseEvent) => {
			if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
				setIsDatePickerOpen(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [isDatePickerOpen]);

	// Reveal the selected date when the picker opens
	useEffect(() => {
		if (isDatePickerOpen) {
			activeDateItemRef.current?.scrollIntoView({ block: "center" });
		}
	}, [isDatePickerOpen]);

	const goToDate = useCallback(
		(index: number) => {
			const start = firstStopByDate.get(index);
			if (start !== undefined) setCursor(start);
		},
		[firstStopByDate],
	);

	// Pressing play while parked on the last hour restarts from the newest date
	const handlePlayPause = useCallback(() => {
		if (!isPlaying && safeCursor >= maxCursor) setCursor(0);
		onPlayPauseToggle();
	}, [isPlaying, safeCursor, maxCursor, onPlayPauseToggle]);

	// Quartile thresholds over this day's incident hours, so the nodes line up
	// with the threat colours the map legend already uses.
	const hourThresholds = useMemo(() => {
		const counts = (currentDay?.activeHours ?? []).map((hour) => currentDay?.hours[hour] ?? 0).sort((a, b) => a - b);
		if (counts.length === 0) return { low: 1, moderate: 2, high: 3, critical: 4 };

		const q3 = counts[Math.floor(counts.length * 0.75)] ?? 3;
		return {
			low: Math.max(1, counts[Math.floor(counts.length * 0.25)] ?? 1),
			moderate: Math.max(2, counts[Math.floor(counts.length * 0.5)] ?? 2),
			high: Math.max(3, q3),
			critical: Math.max(4, q3 + 1),
		};
	}, [currentDay]);

	const renderHourEntry = (stopIndex: number, hour: number, count: number, isFirst: boolean, isLast: boolean) => {
		const isActive = stopIndex === safeCursor;
		const color = THREAT_COLORS[getThreatLevelFromCount(count, hourThresholds)];

		return (
			<button
				key={hour}
				ref={isActive ? activeHourRowRef : undefined}
				onClick={() => setCursor(stopIndex)}
				aria-pressed={isActive}
				className={`group grid w-full grid-cols-[40px_12px_1fr] items-center gap-1.5 rounded-md pr-1 text-left transition-colors ${
					isActive ? "bg-[#0EA5E9]/[0.07] dark:bg-[#0EA5E9]/[0.12]" : "hover:bg-slate-50 dark:hover:bg-white/[0.03]"
				}`}>
				{/* Timestamp gutter */}
				<span
					className={`text-[9px] font-semibold leading-none text-right tabular-nums whitespace-nowrap ${
						isActive ? "text-[#0EA5E9]" : "text-slate-500 dark:text-slate-400"
					}`}>
					{formatHourLabel(hour)}
				</span>

				{/* Rail + node */}
				<span className="relative flex h-7 items-center justify-center">
					<span
						className={`absolute w-px bg-slate-200 dark:bg-white/[0.09] ${isFirst ? "top-1/2" : "top-0"} ${isLast ? "bottom-1/2" : "bottom-0"}`}
					/>
					<span
						className="relative rounded-full transition-all duration-200"
						style={{
							backgroundColor: color,
							width: isActive ? 10 : 7,
							height: isActive ? 10 : 7,
							boxShadow: isActive ? `0 0 0 2.5px ${color}33` : "none",
						}}
					/>
				</span>

				{/* Message bubble */}
				<span
					className={`inline-flex items-baseline gap-1 justify-self-start rounded-md rounded-tl-sm border px-1.5 py-0.5 transition-colors ${
						isActive
							? "border-[#0EA5E9]/40 bg-[#0EA5E9]/10 dark:bg-[#0EA5E9]/15"
							: "border-slate-200 bg-slate-50 group-hover:border-slate-300 dark:border-white/[0.08] dark:bg-white/[0.04] dark:group-hover:border-white/20"
					}`}>
					<span
						className={`text-[12px] font-bold leading-none tabular-nums ${isActive ? "text-[#0EA5E9]" : "text-slate-900 dark:text-white"}`}>
						{count}
					</span>
					<span className="text-[9px] font-medium leading-none text-slate-500 dark:text-slate-400">
						{count === 1 ? "incident" : "incidents"}
					</span>
				</span>
			</button>
		);
	};

	// No `overflow-hidden` here: the date picker needs to escape the panel bounds.
	// Height is left to the content — the parent flex column shrinks this when the
	// rail runs out of room, and the hour list scrolls to absorb it.
	const panelShell =
		"pointer-events-auto relative flex w-full min-h-0 flex-col rounded-2xl bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-xl border border-slate-200 dark:border-white/[0.08] shadow-2xl transition-colors duration-300";

	const closeButton = (
		<button
			onClick={onClose}
			aria-label="Close temporal filter"
			className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-white/[0.08] dark:hover:text-white">
			<X className="h-3.5 w-3.5" />
		</button>
	);

	if (isLoading) {
		return (
			<div className={panelShell}>
				<div className="absolute right-1.5 top-1.5">{closeButton}</div>
				<div className="flex min-h-[104px] flex-col items-center justify-center gap-2 px-3 text-center text-xs text-slate-500 dark:text-slate-400">
					<div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0EA5E9] border-t-transparent" />
					Loading crime timeline…
				</div>
			</div>
		);
	}

	if (error || !currentDay || stops.length === 0) {
		return (
			<div className={panelShell}>
				<div className="absolute right-1.5 top-1.5">{closeButton}</div>
				<div className="flex min-h-[104px] flex-col items-center justify-center gap-1 px-4 text-center">
					<CalendarDays className="h-5 w-5 text-slate-400 dark:text-slate-500" />
					<div className="text-xs font-semibold text-slate-700 dark:text-slate-200">{error ?? "No crime records to scrub through"}</div>
					<div className="text-[11px] text-slate-500 dark:text-slate-400">
						{error ? "Try reopening the time filter." : `Nothing recorded${selectedYear ? ` in ${selectedYear}` : ""}.`}
					</div>
				</div>
			</div>
		);
	}

	const dayStartStop = firstStopByDate.get(dateIndex) ?? 0;
	const activeHours = currentDay.activeHours;

	return (
		<div className={panelShell}>
			{/* ── Header: clock readout + speed ── */}
			<div className="flex-shrink-0 px-3 pt-2.5 pb-2">
				<div className="flex items-center gap-2.5">
					<HourClock hour={currentHour} size={46} showMeridiem={false} />
					<div className="min-w-0 flex-1">
						<div className="flex items-start gap-1">
							<div
								className="text-[13px] font-bold leading-tight text-slate-900 dark:text-white tabular-nums whitespace-nowrap"
								style={{ fontFamily: "var(--font-manrope)" }}>
								{formatClockTime(currentHour)}
								<span className="font-medium text-slate-400 dark:text-slate-500"> – {formatClockTime(currentHour + 1)}</span>
							</div>
							<span className="-mr-1 -mt-1 ml-auto">{closeButton}</span>
						</div>
						<div className="mt-1 flex items-center gap-1.5">
							<span className="text-[11px] font-semibold leading-none text-slate-700 dark:text-slate-200">
								{pluralIncidents(currentHourCount)}
							</span>
							<span className="ml-auto flex items-center gap-0.5">
								{PLAYBACK_SPEEDS.map((speed) => (
									<button
										key={speed}
										onClick={() => setPlaybackSpeed(speed)}
										aria-pressed={playbackSpeed === speed}
										className={`rounded px-1 py-0.5 text-[9px] font-bold leading-none tabular-nums transition-colors ${
											playbackSpeed === speed
												? "bg-[#0EA5E9]/15 text-[#0EA5E9]"
												: "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
										}`}>
										{speed}×
									</button>
								))}
							</span>
						</div>
					</div>
				</div>

				{/* ── Playback + date navigation ── */}
				<div className="mt-2 flex items-center gap-1">
					<button
						onClick={handlePlayPause}
						aria-label={isPlaying ? "Pause playback" : "Play through every recorded hour"}
						className="mr-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#0EA5E9] shadow-sm transition-colors hover:bg-[#0EA5E9]/90">
						{isPlaying ? (
							<Pause className="h-3.5 w-3.5 fill-white text-white" />
						) : (
							<Play className="ml-px h-3.5 w-3.5 fill-white text-white" />
						)}
					</button>

					<button
						onClick={() => goToDate(dateIndex - 1)}
						disabled={dateIndex === 0}
						aria-label="Newer date"
						className="flex h-8 w-6 flex-shrink-0 items-center justify-center rounded-md bg-slate-100 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-white/[0.06] dark:hover:bg-white/[0.12]">
						<ChevronLeft className="h-3.5 w-3.5 text-slate-600 dark:text-white" />
					</button>

					<div ref={datePickerRef} className="relative min-w-0 flex-1">
						<button
							onClick={() => setIsDatePickerOpen((open) => !open)}
							className="flex h-8 w-full items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 transition-colors hover:border-slate-300 dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:border-white/20">
							<CalendarDays className="h-3 w-3 flex-shrink-0 text-[#0EA5E9]" />
							<span className="min-w-0 flex-1 text-left">
								<span className="block truncate text-[11px] font-semibold leading-tight text-slate-900 dark:text-white">
									{formatShortDate(currentDay.date)}
								</span>
								<span className="block truncate text-[9px] leading-tight text-slate-500 dark:text-slate-400 tabular-nums">
									{pluralIncidents(currentDay.total)} · {dateIndex + 1}/{days.length}
								</span>
							</span>
							<ChevronDown
								className={`h-3 w-3 flex-shrink-0 text-slate-400 transition-transform duration-200 ${isDatePickerOpen ? "rotate-180" : ""}`}
							/>
						</button>

						{isDatePickerOpen && (
							<div className="custom-scrollbar absolute bottom-[calc(100%+4px)] left-0 right-0 z-50 max-h-[240px] overflow-y-auto rounded-lg border border-slate-200 bg-white p-1 shadow-2xl dark:border-white/[0.08] dark:bg-[#0F172A]">
								{days.map((day, index) => {
									const isActive = index === dateIndex;
									return (
										<button
											key={day.key}
											ref={isActive ? activeDateItemRef : undefined}
											onClick={() => {
												goToDate(index);
												setIsDatePickerOpen(false);
											}}
											className={`flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left transition-colors ${
												isActive ? "bg-[#0EA5E9]/10 dark:bg-[#0EA5E9]/15" : "hover:bg-slate-100 dark:hover:bg-white/[0.06]"
											}`}>
											<span
												className={`truncate text-[10px] font-medium ${
													isActive ? "text-[#0EA5E9]" : "text-slate-700 dark:text-slate-200"
												}`}>
												{formatShortDate(day.date)}
											</span>
											<span className="flex-shrink-0 text-[10px] font-bold tabular-nums text-slate-500 dark:text-slate-400">
												{day.total}
											</span>
										</button>
									);
								})}
							</div>
						)}
					</div>

					<button
						onClick={() => goToDate(dateIndex + 1)}
						disabled={dateIndex >= days.length - 1}
						aria-label="Older date"
						className="flex h-8 w-6 flex-shrink-0 items-center justify-center rounded-md bg-slate-100 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-white/[0.06] dark:hover:bg-white/[0.12]">
						<ChevronRight className="h-3.5 w-3.5 text-slate-600 dark:text-white" />
					</button>
				</div>
			</div>

			{/* ── Timeline: only the hours that recorded incidents ── */}
			<div
				className="custom-scrollbar min-h-0 flex-1 overflow-y-auto border-t border-slate-100 px-2.5 py-1.5 dark:border-white/[0.06]"
				role="group"
				aria-label={`Hours with incidents on ${formatFullDate(currentDay.date)}`}>
				{activeHours.map((hour, position) =>
					renderHourEntry(dayStartStop + position, hour, currentDay.hours[hour], position === 0, position === activeHours.length - 1),
				)}
			</div>
		</div>
	);
}
