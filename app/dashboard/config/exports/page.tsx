"use client";

import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { AdminOnly } from "../_components/settings-shell";
import {
	Field,
	PageHeader,
	Row,
	Rows,
	SaveState,
	Section,
	btnPrimary,
	PAGE_FORM,
	SplitLayout,
} from "../_components/settings-ui";
import { cn } from "@/lib/utils";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAYS_OF_MONTH = Array.from({ length: 28 }, (_, i) => i + 1);

const DELIVERY_MODES = [
	{
		id: "prompt" as const,
		label: "Prompt me to download",
		description: "Show a download prompt the next time you open the web app.",
	},
	{
		id: "auto" as const,
		label: "Auto-generate and notify me",
		description:
			"Automatically generate the report and show a notification in-app when it's ready.",
	},
];

export default function DataExportsPage() {
	return (
		<AdminOnly>
			<DataExports />
		</AdminOnly>
	);
}

function DataExports() {
	const [enabled, setEnabled] = useState(false);
	const [frequency, setFrequency] = useState("weekly");
	const [dayOfWeek, setDayOfWeek] = useState("Monday");
	const [dayOfMonth, setDayOfMonth] = useState("1");
	const [monthlyOn, setMonthlyOn] = useState("1"); // day of year for annually
	const [deliveryMode, setDeliveryMode] = useState<"prompt" | "auto">("prompt");
	const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

	React.useEffect(() => {
		fetch("/api/exports/schedule")
			.then((res) => res.json())
			.then((data) => {
				if (data.schedule) {
					setEnabled(data.schedule.enabled);
					setFrequency(data.schedule.frequency);
					setDayOfWeek(data.schedule.dayOfWeek || "Monday");
					setDayOfMonth(data.schedule.dayOfMonth || "1");
					setMonthlyOn(data.schedule.monthlyOn || "1");
					setDeliveryMode(data.schedule.deliveryMode || "prompt");
				}
			})
			.catch((err) => console.error("Failed to load schedule:", err));
	}, []);

	const handleSave = async () => {
		setSaveState("saving");
		try {
			const res = await fetch("/api/exports/schedule", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ enabled, frequency, dayOfWeek, dayOfMonth, monthlyOn, deliveryMode }),
			});
			if (!res.ok) throw new Error("Failed to save schedule");
			setSaveState("saved");
			setHasUnsavedChanges(false);
			setTimeout(() => setSaveState((s) => (s === "saved" ? "idle" : s)), 3000);
		} catch (error) {
			console.error("Error saving schedule:", error);
			setSaveState("error");
		}
	};

	return (
		<div className={cn(PAGE_FORM, "space-y-12")}>
			<PageHeader title="Data Exports" />

			<SplitLayout>
			<Section
				title="Scheduled Exports"
				description="Automatically generate incident reports on a recurring schedule."
			>
				<Rows>
					<Row
						label="Enable Scheduled Exports"
						description="Turn on to activate automatic report generation."
						htmlFor="exports-enabled"
					>
						<Switch id="exports-enabled" checked={enabled} onCheckedChange={(val) => { setEnabled(val); setHasUnsavedChanges(true); }} />
					</Row>
				</Rows>

				<fieldset
					disabled={!enabled}
					className={`transition-opacity duration-200 ${enabled ? "" : "opacity-45"}`}
				>
					<legend className="sr-only">Export schedule</legend>

										<div className="space-y-5 pt-6">
						<Field label="Frequency">
							<div className="flex max-w-[380px] gap-1.5">
								{["daily", "weekly", "monthly"].map((f) => (
									<button
										key={f}
										type="button"
										aria-pressed={frequency === f}
										onClick={() => { setFrequency(f); setHasUnsavedChanges(true); }}
										className={`h-9 flex-1 rounded-md border text-[13px] font-medium capitalize transition-colors ${
											frequency === f
												? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
												: "border-slate-200 text-slate-600 hover:border-slate-300 dark:border-white/[0.12] dark:text-slate-300 dark:hover:border-white/25"
										}`}
									>
										{f}
									</button>
								))}
							</div>
						</Field>

						{frequency === "weekly" && (
							<Field label="Generate every" htmlFor="day-of-week">
								<div className="max-w-[380px]">
									<Select value={dayOfWeek} onValueChange={(val) => { setDayOfWeek(val); setHasUnsavedChanges(true); }}>
										<SelectTrigger
											id="day-of-week"
											className="h-9 border-slate-200 bg-white text-[14px] dark:border-white/[0.12] dark:bg-white/[0.03]"
										>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{DAYS_OF_WEEK.map((d) => (
												<SelectItem key={d} value={d}>
													{d}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</Field>
						)}

						{frequency === "monthly" && (
							<Field label="Generate on day" htmlFor="day-of-month">
								<div className="max-w-[380px]">
									<Select value={dayOfMonth} onValueChange={(val) => { setDayOfMonth(val); setHasUnsavedChanges(true); }}>
										<SelectTrigger
											id="day-of-month"
											className="h-9 border-slate-200 bg-white text-[14px] dark:border-white/[0.12] dark:bg-white/[0.03]"
										>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{DAYS_OF_MONTH.map((d) => (
												<SelectItem key={d} value={String(d)}>
													{d === 1 ? "1st" : d === 2 ? "2nd" : d === 3 ? "3rd" : `${d}th`} of the
													month
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</Field>
						)}

						{frequency === "daily" && (
							<p className="text-[13px] text-slate-500 dark:text-slate-400">
								A report will be generated every day at midnight.
							</p>
						)}
					</div>

					<div className="pt-8">
						<p className="pb-3 text-[13px] font-medium text-slate-700 dark:text-slate-300">
							When the report is ready...
						</p>
						<div role="radiogroup" aria-label="When the report is ready">
							<Rows>
								{DELIVERY_MODES.map((mode) => (
									<button
										key={mode.id}
										type="button"
										role="radio"
										aria-checked={deliveryMode === mode.id}
										onClick={() => { setDeliveryMode(mode.id as any); setHasUnsavedChanges(true); }}
										className="flex w-full items-start gap-3 py-3.5 text-left"
									>
										<span
											aria-hidden="true"
											className={`mt-[3px] flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full border transition-colors ${
												deliveryMode === mode.id
													? "border-[#0EA5E9]"
													: "border-slate-300 dark:border-white/25"
											}`}
										>
											{deliveryMode === mode.id && (
												<span className="h-[7px] w-[7px] rounded-full bg-[#0EA5E9]" />
											)}
										</span>
										<span className="min-w-0">
											<span className="block text-[14px] font-medium text-slate-900 dark:text-slate-100">
												{mode.label}
											</span>
											<span className="mt-0.5 block text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
												{mode.description}
											</span>
										</span>
									</button>
								))}
							</Rows>
						</div>
					</div>

				</fieldset>
			</Section>
			</SplitLayout>

			{hasUnsavedChanges && (
				<div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
					<div className="flex items-center gap-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-full py-2 pl-6 pr-2">
						<span className="text-[14px] font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap">
							Unsaved changes
						</span>
						<button
							type="button"
							onClick={handleSave}
							disabled={saveState === "saving"}
							className={cn(btnPrimary, "rounded-full h-9 px-6 shadow-sm text-[13.5px] font-semibold")}
						>
							{saveState === "saving" ? "Saving..." : "Save Changes"}
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
