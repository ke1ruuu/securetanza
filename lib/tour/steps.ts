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
// Stage: Introduce the System (header elements, present on every page)
// ─────────────────────────────────────────────────────────────────────────
export const systemSteps: DriveStep[] = [
	{
		element: '[data-tour="brand"]',
		skipMissingElement: true,
		popover: {
			title: "Welcome to Secure Tanza",
			description:
				"A live crime-mapping and reporting system for Tanza, Cavite. Let's take a quick look around.",
			side: "bottom",
			align: "start",
		},
	},
	{
		element: '[data-tour="main-nav"]',
		skipMissingElement: true,
		popover: {
			title: "Five Sections",
			description:
				"Map, Overview, Cases, Analytics and Reports \u2014 everything you need is one click away in this bar.",
			side: "bottom",
			align: "center",
		},
	},
	{
		element: '[data-tour="user-menu"]',
		skipMissingElement: true,
		popover: {
			title: "Your Account",
			description:
				"Check notifications, review your permissions, and sign out from here. You can replay this tour anytime from this menu.",
			side: "bottom",
			align: "end",
		},
	},
];

// ─────────────────────────────────────────────────────────────────────────
// Stage: Map (app/page.tsx)
// ─────────────────────────────────────────────────────────────────────────
export const mapSteps: DriveStep[] = [
	{
		element: '[data-tour="barangay-filter"]',
		skipMissingElement: true,
		popover: {
			title: "Filter by Barangay",
			description:
				"Search or select a specific barangay to zoom the map and focus the data on that area.",
			side: "bottom",
			align: "start",
		},
	},
	{
		element: '[data-tour="crime-type-filter"]',
		skipMissingElement: true,
		popover: {
			title: "Filter by Crime Type",
			description: "Narrow the map down to a specific category of incident.",
			side: "bottom",
			align: "start",
		},
	},
	{
		element: '[data-tour="map-legend"]',
		skipMissingElement: true,
		popover: {
			title: "Threat Level Legend",
			description:
				"Colors show relative incident density \u2014 from Critical down to Low \u2014 calculated live from the current data.",
			side: "left",
			align: "start",
		},
	},
	{
		element: '[data-tour="map-canvas"]',
		skipMissingElement: true,
		popover: {
			title: "The Map",
			description:
				"Hover over a barangay for a quick stats popup, or click it to open a detailed breakdown.",
			side: "top",
			align: "center",
		},
	},
	{
		element: '[data-tour="map-zoom-controls"]',
		skipMissingElement: true,
		popover: {
			title: "Zoom & Reset",
			description: "Zoom in for detail, or snap back to the default view at any time.",
			side: "left",
			align: "center",
		},
	},
	{
		element: '[data-tour="real-time-clock"]',
		skipMissingElement: true,
		popover: {
			title: "Time Playback",
			description:
				"Open the time filter to scrub through historical data or play it back over a date range.",
			side: "top",
			align: "start",
		},
	},
	{
		element: '[data-tour="upload-data"]',
		skipMissingElement: true,
		popover: {
			title: "Upload Data",
			description: "Authorized users can upload new incident records directly from here.",
			side: "bottom",
			align: "end",
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
			title: "Switch Barangay",
			description:
				"Jump between the General Dashboard and any single barangay \u2014 every stat and chart below updates to match. Pick a barangay and the \"Critical Area\" card also swaps out for a \"Barangay View\" badge, since that stat only makes sense across the whole map.",
			side: "bottom",
			align: "start",
		},
	},
	{
		element: '[data-tour="overview-stats"]',
		skipMissingElement: true,
		popover: {
			title: "Key Stats",
			description:
				"A quick read on total crimes, the most frequent offense type, and (on the general dashboard) the most critical area.",
			side: "bottom",
			align: "start",
		},
	},
	{
		element: '[data-tour="overview-trend"]',
		skipMissingElement: true,
		popover: {
			title: "Crime Trend",
			description: "See how incident volume has moved over time at a glance.",
			side: "top",
			align: "start",
		},
	},
	{
		element: '[data-tour="overview-distribution"]',
		skipMissingElement: true,
		popover: {
			title: "Crime Distribution",
			description: "A breakdown of incidents by category, so you can spot what's most common.",
			side: "top",
			align: "start",
		},
	},
	{
		element: '[data-tour="overview-activity-table"]',
		skipMissingElement: true,
		popover: {
			title: "Recent Crime Activity",
			description: "The latest logged incidents, in one scrollable table.",
			side: "top",
			align: "center",
		},
	},
	{
		element: '[data-tour="overview-view-cases"]',
		skipMissingElement: true,
		popover: {
			title: "Jump to Cases",
			description:
				"Ready to dig deeper? This takes you straight to the full case list, already filtered to whatever you're viewing here.",
			side: "left",
			align: "end",
		},
	},
];

// ─────────────────────────────────────────────────────────────────────────
// Stage: Cases (app/dashboard/cases/page.tsx)
// ─────────────────────────────────────────────────────────────────────────
export const casesSteps: DriveStep[] = [
	{
		element: '[data-tour="cases-search"]',
		skipMissingElement: true,
		popover: {
			title: "Search Cases",
			description: "Find a case fast by ID, crime type, or location.",
			side: "bottom",
			align: "start",
		},
	},
	{
		element: '[data-tour="cases-filters"]',
		skipMissingElement: true,
		popover: {
			title: "Filter Cases",
			description:
				"Narrow the list by crime type, date range, barangay, or case status \u2014 combine them for a precise view.",
			side: "bottom",
			align: "start",
		},
	},
	{
		element: '[data-tour="cases-list"]',
		skipMissingElement: true,
		popover: {
			title: "Case List",
			description: "Browse matching cases here and click any row to open its full details.",
			side: "right",
			align: "start",
		},
	},
	{
		element: '[data-tour="cases-details-panel"]',
		skipMissingElement: true,
		popover: {
			title: "Case Details",
			description:
				"The selected case's full record \u2014 offense details, location, timing, modus, and a map preview.",
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
			title: "Performance Metrics",
			description:
				"Key quarterly indicators at a glance \u2014 quarterly crime trend percentage, peak hours, case resolution rate, and community safety index.",
			side: "bottom",
			align: "start",
		},
	},
	{
		element: '[data-tour="analytics-time-patterns"]',
		skipMissingElement: true,
		popover: {
			title: "24-Hour Time Patterns",
			description:
				"A 24-hour radar distribution highlighting peak incident hours to help plan law enforcement patrol schedules.",
			side: "top",
			align: "center",
		},
	},
	{
		element: '[data-tour="analytics-crime-types"]',
		skipMissingElement: true,
		popover: {
			title: "Crime Types Distribution",
			description:
				"A breakdown of the most common crime categories and their percentage share of all recorded incidents.",
			side: "top",
			align: "center",
		},
	},
	{
		element: '[data-tour="analytics-monthly-trends"]',
		skipMissingElement: true,
		popover: {
			title: "Monthly Crime Trends",
			description:
				"Track month-over-month volume changes to identify seasonality and long-term crime trajectories.",
			side: "top",
			align: "start",
		},
	},
	{
		element: '[data-tour="analytics-barangay-comparison"]',
		skipMissingElement: true,
		popover: {
			title: "Barangay Comparison",
			description:
				"Compare incident totals across top barangays to spot geographic concentrations and high-density zones.",
			side: "top",
			align: "start",
		},
	},
	{
		element: '[data-tour="analytics-modus"]',
		skipMissingElement: true,
		popover: {
			title: "Modus Operandi",
			description:
				"Review the most frequent methods of operation and criminal tactics reported across cases.",
			side: "top",
			align: "start",
		},
	},
	{
		element: '[data-tour="analytics-locations"]',
		skipMissingElement: true,
		popover: {
			title: "Location Types",
			description:
				"See which environments \u2014 residential, commercial, or public thoroughfares \u2014 have the highest incident rates.",
			side: "top",
			align: "start",
		},
	},
	{
		element: '[data-tour="analytics-matrix"]',
		skipMissingElement: true,
		popover: {
			title: "Crime Type Matrix",
			description:
				"A detailed cross-tabulated heatmap showing monthly distribution across every major crime category.",
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
		element: '[data-tour="reports-header"]',
		skipMissingElement: true,
		popover: {
			title: "Generate Reports",
			description:
				"Produce customized, professional PDF analytical case studies and summary reports for any barangay and timeframe.",
			side: "bottom",
			align: "start",
		},
	},
	{
		element: '[data-tour="reports-sections"]',
		skipMissingElement: true,
		popover: {
			title: "Select Report Sections",
			description:
				"Customize the contents of your report by toggling sections \u2014 including Executive Summary, Trends, Time Patterns, and Recommendations.",
			side: "right",
			align: "start",
		},
	},
	{
		element: '[data-tour="reports-preview"]',
		skipMissingElement: true,
		popover: {
			title: "Document Cover Preview",
			description:
				"See an instant preview of the report cover showing the target area, reporting period, and section count.",
			side: "left",
			align: "start",
		},
	},
	{
		element: '[data-tour="reports-export"]',
		skipMissingElement: true,
		popover: {
			title: "Export to PDF",
			description:
				"Compile the selected data and download a publication-ready PDF document directly to your device.",
			side: "top",
			align: "center",
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
		// overview-tab.tsx renders a skeleton (no data-tour attrs at all)
		// until its dashboard data has loaded.
		readySelector: '[data-tour="overview-stats"]',
	},
	{
		id: "cases",
		path: "/dashboard/cases",
		steps: casesSteps,
		// incidents-tab.tsx does the same while its case list loads.
		readySelector: '[data-tour="cases-search"]',
	},
	{
		id: "analytics",
		path: "/dashboard/analytics",
		steps: analyticsSteps,
		// analytics-tab.tsx renders a skeleton until analytics data loads.
		readySelector: '[data-tour="analytics-metrics"]',
	},
	{
		id: "reports",
		path: "/dashboard/reports",
		steps: reportsSteps,
		readySelector: '[data-tour="reports-sections"]',
	},
];
