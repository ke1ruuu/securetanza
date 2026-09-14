"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
	AlertCircle,
	CalendarDays,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Clock,
	Database,
	Download,
	Eye,
	FileSpreadsheet,
	Hash,
	Info,
	KeyRound,
	RefreshCw,
	Search,
	Shield,
	User,
	X,
	XCircle,
} from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { AdminOnly } from "../_components/settings-shell";
import {
	EmptyState,
	PageHeader,
	Panel,
	Section,
	btnGhost,
	inputBase,
	td,
	th,
} from "../_components/settings-ui";
import { cn } from "@/lib/utils";

/* ─────────────────────── Types ─────────────────────── */

type ActionType = "Auth" | "Import" | "Read" | "Export" | "Settings";
type AuditFilter = "All" | ActionType;
/** Set by the summary line; narrows on outcome or severity rather than action. */
type Focus = null | "failure" | "high";

interface UnifiedLog {
	id: string | number;
	action: ActionType;
	details: string;
	user: string;
	time: string;
	ip: string;
	session: string;
	resource: string;
	severity: "low" | "medium" | "high";
	outcome: "success" | "failure" | "warning";
	fileName?: string;
	fileSize?: number;
	recordsImported?: number;
	errorMessage?: string;
}

/* ─────────────────────── Constants ─────────────────────── */

const AUDIT_FILTERS: AuditFilter[] = ["All", "Auth", "Import", "Read", "Export", "Settings"];

/** Quick ranges offered beside the two date fields. `days` counts back from today, inclusive. */
const DATE_PRESETS: { key: string; label: string; days: number | null }[] = [
	{ key: "today", label: "Today", days: 1 },
	{ key: "7d", label: "7 days", days: 7 },
	{ key: "30d", label: "30 days", days: 30 },
	{ key: "all", label: "All time", days: null },
];

/** Date as the `<input type="date">` value in the viewer's own timezone. */
function toInputDate(date: Date) {
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${date.getFullYear()}-${month}-${day}`;
}

const ACTION_ICON: Record<ActionType, React.ReactNode> = {
	Auth: <KeyRound className="h-3.5 w-3.5" />,
	Import: <Database className="h-3.5 w-3.5" />,
	Read: <Eye className="h-3.5 w-3.5" />,
	Export: <Download className="h-3.5 w-3.5" />,
	Settings: <Shield className="h-3.5 w-3.5" />,
};

const SEVERITY_COLOR: Record<string, string> = {
	low: "text-slate-500 dark:text-slate-400",
	medium: "text-amber-600 dark:text-amber-400",
	high: "text-red-600 dark:text-red-400",
};

const OUTCOME_META: Record<string, { color: string; icon: React.ReactNode }> = {
	success: {
		color: "text-emerald-600 dark:text-emerald-400",
		icon: <CheckCircle2 className="h-3.5 w-3.5" />,
	},
	failure: { color: "text-red-600 dark:text-red-400", icon: <XCircle className="h-3.5 w-3.5" /> },
	warning: {
		color: "text-amber-600 dark:text-amber-400",
		icon: <AlertCircle className="h-3.5 w-3.5" />,
	},
};

function formatTimeAgo(dateString: string) {
	const date = new Date(dateString);
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (diffInSeconds < 60) return "Just now";
	const diffInMinutes = Math.floor(diffInSeconds / 60);
	if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
	const diffInHours = Math.floor(diffInMinutes / 60);
	if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
	const diffInDays = Math.floor(diffInHours / 24);
	return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
}

function formatFileSize(bytes: number) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AuditLogsPage() {
	return (
		<AdminOnly>
			<AuditLogs />
		</AdminOnly>
	);
}

function AuditLogs() {
	const [unifiedLogs, setUnifiedLogs] = useState<UnifiedLog[]>([]);
	const [logsLoading, setLogsLoading] = useState(false);
	const [activeFilter, setActiveFilter] = useState<AuditFilter>("All");
	const [focus, setFocus] = useState<Focus>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [dateFrom, setDateFrom] = useState("");
	const [dateTo, setDateTo] = useState("");
	const [activePreset, setActivePreset] = useState<string>("all");

	const [currentPage, setCurrentPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const [hoveredLog, setHoveredLog] = useState<UnifiedLog | null>(null);
	const [selectedLog, setSelectedLog] = useState<UnifiedLog | null>(null);

	// Track real cursor position via native listener — bypasses React batching/stale-closure issues
	const mousePosRef = useRef({ x: 0, y: 0 });
	const [, forceHoverRender] = useState(0);

	useEffect(() => {
		function onMove(e: MouseEvent) {
			mousePosRef.current = { x: e.clientX, y: e.clientY };
			setHoveredLog((prev) => {
				if (prev) forceHoverRender((n) => n + 1);
				return prev;
			});
		}
		document.addEventListener("mousemove", onMove);
		return () => document.removeEventListener("mousemove", onMove);
	}, []);

	// The range is filtered in the query rather than in the page, so a narrow window
	// reaches past the 500 most recent events instead of only searching within them.
	const loadLogs = useCallback(async () => {
		setLogsLoading(true);
		try {
			const params = new URLSearchParams({ limit: "500" });
			if (dateFrom) params.set("startDate", new Date(`${dateFrom}T00:00:00`).toISOString());
			if (dateTo) params.set("endDate", new Date(`${dateTo}T23:59:59.999`).toISOString());

			const auditRes = await fetch(`/api/audit-logs?${params.toString()}`);
			if (!auditRes.ok) return;
			const auditData = await auditRes.json();
			if (auditData.success) {
				const formattedLogs = auditData.data.map((log: UnifiedLog & { createdAt?: string }) => ({
					...log,
					time: formatTimeAgo(log.createdAt || log.time),
				}));
				setUnifiedLogs(formattedLogs);
			}
		} catch (e) {
			console.error("Error loading logs:", e);
		} finally {
			setLogsLoading(false);
		}
	}, [dateFrom, dateTo]);

	useEffect(() => {
		loadLogs();
	}, [loadLogs]);

	const applyPreset = (preset: { key: string; days: number | null }) => {
		if (preset.days === null) {
			setDateFrom("");
			setDateTo("");
		} else {
			const to = new Date();
			const from = new Date();
			from.setDate(from.getDate() - (preset.days - 1));
			setDateFrom(toInputDate(from));
			setDateTo(toInputDate(to));
		}
		setActivePreset(preset.key);
		setCurrentPage(1);
	};

	const setRangeEdge = (edge: "from" | "to", value: string) => {
		if (edge === "from") setDateFrom(value);
		else setDateTo(value);
		setActivePreset("custom");
		setCurrentPage(1);
	};

	const hasDateRange = Boolean(dateFrom || dateTo);

	/* ── Derived counts. These drive the summary line, which is also the filter. ── */
	const importCount = unifiedLogs.filter((l) => l.action === "Import").length;
	const failureCount = unifiedLogs.filter((l) => l.outcome === "failure").length;
	const highSevCount = unifiedLogs.filter((l) => l.severity === "high").length;

	/* ── Filtered logs ── */
	let filteredLogs =
		activeFilter === "All" ? unifiedLogs : unifiedLogs.filter((l) => l.action === activeFilter);

	if (focus === "failure") filteredLogs = filteredLogs.filter((l) => l.outcome === "failure");
	if (focus === "high") filteredLogs = filteredLogs.filter((l) => l.severity === "high");

	if (searchQuery.trim()) {
		const lowerQuery = searchQuery.toLowerCase();
		filteredLogs = filteredLogs.filter(
			(l) =>
				(l.user && l.user.toLowerCase().includes(lowerQuery)) ||
				(l.details && l.details.toLowerCase().includes(lowerQuery)) ||
				(l.ip && l.ip.toLowerCase().includes(lowerQuery)) ||
				(l.resource && l.resource.toLowerCase().includes(lowerQuery)) ||
				(l.action && l.action.toLowerCase().includes(lowerQuery))
		);
	}

	const totalPages = Math.ceil(filteredLogs.length / rowsPerPage);
	const paginatedLogs = filteredLogs.slice(
		(currentPage - 1) * rowsPerPage,
		currentPage * rowsPerPage
	);

	const selectAction = (filter: AuditFilter) => {
		setActiveFilter(filter);
		setFocus(null);
		setCurrentPage(1);
	};

	const selectFocus = (next: Focus, action: AuditFilter = "All") => {
		setActiveFilter(action);
		setFocus(next);
		setCurrentPage(1);
	};

	/* ── Hover card positioning ── */
	const CARD_W = 320;
	const CARD_H = 360;
	const GAP = 14;
	const MARGIN = 20;

	function getCardStyle(): React.CSSProperties {
		if (typeof window === "undefined") return { position: "fixed", left: 0, top: 0, zIndex: 50 };
		const pos = mousePosRef.current;
		const vw = window.innerWidth;
		const vh = window.innerHeight;

		let left = pos.x + GAP + CARD_W > vw - MARGIN ? pos.x - CARD_W - GAP : pos.x + GAP;
		let top = pos.y + GAP + CARD_H > vh - MARGIN ? vh - CARD_H - MARGIN : pos.y + GAP;

		left = Math.max(MARGIN, Math.min(left, vw - CARD_W - MARGIN));
		top = Math.max(MARGIN, Math.min(top, vh - CARD_H - MARGIN));

		return { position: "fixed", left, top, zIndex: 50 };
	}

	/* Prevent body scroll when modal open & handle Escape key */
	useEffect(() => {
		if (selectedLog) {
			document.body.style.overflow = "hidden";
			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.key === "Escape") setSelectedLog(null);
			};
			document.addEventListener("keydown", handleKeyDown);
			return () => {
				document.body.style.overflow = "";
				document.removeEventListener("keydown", handleKeyDown);
			};
		}
		document.body.style.overflow = "";
	}, [selectedLog]);

	return (
		<div className="max-w-[1040px] space-y-10">
			<PageHeader
				title="Audit Logs"
				description="Unified record of all system activity, data imports, and administrative events."
			/>

			{/* The summary line replaces four decorative metric tiles: same numbers,
			    but each segment narrows the table beneath it. */}
			<div className="flex flex-wrap items-center gap-x-1 gap-y-2 border-y border-slate-200 py-2.5 text-[13px] dark:border-white/[0.07]">
				<SummaryChip
					active={activeFilter === "All" && focus === null}
					count={unifiedLogs.length}
					label="events"
					onClick={() => selectAction("All")}
				/>
				<Dot />
				<SummaryChip
					active={activeFilter === "Import" && focus === null}
					count={importCount}
					label="imports"
					onClick={() => selectFocus(null, "Import")}
				/>
				<Dot />
				<SummaryChip
					active={focus === "failure"}
					count={failureCount}
					label="failures"
					tone={failureCount > 0 ? "danger" : undefined}
					onClick={() => selectFocus("failure")}
				/>
				<Dot />
				<SummaryChip
					active={focus === "high"}
					count={highSevCount}
					label="high severity"
					tone={highSevCount > 0 ? "warning" : undefined}
					onClick={() => selectFocus("high")}
				/>
				<button
					onClick={loadLogs}
					className={cn(btnGhost, "ml-auto h-7 px-2 text-[12.5px]")}
					title="Reload the audit trail"
				>
					<RefreshCw className={`h-3.5 w-3.5 ${logsLoading ? "animate-spin" : ""}`} /> Refresh
				</button>
			</div>

			<Section
				title="Activity & Import History"
				description="Hover a row for a quick preview — click to open detailed view."
			>
				<div className="space-y-3">
					{/* Action filter + search */}
					<div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex flex-wrap gap-1">
							{AUDIT_FILTERS.map((filter) => (
								<button
									key={filter}
									onClick={() => selectAction(filter)}
									aria-pressed={activeFilter === filter && focus === null}
									className={`h-7 rounded-md px-2.5 text-[12.5px] font-medium transition-colors ${
										activeFilter === filter && focus === null
											? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
											: "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
									}`}
								>
									{filter}
								</button>
							))}
						</div>
						<div className="relative w-full sm:w-56">
							<Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
							<input
								type="text"
								placeholder="Search logs..."
								aria-label="Search logs"
								value={searchQuery}
								onChange={(e) => {
									setSearchQuery(e.target.value);
									setCurrentPage(1);
								}}
								className={cn(inputBase, "h-8 pl-8 text-[13px]")}
							/>
						</div>
					</div>

					{/* Date range */}
					<div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex flex-wrap items-center gap-1.5">
							<CalendarDays className="h-3.5 w-3.5 shrink-0 text-slate-500 dark:text-slate-400" />
							<input
								type="date"
								aria-label="From date"
								value={dateFrom}
								max={dateTo || undefined}
								onChange={(e) => setRangeEdge("from", e.target.value)}
								className={cn(inputBase, "h-8 w-[148px] text-[13px] tabular-nums")}
							/>
							<span className="text-[13px] text-slate-500 dark:text-slate-400">to</span>
							<input
								type="date"
								aria-label="To date"
								value={dateTo}
								min={dateFrom || undefined}
								onChange={(e) => setRangeEdge("to", e.target.value)}
								className={cn(inputBase, "h-8 w-[148px] text-[13px] tabular-nums")}
							/>
							{hasDateRange && (
								<button
									onClick={() => applyPreset({ key: "all", days: null })}
									className={cn(btnGhost, "h-7 px-2 text-[12.5px]")}
								>
									<X className="h-3.5 w-3.5" /> Clear
								</button>
							)}
						</div>
						<div className="flex flex-wrap gap-1">
							{DATE_PRESETS.map((preset) => (
								<button
									key={preset.key}
									onClick={() => applyPreset(preset)}
									aria-pressed={activePreset === preset.key}
									className={`h-7 rounded-md px-2.5 text-[12.5px] font-medium transition-colors ${
										activePreset === preset.key
											? "bg-slate-100 text-slate-900 dark:bg-white/[0.09] dark:text-white"
											: "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
									}`}
								>
									{preset.label}
								</button>
							))}
						</div>
					</div>

					{/* Table */}
					<Panel>
						<div className="overflow-x-auto">
							<table className="w-full min-w-[860px]">
								<thead>
									<tr className="border-b border-slate-200 dark:border-white/[0.07]">
										<th className={th}>User</th>
										<th className={th}>Action</th>
										<th className={th}>ID</th>
										<th className={th}>Details</th>
										<th className={th}>Outcome</th>
										<th className={th}>Severity</th>
										<th className={th}>Time</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-200 dark:divide-white/[0.07]">
									{logsLoading && paginatedLogs.length === 0 ? (
										Array.from({ length: 6 }).map((_, i) => (
											<tr key={i} aria-hidden="true">
												<td colSpan={7} className="px-4 py-3">
													<div className="h-[11px] w-full rounded-full bg-slate-100 dark:bg-white/[0.06]" />
												</td>
											</tr>
										))
									) : paginatedLogs.length === 0 ? (
										<tr>
											<td colSpan={7}>
												<EmptyState
													title={`No ${activeFilter} events found${
														hasDateRange ? " in this date range" : ""
													}.`}
													hint={
														searchQuery || focus
															? "Try clearing the search or the active summary filter."
															: undefined
													}
												/>
											</td>
										</tr>
									) : (
										paginatedLogs.map((log) => (
											<LogRow
												key={log.id}
												log={log}
												onHover={setHoveredLog}
												onClick={(l) => {
													setSelectedLog(l);
													setHoveredLog(null);
												}}
											/>
										))
									)}
								</tbody>
							</table>
						</div>

						{/* Pagination */}
						<div className="flex flex-col gap-2.5 border-t border-slate-200 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.07]">
							<span className="text-[12.5px] tabular-nums text-slate-500 dark:text-slate-400">
								{filteredLogs.length > 0
									? `${Math.min((currentPage - 1) * rowsPerPage + 1, filteredLogs.length)} to ${Math.min(
											currentPage * rowsPerPage,
											filteredLogs.length
									  )} of ${filteredLogs.length} rows`
									: "0 rows"}
							</span>
							<div className="flex items-center gap-4">
								<div className="flex items-center gap-1.5">
									<span className="text-[12.5px] text-slate-500 dark:text-slate-400">
										Rows per page
									</span>
									<Select
										value={rowsPerPage.toString()}
										onValueChange={(val) => {
											setRowsPerPage(Number(val));
											setCurrentPage(1);
										}}
									>
										<SelectTrigger
											aria-label="Rows per page"
											className="h-7 w-[62px] border-slate-200 bg-transparent text-[12.5px] dark:border-white/[0.12]"
										>
											<SelectValue placeholder={rowsPerPage.toString()} />
										</SelectTrigger>
										<SelectContent>
											{[5, 10, 20, 50].map((size) => (
												<SelectItem key={size} value={size.toString()}>
													{size}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<span className="text-[12.5px] tabular-nums text-slate-500 dark:text-slate-400">
									Page {currentPage} of {Math.max(1, totalPages)}
								</span>
								<div className="flex items-center gap-0.5">
									<PageButton
										label="First page"
										disabled={currentPage === 1}
										onClick={() => setCurrentPage(1)}
									>
										<ChevronsLeft className="h-4 w-4" />
									</PageButton>
									<PageButton
										label="Previous page"
										disabled={currentPage === 1}
										onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
									>
										<ChevronLeft className="h-4 w-4" />
									</PageButton>
									<PageButton
										label="Next page"
										disabled={currentPage >= totalPages}
										onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
									>
										<ChevronRight className="h-4 w-4" />
									</PageButton>
									<PageButton
										label="Last page"
										disabled={currentPage >= totalPages}
										onClick={() => setCurrentPage(totalPages)}
									>
										<ChevronsRight className="h-4 w-4" />
									</PageButton>
								</div>
							</div>
						</div>
					</Panel>
				</div>
			</Section>

			{/* Hover preview — portaled to body to escape any CSS transform context */}
			{hoveredLog &&
				!selectedLog &&
				typeof document !== "undefined" &&
				createPortal(
					<div style={getCardStyle()} className="pointer-events-none">
						<AuditCard log={hoveredLog} />
					</div>,
					document.body
				)}

			{/* Detail */}
			{selectedLog && typeof document !== "undefined" && (
				<AuditDetail log={selectedLog} onClose={() => setSelectedLog(null)} />
			)}
		</div>
	);
}

/* ─────────────────────── Pieces ─────────────────────── */

function Dot() {
	return (
		<span aria-hidden="true" className="px-0.5 text-slate-300 dark:text-slate-600">
			·
		</span>
	);
}

function SummaryChip({
	count,
	label,
	active,
	tone,
	onClick,
}: {
	count: number;
	label: string;
	active: boolean;
	tone?: "danger" | "warning";
	onClick: () => void;
}) {
	const countColor =
		tone === "danger"
			? "text-red-600 dark:text-red-400"
			: tone === "warning"
			? "text-amber-600 dark:text-amber-400"
			: "text-slate-900 dark:text-white";

	return (
		<button
			onClick={onClick}
			aria-pressed={active}
			className={`rounded-md px-2 py-1 transition-colors ${
				active
					? "bg-slate-100 dark:bg-white/[0.09]"
					: "hover:bg-slate-100 dark:hover:bg-white/[0.06]"
			}`}
		>
			<span className={`font-medium tabular-nums ${countColor}`}>{count.toLocaleString()}</span>{" "}
			<span className="text-slate-500 dark:text-slate-400">{label}</span>
		</button>
	);
}

function PageButton({
	label,
	disabled,
	onClick,
	children,
}: {
	label: string;
	disabled: boolean;
	onClick: () => void;
	children: React.ReactNode;
}) {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			aria-label={label}
			className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-30 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
		>
			{children}
		</button>
	);
}

function LogRow({
	log,
	onHover,
	onClick,
}: {
	log: UnifiedLog;
	onHover: (log: UnifiedLog | null) => void;
	onClick: (log: UnifiedLog) => void;
}) {
	const outcome = OUTCOME_META[log.outcome] || {
		color: "text-slate-500 dark:text-slate-400",
		icon: <Info className="h-3.5 w-3.5" />,
	};

	return (
		<tr
			className="cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.02]"
			onMouseEnter={() => onHover(log)}
			onMouseLeave={() => onHover(null)}
			onClick={() => onClick(log)}
		>
			<td className={cn(td, "whitespace-nowrap")}>{log.user}</td>
			<td className={td}>
				<span className="inline-flex items-center gap-1.5 whitespace-nowrap text-slate-700 dark:text-slate-200">
					<span className="text-slate-500 dark:text-slate-400">
						{ACTION_ICON[log.action] ?? <Info className="h-3.5 w-3.5" />}
					</span>
					{log.action}
				</span>
			</td>
			<td className={cn(td, "font-mono text-[12px] whitespace-nowrap text-slate-500 dark:text-slate-400")}>
				#{log.id.toString().substring(0, 8)}
			</td>
			<td className={cn(td, "max-w-xs")}>
				<div className="truncate font-medium text-slate-900 dark:text-white">{log.details}</div>
				{log.errorMessage && (
					<div className="mt-0.5 truncate text-[12.5px] text-red-600 dark:text-red-400">
						{log.errorMessage}
					</div>
				)}
			</td>
			<td className={td}>
				<span className={`inline-flex items-center gap-1 whitespace-nowrap ${outcome.color}`}>
					{outcome.icon}
					<span className="capitalize">{log.outcome}</span>
				</span>
			</td>
			<td className={td}>
				<span className={`capitalize ${SEVERITY_COLOR[log.severity] || "text-slate-500"}`}>
					{log.severity || "Unknown"}
				</span>
			</td>
			<td className={cn(td, "whitespace-nowrap")}>{log.time}</td>
		</tr>
	);
}

function AuditCard({ log }: { log: UnifiedLog }) {
	const outcome = OUTCOME_META[log.outcome] || {
		color: "text-slate-500 dark:text-slate-400",
		icon: <Info className="h-3.5 w-3.5" />,
	};

	return (
		<div className="settings-surface w-80 rounded-[10px] border border-slate-200 bg-white text-slate-800 shadow-[0_12px_36px_-10px_rgba(15,23,42,0.3)] dark:border-white/[0.09] dark:bg-[#0F172A] dark:text-white dark:shadow-[0_12px_36px_-10px_rgba(0,0,0,0.75)]">
			<div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-white/[0.07]">
				<span className="text-slate-500 dark:text-slate-400">
					{ACTION_ICON[log.action] ?? <Info className="h-3.5 w-3.5" />}
				</span>
				<span className="text-[13px] font-medium text-slate-900 dark:text-white">
					{log.action} Event
				</span>
			</div>

			<div className="max-h-[260px] space-y-3 overflow-y-auto overscroll-contain px-4 py-3">
				<p className="text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">
					{log.details}
				</p>

				<div className="grid grid-cols-2 gap-x-4 gap-y-2">
					<AuditField icon={<User className="h-3 w-3" />} label="User" value={log.user} />
					<AuditField icon={<Clock className="h-3 w-3" />} label="Time" value={log.time} />
					<AuditField icon={<Info className="h-3 w-3" />} label="IP Address" value={log.ip} />
					<AuditField icon={<Hash className="h-3 w-3" />} label="Session" value={log.session} mono />
					<AuditField
						icon={<Shield className="h-3 w-3" />}
						label="Severity"
						value={
							<span className={`capitalize ${SEVERITY_COLOR[log.severity] || "text-slate-500"}`}>
								{log.severity || "Unknown"}
							</span>
						}
					/>
					<AuditField
						icon={outcome.icon}
						label="Outcome"
						value={<span className={`capitalize ${outcome.color}`}>{log.outcome}</span>}
					/>
				</div>

				{log.resource && (
					<div>
						<FieldLabel>Resource</FieldLabel>
						<code className="mt-0.5 block truncate font-mono text-[12px] text-[#0369A1] dark:text-[#7DD3FC]">
							{log.resource}
						</code>
					</div>
				)}

				{log.fileName && (
					<div className="border-t border-slate-200 pt-2.5 dark:border-white/[0.07]">
						<FieldLabel>Import Details</FieldLabel>
						<div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1.5">
							<AuditField
								icon={<FileSpreadsheet className="h-3 w-3" />}
								label="File"
								value={log.fileName}
							/>
							{log.fileSize !== undefined && (
								<AuditField
									icon={<Database className="h-3 w-3" />}
									label="Size"
									value={formatFileSize(log.fileSize)}
								/>
							)}
							{log.recordsImported !== undefined && (
								<AuditField
									icon={<CheckCircle2 className="h-3 w-3" />}
									label="Records"
									value={log.recordsImported.toLocaleString()}
								/>
							)}
						</div>
					</div>
				)}

				{log.errorMessage && (
					<div className="rounded-md border border-red-200 px-2.5 py-2 dark:border-red-500/25">
						<FieldLabel>Error</FieldLabel>
						<p className="mt-0.5 text-[12.5px] leading-relaxed text-red-700 dark:text-red-400">
							{log.errorMessage}
						</p>
					</div>
				)}
			</div>

			<div className="flex items-center justify-between border-t border-slate-200 px-4 py-2 text-[12px] text-slate-500 dark:border-white/[0.07] dark:text-slate-400">
				<span className="font-mono">#{log.id.toString()}</span>
				<span>Click row for details</span>
			</div>
		</div>
	);
}

function FieldLabel({ children }: { children: React.ReactNode }) {
	return (
		<p className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400">{children}</p>
	);
}

function AuditField({
	icon,
	label,
	value,
	mono,
}: {
	icon: React.ReactNode;
	label: string;
	value: React.ReactNode;
	mono?: boolean;
}) {
	return (
		<div className="min-w-0">
			<p className="flex items-center gap-1 text-[11.5px] font-medium text-slate-500 dark:text-slate-400">
				{icon}
				{label}
			</p>
			<p
				className={`mt-0.5 truncate text-[12.5px] text-slate-700 dark:text-slate-300 ${
					mono ? "font-mono" : ""
				}`}
			>
				{value}
			</p>
		</div>
	);
}

function AuditDetail({ log, onClose }: { log: UnifiedLog; onClose: () => void }) {
	const outcome = OUTCOME_META[log.outcome] || {
		color: "text-slate-500 dark:text-slate-400",
		icon: <Info className="h-3.5 w-3.5" />,
	};

	return createPortal(
		<div
			className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px] dark:bg-black/60"
			onClick={onClose}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-label={`${log.action} event detail`}
				onClick={(e) => e.stopPropagation()}
				className="settings-surface settings-dialog flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-[10px] border border-slate-200 bg-white shadow-[0_16px_48px_-12px_rgba(15,23,42,0.28)] dark:border-white/[0.09] dark:bg-[#0F172A] dark:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.7)]"
			>
				<div className="flex flex-none items-start justify-between gap-4 border-b border-slate-200 px-6 py-4 dark:border-white/[0.07]">
					<div className="flex items-center gap-2.5">
						<span className="text-slate-500 dark:text-slate-400">
							{ACTION_ICON[log.action] ?? <Info className="h-4 w-4" />}
						</span>
						<div>
							<h2 className="text-[15px] font-semibold tracking-[-0.008em] text-slate-900 dark:text-white">
								{log.action} Event
							</h2>
							<p className="mt-0.5 text-[13px] text-slate-500 dark:text-slate-400">
								Detailed audit log record
							</p>
						</div>
					</div>
					<button
						onClick={onClose}
						aria-label="Close"
						className="-mt-1 -mr-1 inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/[0.06] dark:hover:text-slate-200"
					>
						<X className="h-4 w-4" />
					</button>
				</div>

				<div className="settings-scroll flex-1 space-y-6 overflow-y-auto overscroll-contain px-6 py-5">
					<p className="text-[15px] leading-relaxed text-slate-800 dark:text-slate-200">
						{log.details}
					</p>

					<dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-y border-slate-200 py-4 sm:grid-cols-3 dark:border-white/[0.07]">
						<DetailField label="User" value={log.user} />
						<DetailField label="Time" value={log.time} />
						<DetailField label="IP Address" value={log.ip} />
						<DetailField label="Session" value={log.session} mono />
						<DetailField
							label="Severity"
							value={
								<span className={`capitalize ${SEVERITY_COLOR[log.severity]}`}>{log.severity}</span>
							}
						/>
						<DetailField
							label="Outcome"
							value={
								<span className={`inline-flex items-center gap-1 capitalize ${outcome.color}`}>
									{outcome.icon}
									{log.outcome}
								</span>
							}
						/>
					</dl>

					{log.resource && (
						<div>
							<FieldLabel>Target Resource</FieldLabel>
							<code className="mt-1 block font-mono text-[13px] break-all text-[#0369A1] dark:text-[#7DD3FC]">
								{log.resource}
							</code>
						</div>
					)}

					{log.fileName && (
						<div>
							<FieldLabel>Import Statistics</FieldLabel>
							<dl className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
								<DetailField label="File Name" value={log.fileName} />
								{log.fileSize !== undefined && (
									<DetailField label="File Size" value={formatFileSize(log.fileSize)} />
								)}
								{log.recordsImported !== undefined && (
									<DetailField label="Records" value={log.recordsImported.toLocaleString()} />
								)}
							</dl>
						</div>
					)}

					{log.errorMessage && (
						<div className="rounded-md border border-red-200 px-4 py-3 dark:border-red-500/25">
							<p className="flex items-center gap-1.5 text-[11.5px] font-medium text-red-600 dark:text-red-400">
								<AlertCircle className="h-3.5 w-3.5" /> Error Details
							</p>
							<p className="mt-1.5 text-[13px] leading-relaxed whitespace-pre-wrap text-red-700 dark:text-red-400">
								{log.errorMessage}
							</p>
						</div>
					)}
				</div>

				<div className="flex flex-none items-center justify-between border-t border-slate-200 px-6 py-3 dark:border-white/[0.07]">
					<span className="font-mono text-[12px] text-slate-500 dark:text-slate-400">
						#{log.id.toString()}
					</span>
					<button
						onClick={onClose}
						className="inline-flex h-8 items-center rounded-md bg-slate-900 px-3 text-[13px] font-medium text-white transition-colors hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
					>
						Close
					</button>
				</div>
			</div>
		</div>,
		document.body
	);
}

function DetailField({
	label,
	value,
	mono,
}: {
	label: string;
	value: React.ReactNode;
	mono?: boolean;
}) {
	return (
		<div className="min-w-0">
			<dt className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400">{label}</dt>
			<dd
				className={`mt-1 truncate text-[13px] text-slate-800 dark:text-slate-200 ${
					mono ? "font-mono text-[12.5px]" : ""
				}`}
				title={typeof value === "string" ? value : undefined}
			>
				{value}
			</dd>
		</div>
	);
}
