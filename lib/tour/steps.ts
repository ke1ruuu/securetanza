import type { DriveStep } from "driver.js";

/**
 * Product tour step definitions.
 *
 * The tour is split into ordered "stages", one per page (System+Map share
 * the "/" page, then Overview, Cases, Analytics, and Reports).
 * TourContext drives one stage at a time and, on finishing a non-final
 * stage, navigates to the next stage's page and resumes automatically.
 *
 * All `element` selectors target `data-tour="..."` attributes rather than
 * class names, so the tour keeps working even if styling changes.
 */

// localStorage keys
// Whole tour finished (or dismissed early) — stops the auto-start forever.
export const TOUR_COMPLETED_KEY = "secureTanza:tour:completed";
// Index (into TOUR_STAGES) of the stage that should resume automatically
// the next time its page mounts. Written right before navigating away.
export const TOUR_STAGE_KEY = "secureTanza:tour:stage";
// Signal that TOUR_STAGE_KEY should be consumed and run immediately on
// this mount, rather than waiting for the "first visit ever" check.
export const TOUR_PENDING_KEY = "secureTanza:tour:pendingStart";

export type UserRoleType = "admin" | "operational_officer" | "privileged_user" | "public";

export const TOUR_ROLE_KEY = "secureTanza:tour:role";

// ─────────────────────────────────────────────────────────────────────────
// Public Visitor Steps (app/page.tsx & app/docs/page.tsx)
// ─────────────────────────────────────────────────────────────────────────
export const publicSystemSteps: DriveStep[] = [
	{
		element: '[data-tour="brand"]',
		skipMissingElement: true,
		popover: {
			title: "Welcome to Secure Tanza",
			description:
				"Explore Tanza's GIS crime mapping and analytics platform. Discover real-time municipal safety metrics, geographic threat levels, and historical crime trends.",
			side: "bottom",
			align: "start",
		},
	},
	{
		element: '[data-tour="public-actions"]',
		skipMissingElement: true,
		popover: {
			title: "Documentation & Officer Portal",
			description:
				"Access comprehensive documentation and user guides, or manage your authorized account session.",
			side: "bottom",
			align: "end",
		},
	},
];

export const publicMapSteps: DriveStep[] = [
	{
		element: '[data-tour="map-canvas"]',
		skipMissingElement: true,
		popover: {
			title: "Interactive Municipality Map",
			description:
				"Visualize geographic crime density across all 41 barangays of Tanza. Click on any barangay polygon to inspect local safety statistics and demographics.",
			side: "top",
			align: "center",
		},
	},
	{
		element: '[data-tour="map-filters"]',
		skipMissingElement: true,
		popover: {
			title: "Barangay & Crime Filters",
			description:
				"Filter map density by selecting your specific barangay or isolating statutory crime categories such as Theft, Robbery, or Physical Injury.",
			side: "bottom",
			align: "start",
		},
	},
	{
		element: '[data-tour="map-legend"]',
		skipMissingElement: true,
		popover: {
			title: "Threat Level Classifications",
			description:
				"Understand color-coded municipal risk levels: Secure (Emerald), Low (Sky Blue), Moderate (Amber), High (Orange), and Critical (Crimson).",
			side: "left",
			align: "start",
		},
	},
	{
		element: '[data-tour="real-time-clock"]',
		skipMissingElement: true,
		popover: {
			title: "Timeline & Historical Scrubber",
			description:
				"Click the clock button to reveal the temporal filter drawer. Scrub through quarterly or monthly crime records and play automated time animations.",
			side: "top",
			align: "start",
		},
	},
];

export const publicDocsSteps: DriveStep[] = [
	{
		element: '[data-tour="docs-sidebar"]',
		skipMissingElement: true,
		popover: {
			title: "Public User Manual",
			description:
				"Browse structured platform guides explaining map navigation, threat level classifications, and municipal security metrics.",
			side: "right",
			align: "start",
		},
	},
	{
		element: '[data-tour="docs-search"]',
		skipMissingElement: true,
		popover: {
			title: "Topic Search",
			description:
				"Search crime intelligence topics, definitions, and operational information instantly.",
			side: "bottom",
			align: "start",
		},
	},
	{
		element: '[data-tour="docs-tour-btn"]',
		skipMissingElement: true,
		popover: {
			title: "Walkthrough Complete",
			description:
				"You've completed the guided walkthrough! You can relaunch this tour at any time from this button or the navigation bar.",
			side: "bottom",
			align: "end",
		},
	},
];

// ─────────────────────────────────────────────────────────────────────────
// Operational Officer Steps (Tactical Workflows)
// ─────────────────────────────────────────────────────────────────────────
export const officerSystemSteps: DriveStep[] = [
	{
		element: '[data-tour="main-nav"]',
		skipMissingElement: true,
		popover: {
			title: "Officer Command Navigation",
			description:
				"Navigate tactical operational modules: Interactive Map, Overview Dashboard, Cases Blotter, Analytics Intelligence, and PDF Reports.",
			side: "bottom",
			align: "center",
		},
	},
	{
		element: '[data-tour="upload-data"]',
		skipMissingElement: true,
		popover: {
			title: "Batch Blotter Ingestion",
			description:
				"Upload freshly encoded Excel blotter spreadsheets (.xlsx) with automated schema verification, coordinate mapping, and instant database ingestion.",
			side: "bottom",
			align: "end",
		},
	},
	{
		element: '[data-tour="notification-bell"]',
		skipMissingElement: true,
		popover: {
			title: "Automated Intelligence Alerts",
			description:
				"Receive real-time alerts on peak-hour volume surges, barangay incident spikes, and critical heinous crime detections.",
			side: "bottom",
			align: "end",
		},
	},
	{
		element: '[data-tour="user-menu"]',
		skipMissingElement: true,
		popover: {
			title: "Officer Profile & Clearance",
			description:
				"Verify your officer badge and clearance level, manage account credentials, and replay this walkthrough at any time.",
			side: "bottom",
			align: "end",
		},
	},
];

export const officerMapSteps: DriveStep[] = [
	{
		element: '[data-tour="map-canvas"]',
		skipMissingElement: true,
		popover: {
			title: "Tactical GIS Crime Map",
			description:
				"Inspect spatial crime density and live incident clusters across all 41 Tanza barangays with multi-layer boundary rendering.",
			side: "top",
			align: "center",
		},
	},
	{
		element: '[data-tour="map-filters"]',
		skipMissingElement: true,
		popover: {
			title: "Multi-Barangay & Offense Filters",
			description:
				"Filter crime density by specific barangay jurisdictions or isolate statutory offense classifications.",
			side: "bottom",
			align: "start",
		},
	},
	{
		element: '[data-tour="map-legend"]',
		skipMissingElement: true,
		popover: {
			title: "Dynamic Threat Thresholds",
			description:
				"Monitor active threat classifications from Secure (green) to Critical (red) based on recorded incident counts.",
			side: "left",
			align: "start",
		},
	},
	{
		element: '[data-tour="real-time-clock"]',
		skipMissingElement: true,
		popover: {
			title: "Temporal Filter & Patrol Playback",
			description:
				"Toggle the timeline drawer to scrub through historical periods and animate spatial trends for patrol deployment planning.",
			side: "top",
			align: "start",
		},
	},
];

export const officerDocsSteps: DriveStep[] = [
	{
		element: '[data-tour="docs-sidebar"]',
		skipMissingElement: true,
		popover: {
			title: "Operational SOPs & Playbooks",
			description:
				"Access tactical standard operating procedures, data schemas, batch ingestion guidelines, and analytical methodologies.",
			side: "right",
			align: "start",
		},
	},
	{
		element: '[data-tour="docs-search"]',
		skipMissingElement: true,
		popover: {
			title: "Operational Quick Search",
			description:
				"Search incident schemas, reporting rules, crime categories, and troubleshooting guides instantaneously.",
			side: "bottom",
			align: "start",
		},
	},
	{
		element: '[data-tour="docs-tour-btn"]',
		skipMissingElement: true,
		popover: {
			title: "Officer Walkthrough Complete",
			description:
				"You've completed the Operational Officer walkthrough! You can relaunch this guided tour at any time from your account menu or this button.",
			side: "bottom",
			align: "end",
		},
	},
];

// ─────────────────────────────────────────────────────────────────────────
// Privileged User / Viewer Steps
// ─────────────────────────────────────────────────────────────────────────
export const privilegedSystemSteps: DriveStep[] = [
	{
		element: '[data-tour="main-nav"]',
		skipMissingElement: true,
		popover: {
			title: "Authorized Intelligence Modules",
			description:
				"Access your authorized modules: Interactive Map, Overview Metrics, Case Dossiers, Analytics, and Documentation.",
			side: "bottom",
			align: "center",
		},
	},
	{
		element: '[data-tour="user-menu"]',
		skipMissingElement: true,
		popover: {
			title: "Security Clearance & Profile",
			description:
				"Review your granted module permissions and replay your role-specific walkthrough anytime.",
			side: "bottom",
			align: "end",
		},
	},
];

export const privilegedDocsSteps: DriveStep[] = [
	{
		element: '[data-tour="docs-sidebar"]',
		skipMissingElement: true,
		popover: {
			title: "Documentation & Intelligence Manual",
			description:
				"Review documentation covering data definitions, analytical metrics, and platform operations.",
			side: "right",
			align: "start",
		},
	},
	{
		element: '[data-tour="docs-search"]',
		skipMissingElement: true,
		popover: {
			title: "Quick Topic Search",
			description:
				"Find guidelines and metrics explanations quickly.",
			side: "bottom",
			align: "start",
		},
	},
	{
		element: '[data-tour="docs-tour-btn"]',
		skipMissingElement: true,
		popover: {
			title: "Tour Replay & Completion",
			description:
				"You've completed the walkthrough! Relaunch this guided tour anytime from this button or your account menu.",
			side: "bottom",
			align: "end",
		},
	},
];

// ─────────────────────────────────────────────────────────────────────────
// Administrator Steps
// ─────────────────────────────────────────────────────────────────────────
export const adminSystemSteps: DriveStep[] = [
	{
		element: '[data-tour="main-nav"]',
		skipMissingElement: true,
		popover: {
			title: "Administrator Command Center",
			description:
				"Full access across all platform modules: Map, Overview, Cases, Analytics, Reports, System Settings, and Documentation.",
			side: "bottom",
			align: "center",
		},
	},
	{
		element: '[data-tour="upload-data"]',
		skipMissingElement: true,
		popover: {
			title: "Batch Data Ingestion",
			description:
				"Upload bulk Excel blotter files (.xlsx) with automatic schema verification and geocoding.",
			side: "bottom",
			align: "end",
		},
	},
	{
		element: '[data-tour="notification-bell"]',
		skipMissingElement: true,
		popover: {
			title: "Alert & Notification Engine",
			description:
				"Review automated system alerts triggered by volume threshold rules and data import receipts.",
			side: "bottom",
			align: "end",
		},
	},
	{
		element: '[data-tour="user-menu"]',
		skipMissingElement: true,
		popover: {
			title: "Administrator Account & Settings",
			description:
				"Manage administrator credentials, jump into System Configuration, and replay guided tours.",
			side: "bottom",
			align: "end",
		},
	},
];

// ─────────────────────────────────────────────────────────────────────────
// Stage: Introduce the System & Map (app/page.tsx)
// ─────────────────────────────────────────────────────────────────────────
export const systemSteps: DriveStep[] = adminSystemSteps;

export const mapSteps: DriveStep[] = [
	{
		element: '[data-tour="map-canvas"]',
		skipMissingElement: true,
		popover: {
			title: "Interactive Crime Map",
			description:
				"Visualize live crime density across Tanza. Hover over any barangay for quick stats or click to view in-depth details.",
			side: "top",
			align: "center",
		},
	},
	{
		element: '[data-tour="map-filters"]',
		skipMissingElement: true,
		popover: {
			title: "Location & Crime Filters",
			description:
				"Filter map density and incident records by specific barangay or crime category.",
			side: "bottom",
			align: "start",
		},
	},
	{
		element: '[data-tour="map-legend"]',
		skipMissingElement: true,
		popover: {
			title: "Threat Levels & Timeline",
			description:
				"Track color-coded risk levels from Low to Critical, and use time controls to scrub through historical incident data.",
			side: "left",
			align: "start",
		},
	},
];

// ─────────────────────────────────────────────────────────────────────────
// Stage: Overview (app/dashboard/overview/page.tsx)
// ─────────────────────────────────────────────────────────────────────────
export const overviewSteps: DriveStep[] = [
	{
		element: '[data-tour="barangay-selector"]',
		skipMissingElement: true,
		popover: {
			title: "Barangay Scope",
			description:
				"Switch between the General Dashboard and individual barangays — all metrics, charts, and activity logs update dynamically.",
			side: "bottom",
			align: "start",
		},
	},
	{
		element: '[data-tour="overview-stats"]',
		skipMissingElement: true,
		popover: {
			title: "Key Metrics Snapshot",
			description:
				"Instant overview of total incident volume, most prevalent offense types, and high-density hotspot areas.",
			side: "bottom",
			align: "start",
		},
	},
	{
		element: '[data-tour="overview-charts"]',
		skipMissingElement: true,
		popover: {
			title: "Trends & Distribution",
			description:
				"Track monthly crime volume progression alongside a categorical breakdown of all recorded offenses.",
			side: "top",
			align: "center",
		},
	},
	{
		element: '[data-tour="overview-activity-table"]',
		skipMissingElement: true,
		popover: {
			title: "Recent Activity & Case Drill-down",
			description:
				"Browse the latest logged incidents with quick links to jump directly into filtered case records.",
			side: "top",
			align: "center",
		},
	},
];

// ─────────────────────────────────────────────────────────────────────────
// Stage: Cases (app/dashboard/cases/page.tsx)
// ─────────────────────────────────────────────────────────────────────────
export const casesSteps: DriveStep[] = [
	{
		element: '[data-tour="cases-controls"]',
		skipMissingElement: true,
		popover: {
			title: "Search & Filter Suite",
			description:
				"Find specific incidents instantly by Case ID, keyword, crime category, barangay, date range, or clearance status.",
			side: "bottom",
			align: "start",
		},
	},
	{
		element: '[data-tour="cases-list"]',
		skipMissingElement: true,
		popover: {
			title: "Case Directory",
			description:
				"Browse matching incident records and select any case to inspect its complete dossier.",
			side: "right",
			align: "start",
		},
	},
	{
		element: '[data-tour="cases-details-panel"]',
		skipMissingElement: true,
		popover: {
			title: "Case Profile & Geo-Context",
			description:
				"Review comprehensive incident details including modus operandi, timeline, location, and map coordinates.",
			side: "left",
			align: "start",
		},
	},
];

// ─────────────────────────────────────────────────────────────────────────
// Stage: Analytics (app/dashboard/analytics/page.tsx)
// ─────────────────────────────────────────────────────────────────────────
export const analyticsSteps: DriveStep[] = [
	{
		element: '[data-tour="analytics-metrics"]',
		skipMissingElement: true,
		popover: {
			title: "Executive KPI Cards",
			description:
				"Quarterly crime trend percentages, peak incident hours, case resolution rates, and community safety score.",
			side: "bottom",
			align: "start",
		},
	},
	{
		element: '[data-tour="analytics-temporal-trends"]',
		skipMissingElement: true,
		popover: {
			title: "Time Patterns & Offense Breakdown",
			description:
				"A 24-hour radar distribution for patrol planning alongside top crime category volume rankings and monthly trajectories.",
			side: "top",
			align: "center",
		},
	},
	{
		element: '[data-tour="analytics-modus-locations"]',
		skipMissingElement: true,
		popover: {
			title: "Modus Operandi & High-Risk Locations",
			description:
				"Analyze common criminal methods alongside high-frequency environments like residential, commercial, or public spaces.",
			side: "top",
			align: "center",
		},
	},
	{
		element: '[data-tour="analytics-matrix"]',
		skipMissingElement: true,
		popover: {
			title: "Crime Type Matrix Heatmap",
			description:
				"A full-spectrum cross-tabulated heatmap showing monthly distribution across every major crime category.",
			side: "top",
			align: "center",
		},
	},
];

// ─────────────────────────────────────────────────────────────────────────
// Stage: Reports (app/dashboard/reports/page.tsx)
// ─────────────────────────────────────────────────────────────────────────
export const reportsSteps: DriveStep[] = [
	{
		element: '[data-tour="reports-sections"]',
		skipMissingElement: true,
		popover: {
			title: "Configure Report Content",
			description:
				"Select the analytical sections to include — Executive Summary, Trends, Time Patterns, Modus Operandi, and Recommendations.",
			side: "right",
			align: "start",
		},
	},
	{
		element: '[data-tour="reports-export-panel"]',
		skipMissingElement: true,
		popover: {
			title: "Document Preview & PDF Export",
			description:
				"Review document parameters, preview the live publication cover, and compile a publication-ready PDF case study.",
			side: "left",
			align: "start",
		},
	},
];

// ─────────────────────────────────────────────────────────────────────────
// Stage: System Settings (app/dashboard/config/page.tsx)
// ─────────────────────────────────────────────────────────────────────────
export const settingsSteps: DriveStep[] = [
	{
		element: '[data-tour="settings-nav"]',
		skipMissingElement: true,
		popover: {
			title: "System Configuration Hub",
			description:
				"Navigate administration and user preferences: manage profile credentials, security clearances, alert rules, and audit logs.",
			side: "right",
			align: "start",
		},
	},
	{
		element: '[data-tour="settings-access-security"]',
		skipMissingElement: true,
		popover: {
			title: "Access & Security (RBAC)",
			description:
				"Provision personnel accounts, assign administrative roles, and enforce granular security clearances.",
			side: "right",
			align: "start",
		},
	},
	{
		element: '[data-tour="settings-notifications"]',
		skipMissingElement: true,
		popover: {
			title: "Alert & Notification Engine",
			description:
				"Configure automated triggers for peak-hour volume spikes, barangay surges, and critical blotter incidents.",
			side: "right",
			align: "start",
		},
	},
	{
		element: '[data-tour="settings-workspace"]',
		skipMissingElement: true,
		popover: {
			title: "Configuration Workspace",
			description:
				"Review credentials, adjust notification rules, audit batch data imports, and customize application preferences.",
			side: "left",
			align: "start",
		},
	},
];

// ─────────────────────────────────────────────────────────────────────────
// Stage: User Guide & Documentation (app/docs/page.tsx)
// ─────────────────────────────────────────────────────────────────────────
export const docsSteps: DriveStep[] = [
	{
		element: '[data-tour="docs-sidebar"]',
		skipMissingElement: true,
		popover: {
			title: "Documentation & User Manual",
			description:
				"Browse structured operational guides covering every module in SecureTanza, including GIS map controls, analytics metrics, case dossiers, and reporting.",
			side: "right",
			align: "start",
		},
	},
	{
		element: '[data-tour="docs-search"]',
		skipMissingElement: true,
		popover: {
			title: "Quick Topic Search",
			description:
				"Search topics, incident schemas, operational playbooks, and troubleshooting guides instantaneously.",
			side: "bottom",
			align: "start",
		},
	},
	{
		element: '[data-tour="docs-content"]',
		skipMissingElement: true,
		popover: {
			title: "Operational Guides & Playbooks",
			description:
				"Review in-depth manuals, role-based standard operating procedures (SOPs), and system architectural specifications.",
			side: "left",
			align: "start",
		},
	},
	{
		element: '[data-tour="docs-tour-btn"]',
		skipMissingElement: true,
		popover: {
			title: "Tour Replay & Completion",
			description:
				"You've completed the complete system walkthrough! You can relaunch this guided tour at any time from this button or your account menu.",
			side: "bottom",
			align: "end",
		},
	},
];

// ─────────────────────────────────────────────────────────────────────────
// Stage registry — drives the multi-page chain in TourContext.
// ─────────────────────────────────────────────────────────────────────────
export interface TourStage {
	id: string;
	path: string;
	steps: DriveStep[];
	/**
	 * Selector for an element that only appears once this stage's page has
	 * finished loading its data (i.e. it's rendering real content instead
	 * of a loading skeleton).
	 */
	readySelector?: string;
}

export const TOUR_STAGES: TourStage[] = [
	{ id: "system-map", path: "/", steps: [...systemSteps, ...mapSteps] },
	{
		id: "overview",
		path: "/dashboard/overview",
		steps: overviewSteps,
		readySelector: '[data-tour="overview-stats"]',
	},
	{
		id: "cases",
		path: "/dashboard/cases",
		steps: casesSteps,
		readySelector: '[data-tour="cases-controls"]',
	},
	{
		id: "analytics",
		path: "/dashboard/analytics",
		steps: analyticsSteps,
		readySelector: '[data-tour="analytics-metrics"]',
	},
	{
		id: "reports",
		path: "/dashboard/reports",
		steps: reportsSteps,
		readySelector: '[data-tour="reports-sections"]',
	},
	{
		id: "settings",
		path: "/dashboard/config",
		steps: settingsSteps,
		readySelector: '[data-tour="settings-nav"]',
	},
	{
		id: "docs",
		path: "/docs",
		steps: docsSteps,
		readySelector: '[data-tour="docs-sidebar"]',
	},
];

/**
 * Returns role-tailored tour stages according to the user's role and granular permissions.
 */
export function getTourStagesForRole(
	role: UserRoleType,
	permissions: string[] = []
): TourStage[] {
	if (role === "public") {
		return [
			{
				id: "system-map",
				path: "/",
				steps: [...publicSystemSteps, ...publicMapSteps],
			},
			{
				id: "docs",
				path: "/docs",
				steps: publicDocsSteps,
				readySelector: '[data-tour="docs-sidebar"]',
			},
		];
	}

	if (role === "operational_officer") {
		return [
			{
				id: "system-map",
				path: "/",
				steps: [...officerSystemSteps, ...officerMapSteps],
			},
			{
				id: "overview",
				path: "/dashboard/overview",
				steps: overviewSteps,
				readySelector: '[data-tour="overview-stats"]',
			},
			{
				id: "cases",
				path: "/dashboard/cases",
				steps: casesSteps,
				readySelector: '[data-tour="cases-controls"]',
			},
			{
				id: "analytics",
				path: "/dashboard/analytics",
				steps: analyticsSteps,
				readySelector: '[data-tour="analytics-metrics"]',
			},
			{
				id: "reports",
				path: "/dashboard/reports",
				steps: reportsSteps,
				readySelector: '[data-tour="reports-sections"]',
			},
			{
				id: "docs",
				path: "/docs",
				steps: officerDocsSteps,
				readySelector: '[data-tour="docs-sidebar"]',
			},
		];
	}

	if (role === "privileged_user") {
		const stages: TourStage[] = [];
		const hasMap = permissions.includes("privileged_map_view") || permissions.includes("privileged_user");
		const hasCases = permissions.includes("privileged_cases_view") || permissions.includes("privileged_user");
		const hasAnalytics = permissions.includes("privileged_analytics_view") || permissions.includes("privileged_user");

		if (hasMap || (!hasCases && !hasAnalytics)) {
			stages.push({
				id: "system-map",
				path: "/",
				steps: [...privilegedSystemSteps, ...mapSteps],
			});
			stages.push({
				id: "overview",
				path: "/dashboard/overview",
				steps: overviewSteps,
				readySelector: '[data-tour="overview-stats"]',
			});
		}

		if (hasCases) {
			stages.push({
				id: "cases",
				path: "/dashboard/cases",
				steps: casesSteps,
				readySelector: '[data-tour="cases-controls"]',
			});
		}

		if (hasAnalytics) {
			stages.push({
				id: "analytics",
				path: "/dashboard/analytics",
				steps: analyticsSteps,
				readySelector: '[data-tour="analytics-metrics"]',
			});
			stages.push({
				id: "reports",
				path: "/dashboard/reports",
				steps: reportsSteps,
				readySelector: '[data-tour="reports-sections"]',
			});
		}

		stages.push({
			id: "docs",
			path: "/docs",
			steps: privilegedDocsSteps,
			readySelector: '[data-tour="docs-sidebar"]',
		});

		return stages;
	}

	// Default Admin role
	return [
		{
			id: "system-map",
			path: "/",
			steps: [...adminSystemSteps, ...mapSteps],
		},
		{
			id: "overview",
			path: "/dashboard/overview",
			steps: overviewSteps,
			readySelector: '[data-tour="overview-stats"]',
		},
		{
			id: "cases",
			path: "/dashboard/cases",
			steps: casesSteps,
			readySelector: '[data-tour="cases-controls"]',
		},
		{
			id: "analytics",
			path: "/dashboard/analytics",
			steps: analyticsSteps,
			readySelector: '[data-tour="analytics-metrics"]',
		},
		{
			id: "reports",
			path: "/dashboard/reports",
			steps: reportsSteps,
			readySelector: '[data-tour="reports-sections"]',
		},
		{
			id: "settings",
			path: "/dashboard/config",
			steps: settingsSteps,
			readySelector: '[data-tour="settings-nav"]',
		},
		{
			id: "docs",
			path: "/docs",
			steps: docsSteps,
			readySelector: '[data-tour="docs-sidebar"]',
		},
	];
}
