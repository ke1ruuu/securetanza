"use client";

import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { Switch } from "@/components/ui/switch";
import {
	PageHeader,
	Row,
	Rows,
	SaveState,
	Section,
} from "../_components/settings-ui";
import { landingOptions, themes } from "../_components/preview-thumbnails";

export default function PreferencesPage() {
	const { theme, setTheme } = useTheme();
	const { user, refreshSession } = useAuth();
	const [syncWithSystem, setSyncWithSystem] = useState(false);
	const [landingState, setLandingState] = useState<"idle" | "saving" | "saved" | "error">("idle");
	const [landingPage, setLandingPage] = useState<string>(() => {
		const raw =
			user?.defaultLandingPage ||
			(typeof window !== "undefined" ? localStorage.getItem("landingPage") : null);
		if (raw === "dashboard") return "overview";
		return raw || "overview";
	});

	React.useEffect(() => {
		if (user && user.defaultLandingPage) {
			const norm = user.defaultLandingPage === "dashboard" ? "overview" : user.defaultLandingPage;
			setLandingPage(norm);
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
		if (typeof window !== "undefined") localStorage.setItem("landingPage", id);

		setLandingState("saving");
		try {
			const res = await fetch("/api/users/settings/landing-page", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ landingPage: id }),
			});
			if (!res.ok) throw new Error("Request rejected");
			await refreshSession();
			setLandingState("saved");
			setTimeout(() => setLandingState((s) => (s === "saved" ? "idle" : s)), 2500);
		} catch (error) {
			console.error("Failed to update landing page", error);
			setLandingState("error");
		}
	};

	return (
		<div className="max-w-[720px] space-y-12">
			<PageHeader title="Account Preferences" />

			<Section
				title="Interface Theme"
				description="Select a theme or sync with your system for automatic switching."
			>
				<Rows>
					<Row label="Sync with system" htmlFor="sync-system">
						<Switch id="sync-system" checked={syncWithSystem} onCheckedChange={handleSyncToggle} />
					</Row>
				</Rows>
				<div
					role="radiogroup"
					aria-label="Interface theme"
					className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3"
				>
					{themes.map(({ id, label, sublabel, Preview }) => (
						<PickerTile
							key={id}
							selected={theme === id || (id === "system" && syncWithSystem)}
							label={label}
							caption={sublabel}
							onSelect={() => handleThemeSelect(id)}
						>
							<Preview />
						</PickerTile>
					))}
				</div>
			</Section>

			<Section
				title="Default Landing Page"
				description="Choose which view opens automatically when you log in."
				actions={
					<SaveState
						state={landingState}
						labels={{ saved: "Preference saved", error: "Could not save" }}
					/>
				}
			>
				<div
					role="radiogroup"
					aria-label="Default landing page"
					className="grid grid-cols-1 gap-3 border-t border-slate-200 pt-5 sm:grid-cols-3 dark:border-white/[0.07]"
				>
					{landingOptions.map(({ id, label, description, Preview }) => (
						<PickerTile
							key={id}
							selected={landingPage === id}
							label={label}
							caption={description}
							onSelect={() => handleLandingSelect(id)}
						>
							<Preview />
						</PickerTile>
					))}
				</div>
			</Section>
		</div>
	);
}

/**
 * One tile treatment for both pickers: a 1px border that turns accent
 * when selected, plus a dot. No second border weight, no shouted badge.
 */
function PickerTile({
	selected,
	label,
	caption,
	onSelect,
	children,
}: {
	selected: boolean;
	label: string;
	caption: string;
	onSelect: () => void;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			role="radio"
			aria-checked={selected}
			onClick={onSelect}
			className={`group rounded-[10px] border p-2.5 text-left transition-colors ${
				selected
					? "border-[#0EA5E9] bg-[#0EA5E9]/[0.045] dark:bg-[#0EA5E9]/[0.07]"
					: "border-slate-200 hover:border-slate-300 dark:border-white/[0.09] dark:hover:border-white/20"
			}`}
		>
			{children}
			<div className="mt-2.5 flex items-center gap-1.5">
				<span
					aria-hidden="true"
					className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
						selected ? "bg-[#0EA5E9]" : "bg-slate-300 dark:bg-white/20"
					}`}
				/>
				<span
					className={`truncate text-[13px] font-medium ${
						selected
							? "text-[#0369A1] dark:text-[#7DD3FC]"
							: "text-slate-700 dark:text-slate-200"
					}`}
				>
					{label}
				</span>
			</div>
			<p className="mt-0.5 pl-3 text-[12.5px] text-slate-500 dark:text-slate-400">{caption}</p>
		</button>
	);
}
