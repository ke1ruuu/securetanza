"use client";

import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import {
	PageHeader,
	Section,
	btnPrimary,
} from "../_components/settings-ui";
import { cn } from "@/lib/utils";
import { landingOptions, themes } from "../_components/preview-thumbnails";

export default function PreferencesPage() {
	const { theme, setTheme } = useTheme();
	const { user, refreshSession } = useAuth();
	const [savedSync, setSavedSync] = useState(false);
	const [draftSync, setDraftSync] = useState(false);

	const [savedTheme, setSavedTheme] = useState(theme);
	const [draftTheme, setDraftTheme] = useState(theme);

	const [landingState, setLandingState] = useState<"idle" | "saving" | "saved" | "error">("idle");
	
	const [savedLanding, setSavedLanding] = useState<string>(() => {
		const raw = user?.defaultLandingPage || (typeof window !== "undefined" ? localStorage.getItem("landingPage") : null);
		if (raw === "dashboard") return "overview";
		return raw || "overview";
	});
	const [draftLanding, setDraftLanding] = useState<string>(savedLanding);

	React.useEffect(() => {
		setSavedTheme(theme);
		setDraftTheme(theme);
	}, [theme]);

	React.useEffect(() => {
		if (user && user.defaultLandingPage) {
			const norm = user.defaultLandingPage === "dashboard" ? "overview" : user.defaultLandingPage;
			setSavedLanding(norm);
			setDraftLanding(norm);
		}
	}, [user]);

	React.useEffect(() => {
		const applyTheme = (t: string) => {
			if (t === "dark") {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
		};

		const isCurrentlyDark = document.documentElement.classList.contains("dark");
		const wantsDark = draftTheme === "dark";

		if (isCurrentlyDark === wantsDark) return;

		if (!document.startViewTransition) {
			applyTheme(draftTheme);
		} else {
			document.startViewTransition(() => applyTheme(draftTheme));
		}
	}, [draftTheme]);

	const savedThemeRef = React.useRef(savedTheme);
	React.useEffect(() => {
		savedThemeRef.current = savedTheme;
	}, [savedTheme]);

	React.useEffect(() => {
		return () => {
			if (savedThemeRef.current === "dark") {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
		};
	}, []);


	const handleThemeSelect = (id: string) => {
		if (id === "system") {
			setDraftSync(true);
			if (typeof window !== "undefined") {
				const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
				setDraftTheme(prefersDark ? "dark" : "light");
			}
		} else {
			setDraftSync(false);
			setDraftTheme(id as "light" | "dark");
		}
	};

	const handleLandingSelect = (id: string) => {
		setDraftLanding(id);
	};

	const hasUnsavedChanges = draftSync !== savedSync || draftTheme !== savedTheme || draftLanding !== savedLanding;

	const handleSave = async () => {
		setLandingState("saving");

		// Apply Theme
		if (draftTheme !== savedTheme || draftSync !== savedSync) {
			setTheme(draftTheme);
			setSavedTheme(draftTheme);
			setSavedSync(draftSync);
		}

		// Apply Landing Page
		if (draftLanding !== savedLanding) {
			if (typeof window !== "undefined") localStorage.setItem("landingPage", draftLanding);
			try {
				const res = await fetch("/api/users/settings/landing-page", {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ landingPage: draftLanding }),
				});
				if (!res.ok) throw new Error("Request rejected");
				await refreshSession();
			} catch (error) {
				console.error("Failed to update landing page", error);
			}
		}

		setSavedLanding(draftLanding);
		setLandingState("saved");
		setTimeout(() => setLandingState((s) => (s === "saved" ? "idle" : s)), 2500);
	};

	return (
		<div className="max-w-[720px] space-y-12">
			<PageHeader title="Account Preferences" />

			<Section
				title="Interface Theme"
				description="Select a theme or sync with your system for automatic switching."
			>
				<div
					role="radiogroup"
					aria-label="Interface theme"
					className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3"
				>
					{themes.map(({ id, label, sublabel, Preview }) => (
						<PickerTile
							key={id}
							selected={id === "system" ? draftSync : (!draftSync && draftTheme === id)}
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
			>
				<div
					role="radiogroup"
					aria-label="Default landing page"
					className="grid grid-cols-1 gap-3 border-t border-slate-200 pt-5 sm:grid-cols-3 dark:border-white/[0.07]"
				>
					{landingOptions.map(({ id, label, description, Preview }) => (
						<PickerTile
							key={id}
							selected={draftLanding === id}
							label={label}
							caption={description}
							onSelect={() => handleLandingSelect(id)}
						>
							<Preview />
						</PickerTile>
					))}
				</div>
			</Section>

			{hasUnsavedChanges && (
				<div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
					<div className="flex items-center gap-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-full py-2 pl-6 pr-2">
						<span className="text-[14px] font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap">
							Unsaved changes
						</span>
						<button
							onClick={handleSave}
							disabled={landingState === "saving"}
							className={cn(btnPrimary, "rounded-full h-9 px-6 shadow-sm text-[13.5px] font-semibold")}
						>
							{landingState === "saving" ? "Saving..." : "Save Changes"}
						</button>
					</div>
				</div>
			)}
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
