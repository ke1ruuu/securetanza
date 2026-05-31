"use client";

import React, { useRef, useEffect } from "react";
import { Filter, X, ChevronDown } from "lucide-react";
import { useMapContext } from "@/context/MapContext";
import { useCrimeTypes, getCrimeTypeColor } from "@/hooks/useCrimeTypes";

export default function CrimeTypeFilter() {
	const { selectedCrimeType, setSelectedCrimeType } = useMapContext();
	const [filterOpen, setFilterOpen] = React.useState(false);
	const { stats, loading } = useCrimeTypes();
	const filterRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
				setFilterOpen(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	return (
		<div ref={filterRef} className="pointer-events-auto relative">
			{/* ── Trigger Button ── */}
			<button
				onClick={() => setFilterOpen(!filterOpen)}
				className="flex items-center gap-3 h-12 pl-4 pr-5 rounded-xl bg-white/90 dark:bg-[#0F172A]/70 backdrop-blur-xl border border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-[#0EA5E9]/20 hover:bg-white dark:hover:bg-[#0F172A]/90 transition-all duration-300 cursor-pointer group shadow-sm dark:shadow-none">
				<Filter className="h-4 w-4 text-[#0EA5E9] group-hover:scale-110 transition-transform" />
				<span
					className="text-[14px] font-medium text-slate-700 dark:text-white/80 whitespace-nowrap"
					style={{ fontFamily: "var(--font-inter)" }}>
					{selectedCrimeType || "Filter by Crime Type"}
				</span>
				<ChevronDown
					className={`h-3.5 w-3.5 text-slate-500 group-hover:text-[#0EA5E9] transition-all duration-300 ${filterOpen ? "rotate-180" : ""}`}
				/>

				{/* Clear button when selected */}
				{selectedCrimeType && (
					<div
						onClick={(e) => {
							e.stopPropagation();
							setSelectedCrimeType(null);
						}}
						className="ml-1 w-5 h-5 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-all">
						<X className="h-3 w-3" />
					</div>
				)}
			</button>

			{/* ── Dropdown ── */}
			<div
				className={`absolute top-[calc(100%+8px)] left-0 min-w-[280px] rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-300 origin-top-left ${
					filterOpen ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
				}`}>
				{/* Glow accent */}
				<div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#0EA5E9]/40 via-transparent to-transparent" />

				{/* Header */}
				<div className="p-3 border-b border-slate-100 dark:border-white/[0.04]">
					<div className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Crime Types</div>
				</div>

				{/* List */}
				<div className="overflow-y-auto max-h-[320px] py-1 custom-scrollbar">
					{loading ? (
						<div className="p-4 text-[13px] text-slate-500 dark:text-slate-600 text-center" style={{ fontFamily: "var(--font-inter)" }}>
							Loading...
						</div>
					) : stats.length === 0 ? (
						<div className="p-4 text-[13px] text-slate-500 dark:text-slate-600 text-center" style={{ fontFamily: "var(--font-inter)" }}>
							No crime types available
						</div>
					) : (
						stats.map((item) => {
							const color = getCrimeTypeColor(item.type);
							const isSelected = selectedCrimeType === item.type;

							return (
								<button
									key={item.type}
									onClick={() => {
										setSelectedCrimeType(item.type);
										setFilterOpen(false);
									}}
									className={`flex items-center gap-3 w-full text-left px-4 py-2.5 transition-all duration-150 ${
										isSelected ? "bg-[#0EA5E9]/10 dark:bg-[#0EA5E9]/[0.08]" : "hover:bg-slate-50 dark:hover:bg-white/[0.04]"
									}`}>
									{/* Color indicator */}
									<div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />

									{/* Crime type name */}
									<span
										className={`text-[13px] font-medium flex-1 transition-colors ${
											isSelected
												? "text-[#0EA5E9]"
												: "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
										}`}
										style={{ fontFamily: "var(--font-inter)" }}>
										{item.type}
									</span>

									{/* Count badge */}
									<div
										className={`min-w-[32px] h-[20px] px-2 rounded-md flex items-center justify-center text-[11px] font-bold tabular-nums transition-colors ${
											isSelected ? "text-white" : "text-white dark:text-white/90"
										}`}
										style={{
											backgroundColor: color,
											opacity: isSelected ? 1 : 0.8,
										}}>
										{item.count}
									</div>
								</button>
							);
						})
					)}
				</div>
			</div>
		</div>
	);
}
