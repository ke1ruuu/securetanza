"use client";

import React from "react";
import { X } from "lucide-react";
import { useCrimeTypeByBarangay } from "@/hooks/useCrimeTypeByBarangay";
import { extractCrimeType, getCrimeTypeColor } from "@/hooks/useCrimeTypes";
import { useMapContext } from "@/context/MapContext";
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
	const { hoveredBarangay, setHoveredBarangay } = useMapContext();

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

	// Whatever exit path takes this panel away mid-hover — the close button,
	// picking a different crime type, deselecting it entirely — the map
	// shouldn't be left with a polygon stuck highlighted for a row that's no
	// longer there to hover.
	React.useEffect(() => () => setHoveredBarangay(null), [setHoveredBarangay]);

	const total = rows.reduce((sum, [, count]) => sum + count, 0);

	return (
		<div className={`relative w-[168px] sm:w-[232px] overflow-hidden animate-in fade-in slide-in-from-right-1 duration-200 ${OVERLAY_SURFACE}`}>
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
					<p className={`mt-1 ${OVERLAY_LABEL} !text-[0.62rem]`}>
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
					<p className={`mt-1.5 ${OVERLAY_LABEL} !text-[0.62rem]`}>
						Barangays
					</p>
				</div>
				<div className="px-3 py-2">
					<p className="text-[15px] font-bold leading-none tabular-nums" style={{ color }}>
						{isPending ? "—" : formatNumber(total)}
					</p>
					<p className={`mt-1.5 ${OVERLAY_LABEL} !text-[0.62rem]`}>
						Incidents
					</p>
				</div>
			</div>

			{/* No separate column-header row here — it repeated "Barangays" from the
			    totals directly above ("Barangay") in the same tiny caption style, close
			    enough together to read as a stray duplicate rather than two things. The
			    totals already teach the vocabulary, and the list's own layout (name
			    left, number right) mirrors it directly. */}

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
					{rows.map(([barangay, count], index) => {
						// Two-way: hovering a row highlights its polygon on the map (via
						// setHoveredBarangay below), and hovering the polygon directly sets
						// the same state, so this also lights the row back up.
						const isHovered = hoveredBarangay?.toLowerCase().trim() === barangay.toLowerCase().trim();
						return (
							<div
								key={barangay}
								onMouseEnter={() => setHoveredBarangay(barangay)}
								onMouseLeave={() => setHoveredBarangay(null)}
								className={`flex items-center gap-2 px-3 h-[28px] transition-colors ${
									isHovered
										? "bg-sky-50 shadow-[inset_3px_0_0_#0369a1] dark:bg-sky-400/[0.08] dark:shadow-[inset_3px_0_0_#38bdf8]"
										: "hover:bg-slate-50 dark:hover:bg-white/[0.04]"
								}`}>
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
						);
					})}
				</div>
			)}
		</div>
	);
}
