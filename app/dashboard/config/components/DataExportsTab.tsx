"use client";

import React, { useState } from "react";
import { Calendar, CheckCircle2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAYS_OF_MONTH = Array.from({ length: 28 }, (_, i) => i + 1);

export default function DataExportsTab() {
	const [enabled, setEnabled] = useState(false);
	const [frequency, setFrequency] = useState("weekly");
	const [dayOfWeek, setDayOfWeek] = useState("Monday");
	const [dayOfMonth, setDayOfMonth] = useState("1");
	const [monthlyOn, setMonthlyOn] = useState("1"); // day of year for annually
	const [deliveryMode, setDeliveryMode] = useState<"prompt" | "auto">("prompt");
	const [saved, setSaved] = useState(false);

	const handleSave = () => {
		setSaved(true);
		setTimeout(() => setSaved(false), 3000);
	};

	return (
		<div className="flex flex-col items-center w-full h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="w-full max-w-3xl flex flex-col gap-8 pb-12">
				{/* Header */}
				<div className="flex justify-between items-end pb-4">
					<div className="space-y-1">
						<h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
							Data Exports
						</h2>
					</div>
					{saved ? (
						<div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg text-sm font-medium">
							<CheckCircle2 className="h-4 w-4" /> Saved
						</div>
					) : (
						<Button onClick={handleSave} className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
							Save Configuration
						</Button>
					)}
				</div>

				<div className="space-y-12">
					<div className="space-y-4">
						<div className="space-y-1">
							<h3 className="text-lg font-bold text-slate-900 dark:text-white">Scheduled Exports</h3>
							<p className="text-sm text-slate-500 dark:text-slate-400">
								Automatically generate incident reports on a recurring schedule.
							</p>
						</div>

						{/* The Card */}
						<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">

							{/* Enable Toggle — at the very top */}
							<div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/5">
								<div className="space-y-0.5">
									<Label className="text-sm font-semibold text-slate-900 dark:text-white">Enable Scheduled Exports</Label>
									<p className="text-sm text-slate-500">
										Turn on to activate automatic report generation.
									</p>
								</div>
								<Switch checked={enabled} onCheckedChange={setEnabled} />
							</div>

							{/* Schedule Config — only when enabled */}
							<div className={`transition-all duration-200 ${!enabled ? "opacity-40 pointer-events-none" : ""}`}>

								{/* Frequency */}
								<div className="p-6 border-b border-slate-200 dark:border-white/5 space-y-4">
									<Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">Frequency</Label>
									<div className="flex gap-3">
										{["daily", "weekly", "monthly"].map((f) => (
											<button
												key={f}
												onClick={() => setFrequency(f)}
												className={`flex-1 py-2 px-4 rounded-lg border text-sm font-semibold capitalize transition-all ${
													frequency === f
														? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900"
														: "bg-transparent border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-400"
												}`}>
												{f}
											</button>
										))}
									</div>

									{/* Day selector appears below the frequency buttons */}
									{frequency === "weekly" && (
										<div className="space-y-2 pt-2">
											<Label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Generate every</Label>
											<Select value={dayOfWeek} onValueChange={setDayOfWeek}>
												<SelectTrigger className="h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
													<div className="flex items-center gap-2">
														<Calendar className="h-4 w-4 text-slate-400" />
														<SelectValue />
													</div>
												</SelectTrigger>
												<SelectContent>
													{DAYS_OF_WEEK.map((d) => (
														<SelectItem key={d} value={d}>{d}</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									)}

									{frequency === "monthly" && (
										<div className="space-y-2 pt-2">
											<Label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Generate on day</Label>
											<Select value={dayOfMonth} onValueChange={setDayOfMonth}>
												<SelectTrigger className="h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
													<div className="flex items-center gap-2">
														<Calendar className="h-4 w-4 text-slate-400" />
														<SelectValue />
													</div>
												</SelectTrigger>
												<SelectContent>
													{DAYS_OF_MONTH.map((d) => (
														<SelectItem key={d} value={String(d)}>
															{d === 1 ? "1st" : d === 2 ? "2nd" : d === 3 ? "3rd" : `${d}th`} of the month
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									)}

									{frequency === "daily" && (
										<p className="text-sm text-slate-500 dark:text-slate-400 pt-1">
											A report will be generated every day at midnight.
										</p>
									)}
								</div>

								{/* Delivery Mode */}
								<div className="p-6 space-y-3">
									<Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">When the report is ready...</Label>
									<div className="flex flex-col gap-3">
										<button
											onClick={() => setDeliveryMode("prompt")}
											className={`flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${
												deliveryMode === "prompt"
													? "border-[#0EA5E9] bg-[#0EA5E9]/5"
													: "border-slate-200 dark:border-white/10 hover:border-slate-300"
											}`}>
											<div className={`w-4 h-4 mt-0.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${deliveryMode === "prompt" ? "border-[#0EA5E9]" : "border-slate-300 dark:border-slate-600"}`}>
												{deliveryMode === "prompt" && <div className="w-2 h-2 rounded-full bg-[#0EA5E9]" />}
											</div>
											<div>
												<p className={`text-sm font-semibold ${deliveryMode === "prompt" ? "text-[#0EA5E9]" : "text-slate-700 dark:text-slate-300"}`}>
													Prompt me to download
												</p>
												<p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
													Show a download prompt the next time you open the web app.
												</p>
											</div>
										</button>
										<button
											onClick={() => setDeliveryMode("auto")}
											className={`flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${
												deliveryMode === "auto"
													? "border-[#0EA5E9] bg-[#0EA5E9]/5"
													: "border-slate-200 dark:border-white/10 hover:border-slate-300"
											}`}>
											<div className={`w-4 h-4 mt-0.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${deliveryMode === "auto" ? "border-[#0EA5E9]" : "border-slate-300 dark:border-slate-600"}`}>
												{deliveryMode === "auto" && <div className="w-2 h-2 rounded-full bg-[#0EA5E9]" />}
											</div>
											<div>
												<p className={`text-sm font-semibold ${deliveryMode === "auto" ? "text-[#0EA5E9]" : "text-slate-700 dark:text-slate-300"}`}>
													Auto-generate and notify me
												</p>
												<p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
													Automatically generate the report and show a notification in-app when it's ready.
												</p>
											</div>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
