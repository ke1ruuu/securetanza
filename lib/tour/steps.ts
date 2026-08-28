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

// ─────────────────────────────────────────────────────────────────────────
// Stage: Introduce the System & Map (app/page.tsx)
// ─────────────────────────────────────────────────────────────────────────
export const systemSteps: DriveStep[] = [
	{
		element: '[data-tour="main-nav"]',
		skipMissingElement: true,
		popover: {
			title: "Welcome to Secure Tanza",
			description:
				"Navigate across the five core modules: Map, Overview, Cases, Analytics, and Reports.",
			side: "bottom",
			align: "center",
		},
	},
	{
		element: '[data-tour="user-menu"]',
		skipMissingElement: true,
		popover: {
			title: "Account & Settings",
			description:
				"Manage notifications, review security permissions, and replay this tour anytime.",
			side: "bottom",
			align: "end",
		},
	},
];

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
// Stage registry — drives the multi-page chain in TourContext.
// ─────────────────────────────────────────────────────────────────────────
export interface TourStage {
	id: string;
	path: string;
	steps: DriveStep[];
	/**
	 * Selector for an element that only appears once this stage's page has
	 * finished loading its data (i.e. it's rendering real content instead
	 * of a loading skeleton). When set, TourContext waits for it to show up
	 * before calling `driver.drive()`, so the tour doesn't start pointing
	 * at `data-tour` targets that haven't been rendered yet. Leave unset
	 * for stages whose steps are all present immediately (no async data).
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
];
