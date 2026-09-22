/**
 * Shared look for the panels that float over the map, so they read as part of
 * the same system as the dashboard pages (Analytics, Cases, Overview): a
 * hairline-bordered rounded-xl surface, uppercase micro-labels, sky-blue for
 * "selected". They still float and blur — the map is full-bleed — but drop the
 * old gradient edge lines and heavy glow shadows.
 */

/** The surface every floating map panel sits on. */
export const OVERLAY_SURFACE =
  "rounded-xl border border-slate-200 bg-white/95 shadow-lg shadow-slate-900/10 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#1e293b]/95 dark:shadow-black/40";

/** Uppercase micro-label used for panel and section titles. */
export const OVERLAY_LABEL =
  "text-[0.68rem] font-bold uppercase tracking-[0.11em] text-slate-500 dark:text-slate-400";

/** A list row: neutral hover, no focus ring (the fill already shows where you are). */
export const OVERLAY_ITEM =
  "rounded-lg outline-none transition-colors focus-visible:outline-none! text-slate-700 hover:bg-slate-100 focus-visible:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 dark:focus-visible:bg-white/10";

/** The chosen row in a list. */
export const OVERLAY_ITEM_ACTIVE =
  "rounded-lg outline-none transition-colors focus-visible:outline-none! bg-sky-50 font-semibold text-sky-700 hover:bg-sky-100 dark:bg-sky-400/15 dark:text-sky-300 dark:hover:bg-sky-400/25";

/** A small square/round control (zoom buttons, close buttons). */
export const OVERLAY_BUTTON =
  "flex items-center justify-center rounded-lg border border-slate-200 bg-white/95 text-slate-700 shadow-sm backdrop-blur-xl transition-colors hover:bg-slate-100 dark:border-white/[0.08] dark:bg-[#1e293b]/95 dark:text-slate-200 dark:hover:bg-[#273449]";
