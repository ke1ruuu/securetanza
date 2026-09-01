"use client";

import dynamic from "next/dynamic";
import { useState, useCallback, Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import MapHeader from "@/components/layout/map-header";
import UnifiedFilterBar from "@/components/layout/unified-filter-bar";
import RealTimeClock from "@/components/layout/real-time-clock";
import TimeFilter from "@/components/layout/time-filter";
import LatestDataIndicator from "@/components/layout/latest-data-indicator";

import { MapProvider, useMapContext } from "@/context/MapContext";

import RightSidebarControls from "@/components/layout/right-sidebar-controls";
import MapLegend from "@/components/map/map-legend";

const TanzaMap = dynamic(() => import("../components/map/tanza-map-root"), {
	ssr: false,
});

function HomeContent() {
	const { user, loading: authLoading } = useAuth();
	const router = useRouter();
	const [isFilterActive, setIsFilterActive] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);

	const { setIsTimeFilterActive, setTimeFilter } = useMapContext();

	useEffect(() => {
		if (!authLoading && !user) {
			router.replace("/login");
		}
	}, [authLoading, user, router]);

	const handleFilterToggle = useCallback(
		(isActive: boolean) => {
			console.log("Filter toggle:", isActive);
			setIsFilterActive(isActive);
			setIsTimeFilterActive(isActive);

			// Clear time filter when closing
			if (!isActive) {
				console.log("Clearing time filter");
				setTimeFilter(null, null, 0);
			}
		},
		[setIsTimeFilterActive, setTimeFilter],
	);

	const handleFilterChange = useCallback((filters: any) => {
		console.log("Filter changed:", filters);
	}, []);

	const handlePlayPauseToggle = useCallback(() => {
		setIsPlaying((prev) => {
			const newIsPlaying = !prev;
			// Activate time filter when starting playback
			if (newIsPlaying) {
				console.log("▶️ Starting playback - activating time filter");
				setIsTimeFilterActive(true);
			}
			return newIsPlaying;
		});
	}, [setIsTimeFilterActive]);

	if (authLoading) {
		return (
			<div className="flex h-screen w-screen items-center justify-center bg-[#0f172a]">
				<div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0EA5E9] border-t-transparent" />
			</div>
		);
	}

	if (!user) {
		return null;
	}

	return (
		<main className="relative h-screen w-screen bg-slate-50 dark:bg-[#020617] overflow-hidden text-slate-900 dark:text-slate-100 font-sans transition-colors duration-500">
			<div className="fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-in-out">
				<Suspense
					fallback={
						<div className="w-full h-16 bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-white/[0.06] transition-colors duration-500" />
					}>
					<MapHeader isVisible={!isFilterActive} />
				</Suspense>
			</div>

			<div
				data-tour="map-canvas"
				className={`absolute inset-0 z-0 transition-all duration-500 ease-in-out ${isFilterActive ? "pt-0" : "pt-16"}`}>
				<TanzaMap />
			</div>

			<div className={`fixed inset-0 z-10 pointer-events-none transition-all duration-500 ease-in-out ${isFilterActive ? "pt-0" : "pt-16"}`}>
				{/* Top Left Unified Filter Bar (Barangay, Crime Type, Time Selector) */}
				<div
					className={`absolute left-3 sm:left-4 lg:left-6 transition-all duration-500 ease-in-out ${
						isFilterActive ? "top-3 sm:top-4 lg:top-6" : "top-[72px] sm:top-20"
					}`}>
					<UnifiedFilterBar />
				</div>

				{/* Top Right Legend */}
				<div
					data-tour="map-legend"
					className={`absolute right-3 sm:right-4 lg:right-6 transition-all duration-500 ease-in-out ${
						isFilterActive ? "top-3 sm:top-4 lg:top-6" : "top-[72px] sm:top-20"
					}`}>
					<MapLegend />
				</div>

				{/* Bottom Right: Latest Data Indicator beside Zoom Controls */}
				<div className="absolute bottom-3 sm:bottom-4 lg:bottom-6 right-3 sm:right-4 lg:right-6 flex items-end gap-2.5 sm:gap-3">
					<LatestDataIndicator />
					<div data-tour="map-zoom-controls">
						<RightSidebarControls />
					</div>
				</div>

				{/* Time Filter - appears at bottom when filter is active */}
				<div
					className={`absolute left-1/2 -translate-x-1/2 transition-all duration-500 ease-in-out px-3 sm:px-0 ${
						isFilterActive ? "bottom-3 sm:bottom-4 lg:bottom-6 opacity-100" : "-bottom-32 opacity-0"
					}`}>
					{isFilterActive && (
						<TimeFilter
							key="time-filter-active"
							onFilterChange={handleFilterChange}
							isPlaying={isPlaying}
							onPlayPauseToggle={handlePlayPauseToggle}
						/>
					)}
				</div>

				{/* Real Time Clock */}
				<div
					data-tour="real-time-clock"
					className={`absolute left-3 sm:left-4 lg:left-6 transition-all duration-500 ease-in-out ${
						isFilterActive ? "bottom-[100px] sm:bottom-4 lg:bottom-6" : "bottom-3 sm:bottom-4 lg:bottom-6"
					}`}>
					<RealTimeClock onFilterToggle={handleFilterToggle} isFilterActive={isFilterActive} />
				</div>
			</div>
		</main>
	);
}

export default function Home() {
	return (
		<MapProvider>
			<HomeContent />
		</MapProvider>
	);
}
