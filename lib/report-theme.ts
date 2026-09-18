import type { RGB } from './geo-threat';

export type { RGB };

/** Shared ink/accent palette for anything that renders in the report's visual
 *  system — the PDF (lib/pdf-generator.ts) and the exported chart/map images
 *  (lib/image-export.ts) both use this, so a PPT image looks like it came
 *  from the same document as the PDF.
 *
 *  One ink, one accent. Accent tints carry data; accent-deep carries accent
 *  text, because #0EA5E9 on paper falls below 3:1 at text sizes. */
export const INK: RGB = [15, 23, 42];
export const INK_MID: RGB = [51, 65, 85];
export const INK_SOFT: RGB = [100, 116, 139];
export const RULE: RGB = [148, 163, 184];
export const HAIR: RGB = [214, 222, 232];
export const ACCENT: RGB = [14, 165, 233];
export const ACCENT_DEEP: RGB = [3, 105, 161];
export const PAPER: RGB = [255, 255, 255];

/** Sequential ramp: pale sky → deep sky. Encodes magnitude, prints legibly. */
export const RAMP_LO: RGB = [222, 242, 254];
export const RAMP_HI: RGB = [7, 89, 133];

export function mix(a: RGB, b: RGB, t: number): RGB {
  const k = Math.max(0, Math.min(1, t));
  return [
    Math.round(a[0] + (b[0] - a[0]) * k),
    Math.round(a[1] + (b[1] - a[1]) * k),
    Math.round(a[2] + (b[2] - a[2]) * k),
  ];
}

/** Perceptual-ish ease so mid-range values stay distinguishable on paper. */
export function rampColor(intensity: number): RGB {
  return mix(RAMP_LO, RAMP_HI, Math.pow(Math.max(0, Math.min(1, intensity)), 0.75));
}

/** Dark-mode counterpart to RAMP_LO/RAMP_HI. The paper ramp goes pale → deep
 *  navy because "more ink" reads as "more emphasis" on white paper — but
 *  that direction inverts on a dark card, where deep navy has *less*
 *  contrast against the background than the mid-tones do. Live dashboard
 *  charts (not the PDF, which is always paper) use this instead so the
 *  highest-magnitude mark is always the most visually prominent one. */
export const DARK_RAMP_LO: RGB = [30, 45, 68];
export const DARK_RAMP_HI: RGB = [56, 189, 248];

/** rampColor, but themed — use this (not rampColor) for anything that
 *  renders live in the app rather than onto paper. */
export function rampColorForTheme(intensity: number, theme: "light" | "dark"): RGB {
  const t = Math.pow(Math.max(0, Math.min(1, intensity)), 0.75);
  return theme === "dark" ? mix(DARK_RAMP_LO, DARK_RAMP_HI, t) : mix(RAMP_LO, RAMP_HI, t);
}

export function rgbToCss([r, g, b]: RGB): string {
  return `rgb(${r}, ${g}, ${b})`;
}
