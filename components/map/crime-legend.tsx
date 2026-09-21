"use client";

import React from "react";
import { useCrimeTypes, getCrimeTypeColor, extractCrimeType } from "@/hooks/useCrimeTypes";
import { useMapContext } from "@/context/MapContext";
import CrimeTypeBreakdown from "@/components/map/crime-type-breakdown";
import { OVERLAY_SURFACE, OVERLAY_LABEL } from "@/lib/map-overlay";

// Helper function to format numbers in standard notation
function formatNumber(num: number): string {
	if (num >= 1000000) {
		return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
	}
	if (num >= 1000) {
		return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
	}
	return num.toString();
}

// Shared card chrome so the legend and its breakdown panel read as one surface
const CARD = `${OVERLAY_SURFACE} overflow-hidden`;

export default function CrimeLegend() {
	const { stats, total, loading } = useCrimeTypes();
	const { selectedCrimeType, setSelectedCrimeType } = useMapContext();

	const handleToggle = (type: string) => {
		if (selectedCrimeType === type) {
			setSelectedCrimeType(null);
		} else {
			setSelectedCrimeType(type);
		}
	};

	return (
		<div className="relative pointer-events-auto w-[180px] sm:w-[228px]">
			<div className={`relative ${CARD}`}>
				{/* Header */}
				<div className="flex items-center justify-between gap-2 px-3 py-2.5 border-b border-slate-100 dark:border-white/[0.06]">
					<span className={OVERLAY_LABEL}>Crime Types</span>
					{selectedCrimeType ? (
						<button
							onClick={() => setSelectedCrimeType(null)}
							className="shrink-0 text-[0.68rem] font-bold uppercase tracking-[0.11em] text-sky-600 hover:text-sky-500 dark:text-sky-400 transition-colors cursor-pointer">
							Reset
						</button>
					) : (
						<span className="shrink-0 text-[11.5px] font-bold tabular-nums text-slate-700 dark:text-slate-200">
							{loading ? "—" : formatNumber(total)}
							<span className="ml-1 font-semibold text-slate-400 dark:text-slate-500">total</span>
						</span>
					)}
				</div>

				{/* Crime type rows */}
				{loading ? (
					<div className="flex flex-col gap-2 px-3 py-3">
						{[1, 2, 3, 4, 5].map((i) => (
							<div key={i} className="h-3.5 rounded-md bg-slate-200/70 dark:bg-white/[0.05] animate-pulse" />
						))}
					</div>
				) : stats.length === 0 ? (
					<div className="px-3 py-3">
						<p className="text-[11.5px] text-slate-500 dark:text-slate-400">No incidents in the selected period.</p>
					</div>
				) : (
					<div className="custom-scrollbar max-h-[calc(100vh-290px)] overflow-y-auto divide-y divide-slate-100 dark:divide-white/[0.04]">
						{stats.map((item) => {
							const isActive = selectedCrimeType === item.type;
							const isDimmed = Boolean(selectedCrimeType) && !isActive;
							const color = getCrimeTypeColor(item.type);
							const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
							const displayName = extractCrimeType(item.type); // Remove prefix for display

							return (
								<button
									key={item.type}
									onClick={() => handleToggle(item.type)}
									aria-pressed={isActive}
									title={`${displayName} — ${item.count} incidents (${percentage}%)`}
									className={`group relative flex w-full items-center gap-2.5 h-[34px] pl-3 pr-3 text-left transition-all duration-200 cursor-pointer ${
										isActive
											? "bg-sky-50 dark:bg-sky-400/10"
											: isDimmed
												? "opacity-45 hover:opacity-100 hover:bg-slate-50 dark:hover:bg-white/[0.04]"
												: "hover:bg-slate-50 dark:hover:bg-white/[0.04]"
									}`}>
									{/* Active stripe */}
									<span
										className="absolute left-0 top-0 bottom-0 w-[2.5px] transition-opacity duration-200"
										style={{ backgroundColor: color, opacity: isActive ? 1 : 0 }}
									/>

									{/* Color key */}
									<span
										className="h-2.5 w-2.5 shrink-0 rounded-full transition-all duration-200"
										style={{
											backgroundColor: color,
											boxShadow: isActive ? `0 0 0 3px ${color}33` : "none",
										}}
									/>

									{/* Type name */}
									<span
										className={`min-w-0 flex-1 truncate text-[12px] font-semibold transition-colors ${
											isActive
												? "text-slate-900 dark:text-white"
												: "text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white"
										}`}
										style={{ fontFamily: "var(--font-inter)" }}>
										{displayName}
									</span>

									{/* Count */}
									<span
										className={`shrink-0 text-[12px] font-bold tabular-nums transition-colors ${
											isActive ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-200"
										}`}>
										{formatNumber(item.count)}
									</span>

									{/* Share of total */}
									<span className="hidden sm:block w-[24px] shrink-0 text-right text-[10.5px] font-semibold tabular-nums text-slate-400 dark:text-slate-500">
										{percentage}%
									</span>
								</button>
							);
						})}
					</div>
				)}

				{/* Hint */}
				{!loading && stats.length > 0 && (
					<div className="border-t border-slate-100 dark:border-white/[0.06] px-3 py-1.5">
						<p className="text-[0.62rem] font-semibold text-slate-400 dark:text-slate-500">
							{selectedCrimeType ? "Showing barangay breakdown" : "Click a type for barangay detail"}
						</p>
					</div>
				)}
			</div>

			{/* Barangay breakdown for the selected crime type */}
			{selectedCrimeType && (
				<div className="absolute top-0 right-full mr-2 z-20">
					<CrimeTypeBreakdown
						key={selectedCrimeType}
						crimeType={selectedCrimeType}
						onClose={() => setSelectedCrimeType(null)}
					/>
				</div>
			)}
		</div>
	);
}
