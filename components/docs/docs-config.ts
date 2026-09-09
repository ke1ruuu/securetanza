import {
  BookOpen,
  Map,
  BarChart3,
  TrendingUp,
  FolderOpen,
  FileText,
  Bell,
  ShieldCheck,
  Upload,
  AlertCircle,
} from "lucide-react";
import { DocsSectionItem, DocsCategoryItem } from "./docs-types";
import { DocsIntro } from "./docs-intro";
import { DocsMap } from "./docs-map";
import { DocsDashboard } from "./docs-dashboard";
import { DocsAnalytics } from "./docs-analytics";
import { DocsCases } from "./docs-cases";
import { DocsReports } from "./docs-reports";
import { DocsNotifications } from "./docs-notifications";
import { DocsSettings } from "./docs-settings";
import { DocsUpload } from "./docs-upload";
import { DocsTroubleshooting } from "./docs-troubleshooting";

export const DOCS_SECTIONS: DocsSectionItem[] = [
  {
    id: "intro",
    title: "Introduction",
    icon: BookOpen,
    tags: ["welcome", "overview", "system", "architecture", "tanza", "gis"],
    subsections: [
      { id: "walkthroughs", title: "Interactive Walkthroughs", tags: ["tour", "roles", "officer", "analyst", "admin"] },
      { id: "core-modules", title: "Core Modules", tags: ["gis", "dashboard", "analytics", "cases", "reports"] },
    ],
    component: DocsIntro,
  },
  {
    id: "map",
    title: "GIS Crime Map",
    icon: Map,
    tags: ["gis", "map", "barangay", "filters", "time", "playback", "threat", "legend", "export"],
    subsections: [
      { id: "threat-levels", title: "Barangay Threat Levels", tags: ["threat", "quartiles", "thresholds", "critical", "moderate", "low"] },
      { id: "map-controls", title: "Map Controls & Spatial Tools", tags: ["filters", "playback", "scrubber", "drawer", "export"] },
    ],
    component: DocsMap,
  },
  {
    id: "dashboard",
    title: "Dashboard",
    icon: BarChart3,
    tags: ["overview", "dashboard", "kpi", "trends", "distribution", "blotter"],
    subsections: [
      { id: "kpi-metrics", title: "Key Performance Indicators", tags: ["total crimes", "offense", "hotspot", "kpi"] },
      { id: "charts-blotter", title: "Charts & Blotter Activity", tags: ["trajectory", "distribution", "blotter", "activity"] },
    ],
    component: DocsDashboard,
  },
  {
    id: "analytics",
    title: "Analytics",
    icon: TrendingUp,
    tags: ["analytics", "radar", "peak", "hours", "modus", "location", "heatmap", "matrix", "safety"],
    subsections: [
      { id: "math-metrics", title: "Mathematical Metrics & Indicators", tags: ["resolution rate", "safety index", "formula"] },
      { id: "visualizations", title: "Analytical Visualizations", tags: ["24-hour radar", "modus operandi", "heatmap", "matrix"] },
    ],
    component: DocsAnalytics,
  },
  {
    id: "cases",
    title: "Case Blotter",
    icon: FolderOpen,
    tags: ["cases", "blotter", "investigation", "dossier", "heinous", "sensational", "ego", "suspect"],
    subsections: [
      { id: "clearance-status", title: "Clearance Classifications", tags: ["cleared", "investigation", "court", "closed"] },
      { id: "dossier-fields", title: "Dossier Fields & Classifications", tags: ["heinous", "sensational", "ego", "investigator"] },
    ],
    component: DocsCases,
  },
  {
    id: "reports",
    title: "PDF Reports",
    icon: FileText,
    tags: ["reports", "pdf", "export", "download", "executive", "summary", "print"],
    subsections: [
      { id: "report-sections", title: "Configurable Report Sections", tags: ["executive", "briefing", "matrix", "recommendations"] },
      { id: "exporting-reports", title: "Generating & Exporting Reports", tags: ["pdf", "download", "steps"] },
    ],
    component: DocsReports,
  },
  {
    id: "notifications",
    title: "Notifications & Alerts",
    icon: Bell,
    tags: ["notifications", "alerts", "rules", "critical", "warning", "threshold", "heinous"],
    subsections: [
      { id: "severity-levels", title: "Alert Severity Levels", tags: ["critical", "warning", "info", "triggers"] },
      { id: "rule-configuration", title: "Rule Configuration", tags: ["hourly", "threshold", "surge", "rules"] },
    ],
    component: DocsNotifications,
  },
  {
    id: "settings",
    title: "Settings & RBAC",
    icon: ShieldCheck,
    tags: ["settings", "rbac", "permissions", "roles", "admin", "clearance", "audit", "security"],
    subsections: [
      { id: "rbac-matrix", title: "Permissions Matrix (RBAC)", tags: ["admin", "officer", "privileged", "clearance"] },
      { id: "config-sections", title: "Configuration Sections", tags: ["profile", "security", "audit logs", "preferences"] },
    ],
    component: DocsSettings,
  },
  {
    id: "upload",
    title: "Data Ingestion",
    icon: Upload,
    tags: ["upload", "excel", "xlsx", "schema", "columns", "import", "data", "pipeline"],
    subsections: [
      { id: "excel-schema", title: "Excel Column Schema", tags: ["headers", "xlsx", "format", "mandatory"] },
      { id: "validation-handling", title: "Validation & Error Handling", tags: ["centroid", "fallback", "duplicates", "audit"] },
    ],
    component: DocsUpload,
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    icon: AlertCircle,
    tags: ["troubleshooting", "faq", "error", "map", "charts", "browser"],
    subsections: [
      { id: "troubleshooting-issues", title: "Diagnostic Resolutions", tags: ["map tiles", "clearance", "download", "schema error"] },
    ],
    component: DocsTroubleshooting,
  },
];

export const DOCS_CATEGORIES: DocsCategoryItem[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "System overview, municipal context, and interactive tours",
    sectionIds: ["intro"],
  },
  {
    id: "spatial-intelligence",
    title: "Spatial Intelligence",
    description: "GIS crime map, barangay polygons, and timeline scrubber",
    sectionIds: ["map"],
  },
  {
    id: "operations-analytics",
    title: "Operations & Analytics",
    description: "KPI executive dashboard, temporal radar, and patterns",
    sectionIds: ["dashboard", "analytics"],
  },
  {
    id: "records-reports",
    title: "Records & Reports",
    description: "Police blotter case dossiers, flags, and PDF exports",
    sectionIds: ["cases", "reports"],
  },
  {
    id: "system-administration",
    title: "System Administration",
    description: "Alert triggers, batch ingestion, RBAC, and diagnostics",
    sectionIds: ["notifications", "upload", "settings", "troubleshooting"],
  },
];
