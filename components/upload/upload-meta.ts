/**
 * Shared vocabulary for the ingestion surfaces — the upload dialog and the upload
 * register. Mirrors the shape of components/notifications/notification-meta.tsx so both
 * ledgers speak the same language: a word for every status, a spine for position, and
 * never colour on its own.
 */

/** Columns the crime register accepts. Mirrors the scalar fields read by backend/api/crimes/upload/route.ts. */
export const EXPECTED_COLUMNS = [
  "blotter_no",
  "date_encoded",
  "police_regional_office",
  "police_provincial_office",
  "station",
  "police_community_precinct",
  "region",
  "province",
  "municipality",
  "barangay",
  "street",
  "type_of_place",
  "date_reported",
  "time_reported",
  "date_committed",
  "time_committed",
  "incident_type",
  "is_crime",
  "mode_reporting",
  "stage_of_felony",
  "offense",
  "offense_type",
  "section",
  "modus",
  "suspect_motive",
  "suspect_sub_motive",
  "heinous",
  "sensational",
  "threat_grp",
  "grp_affiliation",
  "incident_type_threat_grp",
  "mrs",
  "suspect_is_ego",
  "suspect_ego_position",
  "suspect_ego_class",
  "suspect_count",
  "suspect_arrested",
  "victim_is_ego",
  "victim_ego_position",
  "victim_ego_class",
  "victim_count",
  "case_status",
  "investigator",
  "head_investigator",
  "lat",
  "lng",
];

/**
 * Without these a row cannot be placed on the map or the clock, so the analytical
 * engine has nothing to evaluate. Stricter than the row-level check in the backend,
 * which only refuses rows missing barangay, date_reported, date_committed and
 * incident_type — the time columns are what the peak-hour rule reads.
 */
export const REQUIRED_COLUMNS = [
  "barangay",
  "date_reported",
  "time_reported",
  "date_committed",
  "time_committed",
  "incident_type",
];

const REQUIRED_SET = new Set(REQUIRED_COLUMNS);

export type UploadStatus = "success" | "partial" | "failed";

interface UploadStatusMeta {
  /** The status word. Present in every rendering, so colour is never the only carrier. */
  label: string;
  /** Depth chosen so it clears 4.5:1 on both paper-white and #0F172A. */
  text: string;
  /** The row spine: outcome is encoded by position + colour + word. */
  spine: string;
}

const STATUSES: Record<UploadStatus, UploadStatusMeta> = {
  success: {
    label: "Imported",
    text: "text-emerald-700 dark:text-emerald-400",
    spine: "bg-emerald-600 dark:bg-emerald-500",
  },
  partial: {
    label: "Partial",
    text: "text-amber-700 dark:text-amber-400",
    spine: "bg-amber-500",
  },
  failed: {
    label: "Failed",
    text: "text-red-700 dark:text-red-400",
    spine: "bg-red-600 dark:bg-red-500",
  },
};

/** Tolerant lookup — the column is a free-text string, so the register never blanks out on drift. */
export function uploadStatusMeta(status: string): UploadStatusMeta {
  return STATUSES[status as UploadStatus] ?? STATUSES.failed;
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Sheet headers arrive in whatever case and spacing the officer typed them. */
export function normaliseHeader(raw: unknown): string {
  return String(raw ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_");
}

export interface ColumnCheck {
  recognised: string[];
  /** Blocking: the engine cannot evaluate rows without these. */
  missingRequired: string[];
  /** Not blocking: rows import without them. */
  missingOptional: string[];
  /** Blocking: the register has nowhere to put these. */
  unknown: string[];
  isValid: boolean;
}

export function checkColumns(headers: string[]): ColumnCheck {
  const present = new Set(headers.filter(Boolean));

  const recognised: string[] = [];
  const missingRequired: string[] = [];
  const missingOptional: string[] = [];

  for (const column of EXPECTED_COLUMNS) {
    if (present.has(column)) recognised.push(column);
    else if (REQUIRED_SET.has(column)) missingRequired.push(column);
    else missingOptional.push(column);
  }

  const unknown = [...present].filter((header) => !EXPECTED_COLUMNS.includes(header));

  return {
    recognised,
    missingRequired,
    missingOptional,
    unknown,
    isValid: missingRequired.length === 0 && unknown.length === 0,
  };
}

/** One sentence naming the problem and the recovery, or what will happen if there is none. */
export function columnCheckSummary(check: ColumnCheck): string {
  const { missingRequired, unknown, missingOptional } = check;

  if (missingRequired.length && unknown.length) {
    return `Add the ${missingRequired.length} required column${
      missingRequired.length === 1 ? "" : "s"
    } and remove the ${unknown.length} the register does not hold, then choose the file again.`;
  }
  if (missingRequired.length) {
    return `Add the required column${
      missingRequired.length === 1 ? "" : "s"
    } to the header row, then choose the file again. Rows without them cannot be placed on the map or the clock.`;
  }
  if (unknown.length) {
    return `The register has nowhere to put ${
      unknown.length === 1 ? "this column" : "these columns"
    }. Remove them from the header row, then choose the file again.`;
  }
  if (missingOptional.length) {
    return `Every required column is present. The ${missingOptional.length} optional column${
      missingOptional.length === 1 ? "" : "s"
    } not in the file will be left empty.`;
  }
  return "Every column in the file matches the register.";
}
