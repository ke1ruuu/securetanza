import type { CrimeIncident } from "./api";

/** A "slice" is whatever the user clicked on in the Analytics page — one bar,
 *  one column, one heatmap cell. Every chart maps its datum onto one of these,
 *  and matchesSlice() is the single place that knows how a slice translates
 *  back into a filter over raw incidents. Keeping that knowledge in one file is
 *  what stops the drill-down list from drifting away from the chart it came
 *  from as charts get added or relabelled. */
export type AnalyticsSlice =
  | { kind: "crimeType"; value: string }
  | { kind: "barangay"; value: string }
  | { kind: "modus"; value: string }
  | { kind: "place"; value: string }
  | { kind: "month"; value: number } // 0–11
  | { kind: "hour"; value: number } // 0–23
  | { kind: "matrixCell"; crimeType: string; month: number };

export const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const MONTH_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "(Incident) Theft" → "Theft". The raw incidentType strings carry a category
 *  prefix that's redundant once every row on a chart is already a crime type. */
export function cleanLabel(label: string): string {
  return label.replace(/^\(Incident\)\s*/i, "");
}

/** 0 → "12 AM", 13 → "1 PM". */
export function formatHour(hour: number): string {
  if (hour === 0) return "12 AM";
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return "12 PM";
  return `${hour - 12} PM`;
}

/** Compare two labels that may differ by the "(Incident) " prefix, casing, or
 *  surrounding whitespace — chart labels are cleaned for display while the
 *  underlying incident fields are not. */
function sameLabel(a: string | undefined | null, b: string | undefined | null): boolean {
  if (!a || !b) return false;
  return cleanLabel(a).trim().toLowerCase() === cleanLabel(b).trim().toLowerCase();
}

/** Month of an incident, read straight off the ISO string rather than via
 *  `new Date(...).getMonth()`. dateCommitted is stored as a date at UTC
 *  midnight, so constructing a Date and reading a local month would shift the
 *  month for anyone in a negative-offset timezone. Slicing the string keeps
 *  this agreeing with the date the rest of the UI prints. */
export function incidentMonth(crime: CrimeIncident): number | null {
  if (!crime.dateCommitted) return null;
  const month = parseInt(String(crime.dateCommitted).slice(5, 7), 10);
  return Number.isNaN(month) || month < 1 || month > 12 ? null : month - 1;
}

/** Hour of an incident — parsed exactly the way useAnalyticsData builds
 *  hourlyDistribution ("HH:MM:SS" / "HH:MM"), so the Hour of Day drill-down can
 *  never disagree with the column it was launched from. */
export function incidentHour(crime: CrimeIncident): number | null {
  if (!crime.timeCommitted) return null;
  const hour = parseInt(String(crime.timeCommitted).split(":")[0], 10);
  return Number.isNaN(hour) || hour < 0 || hour > 23 ? null : hour;
}

export function matchesSlice(crime: CrimeIncident, slice: AnalyticsSlice): boolean {
  switch (slice.kind) {
    case "crimeType":
      return sameLabel(crime.incidentType, slice.value);
    case "barangay":
      return sameLabel(crime.barangay, slice.value);
    case "modus":
      return sameLabel(crime.modus, slice.value);
    case "place":
      return sameLabel(crime.typeOfPlace, slice.value);
    case "month":
      return incidentMonth(crime) === slice.value;
    case "hour":
      return incidentHour(crime) === slice.value;
    case "matrixCell":
      return (
        sameLabel(crime.incidentType, slice.crimeType) &&
        incidentMonth(crime) === slice.month
      );
  }
}

export function filterIncidents(
  crimes: CrimeIncident[],
  slice: AnalyticsSlice
): CrimeIncident[] {
  return crimes.filter((crime) => matchesSlice(crime, slice));
}

/**
 * Normalises a barangay name for comparison against the GeoJSON's `adm4_en`.
 *
 * The incident table writes the four Poblacion barangays as "BARANGAY I
 * (POB.)" while the GeoJSON calls them "Barangay I", so a plain
 * case-insensitive compare leaves those four polygons permanently unhighlighted.
 *
 * Note this strips the suffix and then expects an *exact* match — matching by
 * prefix/startsWith instead would happily bind "Barangay II (Pob.)" to
 * "Barangay I", because the latter is a prefix of the former.
 */
export function normalizeBarangayName(name?: string | null): string {
  return (name ?? "")
    .toLowerCase()
    .replace(/\(\s*pob\.?\s*\)/g, "") // drop the Poblacion marker
    .replace(/[^a-z0-9]+/g, " ") // punctuation → space
    .trim()
    .replace(/\s+/g, " ");
}

/** Human-readable name for the slice, used as the detail modal's title. */
export function sliceLabel(slice: AnalyticsSlice): string {
  switch (slice.kind) {
    case "crimeType":
    case "barangay":
    case "modus":
    case "place":
      return cleanLabel(slice.value);
    case "month":
      return MONTH_LONG[slice.value] ?? `Month ${slice.value + 1}`;
    case "hour":
      return formatHour(slice.value);
    case "matrixCell":
      return `${cleanLabel(slice.crimeType)} · ${MONTH_LONG[slice.month] ?? ""}`.trim();
  }
}

/** Short description of what the slice filtered on, shown under the title. */
export function sliceKindLabel(slice: AnalyticsSlice): string {
  switch (slice.kind) {
    case "crimeType":
      return "Crime type";
    case "barangay":
      return "Barangay";
    case "modus":
      return "Modus operandi";
    case "place":
      return "Location type";
    case "month":
      return "Month";
    case "hour":
      return "Hour of day";
    case "matrixCell":
      return "Crime type in month";
  }
}
