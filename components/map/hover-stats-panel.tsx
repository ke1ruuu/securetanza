"use client";

import React from "react";
import { useMapContext } from "@/context/MapContext";
import { useCrimeHoverStats } from "@/hooks/useCrimeHoverStats";
import { useThreatLevels, getThreatLevelFromCount } from "@/hooks/useThreatLevels";
import { Shield, AlertTriangle, Activity, MapPin } from "lucide-react";

const CRIME_TYPE_COLORS = {
	Theft: "#ef4444", // Red
	Robbery: "#dc2626", // Dark Red
	Assault: "#f97316", // Orange
	Burglary: "#ea580c", // Dark Orange
	Vandalism: "#eab308", // Yellow
	"Public Disorder": "#ca8a04", // Dark Yellow
	"Drug Related": "#8b5cf6", // Purple
	Fraud: "#7c3aed", // Dark Purple
	Homicide: "#be123c", // Rose
	Rape: "#9f1239", // Dark Rose
	Kidnapping: "#991b1b", // Very Dark Red
	Arson: "#b91c1c", // Crimson
	Other: "#6b7280", // Gray
};

export default function HoverStatsPanel() {
	const { hoveredBarangay } = useMapContext();
	const { stats, loading } = useCrimeHoverStats(hoveredBarangay);
	const { barangayCrimeCounts } = useThreatLevels();

	if (!hoveredBarangay || loading) return null;

	if (!stats) {
		return (
			<div className="fixed right-6 top-1/2 -translate-y-1/2 z-[1000] pointer-events-none">
				<div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl min-w-[280px] animate-in slide-in-from-right-2 duration-300">
					<div className="flex items-center gap-3 mb-4">
						<div className="p-2 bg-slate-100 dark:bg-slate-500/20 rounded-lg">
							<MapPin className="h-4 w-4 text-slate-500 dark:text-slate-400" />
						</div>
						<div>
							<h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">{hoveredBarangay}</h3>
							<p className="text-xs text-slate-500 dark:text-slate-400">No crime data available</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	const totalCrimes = stats.crimesByType.reduce((sum, crime) => sum + crime.count, 0);

	// Use fixed threat level calculation for consistency
	const actualCrimeCount = barangayCrimeCounts[hoveredBarangay] || totalCrimes;
	const threatLevel = getThreatLevelFromCount(actualCrimeCount, {
		low: 2,
		moderate: 5,
		high: 10,
		critical: 15,
	});
	const riskLevel = threatLevel.charAt(0).toUpperCase() + threatLevel.slice(1);
	const riskColor =
		threatLevel === "critical"
			? "text-red-400"
			: threatLevel === "high"
				? "text-orange-400"
				: threatLevel === "moderate"
					? "text-yellow-400"
					: threatLevel === "low"
						? "text-emerald-400"
						: "text-blue-400";

	return (
		<div className="fixed right-6 top-1/2 -translate-y-1/2 z-[1000] pointer-events-none">
			<div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl min-w-[320px] animate-in slide-in-from-right-2 duration-300">
				{/* Header */}
				<div className="flex items-center gap-3 mb-6">
					<div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
						<MapPin className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
					</div>
					<div>
						<h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">{hoveredBarangay}</h3>
						<p className="text-xs text-slate-500 dark:text-slate-400">Crime Statistics</p>
					</div>
				</div>

				{/* Quick Stats */}
				<div className="grid grid-cols-2 gap-3 mb-6">
					<div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3 border border-slate-100 dark:border-white/5">
						<div className="flex items-center gap-2 mb-1">
							<Activity className="h-3 w-3 text-indigo-500 dark:text-indigo-400" />
							<span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total</span>
						</div>
						<p className="text-lg font-black text-slate-900 dark:text-white">{totalCrimes}</p>
					</div>
					<div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3 border border-slate-100 dark:border-white/5">
						<div className="flex items-center gap-2 mb-1">
							<Shield className="h-3 w-3 text-slate-500 dark:text-slate-400" />
							<span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Risk</span>
						</div>
						<p className={`text-lg font-black ${riskColor}`}>{riskLevel}</p>
					</div>
				</div>

				{/* Crime Types */}
				<div className="space-y-3">
					<div className="flex items-center gap-2 mb-3">
						<AlertTriangle className="h-3 w-3 text-slate-500" />
						<span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Crime Distribution</span>
					</div>

					<div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
						{stats.crimesByType
							.filter((crime) => crime.count > 0)
							.sort((a, b) => b.count - a.count)
							.slice(0, 8) // Show top 8 crime types
							.map((crime) => {
								const percentage = totalCrimes > 0 ? Math.round((crime.count / totalCrimes) * 100) : 0;
								const color = CRIME_TYPE_COLORS[crime.type as keyof typeof CRIME_TYPE_COLORS] || CRIME_TYPE_COLORS.Other;

								return (
									<div
										key={crime.type}
										className="flex items-center justify-between py-2 px-3 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5">
										<div className="flex items-center gap-3">
											<div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
											<span className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">{crime.type}</span>
										</div>
										<div className="flex items-center gap-2 flex-shrink-0">
											<span className="text-xs font-bold text-slate-900 dark:text-white">{crime.count}</span>
											<span className="text-xs font-medium text-slate-500 dark:text-slate-400">({percentage}%)</span>
										</div>
									</div>
								);
							})}
					</div>

					{stats.crimesByType.filter((crime) => crime.count > 0).length > 8 && (
						<div className="text-center pt-2">
							<span className="text-xs text-slate-500">
								+{stats.crimesByType.filter((crime) => crime.count > 0).length - 8} more types
							</span>
						</div>
					)}
				</div>

				{/* Safety Index */}
				<div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Safety Index</span>
						<span className="text-sm font-black text-emerald-400">{stats.safetyIndex}</span>
					</div>
					<div className="mt-2 h-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
						<div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: stats.safetyIndex }} />
					</div>
				</div>
			</div>
		</div>
	);
}
