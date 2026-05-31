"use client";

import { Plus, Minus, Crosshair } from "lucide-react";
import { useMapContext } from "@/context/MapContext";

export default function RightSidebarControls() {
	const { mapRef, initialBounds } = useMapContext();

	const handleZoomIn = () => {
		const map = mapRef.current;
		if (!map) return;
		const currentZoom = map.getZoom();
		const maxZoom = map.getMaxZoom();
		if (currentZoom < maxZoom) {
			map.zoomIn();
		}
	};

	const handleResetView = () => {
		const map = mapRef.current;
		if (!map || !initialBounds) return;
		// Reset to initial bounds (same as when map first loads)
		map.flyToBounds(initialBounds, {
			padding: [40, 40],
			duration: 1.5, // Animation duration in seconds
			easeLinearity: 0.25,
		});
	};

	return (
		<div className="flex flex-col items-center gap-1.5 pointer-events-auto">
			{/* Zoom In */}
			<button
				onClick={handleZoomIn}
				className="w-11 h-11 rounded-xl bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-xl border border-slate-200 dark:border-white/[0.08] flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-[#1E293B] hover:border-slate-300 dark:hover:border-white/[0.12] transition-all duration-200 cursor-pointer group shadow-sm dark:shadow-none"
				title="Zoom In">
				<Plus className="h-5 w-5 group-hover:scale-110 transition-transform" />
			</button>

			{/* Reset View / Zoom to Default */}
			<button
				onClick={handleResetView}
				className="w-11 h-11 rounded-xl bg-[#0EA5E9] border border-[#0EA5E9]/60 flex items-center justify-center text-white hover:bg-[#0EA5E9]/90 hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all duration-200 cursor-pointer group shadow-sm dark:shadow-none"
				title="Reset View">
				<Crosshair className="h-5 w-5 group-hover:scale-110 transition-transform" />
			</button>
		</div>
	);
}
