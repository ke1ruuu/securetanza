"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
	CheckCircle2,
	XCircle,
	AlertCircle,
	FileSpreadsheet,
	Download,
	RefreshCw,
	X,
	Clock,
	User,
	Info,
	Hash,
	Shield,
	Database,
	ArrowUpFromLine,
	Eye,
	KeyRound,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Search,
} from "lucide-react";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

/* ─────────────────────── Types ─────────────────────── */

interface ImportLog {
	id: string;
	fileName: string;
	fileSize: number;
	recordsImported: number;
	status: string;
	errorMessage?: string;
	importedBy?: string;
	importedAt: string;
}

type ActionType = "Auth" | "Import" | "Read" | "Export" | "Settings";
type AuditFilter = "All" | ActionType;

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

const ACTION_META: Record<ActionType, { color: string; icon: React.ReactNode; label: string }> = {
	Auth:     { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",  icon: <KeyRound        className="h-3 w-3" />, label: "Auth"     },
	Import:   { color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300",              icon: <Database        className="h-3 w-3" />, label: "Import"   },
	Read:     { color: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300",      icon: <Eye             className="h-3 w-3" />, label: "Read"     },
	Export:   { color: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",          icon: <Download        className="h-3 w-3" />, label: "Export"   },
	Settings: { color: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300",              icon: <Shield          className="h-3 w-3" />, label: "Settings" },
};

const SEVERITY_COLOR: Record<string, string> = {
	low:    "text-emerald-600 dark:text-emerald-400",
	medium: "text-amber-600 dark:text-amber-400",
	high:   "text-red-600 dark:text-red-400",
};

const OUTCOME_META: Record<string, { color: string; icon: React.ReactNode }> = {
	success: { color: "text-emerald-600 dark:text-emerald-400", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
	failure: { color: "text-red-600 dark:text-red-400",         icon: <XCircle      className="h-3.5 w-3.5" /> },
	warning: { color: "text-amber-600 dark:text-amber-400",     icon: <AlertCircle  className="h-3.5 w-3.5" /> },
};

function formatTimeAgo(dateString: string) {
	const date = new Date(dateString);
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
	
	if (diffInSeconds < 60) return 'Just now';
	const diffInMinutes = Math.floor(diffInSeconds / 60);
	if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
	const diffInHours = Math.floor(diffInMinutes / 60);
	if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
	const diffInDays = Math.floor(diffInHours / 24);
	return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
}

/* ─────────────────────── Helpers ─────────────────────── */

function formatFileSize(bytes: number) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ─────────────────────── AuditCard ─────────────────────── */

interface AuditCardProps {
	log: UnifiedLog;
	pinned?: boolean;
	onClose?: () => void;
	style?: React.CSSProperties;
}

function AuditCard({ log, pinned, onClose, style }: AuditCardProps) {
	const meta    = ACTION_META[log.action];
	const outcome = OUTCOME_META[log.outcome];

	return (
		<div
			className={`
				z-[9999] w-80 rounded-2xl border shadow-2xl
				bg-white/95 dark:bg-slate-900/95 backdrop-blur-md
				border-slate-200 dark:border-white/10
				text-slate-800 dark:text-white
				${pinned ? "ring-2 ring-blue-500/40" : ""}
			`}
			style={style}
			{...pinned ? {
				onWheel: (e: React.WheelEvent<HTMLDivElement>) => {
					const el = e.currentTarget;
					const body = el.querySelector(".card-body") as HTMLElement | null;
					if (!body) return;
					const atTop    = body.scrollTop === 0 && e.deltaY < 0;
					const atBottom = body.scrollTop + body.clientHeight >= body.scrollHeight - 1 && e.deltaY > 0;
					if (atTop || atBottom) {
						// No more content to scroll inside card — pass wheel to page
						const page = document.querySelector("[data-scroll]") ?? document.documentElement;
						page.scrollTop += e.deltaY;
					}
				},
			} : {}}
		>
			{/* Header */}
			<div className="flex items-start justify-between px-4 pt-4 pb-3 border-b border-slate-100 dark:border-white/5">
				<div className="flex items-center gap-2.5">
					<div className={`p-1.5 rounded-lg ${meta.color}`}>
						{React.cloneElement(meta.icon as React.ReactElement<{ className?: string }>, { className: "h-3.5 w-3.5" })}
					</div>
					<div>
						<div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-none mb-0.5">Audit Trail</div>
						<div className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{log.action} Event</div>
					</div>
				</div>
				{pinned && (
					<button
						onClick={onClose}
						className="ml-2 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
					>
						<X className="h-3.5 w-3.5" />
					</button>
				)}
			</div>

			{/* Body — max height so it never clips the viewport; scrolls internally if needed */}
			<div className="card-body px-4 py-3 space-y-2.5 max-h-[260px] overflow-y-auto overscroll-contain">
				<div className="text-sm text-slate-700 dark:text-slate-300 leading-snug">{log.details}</div>

				<div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1">
					<AuditField icon={<User  className="h-3 w-3" />} label="User"       value={log.user}    />
					<AuditField icon={<Clock className="h-3 w-3" />} label="Time"       value={log.time}    />
					<AuditField icon={<Info  className="h-3 w-3" />} label="IP Address" value={log.ip}      />
					<AuditField icon={<Hash  className="h-3 w-3" />} label="Session"    value={log.session} mono />
					<AuditField icon={<Shield className="h-3 w-3" />} label="Severity"
						value={<span className={`font-semibold ${SEVERITY_COLOR[log.severity]}`}>{log.severity.toUpperCase()}</span>}
					/>
					<AuditField icon={outcome.icon} label="Outcome"
						value={<span className={`font-semibold ${outcome.color}`}>{log.outcome}</span>}
					/>
				</div>

				{log.resource && (
					<div className="pt-1">
						<p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">Resource</p>
						<code className="text-xs font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded">
							{log.resource}
						</code>
					</div>
				)}

				{(log.fileName || log.errorMessage) && (
					<div className="pt-1 border-t border-slate-100 dark:border-white/5 space-y-1.5">
						{log.fileName && (
							<>
								<p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Import Details</p>
								<div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
									<AuditField icon={<FileSpreadsheet className="h-3 w-3" />} label="File"    value={log.fileName} />
									{log.fileSize      !== undefined && <AuditField icon={<Database    className="h-3 w-3" />} label="Size"    value={formatFileSize(log.fileSize)} />}
									{log.recordsImported !== undefined && <AuditField icon={<CheckCircle2 className="h-3 w-3" />} label="Records" value={log.recordsImported.toLocaleString()} />}
								</div>
							</>
						)}
						{log.errorMessage && (
							<div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-2">
								<p className="text-[10px] font-semibold uppercase tracking-wider text-red-500 mb-0.5">Error</p>
								<p className="text-xs text-red-700 dark:text-red-400 leading-snug">{log.errorMessage}</p>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Footer */}
			<div className="px-4 py-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
				<span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">#{log.id.toString()}</span>
				{pinned
					? <span className="text-[10px] text-blue-500 dark:text-blue-400 font-medium">Pinned · click × to close</span>
					: <span className="text-[10px] text-slate-400 dark:text-slate-500">Click row to pin</span>
				}
			</div>
		</div>
	);
}

function AuditField({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: React.ReactNode; mono?: boolean }) {
	return (
		<div>
			<p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5 flex items-center gap-1">
				{icon}{label}
			</p>
			<p className={`text-xs text-slate-700 dark:text-slate-300 truncate ${mono ? "font-mono" : ""}`}>
				{value}
			</p>
		</div>
	);
}

/* ─────────────────────── Log Row ─────────────────────── */

interface RowProps {
	log: UnifiedLog;
	onHover: (log: UnifiedLog | null) => void;
	onPin: (log: UnifiedLog, e: React.MouseEvent) => void;
	pinnedId: number | null;
}

function LogRow({ log, onHover, onPin, pinnedId }: RowProps) {
	const meta    = ACTION_META[log.action];
	const outcome = OUTCOME_META[log.outcome];

	return (
		<tr
			className={`
				group cursor-pointer transition-colors
				${pinnedId === log.id
					? "bg-blue-50/70 dark:bg-blue-500/[0.06]"
					: "hover:bg-slate-50/60 dark:hover:bg-white/[0.02]"}
			`}
			onMouseEnter={() => onHover(log)}
			onMouseLeave={() => onHover(null)}
			onClick={(e) => onPin(log, e)}
		>
			<td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">{log.user}</td>
			<td className="px-5 py-3.5">
				<span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${meta.color}`}>
					{React.cloneElement(meta.icon as React.ReactElement<{ className?: string }>, { className: "h-3 w-3" })}
					{meta.label}
				</span>
			</td>
			<td className="px-5 py-3.5 text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap font-mono">
				#{log.id.toString().substring(0, 8)}...
			</td>
			<td className="px-5 py-3.5 text-sm font-medium text-slate-900 dark:text-white max-w-xs">
				<div className="truncate">{log.details}</div>
				{log.errorMessage && <div className="text-xs text-red-500 mt-0.5 truncate">{log.errorMessage}</div>}
			</td>
			<td className="px-5 py-3.5">
				<span className={`inline-flex items-center gap-1 text-xs font-semibold ${outcome.color}`}>
					{outcome.icon}
					<span className="capitalize">{log.outcome}</span>
				</span>
			</td>
			<td className="px-5 py-3.5">
				<span className={`text-xs font-bold uppercase ${SEVERITY_COLOR[log.severity]}`}>{log.severity}</span>
			</td>
			<td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">{log.time}</td>
		</tr>
	);
}

/* ─────────────────────── Main Tab ─────────────────────── */

export default function AuditLogsTab() {
	const [unifiedLogs, setUnifiedLogs] = useState<UnifiedLog[]>([]);
	const [logsLoading, setLogsLoading] = useState(false);
	const [totalLogs,   setTotalLogs]   = useState(0);
	const [activeFilter, setActiveFilter] = useState<AuditFilter>("All");
	const [searchQuery, setSearchQuery] = useState("");

	const [currentPage, setCurrentPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const [hoveredLog, setHoveredLog] = useState<UnifiedLog | null>(null);
	const [pinnedLog,  setPinnedLog]  = useState<UnifiedLog | null>(null);
	const [pinnedPos,  setPinnedPos]  = useState({ x: 0, y: 0 });

	// Track real cursor position via native listener — bypasses React batching/stale-closure issues
	const mousePosRef = useRef({ x: 0, y: 0 });
	const [, forceHoverRender] = useState(0); // tiny counter just to trigger re-render on mousemove

	const tableRef = useRef<HTMLDivElement>(null);

	/* native mousemove — always accurate */
	useEffect(() => {
		function onMove(e: MouseEvent) {
			mousePosRef.current = { x: e.clientX, y: e.clientY };
			// only trigger a re-render when a hover card is actually visible
			setHoveredLog((prev) => { if (prev) forceHoverRender((n) => n + 1); return prev; });
		}
		document.addEventListener("mousemove", onMove);
		return () => document.removeEventListener("mousemove", onMove);
	}, []);

	/* ── API ── */
	const loadLogs = async () => {
		setLogsLoading(true);
		try {
			// Fetch audit logs
			const auditRes = await fetch("/api/audit-logs?limit=500");
			const auditData = await auditRes.json();
			if (auditData.success) {
				const formattedLogs = auditData.data.map((log: any) => ({
					...log,
					time: formatTimeAgo(log.createdAt || log.time)
				}));
				setUnifiedLogs(formattedLogs);
				setTotalLogs(auditData.meta.total);
			}
		} catch (e) { console.error("Error loading logs:", e); }
		finally { setLogsLoading(false); }
	};

	useEffect(() => { loadLogs(); }, []);

	/* ── Derived stats ── */
	const importLogs = unifiedLogs.filter((l) => l.action === "Import");
	const successCount = importLogs.filter((l) => l.outcome === "success").length;
	const totalRecords = importLogs.reduce((sum, l) => sum + (l.recordsImported || 0), 0);

	const importCount  = unifiedLogs.filter((l) => l.action === "Import").length;
	const failureCount = unifiedLogs.filter((l) => l.outcome === "failure").length;
	const highSevCount = unifiedLogs.filter((l) => l.severity === "high").length;

	/* ── Filtered logs ── */
	let filteredLogs =
		activeFilter === "All"
			? unifiedLogs
			: unifiedLogs.filter((l) => l.action === activeFilter);

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
	const paginatedLogs = filteredLogs.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

	/* ── Card positioning ── */
	const CARD_W  = 320;
	const CARD_H  = 360; // header ~65 + body max 260 + footer ~40
	const GAP     = 14;   // gap between cursor and card edge
	const MARGIN  = 20;   // min distance from any viewport edge (absorbs scrollbar ~17px)

	function getCardStyle(fixedPos?: { x: number; y: number }): React.CSSProperties {
		if (typeof window === "undefined") return { position: "fixed", left: 0, top: 0, zIndex: 50 };
		const pos = fixedPos ?? mousePosRef.current;
		const vw  = window.innerWidth;
		const vh  = window.innerHeight;

		// Prefer right of cursor; flip left if right side would overflow
		let left = (pos.x + GAP + CARD_W > vw - MARGIN)
			? pos.x - CARD_W - GAP
			: pos.x + GAP;

		// Prefer below cursor; flip up if bottom would overflow
		let top = (pos.y + GAP + CARD_H > vh - MARGIN)
			? vh - CARD_H - MARGIN
			: pos.y + GAP;

		// Hard clamp — card can NEVER escape viewport regardless of cursor position
		left = Math.max(MARGIN, Math.min(left, vw - CARD_W - MARGIN));
		top  = Math.max(MARGIN, Math.min(top,  vh - CARD_H - MARGIN));

		return { position: "fixed", left, top, zIndex: 50 };
	}

	/* ── Hover handlers ── */
	function handleHover(log: UnifiedLog | null) {
		setHoveredLog(log);
	}

	function handlePin(log: UnifiedLog, e: React.MouseEvent) {
		e.stopPropagation();
		if (pinnedLog?.id === log.id) { setPinnedLog(null); }
		else { setPinnedLog(log); setPinnedPos({ x: e.clientX, y: e.clientY }); setHoveredLog(null); }
	}

	/* Close pinned on outside click */
	useEffect(() => {
		function onDocClick(e: MouseEvent) {
			if (tableRef.current && !tableRef.current.contains(e.target as Node)) setPinnedLog(null);
		}
		document.addEventListener("mousedown", onDocClick);
		return () => document.removeEventListener("mousedown", onDocClick);
	}, []);

	return (
		<div className="flex flex-col items-center w-full h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="w-full max-w-5xl flex flex-col gap-10 pb-12">

				{/* ── Header ── */}
				<div className="pb-2">
					<h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Audit Logs</h2>
					<p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
						Unified record of all system activity, data imports, and administrative events.
					</p>
				</div>

				{/* ── Summary Cards ── */}
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
					{[
						{ icon: <Shield      className="h-5 w-5 text-blue-500"   />, bg: "bg-blue-100 dark:bg-blue-500/10",   value: unifiedLogs.length, label: "Total Events"  },
						{ icon: <Database    className="h-5 w-5 text-cyan-500"   />, bg: "bg-cyan-100 dark:bg-cyan-500/10",   value: importCount,              label: "Data Imports"  },
						{ icon: <XCircle     className="h-5 w-5 text-red-500"    />, bg: "bg-red-100 dark:bg-red-500/10",     value: failureCount,             label: "Failures"      },
						{ icon: <AlertCircle className="h-5 w-5 text-amber-500"  />, bg: "bg-amber-100 dark:bg-amber-500/10", value: highSevCount,             label: "High Severity" },
					].map(({ icon, bg, value, label }) => (
						<div key={label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-4 shadow-sm flex items-center gap-3">
							<div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${bg}`}>{icon}</div>
							<div>
								<div className="text-xl font-bold text-slate-900 dark:text-white">{value}</div>
								<div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">{label}</div>
							</div>
						</div>
					))}
				</div>

				{/* ── Unified Activity + Import History Table ── */}
				<div className="space-y-3" ref={tableRef}>
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<h3 className="text-lg font-bold text-slate-900 dark:text-white">Activity &amp; Import History</h3>
							<p className="text-sm text-slate-500 dark:text-slate-400">
								Hover a row to preview the audit trail — click to pin the card.
							</p>
						</div>
						<button
							onClick={loadLogs}
							className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
						>
							<RefreshCw className={`h-4 w-4 ${logsLoading ? "animate-spin" : ""}`} /> Refresh
						</button>
					</div>

					{/* Filter bar & Search */}
					<div className="flex flex-col sm:flex-row gap-3 justify-between">
						<div className="flex gap-1.5 flex-wrap">
							{AUDIT_FILTERS.map((filter) => (
								<button
									key={filter}
									onClick={() => {
										setActiveFilter(filter);
										setCurrentPage(1);
									}}
									className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
										activeFilter === filter
											? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
											: "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
									}`}
								>
									{filter}
								</button>
							))}
						</div>
						<div className="relative w-full sm:w-64 flex-shrink-0">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Search className="h-4 w-4 text-slate-400" />
							</div>
							<Input
								type="text"
								placeholder="Search logs..."
								value={searchQuery}
								onChange={(e) => {
									setSearchQuery(e.target.value);
									setCurrentPage(1);
								}}
								className="pl-9 h-9 text-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10"
							/>
						</div>
					</div>

					{/* Table */}
					<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-slate-50 dark:bg-slate-950/50">
									<tr>
										{["User", "Action", "ID", "Details", "Outcome", "Severity", "Time"].map((h) => (
											<th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-white/5">
												{h}
											</th>
										))}
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100 dark:divide-white/5">
									{paginatedLogs.length === 0 ? (
										<tr>
											<td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">
												No {activeFilter} events found.
											</td>
										</tr>
									) : paginatedLogs.map((log) => (
										<LogRow
											key={log.id}
											log={log}
											onHover={handleHover}
											onPin={handlePin}
											pinnedId={pinnedLog?.id ?? null}
										/>
									))}
								</tbody>
							</table>
						</div>

						{/* ── Pagination Footer ── */}
						<div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50">
							<div className="text-sm text-slate-500 dark:text-slate-400">
								{filteredLogs.length > 0 ? (
									<>
										{Math.min((currentPage - 1) * rowsPerPage + 1, filteredLogs.length)} to {Math.min(currentPage * rowsPerPage, filteredLogs.length)} of {filteredLogs.length} row(s) selected.
									</>
								) : (
									"0 row(s) selected."
								)}
							</div>
							<div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-300">
								<div className="flex items-center gap-2">
									<span className="text-slate-500 dark:text-slate-400">Rows per page</span>
									<Select
										value={rowsPerPage.toString()}
										onValueChange={(val) => {
											setRowsPerPage(Number(val));
											setCurrentPage(1);
										}}
									>
										<SelectTrigger className="w-[70px] h-8 text-xs bg-transparent border-slate-300 dark:border-white/20">
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
								<div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
									Page {currentPage} of {Math.max(1, totalPages)}
								</div>
								<div className="flex items-center gap-1">
									<Pagination className="mx-0 w-auto">
										<PaginationContent>
											<PaginationItem>
												<PaginationLink
													href="#"
													onClick={(e) => { e.preventDefault(); setCurrentPage(1); }}
													className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
												>
													<ChevronsLeft className="h-4 w-4" />
												</PaginationLink>
											</PaginationItem>
											<PaginationItem>
												<PaginationPrevious
													href="#"
													onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)); }}
													className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
													text=""
												/>
											</PaginationItem>
											<PaginationItem>
												<PaginationNext
													href="#"
													onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1)); }}
													className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
													text=""
												/>
											</PaginationItem>
											<PaginationItem>
												<PaginationLink
													href="#"
													onClick={(e) => { e.preventDefault(); setCurrentPage(totalPages); }}
													className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
												>
													<ChevronsRight className="h-4 w-4" />
												</PaginationLink>
											</PaginationItem>
										</PaginationContent>
									</Pagination>
								</div>
							</div>
						</div>
					</div>
				</div>

	

			</div>

			{/* ── Hover tooltip — portaled to body to escape any CSS transform context ── */}
			{hoveredLog && !pinnedLog && typeof document !== "undefined" && createPortal(
				<div style={getCardStyle()} className="pointer-events-none">
					<AuditCard log={hoveredLog} />
				</div>,
				document.body
			)}

			{/* ── Pinned card — portaled to body, closes on × or outside-table click ── */}
			{pinnedLog && typeof document !== "undefined" && createPortal(
				<AuditCard
					log={pinnedLog}
					pinned
					onClose={() => setPinnedLog(null)}
					style={getCardStyle(pinnedPos)}
				/>,
				document.body
			)}
		</div>
	);
}
