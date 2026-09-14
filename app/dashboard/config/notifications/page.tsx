"use client";

import React, { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { AdminOnly } from "../_components/settings-shell";
import {
	EmptyState,
	Field,
	PageHeader,
	Row,
	Rows,
	SaveState,
	Section,
	SkeletonRows,
	btnGhost,
	btnPrimary,
	inputBase,
} from "../_components/settings-ui";
import { cn } from "@/lib/utils";

interface NotificationRule {
	id: string;
	ruleKey: string;
	name: string;
	description: string | null;
	category: "PEAK_HOUR" | "CRIME_ACTIVITY" | "DATASET_PROCESSING" | "SYSTEM";
	conditionType: string;
	parameters: Record<string, unknown>;
	severity: "INFO" | "WARNING" | "CRITICAL";
	isEnabled: boolean;
	updatedAt: string;
}

interface RuleParamField {
	key: string;
	label: string;
	min: number;
	max: number;
	fallback: number;
	unit?: string;
	hint?: string;
}

const RULE_PARAMS: Record<string, RuleParamField[]> = {
	RULE_PEAK_HOUR_SURGE: [
		{
			key: "densityThresholdPercent",
			label: "Concentration",
			min: 10,
			max: 80,
			fallback: 30,
			unit: "%",
			hint: "Share of batch records landing in the temporal window",
		},
		{ key: "windowSpanHours", label: "Window span", min: 1, max: 6, fallback: 3, unit: "hrs" },
	],
	RULE_BARANGAY_VOLUME_SURGE: [
		{
			key: "surgeThresholdPercent",
			label: "Above average",
			min: 15,
			max: 200,
			fallback: 35,
			unit: "%",
			hint: "Percentage increase above the batch average per barangay",
		},
		{
			key: "minBarangayIncidents",
			label: "Minimum incidents",
			min: 3,
			max: 50,
			fallback: 6,
			hint: "Minimum incidents required to classify as a surge",
		},
	],
	RULE_OFFENSE_CLUSTER_SPIKE: [
		{ key: "thresholdCount", label: "Offense count threshold", min: 5, max: 100, fallback: 15 },
	],
};

const SEVERITY_OPTIONS = [
	{ value: "INFO", label: "INFO (Notice Only)" },
	{ value: "WARNING", label: "WARNING (Operational Attention)" },
	{ value: "CRITICAL", label: "CRITICAL (Immediate Action)" },
] as const;

const GENERAL_ALERTS = [
	{
		key: "uploads" as const,
		label: "Failed Dataset Upload Alerts",
		description:
			"Trigger an immediate notification if any bulk dataset upload encounters validation errors.",
	},
	{
		key: "heinous" as const,
		label: "Critical & Heinous Crime Alerts",
		description:
			"Emit priority alerts when newly uploaded records contain offenses flagged as Heinous.",
	},
	{
		key: "sensational" as const,
		label: "Sensational Incident Alerts",
		description:
			"Emit priority warnings when newly uploaded records contain sensational crime incidents.",
	},
];

export default function NotificationsPage() {
	return (
		<AdminOnly>
			<NotificationSettings />
		</AdminOnly>
	);
}

function NotificationSettings() {
	const { user } = useAuth();
	const isAdmin =
		user?.permissions?.includes("admin_operational_officer") ||
		user?.permissions?.includes("admin");

	const [general, setGeneral] = useState({ uploads: true, heinous: true, sensational: true });
	const [defaultDateRange, setDefaultDateRange] = useState("last30");
	const [generalState, setGeneralState] = useState<"idle" | "saving" | "saved" | "error">("idle");

	const [rules, setRules] = useState<NotificationRule[]>([]);
	const [rulesStatus, setRulesStatus] = useState<"initial" | "ready" | "error">("initial");
	const [savingRuleId, setSavingRuleId] = useState<string | null>(null);
	const [rowState, setRowState] = useState<Record<string, { msg: string; isError?: boolean }>>({});
	const [drafts, setDrafts] = useState<Record<string, string>>({});

	const fetchRules = useCallback(async () => {
		try {
			const res = await fetch("/api/notifications/rules");
			if (!res.ok) throw new Error("Request failed");
			const data = await res.json();
			if (!data.success) throw new Error(data.error || "Request failed");
			setRules(data.data || []);
			setRulesStatus("ready");
		} catch (err) {
			console.warn("Failed to fetch notification rules:", err);
			setRulesStatus("error");
		}
	}, []);

	useEffect(() => {
		fetchRules();
	}, [fetchRules]);

	const handleUpdateRule = async (ruleId: string, updates: Partial<NotificationRule>) => {
		if (!isAdmin) return;
		if (savingRuleId === ruleId) return;
		const previous = rules.find((r) => r.id === ruleId);
		if (!previous) return;

		setRules((prev) => prev.map((r) => (r.id === ruleId ? { ...r, ...updates } : r)));
		setSavingRuleId(ruleId);
		setRowState((prev) => ({ ...prev, [ruleId]: { msg: "Saving changes..." } }));

		try {
			const res = await fetch(`/api/notifications/rules/${ruleId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(updates),
			});
			if (!res.ok) throw new Error("Update was rejected");
			const data = await res.json();
			if (!data.success) throw new Error(data.error || "Update was rejected");

			setRules((prev) => prev.map((r) => (r.id === ruleId ? { ...r, ...data.data } : r)));
			setRowState((prev) => ({ ...prev, [ruleId]: { msg: "Saved" } }));
			setTimeout(() => {
				setRowState((prev) => {
					if (prev[ruleId]?.msg !== "Saved") return prev;
					const next = { ...prev };
					delete next[ruleId];
					return next;
				});
			}, 2500);
		} catch (err) {
			setRules((prev) => prev.map((r) => (r.id === ruleId ? previous : r)));
			setRowState((prev) => ({
				...prev,
				[ruleId]: { msg: err instanceof Error ? err.message : "Update failed", isError: true },
			}));
		} finally {
			setSavingRuleId(null);
		}
	};

	const commitParam = (rule: NotificationRule, field: RuleParamField, raw: string) => {
		const draftKey = `${rule.id}:${field.key}`;
		setDrafts((prev) => {
			const next = { ...prev };
			delete next[draftKey];
			return next;
		});

		const current = Number(rule.parameters?.[field.key] ?? field.fallback);
		const parsed = Number.parseInt(raw, 10);
		if (Number.isNaN(parsed) || parsed === current) return;

		if (parsed < field.min || parsed > field.max) {
			setRowState((prev) => ({
				...prev,
				[rule.id]: {
					msg: `${field.label} must be between ${field.min} and ${field.max}${
						field.unit ? ` ${field.unit}` : ""
					}. Kept ${current}.`,
					isError: true,
				},
			}));
			return;
		}

		handleUpdateRule(rule.id, { parameters: { ...rule.parameters, [field.key]: parsed } });
	};

	const handleSaveGeneral = () => {
		setGeneralState("saving");
		setTimeout(() => {
			setGeneralState("saved");
			setTimeout(() => setGeneralState((s) => (s === "saved" ? "idle" : s)), 3000);
		}, 300);
	};

	const activeRules = rules.filter((r) => r.isEnabled).length;

	return (
		<div className="max-w-[860px] space-y-12">
			<PageHeader
				title="Notification & Alert Engine"
				description="Configure post-ingestion analytical triggers, mathematical detection thresholds, and in-app alerts."
				actions={
					<>
						<SaveState state={generalState} labels={{ saved: "Preferences saved" }} />
						<button onClick={handleSaveGeneral} className={btnPrimary}>
							Save Preferences
						</button>
					</>
				}
			/>

			<Section
				title="Analytical Rule Engine"
				description="Automated conditions evaluated across crime datasets upon CSV/Excel upload."
				actions={
					rules.length > 0 ? (
						<span className="text-[13px] tabular-nums text-slate-500 dark:text-slate-400">
							{activeRules} of {rules.length} Rules Active
						</span>
					) : null
				}
			>
				{rulesStatus === "initial" ? (
					<SkeletonRows count={3} />
				) : rulesStatus === "error" ? (
					<div className="border-y border-slate-200 dark:border-white/[0.07]">
						<EmptyState
							title="Notification rules could not be synchronized from the server."
							action={
								<button onClick={fetchRules} className={btnGhost}>
									<RefreshCw className="h-3.5 w-3.5" /> Try Again
								</button>
							}
						/>
					</div>
				) : rules.length === 0 ? (
					<div className="border-y border-slate-200 dark:border-white/[0.07]">
						<EmptyState title="No notification rules found." />
					</div>
				) : (
					<Rows>
						{rules.map((rule) => {
							const fields = RULE_PARAMS[rule.ruleKey] ?? [];
							const row = rowState[rule.id];
							const isSaving = savingRuleId === rule.id;

							return (
								<div key={rule.id} className="py-5">
									<div className="flex items-start justify-between gap-6">
										<div className="min-w-0">
											<div className="flex flex-wrap items-center gap-x-2 gap-y-1">
												<h3 className="text-[14px] font-medium text-slate-900 dark:text-slate-100">
													{rule.name}
												</h3>
												<code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11.5px] text-slate-500 dark:bg-white/[0.07] dark:text-slate-400">
													{rule.ruleKey}
												</code>
											</div>
											{rule.description && (
												<p className="mt-1 max-w-[62ch] text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
													{rule.description}
												</p>
											)}
										</div>
										<Switch
											checked={rule.isEnabled}
											disabled={!isAdmin || isSaving}
											aria-label={`Enable ${rule.name}`}
											onCheckedChange={(val) => handleUpdateRule(rule.id, { isEnabled: val })}
										/>
									</div>

									<div className="mt-4 flex flex-wrap items-end gap-x-5 gap-y-4">
										<div className="space-y-1.5">
											<label className="block text-[12.5px] text-slate-500 dark:text-slate-400">
												Severity Level
											</label>
											<Select
												value={rule.severity}
												disabled={!isAdmin || isSaving}
												onValueChange={(val) =>
													handleUpdateRule(rule.id, {
														severity: val as NotificationRule["severity"],
													})
												}
											>
												<SelectTrigger className="h-8 w-48 border-slate-200 bg-white text-[13px] dark:border-white/[0.12] dark:bg-white/[0.03]">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{SEVERITY_OPTIONS.map((opt) => (
														<SelectItem key={opt.value} value={opt.value} className="text-[13px]">
															{opt.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										{fields.map((field) => {
											const draftKey = `${rule.id}:${field.key}`;
											const stored = String(rule.parameters?.[field.key] ?? field.fallback);
											const inputId = `param-${draftKey}`;

											return (
												<div key={field.key} className="space-y-1.5">
													<label
														htmlFor={inputId}
														title={field.hint}
														className="block text-[12.5px] text-slate-500 dark:text-slate-400"
													>
														{field.label}{" "}
														<span className="text-slate-500 dark:text-slate-400">
															({field.min}–{field.max}
															{field.unit ? ` ${field.unit}` : ""})
														</span>
													</label>
													<div className="flex items-center gap-1.5">
														<input
															id={inputId}
															type="number"
															min={field.min}
															max={field.max}
															value={drafts[draftKey] ?? stored}
															disabled={!isAdmin || isSaving}
															onChange={(e) =>
																setDrafts((prev) => ({ ...prev, [draftKey]: e.target.value }))
															}
															onBlur={(e) => commitParam(rule, field, e.target.value)}
															onKeyDown={(e) => {
																if (e.key === "Enter") {
																	e.preventDefault();
																	e.currentTarget.blur();
																}
															}}
															className={cn(inputBase, "h-8 w-[76px] tabular-nums disabled:opacity-50")}
														/>
														{field.unit && (
															<span className="text-[12.5px] text-slate-500 dark:text-slate-400">
																{field.unit}
															</span>
														)}
													</div>
												</div>
											);
										})}

										{row?.msg && (
											<p
												aria-live="polite"
												className={`pb-1.5 text-[12.5px] ${
													row.isError
														? "text-red-600 dark:text-red-400"
														: "text-emerald-600 dark:text-emerald-400"
												}`}
											>
												{row.msg}
											</p>
										)}
									</div>
								</div>
							);
						})}
					</Rows>
				)}
			</Section>

			<Section
				title="System Alerts & Delivery"
				description="Control prompt alerts and instant triggers for priority incidents."
			>
				<Rows>
					{GENERAL_ALERTS.map((alert) => (
						<Row
							key={alert.key}
							label={alert.label}
							description={alert.description}
							htmlFor={`alert-${alert.key}`}
						>
							<Switch
								id={`alert-${alert.key}`}
								checked={general[alert.key]}
								onCheckedChange={(val) => setGeneral((prev) => ({ ...prev, [alert.key]: val }))}
							/>
						</Row>
					))}
				</Rows>
			</Section>

			<Section
				title="Default Temporal Scope"
				description="Set the default timeframe when navigating to analytics and map overviews."
			>
				<div className="border-t border-slate-200 pt-5 dark:border-white/[0.07]">
					<Field label="Initial Date Filter Range" htmlFor="default-range">
						<div className="max-w-[380px]">
							<Select value={defaultDateRange} onValueChange={setDefaultDateRange}>
								<SelectTrigger
									id="default-range"
									className="h-9 border-slate-200 bg-white text-[14px] dark:border-white/[0.12] dark:bg-white/[0.03]"
								>
									<SelectValue placeholder="Select date range" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="today">Today</SelectItem>
									<SelectItem value="last7">Last 7 Days</SelectItem>
									<SelectItem value="last30">Last 30 Days</SelectItem>
									<SelectItem value="thisQuarter">This Quarter</SelectItem>
									<SelectItem value="thisYear">Current Year</SelectItem>
									<SelectItem value="all">All Available Records</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</Field>
				</div>
			</Section>
		</div>
	);
}
