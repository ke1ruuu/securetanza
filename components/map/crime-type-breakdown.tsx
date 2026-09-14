"use client";

import React from "react";
import { X } from "lucide-react";
import { useCrimeTypeByBarangay } from "@/hooks/useCrimeTypeByBarangay";
import { extractCrimeType, getCrimeTypeColor } from "@/hooks/useCrimeTypes";

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

interface CrimeTypeBreakdownProps {
	crimeType: string;
	onClose: () => void;
}

/**
 * Barangay breakdown for the crime type selected in the map legend.
 *
 * Reuses the same barangay counts the choropleth is painted from, so the panel
 * always agrees with the shading on the map for the active temporal filter.
 */
export default function CrimeTypeBreakdown({ crimeType, onClose }: CrimeTypeBreakdownProps) {
	const { crimeTypeCounts, loading, hasLoaded } = useCrimeTypeByBarangay();

	// Treat "not settled yet" as loading so the panel never flashes an empty state
	// between the click and the first response.
	const isPending = loading || !hasLoaded;

	const color = getCrimeTypeColor(crimeType);
	const displayName = extractCrimeType(crimeType);

	const rows = React.useMemo(
		() =>
			Object.entries(crimeTypeCounts)
				.filter(([, count]) => count > 0)
				.sort((a, b) => b[1] - a[1]),
		[crimeTypeCounts],
	);

	const total = rows.reduce((sum, [, count]) => sum + count, 0);

	return (
		<div className="relative w-[168px] sm:w-[232px] rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-2xl shadow-[0_8px_30px_rgba(15,23,42,0.10)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.55)] overflow-hidden animate-in fade-in slide-in-from-right-1 duration-200">
			{/* Accent edge tinted with the crime type colour */}
			<div
				className="absolute top-0 left-0 right-0 h-[1.5px]"
				style={{ background: `linear-gradient(to right, ${color}, ${color}00)` }}
			/>

			{/* Header */}
			<div className="flex items-start justify-between gap-2 px-3 pt-2.5 pb-2 border-b border-slate-100 dark:border-white/[0.06]">
				<div className="min-w-0">
					<div className="flex items-center gap-1.5">
						<span
							className="h-2.5 w-2.5 shrink-0 rounded-full"
							style={{ backgroundColor: color, boxShadow: `0 0 0 3px ${color}33` }}
						/>
						<span
							className="truncate text-[12.5px] font-bold text-slate-900 dark:text-white"
							style={{ fontFamily: "var(--font-inter)" }}
							title={displayName}>
							{displayName}
						</span>
					</div>
					<p className="mt-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
						Barangay Breakdown
					</p>
				</div>
				<button
					onClick={onClose}
					aria-label="Close barangay breakdown"
					className="-mr-1 shrink-0 rounded-lg p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors cursor-pointer">
					<X className="h-3 w-3" />
				</button>
			</div>

			{/* Totals */}
			<div className="grid grid-cols-2 divide-x divide-slate-100 dark:divide-white/[0.06] border-b border-slate-100 dark:border-white/[0.06]">
				<div className="px-3 py-2">
					<p className="text-[15px] font-bold leading-none tabular-nums text-slate-900 dark:text-white">
						{isPending ? "—" : rows.length}
					</p>
					<p className="mt-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
						Barangays
					</p>
				</div>
				<div className="px-3 py-2">
					<p className="text-[15px] font-bold leading-none tabular-nums" style={{ color }}>
						{isPending ? "—" : formatNumber(total)}
					</p>
					<p className="mt-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
						Incidents
					</p>
				</div>
			</div>

			{/* Column labels */}
			<div className="flex items-center justify-between px-3 py-1 bg-slate-50/70 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/[0.06]">
				<span className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Barangay</span>
				<span className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Count</span>
			</div>

			{/* Barangay list */}
			{isPending ? (
				<div className="flex flex-col gap-2.5 px-3 py-3">
					{[1, 2, 3, 4, 5].map((i) => (
						<div key={i} className="h-3 rounded-md bg-slate-200/70 dark:bg-white/[0.05] animate-pulse" />
					))}
				</div>
			) : rows.length === 0 ? (
				<div className="px-3 py-3">
					<p className="text-[11.5px] text-slate-500 dark:text-slate-400">
						No barangay recorded this crime type in the selected period.
					</p>
				</div>
			) : (
				<div className="custom-scrollbar max-h-[min(300px,40vh)] overflow-y-auto divide-y divide-slate-100 dark:divide-white/[0.04]">
					{rows.map(([barangay, count], index) => (
						<div
							key={barangay}
							className="flex items-center gap-2 px-3 h-[28px] hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors">
							<span
								className="w-3 shrink-0 text-[10.5px] font-bold tabular-nums text-slate-300 dark:text-slate-600"
								style={index < 3 ? { color } : undefined}>
								{index + 1}
							</span>
							<span
								className="min-w-0 flex-1 truncate text-[12px] font-medium text-slate-700 dark:text-slate-300"
								title={barangay}>
								{barangay}
							</span>
							<span className="shrink-0 text-[12px] font-bold tabular-nums text-slate-900 dark:text-white">
								{formatNumber(count)}
							</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
