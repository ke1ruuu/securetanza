"use client";

import { Plus, Minus, Crosshair } from "lucide-react";
import { useMapContext } from "@/context/MapContext";
import { OVERLAY_BUTTON } from "@/lib/map-overlay";

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

	const handleZoomOut = () => {
		const map = mapRef.current;
		if (!map) return;
		if (map.getZoom() > map.getMinZoom()) {
			map.zoomOut();
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
				className={`w-11 h-11 cursor-pointer group ${OVERLAY_BUTTON}`}
				title="Zoom In">
				<Plus className="h-5 w-5 group-hover:scale-110 transition-transform" />
			</button>

			{/* Zoom Out */}
			<button
				onClick={handleZoomOut}
				className={`w-11 h-11 cursor-pointer group ${OVERLAY_BUTTON}`}
				title="Zoom Out">
				<Minus className="h-5 w-5 group-hover:scale-110 transition-transform" />
			</button>

			{/* Reset View / Zoom to Default */}
			<button
				onClick={handleResetView}
				className="w-11 h-11 rounded-lg border border-sky-500 bg-sky-500 flex items-center justify-center text-white shadow-sm transition-colors hover:bg-sky-600 cursor-pointer group"
				title="Reset View">
				<Crosshair className="h-5 w-5 group-hover:scale-110 transition-transform" />
			</button>
		</div>
	);
}
