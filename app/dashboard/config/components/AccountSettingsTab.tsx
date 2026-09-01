"use client";

import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { Monitor, Sun, Moon, LayoutDashboard, Map, Table2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const ThemePreviewLight = () => (
	<div className="w-full rounded-md overflow-hidden border border-slate-200 bg-[#f8fafc]" style={{ height: 90 }}>
		<div className="flex h-full">
			<div className="w-10 bg-white border-r border-slate-200 flex flex-col gap-1 p-1.5">
				{[...Array(4)].map((_, i) => (
					<div key={i} className="h-1.5 rounded-sm bg-slate-200 w-full" />
				))}
			</div>
			<div className="flex-1 p-2 flex flex-col gap-1.5">
				<div className="h-2 w-16 rounded-sm bg-slate-300" />
				<div className="grid grid-cols-3 gap-1 mt-1">
					{[...Array(3)].map((_, i) => (
						<div key={i} className="h-8 rounded-sm bg-white border border-slate-200" />
					))}
				</div>
				<div className="h-8 rounded-sm bg-white border border-slate-200 mt-1" />
			</div>
		</div>
	</div>
);

const ThemePreviewDark = () => (
	<div className="w-full rounded-md overflow-hidden border border-slate-700 bg-[#0f172a]" style={{ height: 90 }}>
		<div className="flex h-full">
			<div className="w-10 bg-slate-900 border-r border-slate-700 flex flex-col gap-1 p-1.5">
				{[...Array(4)].map((_, i) => (
					<div key={i} className="h-1.5 rounded-sm bg-slate-700 w-full" />
				))}
			</div>
			<div className="flex-1 p-2 flex flex-col gap-1.5">
				<div className="h-2 w-16 rounded-sm bg-slate-600" />
				<div className="grid grid-cols-3 gap-1 mt-1">
					{[...Array(3)].map((_, i) => (
						<div key={i} className="h-8 rounded-sm bg-slate-800 border border-slate-700" />
					))}
				</div>
				<div className="h-8 rounded-sm bg-slate-800 border border-slate-700 mt-1" />
			</div>
		</div>
	</div>
);

const ThemePreviewSystem = () => (
	<div className="w-full rounded-md overflow-hidden border border-slate-300 bg-gradient-to-r from-[#f8fafc] to-[#0f172a]" style={{ height: 90 }}>
		<div className="flex h-full">
			<div className="w-10 bg-gradient-to-b from-white to-slate-900 border-r border-slate-400 flex flex-col gap-1 p-1.5">
				{[...Array(4)].map((_, i) => (
					<div key={i} className="h-1.5 rounded-sm bg-slate-400 w-full" />
				))}
			</div>
			<div className="flex-1 p-2 flex flex-col gap-1.5">
				<div className="h-2 w-16 rounded-sm bg-slate-400" />
				<div className="grid grid-cols-3 gap-1 mt-1">
					{[...Array(3)].map((_, i) => (
						<div key={i} className={`h-8 rounded-sm border ${i < 2 ? "bg-white border-slate-200" : "bg-slate-800 border-slate-700"}`} />
					))}
				</div>
				<div className="h-8 rounded-sm bg-slate-400/30 border border-slate-400 mt-1" />
			</div>
		</div>
	</div>
);

const themes = [
	{ id: "light", label: "Light theme", sublabel: "Default light", icon: Sun, Preview: ThemePreviewLight },
	{ id: "dark", label: "Dark theme", sublabel: "Default dark", icon: Moon, Preview: ThemePreviewDark },
	{ id: "system", label: "System", sublabel: "Default system", icon: Monitor, Preview: ThemePreviewSystem },
];

// Shared nav bar for all previews
const PreviewNav = ({ active }: { active: string }) => (
	<div className="w-full bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 flex items-center px-2 gap-1.5 py-1 flex-shrink-0">
		<div className="w-3 h-3 rounded-sm bg-[#0EA5E9] flex-shrink-0" />
		{["Map", "Overview", "Analytics"].map((tab) => (
			<div key={tab} className={`text-[5px] font-bold px-1 py-0.5 rounded ${tab === active ? "text-[#0EA5E9] border-b border-[#0EA5E9]" : "text-slate-400"}`}>
				{tab}
			</div>
		))}
	</div>
);

// Map preview — colored choropleth regions + legend
const LandingPreviewMap = () => (
	<div className="w-full rounded-md overflow-hidden border border-slate-200 dark:border-slate-700 bg-[#d1d5db] dark:bg-[#1e293b] flex flex-col" style={{ height: 96 }}>
		<PreviewNav active="Map" />
		<div className="flex-1 relative overflow-hidden">
			{/* Water background */}
			<div className="absolute inset-0 bg-[#bfdbfe] dark:bg-[#1e3a5f]" />
			{/* Land mass blobs representing barangays */}
			<div className="absolute top-1 left-3 w-12 h-10 rounded-full bg-[#86efac] opacity-80" style={{ clipPath: "polygon(30% 0%, 70% 5%, 90% 30%, 80% 70%, 50% 100%, 20% 90%, 0% 60%, 10% 20%)" }} />
			<div className="absolute top-3 left-6 w-8 h-7 rounded-full bg-[#fca5a5] opacity-90" style={{ clipPath: "polygon(20% 0%, 80% 10%, 100% 50%, 70% 90%, 30% 100%, 0% 60%)" }} />
			<div className="absolute top-4 left-12 w-7 h-6 rounded-full bg-[#fde68a] opacity-80" style={{ clipPath: "polygon(50% 0%, 100% 30%, 80% 100%, 20% 100%, 0% 40%)" }} />
			<div className="absolute top-7 left-4 w-9 h-6 rounded-full bg-[#6ee7b7] opacity-75" />
			{/* Legend badges */}
			<div className="absolute right-1 top-1 flex flex-col gap-0.5">
				{[["bg-red-400", "Critical"], ["bg-orange-400", "High"], ["bg-yellow-400", "Moderate"], ["bg-green-400", "Low"]].map(([color, label]) => (
					<div key={label} className="flex items-center gap-0.5">
						<div className={`w-2 h-1.5 rounded-sm ${color}`} />
						<span className="text-[4px] font-bold text-slate-700 dark:text-slate-300">{label}</span>
					</div>
				))}
			</div>
		</div>
	</div>
);

// Overview/Dashboard preview — 3 stat cards + line chart + donut
const LandingPreviewDashboard = () => (
	<div className="w-full rounded-md overflow-hidden border border-slate-200 dark:border-slate-700 bg-[#f1f5f9] dark:bg-[#0f172a] flex flex-col" style={{ height: 96 }}>
		<PreviewNav active="Overview" />
		<div className="flex-1 p-1.5 flex flex-col gap-1 overflow-hidden">
			{/* 3 stat cards */}
			<div className="grid grid-cols-3 gap-1">
				{["38", "Theft", "SAHUD ULAN"].map((val, i) => (
					<div key={i} className="bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 p-1">
						<div className="text-[4px] text-slate-400 leading-none mb-0.5">Stat</div>
						<div className="text-[5px] font-black text-slate-700 dark:text-white leading-none truncate">{val}</div>
					</div>
				))}
			</div>
			{/* Chart row */}
			<div className="grid grid-cols-2 gap-1 flex-1 min-h-0">
				{/* Line chart mock */}
				<div className="bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 p-1 flex flex-col justify-end">
					<div className="text-[4px] text-slate-400 mb-0.5">Crime Trend</div>
					<svg viewBox="0 0 40 16" className="w-full" preserveAspectRatio="none" style={{ height: 16 }}>
						<polyline points="0,14 6,6 12,10 18,4 24,8 30,12 36,14 40,14" fill="none" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</div>
				{/* Donut mock */}
				<div className="bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 p-1 flex items-center justify-center">
					<svg viewBox="0 0 20 20" width="22" height="22">
						<circle cx="10" cy="10" r="7" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="18 26" strokeDashoffset="-2" />
						<circle cx="10" cy="10" r="7" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="11 33" strokeDashoffset="-20" />
						<circle cx="10" cy="10" r="7" fill="none" stroke="#22c55e" strokeWidth="4" strokeDasharray="8 36" strokeDashoffset="-31" />
						<circle cx="10" cy="10" r="4.5" fill="white" />
					</svg>
				</div>
			</div>
		</div>
	</div>
);

// Analytics preview — 4 colored metric cards + bar chart
const LandingPreviewAnalytics = () => (
	<div className="w-full rounded-md overflow-hidden border border-slate-200 dark:border-slate-700 bg-[#f1f5f9] dark:bg-[#0f172a] flex flex-col" style={{ height: 96 }}>
		<PreviewNav active="Analytics" />
		<div className="flex-1 p-1.5 flex flex-col gap-1 overflow-hidden">
			{/* 4 coloured metric cards */}
			<div className="grid grid-cols-4 gap-1">
				{[["bg-blue-50 dark:bg-blue-900/30 border-blue-200", "text-blue-600", "Trend"],
				  ["bg-purple-50 dark:bg-purple-900/30 border-purple-200", "text-purple-600", "Peak"],
				  ["bg-green-50 dark:bg-green-900/30 border-green-200", "text-green-600", "Rate"],
				  ["bg-amber-50 dark:bg-amber-900/30 border-amber-200", "text-amber-600", "Safety"]].map(([bg, text, label]) => (
					<div key={label} className={`rounded border p-0.5 ${bg}`}>
						<div className={`text-[4px] font-black leading-none ${text}`}>{label}</div>
					</div>
				))}
			</div>
			{/* Horizontal bar chart mock */}
			<div className="bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 p-1 flex-1 flex flex-col justify-around">
				{[["bg-blue-500", "90%"], ["bg-red-400", "60%"], ["bg-green-400", "50%"], ["bg-yellow-400", "30%"]].map(([color, w], i) => (
					<div key={i} className="flex items-center gap-0.5">
						<div className="w-4 text-[3.5px] text-slate-400 shrink-0">Theft</div>
						<div className={`h-1.5 rounded-sm ${color}`} style={{ width: w }} />
					</div>
				))}
			</div>
		</div>
	</div>
);

const landingOptions = [
	{ id: "map", label: "Map", description: "Geographic crime map", icon: Map, Preview: LandingPreviewMap },
	{ id: "dashboard", label: "Overview", description: "General dashboard & stats", icon: LayoutDashboard, Preview: LandingPreviewDashboard },
	{ id: "analytics", label: "Analytics", description: "Crime trends & insights", icon: Table2, Preview: LandingPreviewAnalytics },
];

export default function AccountSettingsTab() {
	const { theme, setTheme } = useTheme();
	const { user, refreshSession } = useAuth();
	const [syncWithSystem, setSyncWithSystem] = useState(false);
	const [isUpdatingLanding, setIsUpdatingLanding] = useState(false);
	const [landingPage, setLandingPage] = useState<string>(() => {
		if (user && user.defaultLandingPage) {
			return user.defaultLandingPage;
		}
		if (typeof window !== "undefined") {
			return localStorage.getItem("landingPage") ?? "dashboard";
		}
		return "dashboard";
	});

	// Keep state in sync if user changes
	React.useEffect(() => {
		if (user && user.defaultLandingPage) {
			setLandingPage(user.defaultLandingPage);
		}
	}, [user]);

	const handleSyncToggle = (val: boolean) => {
		setSyncWithSystem(val);
		if (val && typeof window !== "undefined") {
			const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
			setTheme(prefersDark ? "dark" : "light");
		}
	};

	const handleThemeSelect = (id: string) => {
		if (id === "system") {
			setSyncWithSystem(true);
			if (typeof window !== "undefined") {
				const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
				setTheme(prefersDark ? "dark" : "light");
			}
		} else {
			setSyncWithSystem(false);
			setTheme(id as "light" | "dark");
		}
	};

	const handleLandingSelect = async (id: string) => {
		setLandingPage(id); // optimistic update
		if (typeof window !== "undefined") {
			localStorage.setItem("landingPage", id);
		}
		
		setIsUpdatingLanding(true);
		try {
			const res = await fetch("/api/users/settings/landing-page", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ landingPage: id }),
			});
			if (res.ok) {
				await refreshSession();
			}
		} catch (error) {
			console.error("Failed to update landing page", error);
		} finally {
			setIsUpdatingLanding(false);
		}
	};

	return (
		<div className="flex flex-col items-center w-full h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="w-full max-w-3xl flex flex-col gap-8 pb-12">
				{/* Header */}
				<div className="pb-4">
					<h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
						Account Preferences
					</h2>
				</div>

				<div className="space-y-12">
					{/* Theme */}
					<div className="space-y-4">
						<div className="space-y-1">
							<h3 className="text-lg font-bold text-slate-900 dark:text-white">Interface Theme</h3>
							<p className="text-sm text-slate-500 dark:text-slate-400">
								Select a theme or sync with your system for automatic switching.
							</p>
						</div>

						<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
							{/* Sync toggle */}
							<div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/5">
								<Label className="text-sm font-semibold text-slate-900 dark:text-white">Sync with system</Label>
								<Switch checked={syncWithSystem} onCheckedChange={handleSyncToggle} />
							</div>

							{/* Theme cards */}
							<div className="p-6">
								<div className="grid grid-cols-3 gap-4">
									{themes.map(({ id, label, sublabel, icon: Icon, Preview }) => {
										const isActive = theme === id || (id === "system" && syncWithSystem);
										return (
											<button
												key={id}
												onClick={() => handleThemeSelect(id)}
												className={`flex flex-col rounded-xl border-2 p-3 text-left transition-all ${
													isActive
														? "border-[#0EA5E9] bg-[#0EA5E9]/5"
														: "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
												}`}>
												{/* Label + Active badge */}
												<div className="flex items-center justify-between mb-3">
													<div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
														<Icon className="h-3.5 w-3.5" />
														{label}
													</div>
													{isActive && (
														<span className="text-[10px] font-black uppercase tracking-wide bg-[#0EA5E9] text-white px-1.5 py-0.5 rounded-full">
															Active
														</span>
													)}
												</div>

												{/* Preview */}
												<Preview />

												{/* Sublabel */}
												<p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">{sublabel}</p>
											</button>
										);
									})}
								</div>
							</div>
						</div>
					</div>

					{/* Landing Page */}
					<div className="space-y-4">
						<div className="space-y-1">
							<h3 className="text-lg font-bold text-slate-900 dark:text-white">Default Landing Page</h3>
							<p className="text-sm text-slate-500 dark:text-slate-400">
								Choose which view opens automatically when you log in.
							</p>
						</div>

						<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
							<div className="grid grid-cols-3 gap-4">
								{landingOptions.map(({ id, label, description, icon: Icon, Preview }) => {
									const isActive = landingPage === id;
									return (
										<button
											key={id}
											onClick={() => handleLandingSelect(id)}
											className={`flex flex-col rounded-xl border-2 p-3 text-left transition-all ${
												isActive
													? "border-[#0EA5E9] bg-[#0EA5E9]/5"
													: "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
											}`}>
											<div className="flex items-center justify-between mb-3">
												<div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
													<Icon className="h-3.5 w-3.5" />
													{label}
												</div>
												{isActive && (
													<span className="text-[10px] font-black uppercase tracking-wide bg-[#0EA5E9] text-white px-1.5 py-0.5 rounded-full">
														Active
													</span>
												)}
											</div>
											<Preview />
											<p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{description}</p>
										</button>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
