"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Activity } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/* The nav is label-only. Each item's description lives on the title
   attribute rather than as a second rendered line — it explains on
   demand instead of competing with the label it describes. */
type NavItem = {
	href: string;
	label: string;
	description: string;
	adminOnly: boolean;
	tour?: string;
};

type NavGroup = { id: string; label: string; items: NavItem[] };

export const NAV_GROUPS: NavGroup[] = [
	{
		id: "account",
		label: "Account",
		items: [
			{
				href: "/dashboard/config",
				label: "My Profile",
				description: "Account & credentials",
				adminOnly: false,
			},
			{
				href: "/dashboard/config/preferences",
				label: "Account Preferences",
				description: "Theme & display settings",
				adminOnly: false,
			},
		],
	},
	{
		id: "administration",
		label: "Administration",
		items: [
			{
				href: "/dashboard/config/access",
				label: "Access & Security",
				description: "Personnel & clearances",
				adminOnly: true,
				tour: "settings-access-security",
			},
			{
				href: "/dashboard/config/notifications",
				label: "Notification Rules",
				description: "Analytical alert engine",
				adminOnly: true,
				tour: "settings-notifications",
			},
			{
				href: "/dashboard/config/audit-logs",
				label: "Audit Logs",
				description: "Uploads & batch records",
				adminOnly: true,
			},
			{
				href: "/dashboard/config/exports",
				label: "Data Exports",
				description: "Scheduled reports",
				adminOnly: true,
			},
			{
				href: "/dashboard/config/backups",
				label: "Backups",
				description: "Retained data & reports",
				adminOnly: true,
			},
		],
	},
];

export function useIsAdmin() {
	const { user } = useAuth();
	return Boolean(
		user &&
			(user.permissions.includes("admin_operational_officer") ||
				user.permissions.includes("admin"))
	);
}

/**
 * Whether stepping back out of settings is safe.
 *
 * Safe when the document loaded somewhere else in the app and settings was
 * reached by client-side navigation — the entries behind us are app pages.
 * When the document loaded straight into settings (a pasted URL, a new tab,
 * or a refresh), only a same-origin referrer proves there is anywhere to go;
 * otherwise stepping back lands on whatever preceded the app.
 */
function canLeaveViaHistory() {
	if (typeof window === "undefined") return false;

	const nav = performance.getEntriesByType("navigation")[0] as
		| PerformanceNavigationTiming
		| undefined;
	let docPath = window.location.pathname;
	try {
		if (nav?.name) docPath = new URL(nav.name).pathname;
	} catch {
		/* keep the current path */
	}

	if (!docPath.startsWith("/dashboard/config")) return true;

	if (!document.referrer) return false;
	try {
		const ref = new URL(document.referrer);
		return ref.origin === window.location.origin && !ref.pathname.startsWith("/dashboard/config");
	} catch {
		return false;
	}
}

/** Where "Back" lands when there is no history to leave to. */
function landingPathFor(landingPage?: string) {
	switch (landingPage === "dashboard" ? "overview" : landingPage) {
		case "map":
			return "/map";
		case "analytics":
			return "/dashboard/analytics";
		case "overview":
			return "/dashboard/overview";
		default:
			return "/dashboard";
	}
}

export default function SettingsShell({ children }: { children: React.ReactNode }) {
	const { user, loading: authLoading } = useAuth();
	const router = useRouter();
	const pathname = usePathname();
	const isAdmin = useIsAdmin();

	useEffect(() => {
		if (!authLoading && !user) router.replace("/login");
	}, [authLoading, user, router]);

	/* Every section is its own history entry now, so a plain router.back()
	   would walk backwards through the sections the officer just visited
	   instead of leaving settings. Track how deep into settings we are and
	   step out in one jump. */
	const visited = useRef<string[]>([]);

	useEffect(() => {
		const stack = visited.current;
		if (stack.length === 0) {
			stack.push(pathname);
		} else if (stack.length >= 2 && stack[stack.length - 2] === pathname) {
			stack.pop(); // browser Back within settings
		} else if (stack[stack.length - 1] !== pathname) {
			stack.push(pathname);
		}
	}, [pathname]);

	const exitSettings = () => {
		if (canLeaveViaHistory()) {
			window.history.go(-(visited.current.length || 1));
		} else {
			// Settings was opened directly — there is nothing behind it to return to.
			router.replace(landingPathFor(user?.defaultLandingPage));
		}
	};

	if (authLoading) {
		return (
			<div className="flex h-screen items-center justify-center bg-white dark:bg-[#0B1120]">
				<div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0EA5E9] border-t-transparent" />
			</div>
		);
	}

	if (!user) return null;

	const groups = NAV_GROUPS.map((group) => ({
		...group,
		items: group.items.filter((item) => !item.adminOnly || isAdmin),
	})).filter((group) => group.items.length > 0);

	return (
		<div className="settings-surface flex h-screen flex-col overflow-hidden bg-white font-sans text-slate-900 dark:bg-[#0B1120] dark:text-slate-100">
			<header className="z-30 flex h-14 flex-none items-center gap-4 border-b border-slate-200 px-4 sm:px-6 dark:border-white/[0.07]">
				<button
					onClick={exitSettings}
					className="-ml-2 inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-[13px] font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
				>
					<ArrowLeft className="h-4 w-4" />
					Back
				</button>
				<span
					aria-hidden="true"
					className="h-4 w-px bg-slate-200 dark:bg-white/[0.09]"
				/>
				{/* Quiet wayfinding label — the route's own h1 is the page title. */}
				<span className="truncate text-[13px] text-slate-500 dark:text-slate-400">
					System Settings &amp; Configuration
				</span>
			</header>

			<div className="flex min-h-0 flex-1 lg:flex-row">
				<SettingsNav groups={groups} pathname={pathname} isAdmin={isAdmin} />

				<main
					data-tour="settings-workspace"
					className="settings-scroll min-w-0 flex-1 overflow-y-auto scroll-smooth"
				>
					<div key={pathname} className="settings-enter px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
						{children}
					</div>
				</main>
			</div>
		</div>
	);
}

function SettingsNav({
	groups,
	pathname,
	isAdmin,
}: {
	groups: NavGroup[];
	pathname: string;
	isAdmin: boolean;
}) {
	const listRef = useRef<HTMLDivElement>(null);
	const railRef = useRef<HTMLSpanElement>(null);

	/* The one authored moment on this surface: the active rail travels to
	   the selected item. Measured rather than computed, so group headings
	   and a filtered admin list can't put it out of register — and written
	   straight to the node, so measuring costs no extra render. */
	useLayoutEffect(() => {
		const list = listRef.current;
		const rail = railRef.current;
		if (!list || !rail) return;

		const active = list.querySelector<HTMLElement>("[data-active='true']");
		if (!active) {
			rail.style.opacity = "0";
			return;
		}
		rail.style.top = `${active.offsetTop + 6}px`;
		rail.style.height = `${active.offsetHeight - 12}px`;
		rail.style.opacity = "1";
	}, [pathname, groups.length]);

	return (
		<aside className="flex-none border-b border-slate-200 lg:w-60 lg:border-r lg:border-b-0 dark:border-white/[0.07]">
			<div className="settings-scroll flex gap-1 overflow-x-auto px-4 py-2 lg:h-full lg:flex-col lg:gap-0 lg:overflow-x-visible lg:overflow-y-auto lg:px-3 lg:py-5">
				<div ref={listRef} className="relative flex gap-1 lg:flex-col lg:gap-0" data-tour="settings-nav">
					<span
						ref={railRef}
						aria-hidden="true"
						className="absolute left-0 hidden w-[2px] rounded-full bg-[#0EA5E9] opacity-0 transition-[top,height,opacity] duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] lg:block"
						style={{ top: 0, height: 0 }}
					/>
					{groups.map((group, groupIndex) => (
						<div key={group.id} className="contents lg:block">
							<p
								className={`hidden px-3 pb-1.5 text-[11px] font-semibold tracking-[0.07em] text-slate-500 uppercase lg:block dark:text-slate-400 ${
									groupIndex > 0 ? "pt-6" : ""
								}`}
							>
								{group.label}
							</p>
							{group.items.map((item) => {
								const isActive =
									item.href === "/dashboard/config"
										? pathname === "/dashboard/config"
										: pathname.startsWith(item.href);
								return (
									<Link
										key={item.href}
										href={item.href}
										title={item.description}
										data-active={isActive}
										data-tour={item.tour}
										aria-current={isActive ? "page" : undefined}
										className={`block shrink-0 rounded-md px-3 py-[7px] text-[13.5px] whitespace-nowrap transition-colors lg:whitespace-normal ${
											isActive
												? "bg-slate-100 font-medium text-slate-900 dark:bg-white/[0.07] dark:text-white"
												: "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.04] dark:hover:text-slate-100"
										}`}
									>
										{item.label}
									</Link>
								);
							})}
						</div>
					))}
				</div>

				{isAdmin && (
					<div className="flex-none border-slate-200 lg:mt-6 lg:border-t lg:pt-4 dark:border-white/[0.07]">
						<Link
							href="/dashboard/performance"
							title="Telemetry & Diagnostics"
							className="flex shrink-0 items-center gap-2 rounded-md px-3 py-[7px] text-[13.5px] whitespace-nowrap text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.04] dark:hover:text-slate-100"
						>
							<Activity className="h-3.5 w-3.5 text-[#0EA5E9]" />
							Process Monitor
						</Link>
					</div>
				)}
			</div>
		</aside>
	);
}

/** Admin routes are reachable by URL now, so each one re-checks the clearance. */
export function AdminOnly({ children }: { children: React.ReactNode }) {
	const { loading } = useAuth();
	const isAdmin = useIsAdmin();

	if (loading) return null;

	if (!isAdmin) {
		return (
			<div className="mx-auto max-w-[720px]">
				<h1 className="text-xl font-semibold tracking-[-0.011em] text-slate-900 dark:text-white">
					Not authorized
				</h1>
				<p className="mt-1.5 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
					This section is limited to administrative officers. Ask a system administrator to
					review your clearance if you need access.
				</p>
				<Link
					href="/dashboard/config"
					className="mt-5 inline-flex h-9 items-center rounded-md bg-slate-900 px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
				>
					Back to My Profile
				</Link>
			</div>
		);
	}

	return <>{children}</>;
}
