---
version: 1
slug: "app-compare-page-tsx"
primary_target: "app/compare/page.tsx"
related_targets: ["components/compare"]
---

# Compare maps (/compare)

Scope: new page inside the established SecureTanza console world (map page + dashboard). Mode: Operate.

Audience and job: operational officers and analysts comparing crime distribution across two periods (year, quarter, months, custom range) and/or two crime types, barangay by barangay. Success: in seconds, see where incidents rose or fell, and trust that a colour means the same count on both maps.

Confirmed answers: one shared threat scale across both maps; a change ledger (totals, shared scale, barangays ranked by rise/fall, row hover highlights both maps); each side owns its period and crime type.

Constraints: inherit the incumbent world (OVERLAY_SURFACE panels, sky accent, threat palette, Inter/Manrope, light + dark). Reuse the existing period picker. Do not disturb the main map's saved period.

## Direction contract

THESIS: Two periods, one ruler. Refuses the default of two independent dashboards glued together, each rescaling its own colours.

OWN-WORLD: The existing console: slate surfaces, hairline borders, rounded-xl floating overlay panels over full-bleed maps, sky #0EA5E9 for selection, Secure→Critical threat palette as the only data colours. A and B are identified by letter, never by a new hue.

STORY: The officer sets A and B (defaults: same months last year vs this year), reads the totals and change, scans the ledger for the biggest rises, hovers one, and sees that barangay lit on both maps with both counts.

FIRST VIEWPORT: Header; below it a hairline split of map A | map B filling the height, each with a top-left strip (letter, period trigger as the pane's title, crime type) and a bottom-left readout; right a 360px ledger column: totals ledger, shared scale with ranges, rise/fall/all list.

FORM: Linked split view with a change ledger; shaped directly from a precisely specified request (no concept-seed roll). Signature interaction: linked viewports and cross-hover across both maps and the ledger.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
