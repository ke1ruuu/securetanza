/**
 * Shared vocabulary for the ingestion surfaces — the upload dialog and the upload
 * register. Mirrors the shape of components/notifications/notification-meta.tsx so both
 * ledgers speak the same language: a word for every status, a spine for position, and
 * never colour on its own.
 */

/**
 * Largest workbook the register accepts, enforced on both sides of the wire:
 * the dialog refuses it before reading, the route refuses it before parsing.
 */
export const MAX_UPLOAD_BYTES =  50 * 1024 * 1024;
export const MAX_UPLOAD_LABEL = "50 MB"

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
function tidyHeader(raw: unknown): string {
  return String(raw ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_");
}

/** Case, spacing and punctuation dropped, so dateReported, date_reported and "Date Reported" all meet. */
function compactHeader(raw: unknown): string {
  return String(raw ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Headers in the PNP incident export that no amount of reformatting turns into a
 * register column — abbreviations, and one misspelling the export has always had.
 */
const HEADER_ALIASES: Record<string, string> = {
  pro: "police_regional_office",
  ppo: "police_provincial_office",
  stn: "station",
  pcp: "police_community_precinct",
  municipal: "municipality",
  iscime: "is_crime",
  headinves: "head_investigator",
};

const COLUMN_BY_COMPACT_HEADER = new Map<string, string>([
  ...EXPECTED_COLUMNS.map((column) => [compactHeader(column), column] as const),
  ...Object.entries(HEADER_ALIASES).map(([alias, column]) => [compactHeader(alias), column] as const),
]);

/**
 * The register column a sheet header names, however the export spelled it
 * (dateReported → date_reported, stn → station). A header that names no register
 * column comes back only tidied, and is skipped at import. Shared by the dialog and
 * the upload route, so what the check promises is what the import reads.
 */
export function normaliseHeader(raw: unknown): string {
  const tidy = tidyHeader(raw);
  return COLUMN_BY_COMPACT_HEADER.get(compactHeader(tidy)) ?? tidy;
}

export interface HeaderRename {
  /** The header as typed in the sheet. */
  from: string;
  /** The register column it was read as. */
  to: string;
}

export interface ColumnCheck {
  recognised: string[];
  /** Not blocking: headers spelled differently from the register, read as the column they name. */
  renamed: HeaderRename[];
  /** Blocking: the engine cannot evaluate rows without these. */
  missingRequired: string[];
  /** Not blocking: rows import without them. */
  missingOptional: string[];
  /** Not blocking: the register has nowhere to put these, so they're dropped and every other column still imports. */
  unknown: string[];
  isValid: boolean;
}

/** Takes the header row exactly as the sheet holds it. */
export function checkColumns(rawHeaders: unknown[]): ColumnCheck {
  const present = new Set<string>();
  const renamed: HeaderRename[] = [];

  for (const raw of rawHeaders) {
    const header = normaliseHeader(raw);
    if (!header || present.has(header)) continue;
    present.add(header);
    // Case and spacing were always forgiven, so only a real respelling is worth reporting.
    if (header !== tidyHeader(raw)) renamed.push({ from: String(raw).trim(), to: header });
  }

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
    renamed,
    missingRequired,
    missingOptional,
    unknown,
    // Unknown columns are dropped at import rather than refused, so they no
    // longer block the file — only a missing required column does.
    isValid: missingRequired.length === 0,
  };
}

/** One sentence naming the problem and the recovery, or what will happen if there is none. */
export function columnCheckSummary(check: ColumnCheck): string {
  const { missingRequired, unknown, missingOptional } = check;

  if (missingRequired.length && unknown.length) {
    return `Add the ${missingRequired.length} required column${
      missingRequired.length === 1 ? "" : "s"
    } to the header row, then choose the file again. The ${unknown.length} column${
      unknown.length === 1 ? "" : "s"
    } the register doesn't hold will be skipped, not refused.`;
  }
  if (missingRequired.length) {
    return `Add the required column${
      missingRequired.length === 1 ? "" : "s"
    } to the header row, then choose the file again. Rows without them cannot be placed on the map or the clock.`;
  }
  if (unknown.length) {
    return `The register has no field for ${
      unknown.length === 1 ? "one column" : `${unknown.length} columns`
    } in the file. ${unknown.length === 1 ? "It" : "They"} will be skipped — every other column still imports.`;
  }
  if (missingOptional.length) {
    return `Every required column is present. The ${missingOptional.length} optional column${
      missingOptional.length === 1 ? "" : "s"
    } not in the file will be left empty.`;
  }
  return "Every column in the file matches the register.";
}
