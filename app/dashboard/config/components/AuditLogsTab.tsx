"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, FileSpreadsheet, Download, RefreshCw } from "lucide-react";

interface UploadLog {
	id: string;
	fileName: string;
	fileSize: number;
	recordsImported: number;
	status: string;
	errorMessage?: string;
	uploadedBy?: string;
	uploadedAt: string;
}

type AuditFilter = "All" | "Upload" | "Read" | "Export" | "Settings";

const AUDIT_FILTERS: AuditFilter[] = ["All", "Upload", "Read", "Export", "Settings"];

const ACTION_COLORS: Record<string, string> = {
	Upload:   "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
	Read:     "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300",
	Export:   "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
	Settings: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300",
};

const MOCK_AUDIT_LOGS = [
	{ id: 1, action: "Settings", details: "Changed default landing page to Dashboard",     user: "jdoe (Admin)",          time: "10 mins ago" },
	{ id: 2, action: "Export",   details: "Exported 500 incident records (CSV)",            user: "psmith (Officer)",       time: "1 hour ago"  },
	{ id: 3, action: "Upload",   details: "Imported incident_batch_0825.csv",               user: "jdoe (Admin)",          time: "3 hours ago" },
	{ id: 4, action: "Read",     details: "Viewed restricted Heinous Crime Case #45021",    user: "ajackson (Investigator)", time: "5 hours ago" },
	{ id: 5, action: "Settings", details: "Updated 2FA security requirements",              user: "jdoe (Admin)",          time: "1 day ago"   },
];

export default function AuditLogsTab() {
	const [logs, setLogs] = useState<UploadLog[]>([]);
	const [logsLoading, setLogsLoading] = useState(false);
	const [totalLogs, setTotalLogs] = useState(0);
	const [activeFilter, setActiveFilter] = useState<AuditFilter>("All");

	const loadLogs = async () => {
		setLogsLoading(true);
		try {
			const response = await fetch("/api/upload-logs?limit=100");
			const data = await response.json();
			if (data.success) {
				setLogs(data.logs);
				setTotalLogs(data.total);
			}
		} catch (error) {
			console.error("Error loading upload logs:", error);
		} finally {
			setLogsLoading(false);
		}
	};

	useEffect(() => { loadLogs(); }, []);

	const formatDate = (dateString: string) =>
		new Intl.DateTimeFormat("en-US", {
			month: "short", day: "numeric", year: "numeric",
			hour: "2-digit", minute: "2-digit", hour12: true,
		}).format(new Date(dateString));

	const formatFileSize = (bytes: number) => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "success": return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
			case "failed":  return <XCircle      className="h-5 w-5 text-red-500" />;
			case "partial": return <AlertCircle  className="h-5 w-5 text-amber-500" />;
			default:        return <FileSpreadsheet className="h-5 w-5 text-slate-400" />;
		}
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "success": return "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-300";
			case "failed":  return "bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-300";
			case "partial": return "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-300";
			default:        return "bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-500/10 dark:border-slate-500/20 dark:text-slate-300";
		}
	};

	const filteredAuditLogs = activeFilter === "All"
		? MOCK_AUDIT_LOGS
		: MOCK_AUDIT_LOGS.filter(l => l.action === activeFilter);

	const successCount = logs.filter(l => l.status === "success").length;
	const totalRecords = logs.reduce((sum, l) => sum + l.recordsImported, 0);

	return (
		<div className="flex flex-col items-center w-full h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="w-full max-w-4xl flex flex-col gap-12 pb-12">

				{/* ── Header ── */}
				<div className="pb-4">
					<h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Audit Logs</h2>
				</div>

				{/* ── System Activity ── */}
				<div className="space-y-4">
					<div className="space-y-1">
						<h3 className="text-lg font-bold text-slate-900 dark:text-white">System Activity</h3>
						<p className="text-sm text-slate-500 dark:text-slate-400">Historical record of administrative and data access events.</p>
					</div>

					<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
						{/* Filter bar */}
						<div className="px-4 pt-4 pb-3 border-b border-slate-200 dark:border-white/5 flex gap-1.5">
							{AUDIT_FILTERS.map(filter => (
								<button
									key={filter}
									onClick={() => setActiveFilter(filter)}
									className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
										activeFilter === filter
											? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
											: "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
									}`}>
									{filter}
								</button>
							))}
						</div>

						<table className="w-full">
							<thead className="bg-slate-50 dark:bg-slate-950/50">
								<tr>
									{["Action", "Details", "User", "Time"].map(h => (
										<th key={h} className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-white/5">
											{h}
										</th>
									))}
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100 dark:divide-white/5">
								{filteredAuditLogs.length === 0 ? (
									<tr>
										<td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-400">No {activeFilter} events found.</td>
									</tr>
								) : filteredAuditLogs.map(log => (
									<tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
										<td className="px-6 py-4">
											<span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${ACTION_COLORS[log.action] ?? ACTION_COLORS.Settings}`}>
												{log.action}
											</span>
										</td>
										<td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{log.details}</td>
										<td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{log.user}</td>
										<td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">{log.time}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/* ── Data Import History ── */}
				<div className="space-y-4">
					<div className="flex justify-between items-end">
						<div className="space-y-1">
							<h3 className="text-lg font-bold text-slate-900 dark:text-white">Data Import History</h3>
							<p className="text-sm text-slate-500 dark:text-slate-400">Summary of recent batch uploads and their success rate.</p>
						</div>
						<button
							onClick={loadLogs}
							className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
							<RefreshCw className={`h-4 w-4 ${logsLoading ? "animate-spin" : ""}`} /> Refresh
						</button>
					</div>

					{/* Stat cards */}
					<div className="grid grid-cols-3 gap-4">
						{[
							{ icon: <FileSpreadsheet className="h-6 w-6 text-blue-500" />,    bg: "bg-blue-100 dark:bg-blue-500/10",    value: totalLogs,    label: "Total Uploads" },
							{ icon: <CheckCircle2    className="h-6 w-6 text-emerald-500" />, bg: "bg-emerald-100 dark:bg-emerald-500/10", value: successCount, label: "Successful"    },
							{ icon: <Download        className="h-6 w-6 text-purple-500" />,  bg: "bg-purple-100 dark:bg-purple-500/10",  value: totalRecords.toLocaleString(), label: "Total Records" },
						].map(({ icon, bg, value, label }) => (
							<div key={label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-5 shadow-sm flex items-center gap-4">
								<div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>{icon}</div>
								<div>
									<div className="text-2xl font-bold text-slate-900 dark:text-white">{logsLoading ? "—" : value}</div>
									<div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-0.5">{label}</div>
								</div>
							</div>
						))}
					</div>

					{/* Upload log table */}
					<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-slate-50 dark:bg-slate-950/50">
									<tr>
										{["File Name", "Size", "Records", "Status", "Uploaded At"].map(h => (
											<th key={h} className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-white/5">
												{h}
											</th>
										))}
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100 dark:divide-white/5">
									{logsLoading ? (
										[...Array(3)].map((_, i) => (
											<tr key={i}>
												{[...Array(5)].map((__, j) => (
													<td key={j} className="px-6 py-4">
														<div className="h-4 rounded bg-slate-100 dark:bg-white/5 animate-pulse w-full" />
													</td>
												))}
											</tr>
										))
									) : logs.length === 0 ? (
										<tr>
											<td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-400">No upload records found.</td>
										</tr>
									) : logs.map(log => (
										<tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
											<td className="px-6 py-4">
												<div className="flex items-center gap-3">
													{getStatusIcon(log.status)}
													<div>
														<div className="font-medium text-slate-900 dark:text-white">{log.fileName}</div>
														{log.errorMessage && (
															<div className="text-xs text-red-500 mt-0.5">{log.errorMessage}</div>
														)}
													</div>
												</div>
											</td>
											<td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{formatFileSize(log.fileSize)}</td>
											<td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{log.recordsImported.toLocaleString()}</td>
											<td className="px-6 py-4">
												<span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(log.status)}`}>
													{log.status}
												</span>
											</td>
											<td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">{formatDate(log.uploadedAt)}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>

			</div>
		</div>
	);
}
