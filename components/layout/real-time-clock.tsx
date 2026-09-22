"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { OVERLAY_SURFACE } from "@/lib/map-overlay";

interface RealTimeClockProps {
	onFilterToggle: (isActive: boolean) => void;
	isFilterActive: boolean;
}

export default function RealTimeClock({ onFilterToggle, isFilterActive }: RealTimeClockProps) {
	const [time, setTime] = useState(new Date());
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		const timer = setInterval(() => {
			setTime(new Date());
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	if (!mounted) {
		return (
			<div className="pointer-events-auto opacity-0">
				<div className={`h-[56px] w-[56px] ${OVERLAY_SURFACE}`} />
			</div>
		);
	}

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: true,
		});
	};

	const formatDay = (date: Date) => {
		return date.toLocaleDateString("en-US", { weekday: "long" });
	};

	const formatDate = (date: Date) => {
		return date.toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
		});
	};

	return (
		<div className="pointer-events-auto flex items-center gap-3">
			{/* Time & Date Display - Only shown when NOT in filter active mode */}
			{!isFilterActive && (
				<div className={`flex items-center gap-3 h-[56px] pl-4 pr-5 animate-in fade-in slide-in-from-left-2 duration-350 ${OVERLAY_SURFACE}`}>
					<div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-400/10 flex items-center justify-center">
						<Clock className="h-4 w-4 text-sky-600 dark:text-sky-400" />
					</div>
					<div className="flex flex-col">
						<span
							className="text-[14px] font-bold text-slate-900 dark:text-white leading-tight tabular-nums"
							style={{ fontFamily: "var(--font-manrope)" }}>
							{formatTime(time)}
						</span>
						<span
							className="text-[11.5px] font-medium text-slate-500 dark:text-slate-300 leading-tight"
							style={{ fontFamily: "var(--font-inter)" }}>
							{formatDay(time)}, {formatDate(time)}
						</span>
					</div>
				</div>
			)}

			<button
				onClick={() => onFilterToggle(!isFilterActive)}
				className={`group h-[56px] w-[56px] transition-colors duration-200 flex items-center justify-center ${
					isFilterActive
						? "rounded-xl border border-sky-500 bg-sky-500 text-white shadow-lg shadow-sky-500/20 hover:bg-sky-600"
						: `${OVERLAY_SURFACE} text-sky-600 hover:bg-slate-100 dark:text-sky-400 dark:hover:bg-[#273449]`
				}`}
				aria-label="Filter"
				aria-pressed={isFilterActive}>
				<Clock className="h-5 w-5 transition-transform group-hover:scale-110 duration-200" />
			</button>
		</div>
	);
}
