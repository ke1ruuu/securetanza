"use client";

import React, { Suspense } from "react";
import { MapProvider } from "@/context/MapContext";
import SettingsShell from "./settings-shell";

/**
 * The shell lives in the layout (via this frame) so it persists across every settings
 * route: the sidebar never unmounts, so navigating between sections
 * costs nothing and animates nothing.
 */
export default function ConfigFrame({ children }: { children: React.ReactNode }) {
	return (
		<Suspense
			fallback={
				<div className="flex h-screen w-screen items-center justify-center bg-white dark:bg-[#0B1120]">
					<div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0EA5E9] border-t-transparent" />
				</div>
			}
		>
			<MapProvider>
				<SettingsShell>{children}</SettingsShell>
			</MapProvider>
		</Suspense>
	);
}
