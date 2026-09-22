"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Database, Download, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { AdminOnly } from "../_components/settings-shell";
import {
	EmptyState,
	Notice,
	PageHeader,
	Panel,
	Section,
	btnGhost,
	btnPrimary,
	td,
	th,
	PAGE_TABLE,
} from "../_components/settings-ui";
import { cn } from "@/lib/utils";

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

const KIND_LABEL: Record<string, string> = {
	crime_data: "Crime Data",
	report: "Report",
	scheduled_export: "Scheduled",
};

function formatFileSize(bytes: number) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatWhen(iso: string) {
	return new Date(iso).toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
	});
}

export default function BackupsPage() {
	return (
		<AdminOnly>
			<Backups />
		</AdminOnly>
	);
}

function Backups() {
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
				setSuccess(
					`Snapshot archived — ${data.data.rowCount ?? 0} incidents, ${formatFileSize(data.data.sizeBytes)}`
				);
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
		<div className={cn(PAGE_TABLE, "space-y-10")}>
			<PageHeader title="Backups" />

			<Section
				title="Retained Archive"
				description="Snapshots and reports kept on the server, so nothing depends on a copy sitting on one machine."
				actions={
					<>
						<button onClick={load} className={btnGhost}>
							<RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
							Refresh
						</button>
						<button onClick={createCrimeDataBackup} disabled={creating} className={btnPrimary}>
							{creating ? (
								<Loader2 className="h-3.5 w-3.5 animate-spin" />
							) : (
								<Database className="h-3.5 w-3.5" />
							)}
							{creating ? "Building snapshot" : "Back Up Crime Data"}
						</button>
					</>
				}
			>
				<div className="space-y-3">
					{error && (
						<Notice tone="error" icon={<AlertCircle className="h-4 w-4" />}>
							{error}
						</Notice>
					)}
					{success && (
						<Notice tone="success" icon={<CheckCircle2 className="h-4 w-4" />}>
							{success}
						</Notice>
					)}

					<Panel>
						<div className="overflow-x-auto">
							<table className="w-full min-w-[760px] text-left">
								<thead>
									<tr className="border-b border-slate-200 dark:border-white/[0.07]">
										<th className={th}>Type</th>
										<th className={th}>File</th>
										<th className={th}>Scope</th>
										<th className={cn(th, "text-right")}>Size</th>
										<th className={th}>Created</th>
										<th className={th}>
											<span className="sr-only">Actions</span>
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-200 dark:divide-white/[0.07]">
									{loading ? (
										Array.from({ length: 4 }).map((_, i) => (
											<tr key={i} aria-hidden="true">
												<td colSpan={6} className="px-4 py-3">
													<div className="h-[11px] w-full rounded-full bg-slate-100 dark:bg-white/[0.06]" />
												</td>
											</tr>
										))
									) : backups.length === 0 ? (
										<tr>
											<td colSpan={6}>
												<EmptyState
													title="Nothing archived yet"
													hint="Back up the crime data above, or save a report from the Reports page."
												/>
											</td>
										</tr>
									) : (
										backups.map((backup) => (
											<tr
												key={backup.id}
												className="transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.02]"
											>
												<td className={td}>
													<span className="text-[12.5px] text-slate-500 dark:text-slate-400">
														{KIND_LABEL[backup.kind] ?? KIND_LABEL.crime_data}
													</span>
												</td>
												<td className={td}>
													<div
														className="max-w-[260px] truncate font-medium text-slate-900 dark:text-white"
														title={backup.fileName}
													>
														{backup.fileName}
													</div>
													{backup.rowCount !== null && (
														<div className="mt-0.5 text-[12.5px] tabular-nums text-slate-500 dark:text-slate-400">
															{backup.rowCount.toLocaleString()} incidents
														</div>
													)}
												</td>
												<td className={td}>
													<div className="max-w-[200px] truncate">{backup.label || "—"}</div>
													{backup.periodLabel && (
														<div className="mt-0.5 text-[12.5px] text-slate-500 dark:text-slate-400">
															{backup.periodLabel}
														</div>
													)}
												</td>
												<td className={cn(td, "text-right tabular-nums whitespace-nowrap")}>
													{formatFileSize(backup.sizeBytes)}
												</td>
												<td className={td}>
													<div className="whitespace-nowrap tabular-nums">
														{formatWhen(backup.createdAt)}
													</div>
													<div className="mt-0.5 font-mono text-[12px] text-slate-500 dark:text-slate-400">
														{backup.createdBy}
													</div>
												</td>
												<td className={cn(td, "text-right")}>
													<div className="flex justify-end gap-0.5">
														<a
															href={`/api/backups/${backup.id}`}
															title="Download a copy"
															className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#0369A1] dark:hover:bg-white/[0.06] dark:hover:text-[#7DD3FC]"
														>
															<Download className="h-4 w-4" />
															<span className="sr-only">Download {backup.fileName}</span>
														</a>
														<button
															onClick={() => removeBackup(backup)}
															disabled={deletingId === backup.id}
															title="Delete from the archive"
															className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-600 disabled:opacity-40 dark:hover:bg-white/[0.06] dark:hover:text-red-400"
														>
															{deletingId === backup.id ? (
																<Loader2 className="h-4 w-4 animate-spin" />
															) : (
																<Trash2 className="h-4 w-4" />
															)}
															<span className="sr-only">Delete {backup.fileName}</span>
														</button>
													</div>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>

						{backups.length > 0 && (
							<div className="flex items-center justify-between border-t border-slate-200 px-4 py-2.5 text-[12.5px] text-slate-500 dark:border-white/[0.07] dark:text-slate-400">
								<span className="tabular-nums">
									{backups.length} archived {backups.length === 1 ? "file" : "files"}
								</span>
								<span className="tabular-nums">{formatFileSize(totalBytes)} retained</span>
							</div>
						)}
					</Panel>
				</div>
			</Section>
		</div>
	);
}
