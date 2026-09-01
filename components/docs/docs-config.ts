import {
  BookOpen,
  Map,
  BarChart3,
  TrendingUp,
  Brain,
  FolderOpen,
  FileText,
  Bell,
  ShieldCheck,
  Upload,
  AlertCircle,
} from "lucide-react";
import { DocsSectionItem } from "./docs-types";
import { DocsIntro } from "./docs-intro";
import { DocsMap } from "./docs-map";
import { DocsDashboard } from "./docs-dashboard";
import { DocsAnalytics } from "./docs-analytics";
import { DocsPredictive } from "./docs-predictive";
import { DocsCases } from "./docs-cases";
import { DocsReports } from "./docs-reports";
import { DocsNotifications } from "./docs-notifications";
import { DocsSettings } from "./docs-settings";
import { DocsUpload } from "./docs-upload";
import { DocsTroubleshooting } from "./docs-troubleshooting";

export const DOCS_SECTIONS: DocsSectionItem[] = [
  {
    id: "intro",
    title: "1. Introduction & Overview",
    icon: BookOpen,
    badge: "Core",
    tags: ["welcome", "overview", "system", "architecture", "tanza", "gis"],
    component: DocsIntro,
  },
  {
    id: "map",
    title: "2. Interactive GIS Crime Map",
    icon: Map,
    badge: "Map",
    tags: ["gis", "map", "barangay", "filters", "time", "playback", "threat", "legend", "export"],
    component: DocsMap,
  },
  {
    id: "dashboard",
    title: "3. Executive Dashboard & Overview",
    icon: BarChart3,
    badge: "Dashboard",
    tags: ["overview", "dashboard", "kpi", "trends", "distribution", "blotter"],
    component: DocsDashboard,
  },
  {
    id: "analytics",
    title: "4. Historical Crime Analytics",
    icon: TrendingUp,
    badge: "Analytics",
    tags: ["analytics", "radar", "peak", "hours", "modus", "location", "heatmap", "matrix", "safety"],
    component: DocsAnalytics,
  },
  {
    id: "predictive",
    title: "5. Predictive Analytics & ARIMA",
    icon: Brain,
    badge: "AI Forecasting",
    tags: ["predictive", "arima", "forecast", "confidence", "mape", "mae", "rmse", "ai"],
    component: DocsPredictive,
  },
  {
    id: "cases",
    title: "6. Case Blotter & Dossier",
    icon: FolderOpen,
    badge: "Cases",
    tags: ["cases", "blotter", "investigation", "dossier", "heinous", "sensational", "ego", "suspect"],
    component: DocsCases,
  },
  {
    id: "reports",
    title: "7. Institutional PDF Reports",
    icon: FileText,
    badge: "Reports",
    tags: ["reports", "pdf", "export", "download", "executive", "summary", "print"],
    component: DocsReports,
  },
  {
    id: "notifications",
    title: "8. Alert & Notification Intelligence",
    icon: Bell,
    badge: "Alerts",
    tags: ["notifications", "alerts", "rules", "critical", "warning", "threshold", "heinous"],
    component: DocsNotifications,
  },
  {
    id: "settings",
    title: "9. System Settings & RBAC Clearances",
    icon: ShieldCheck,
    badge: "Security",
    tags: ["settings", "rbac", "permissions", "roles", "admin", "clearance", "audit", "security"],
    component: DocsSettings,
  },
  {
    id: "upload",
    title: "10. Batch Data Ingestion & Schema",
    icon: Upload,
    badge: "Ingestion",
    tags: ["upload", "excel", "xlsx", "schema", "columns", "import", "data", "pipeline"],
    component: DocsUpload,
  },
  {
    id: "troubleshooting",
    title: "11. System Diagnostics & Troubleshooting",
    icon: AlertCircle,
    badge: "Diagnostics",
    tags: ["troubleshooting", "faq", "error", "map", "charts", "arima", "browser"],
    component: DocsTroubleshooting,
  },
];
