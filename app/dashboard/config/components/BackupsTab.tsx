"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
	AlertCircle,
	Archive,
	CheckCircle2,
	Database,
	Download,
	FileSpreadsheet,
	FileText,
	HardDrive,
	Loader2,
	RefreshCw,
	Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Backup {
	id: string;
	kind: string;
	fileName: string;
	mimeType: string;
	sizeBytes: number;
	label: string | null;
	barangay: string | null;
	periodLabel: string | null;
	rowCount: number | null;
	createdBy: string;
	createdAt: string;
}

const KIND_META: Record<string, { label: string; icon: React.ElementType; tone: string }> = {
	crime_data: {
		label: "Crime Data",
		icon: FileSpreadsheet,
		tone: "bg-sky-50 text-[#0284C7] border-sky-200 dark:bg-[#0EA5E9]/10 dark:text-[#38BDF8] dark:border-[#0EA5E9]/20",
	},
	report: {
		label: "Report",
		icon: FileText,
		tone: "bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
	},
	scheduled_export: {
		label: "Scheduled",
		icon: Archive,
		tone: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
	},
};

function formatFileSize(bytes: number) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatWhen(iso: string) {
	const date = new Date(iso);
	return date.toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
	});
}

export default function BackupsTab() {
	const [backups, setBackups] = useState<Backup[]>([]);
	const [loading, setLoading] = useState(true);
	const [creating, setCreating] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const load = useCallback(async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/backups");
			const data = await res.json();
			if (res.ok && data.success) setBackups(data.data);
			else setError(data.error || "Failed to load backups");
		} catch {
			setError("Failed to load backups");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		load();
	}, [load]);

	const createCrimeDataBackup = async () => {
		if (creating) return;
		setCreating(true);
		setError("");
		setSuccess("");
		try {
			const res = await fetch("/api/backups", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({}),
			});
			const data = await res.json();
			if (res.ok && data.success) {
				setSuccess(`Snapshot archived — ${data.data.rowCount ?? 0} incidents, ${formatFileSize(data.data.sizeBytes)}`);
				load();
			} else setError(data.error || "Failed to create the snapshot");
		} catch {
			setError("Failed to create the snapshot");
		} finally {
			setCreating(false);
		}
	};

	const removeBackup = async (backup: Backup) => {
		setDeletingId(backup.id);
		setError("");
		setSuccess("");
		try {
			const res = await fetch(`/api/backups/${backup.id}`, { method: "DELETE" });
			const data = await res.json();
			if (res.ok && data.success) {
				setSuccess(`Deleted ${backup.fileName}`);
				setBackups((prev) => prev.filter((item) => item.id !== backup.id));
			} else setError(data.error || "Failed to delete the backup");
		} catch {
			setError("Failed to delete the backup");
		} finally {
			setDeletingId(null);
		}
	};

	const totalBytes = backups.reduce((sum, backup) => sum + backup.sizeBytes, 0);

	return (
		<div className="flex flex-col items-center w-full h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="w-full max-w-4xl flex flex-col gap-8 pb-12">
				{/* Header */}
				<div className="flex justify-between items-end pb-4">
					<div className="space-y-1">
						<h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Backups</h2>
					</div>
				</div>

				<div className="space-y-4">
					<div className="flex justify-between items-end gap-4">
						<div className="space-y-1">
							<h3 className="text-lg font-bold text-slate-900 dark:text-white">Retained Archive</h3>
							<p className="text-sm text-slate-500 dark:text-slate-400">
								Snapshots and reports kept on the server, so nothing depends on a copy sitting on one machine.
							</p>
						</div>
						<div className="flex items-center gap-2 shrink-0">
							<Button
								variant="outline"
								onClick={load}
								className="gap-2 h-11 rounded-xl font-semibold border-slate-200 dark:border-white/10">
								<RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
								Refresh
							</Button>
							<Button
								onClick={createCrimeDataBackup}
								disabled={creating}
								className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 gap-2 h-11 rounded-xl font-semibold">
								{creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
								{creating ? "Building snapshot" : "Back Up Crime Data"}
							</Button>
						</div>
					</div>

					{error && (
						<div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center gap-3">
							<AlertCircle className="h-5 w-5 shrink-0" /> {error}
						</div>
					)}
					{success && (
						<div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-3">
							<CheckCircle2 className="h-5 w-5 shrink-0" /> {success}
						</div>
					)}

					{/* Archive table */}
					<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
						<table className="w-full text-left">
							<thead>
								<tr className="bg-slate-50 dark:bg-slate-950/50">
									{["Type", "File", "Scope", "Size", "Created", ""].map((heading) => (
										<th
											key={heading}
											className="px-5 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-white/5">
											{heading}
										</th>
									))}
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100 dark:divide-white/5">
								{loading ? (
									<tr>
										<td colSpan={6} className="px-6 py-12 text-center text-slate-500">
											<div className="flex flex-col items-center gap-3">
												<RefreshCw className="h-6 w-6 animate-spin" />
												<span>Reading the archive...</span>
											</div>
										</td>
									</tr>
								) : backups.length === 0 ? (
									<tr>
										<td colSpan={6} className="px-6 py-12 text-center text-slate-500">
											<div className="flex flex-col items-center gap-2">
												<HardDrive className="h-6 w-6 text-slate-400" />
												<span className="text-sm">Nothing archived yet</span>
												<span className="text-xs text-slate-400 dark:text-slate-500">
													Back up the crime data above, or save a report from the Reports page.
												</span>
											</div>
										</td>
									</tr>
								) : (
									backups.map((backup) => {
										const meta = KIND_META[backup.kind] ?? KIND_META.crime_data;
										const KindIcon = meta.icon;
										return (
											<tr
												key={backup.id}
												className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
												<td className="px-5 py-4">
													<span
														className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-tight border ${meta.tone}`}>
														<KindIcon className="h-3 w-3" />
														{meta.label}
													</span>
												</td>
												<td className="px-5 py-4">
													<div className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[240px]" title={backup.fileName}>
														{backup.fileName}
													</div>
													{backup.rowCount !== null && (
														<div className="text-xs text-slate-400 dark:text-slate-500 tabular-nums">
															{backup.rowCount.toLocaleString()} incidents
														</div>
													)}
												</td>
												<td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
													<div>{backup.label || "—"}</div>
													{backup.periodLabel && (
														<div className="text-xs text-slate-400 dark:text-slate-500">{backup.periodLabel}</div>
													)}
												</td>
												<td className="px-5 py-4 text-sm tabular-nums text-slate-600 dark:text-slate-300">
													{formatFileSize(backup.sizeBytes)}
												</td>
												<td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
													<div>{formatWhen(backup.createdAt)}</div>
													<div className="text-xs text-slate-400 dark:text-slate-500 font-mono">{backup.createdBy}</div>
												</td>
												<td className="px-5 py-4 text-right">
													<div className="flex justify-end gap-1">
														<a
															href={`/api/backups/${backup.id}`}
															title="Download a copy"
															className="p-2 rounded-lg transition-all text-slate-400 hover:text-[#0EA5E9] hover:bg-[#0EA5E9]/10">
															<Download className="h-4 w-4" />
														</a>
														<button
															onClick={() => removeBackup(backup)}
															disabled={deletingId === backup.id}
															title="Delete from the archive"
															className="p-2 rounded-lg transition-all text-slate-400 hover:text-red-500 hover:bg-red-500/10 disabled:opacity-40">
															{deletingId === backup.id ? (
																<Loader2 className="h-4 w-4 animate-spin" />
															) : (
																<Trash2 className="h-4 w-4" />
															)}
														</button>
													</div>
												</td>
											</tr>
										);
									})
								)}
							</tbody>
						</table>

						{backups.length > 0 && (
							<div className="px-5 py-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
								<span className="text-xs font-medium text-slate-500 dark:text-slate-400">
									{backups.length} archived {backups.length === 1 ? "file" : "files"}
								</span>
								<span className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums">
									{formatFileSize(totalBytes)} retained
								</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
