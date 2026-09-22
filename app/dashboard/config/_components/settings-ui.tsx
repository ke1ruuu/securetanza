"use client";

import React from "react";

/* ─────────────────────────────────────────────────────────────
   Settings primitives.

   The settings surface is one continuous document, not a tray of
   cards. Hierarchy is carried by type scale, hairline rules, and
   whitespace. A border appears only where something is genuinely a
   unit: an input, a picker tile, a table, a modal.
   ───────────────────────────────────────────────────────────── */

/* Page widths. Form pages stay one readable column below xl. From xl each
   Section becomes a two-pane row: its title and description on the left, its
   controls on the right at a comfortable width — so the page fills the screen
   with structure instead of stretching controls across it. Table pages simply
   use the room. Content is centred so wide screens get even margins. */
export const PAGE_FORM = "mx-auto w-full max-w-[720px] xl:max-w-[1040px]";
export const PAGE_TABLE = "mx-auto w-full max-w-[1360px]";

const SplitContext = React.createContext(false);

/** Wrap a form page's Sections in this to get the two-pane rows from xl up. */
export function SplitLayout({ children }: { children: React.ReactNode }) {
  return (
    <SplitContext.Provider value={true}>
      <div className="space-y-12 xl:space-y-10">{children}</div>
    </SplitContext.Provider>
  );
}

export const LINE = "border-slate-200 dark:border-white/[0.07]";
export const DIVIDE = "divide-slate-200 dark:divide-white/[0.07]";

/** Page title. One per route — the header bar never competes with it. */
export function PageHeader({
	title,
	description,
	actions,
}: {
	title: string;
	description?: string;
	actions?: React.ReactNode;
}) {
	return (
		<header className="flex items-start justify-between gap-6 pb-1">
			<div className="min-w-0">
				<h1 className="text-xl font-semibold tracking-[-0.011em] text-slate-900 dark:text-white">
					{title}
				</h1>
				{description && (
					<p className="mt-1.5 max-w-[68ch] text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
						{description}
					</p>
				)}
			</div>
			{actions && <div className="flex shrink-0 items-center gap-2 pt-0.5">{actions}</div>}
		</header>
	);
}

/** A titled block of the document. Two-pane inside a SplitLayout (from xl). */
export function Section({
	title,
	description,
	actions,
	children,
}: {
	title: string;
	description?: string;
	actions?: React.ReactNode;
	children: React.ReactNode;
}) {
	const split = React.useContext(SplitContext);

	const heading = (
		<div className="min-w-0">
			<h2 className="text-[14px] font-semibold tracking-[-0.006em] text-slate-900 dark:text-white">
				{title}
			</h2>
			{description && (
				<p className="mt-1 max-w-[68ch] text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
					{description}
				</p>
			)}
		</div>
	);

	if (split) {
		return (
			<section
				className={`scroll-mt-8 xl:grid xl:grid-cols-[minmax(220px,280px)_minmax(0,1fr)] xl:gap-x-14 xl:[&:not(:first-child)]:border-t xl:[&:not(:first-child)]:pt-10 ${LINE}`}
			>
				<div className="pb-3 xl:pb-0">
					{heading}
					{actions && <div className="mt-3 flex items-center gap-2">{actions}</div>}
				</div>
				<div className="min-w-0">{children}</div>
			</section>
		);
	}

	return (
		<section className="scroll-mt-8">
			<div className="flex items-end justify-between gap-4 pb-3">
				{heading}
				{actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
			</div>
			{children}
		</section>
	);
}

/** Rule-bounded group of rows. Terminated top and bottom, divided between. */
export function Rows({ children, className = "" }: { children: React.ReactNode; className?: string }) {
	return (
		<div className={`border-y ${LINE} divide-y ${DIVIDE} ${className}`}>{children}</div>
	);
}

/**
 * Label (and optional helper) on the left, control on the right.
 * Collapses to a stack under 640px so the control never crushes the label.
 */
export function Row({
	label,
	description,
	htmlFor,
	children,
	className = "",
}: {
	label: React.ReactNode;
	description?: React.ReactNode;
	htmlFor?: string;
	children?: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={`flex flex-col gap-2 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 ${className}`}
		>
			<div className="min-w-0">
				<label
					htmlFor={htmlFor}
					className="block text-[14px] font-medium text-slate-900 dark:text-slate-100"
				>
					{label}
				</label>
				{description && (
					<p className="mt-0.5 max-w-[62ch] text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
						{description}
					</p>
				)}
			</div>
			{children && <div className="flex shrink-0 items-center gap-2 sm:justify-end">{children}</div>}
		</div>
	);
}

/** Read-only fact: label left, value right. Numerals align. */
export function DataRow({
	label,
	value,
	mono,
}: {
	label: React.ReactNode;
	value: React.ReactNode;
	mono?: boolean;
}) {
	return (
		<div className="flex flex-col gap-1 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
			<span className="text-[14px] font-medium text-slate-900 dark:text-slate-100">{label}</span>
			<span
				className={`truncate text-[14px] tabular-nums text-slate-600 dark:text-slate-300 ${
					mono ? "font-mono text-[13px]" : ""
				}`}
			>
				{value}
			</span>
		</div>
	);
}

/** Stacked field for inputs that want the full column. */
export function Field({
	label,
	description,
	htmlFor,
	children,
	className = "",
}: {
	label: React.ReactNode;
	description?: React.ReactNode;
	htmlFor?: string;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={`space-y-2 ${className}`}>
			<label
				htmlFor={htmlFor}
				className="block text-[13px] font-medium text-slate-700 dark:text-slate-300"
			>
				{label}
			</label>
			{description && (
				<p className="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
					{description}
				</p>
			)}
			{children}
		</div>
	);
}

/** Bordered container for tables and pickers — one of the five places a border survives. */
export function Panel({
	children,
	className = "",
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={`overflow-hidden rounded-[10px] border ${LINE} ${className}`}>{children}</div>
	);
}

const NOTICE_TONE = {
	error:
		"border-red-200 bg-red-50 text-red-700 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-300",
	success:
		"border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300",
} as const;

export function Notice({
	tone,
	icon,
	children,
}: {
	tone: keyof typeof NOTICE_TONE;
	icon?: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<div
			role={tone === "error" ? "alert" : "status"}
			className={`flex items-start gap-2.5 rounded-md border px-3.5 py-2.5 text-[13px] leading-relaxed ${NOTICE_TONE[tone]}`}
		>
			{icon && <span className="mt-px shrink-0">{icon}</span>}
			<span className="min-w-0">{children}</span>
		</div>
	);
}

/** Loading placeholder on the row rhythm — not a centred spinner. */
export function SkeletonRows({ count = 3 }: { count?: number }) {
	return (
		<div className={`border-y ${LINE} divide-y ${DIVIDE}`} aria-hidden="true">
			{Array.from({ length: count }).map((_, i) => (
				<div key={i} className="flex items-center justify-between gap-6 py-3.5">
					<div className="w-full max-w-[280px] space-y-2">
						<div className="h-[9px] w-[45%] rounded-full bg-slate-200 dark:bg-white/10" />
						<div className="h-[9px] w-[80%] rounded-full bg-slate-100 dark:bg-white/[0.06]" />
					</div>
					<div className="h-[18px] w-9 shrink-0 rounded-full bg-slate-100 dark:bg-white/[0.06]" />
				</div>
			))}
		</div>
	);
}

export function EmptyState({
	title,
	hint,
	action,
}: {
	title: string;
	hint?: string;
	action?: React.ReactNode;
}) {
	return (
		<div className="px-6 py-14 text-center">
			<p className="text-[14px] font-medium text-slate-700 dark:text-slate-200">{title}</p>
			{hint && (
				<p className="mx-auto mt-1.5 max-w-[46ch] text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
					{hint}
				</p>
			)}
			{action && <div className="mt-4">{action}</div>}
		</div>
	);
}

/* ── Shared control classes ────────────────────────────────── */

/** Primary action. One weight, one radius, everywhere. */
export const btnPrimary =
	"inline-flex h-9 items-center justify-center gap-2 rounded-md bg-slate-900 px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-slate-700 disabled:pointer-events-none disabled:opacity-40 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200";

export const btnGhost =
	"inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-[13px] font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-40 dark:text-slate-300 dark:hover:bg-white/[0.06] dark:hover:text-white";

export const btnOutline =
	"inline-flex h-9 items-center justify-center gap-2 rounded-md border border-slate-200 px-3.5 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40 dark:border-white/[0.12] dark:text-slate-200 dark:hover:bg-white/[0.06]";

export const btnDanger =
	"inline-flex h-9 items-center justify-center gap-2 rounded-md bg-red-600 px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-red-700 disabled:pointer-events-none disabled:opacity-40";

export const inputBase =
	"h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-[14px] text-slate-900 transition-colors placeholder:text-slate-500 focus-visible:border-[#0EA5E9] dark:border-white/[0.12] dark:bg-white/[0.03] dark:text-white dark:placeholder:text-slate-400";

/** Table header cell — sentence case, not shouted small caps. */
export const th =
	"px-4 py-2.5 text-left text-[12px] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap";

export const td = "px-4 py-3 text-[13px] text-slate-600 dark:text-slate-300 align-middle";

/** Quiet status text that holds its space instead of replacing the control. */
export function SaveState({
	state,
	labels,
}: {
	state: "idle" | "saving" | "saved" | "error";
	labels?: { saving?: string; saved?: string; error?: string };
}) {
	const text =
		state === "saving"
			? labels?.saving ?? "Saving…"
			: state === "saved"
			? labels?.saved ?? "Saved"
			: state === "error"
			? labels?.error ?? "Could not save"
			: "";
	return (
		<span
			aria-live="polite"
			className={`min-w-[7ch] text-right text-[13px] transition-opacity duration-200 ${
				state === "idle" ? "opacity-0" : "opacity-100"
			} ${
				state === "error"
					? "text-red-600 dark:text-red-400"
					: state === "saved"
					? "text-emerald-600 dark:text-emerald-400"
					: "text-slate-500 dark:text-slate-400"
			}`}
		>
			{text}
		</span>
	);
}
