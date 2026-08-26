"use client";

import React, { useState } from "react";
import { Bell, AlertTriangle, FileWarning, CalendarRange, CheckCircle2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function NotificationSettingsTab() {
	const [notifyUploads, setNotifyUploads] = useState(true);
	const [notifyHeinous, setNotifyHeinous] = useState(true);
	const [notifySensational, setNotifySensational] = useState(true);
	const [defaultDateRange, setDefaultDateRange] = useState("last7");
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
							Notification Settings
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
					{/* Alerts Section */}
					<div className="space-y-4">
						<div className="space-y-1">
							<h3 className="text-lg font-bold text-slate-900 dark:text-white">System Alerts</h3>
							<p className="text-sm text-slate-500 dark:text-slate-400">
								Choose which events trigger an immediate notification.
							</p>
						</div>

						{/* The Card */}
						<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
							<div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/5">
								<div className="flex items-center gap-4">
									<div className="space-y-0.5">
										<Label className="text-sm font-semibold text-slate-900 dark:text-white">Failed Data Uploads</Label>
										<p className="text-sm text-slate-500">
											Get notified immediately if a batch data import fails.
										</p>
									</div>
								</div>
								<Switch checked={notifyUploads} onCheckedChange={setNotifyUploads} />
							</div>

							<div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/5">
								<div className="flex items-center gap-4">
									<div className="space-y-0.5">
										<Label className="text-sm font-semibold text-slate-900 dark:text-white">New Heinous Crimes</Label>
										<p className="text-sm text-slate-500">
											Alert when an incident marked as "Heinous" is entered.
										</p>
									</div>
								</div>
								<Switch checked={notifyHeinous} onCheckedChange={setNotifyHeinous} />
							</div>

							<div className="flex items-center justify-between p-6">
								<div className="flex items-center gap-4">
									<div className="space-y-0.5">
										<Label className="text-sm font-semibold text-slate-900 dark:text-white">New Sensational Crimes</Label>
										<p className="text-sm text-slate-500">
											Alert when an incident marked as "Sensational" is entered.
										</p>
									</div>
								</div>
								<Switch checked={notifySensational} onCheckedChange={setNotifySensational} />
							</div>
						</div>
					</div>

					{/* Dashboard Default Config */}
					<div className="space-y-4">
						<div className="space-y-1">
							<h3 className="text-lg font-bold text-slate-900 dark:text-white">Dashboard Defaults</h3>
							<p className="text-sm text-slate-500 dark:text-slate-400">
								Set the default filters applied when you load the dashboard.
							</p>
						</div>

						{/* The Card */}
						<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
							<div className="max-w-md">
								<Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block">Default Date Range</Label>
								<Select value={defaultDateRange} onValueChange={setDefaultDateRange}>
									<SelectTrigger className="h-12 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
										<div className="flex items-center gap-2">
											<CalendarRange className="h-4 w-4 text-slate-400" />
											<SelectValue placeholder="Select date range" />
										</div>
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="today">Today</SelectItem>
										<SelectItem value="last7">Last 7 Days</SelectItem>
										<SelectItem value="last30">Last 30 Days</SelectItem>
										<SelectItem value="thisMonth">This Month</SelectItem>
										<SelectItem value="ytd">Year to Date</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
