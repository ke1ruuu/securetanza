"use client";

import React from "react";
import { useMapContext } from "@/context/MapContext";
import { useThreatLevels, THREAT_COLORS } from "@/hooks/useThreatLevels";
import { OVERLAY_SURFACE } from "@/lib/map-overlay";

/**
 * A one-line key for the barangay shading: Secure → Critical with five colour
 * steps between. Kept tiny on purpose — the exact incident range for each step
 * is in its tooltip (from the same live thresholds that colour the map), and
 * clicking a step spotlights just those barangays.
 */
export default function ThreatScale() {
  const { hoveredThreatLevel, setHoveredThreatLevel } = useMapContext();
  const { thresholds, loading } = useThreatLevels();

  const steps = [
    { key: "secure", label: "Secure", range: "0" },
    { key: "low", label: "Low", range: `1–${thresholds.low}` },
    { key: "moderate", label: "Moderate", range: `${thresholds.low + 1}–${thresholds.moderate}` },
    { key: "high", label: "High", range: `${thresholds.moderate + 1}–${thresholds.high}` },
    { key: "critical", label: "Critical", range: `${thresholds.high + 1}+` },
  ] as const;

  const endLabel = "text-[0.62rem] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400";

  return (
    <div
      data-tour="map-threat-scale"
      role="group"
      aria-label="Threat level scale"
      className={`pointer-events-auto flex h-8 items-center gap-2.5 px-3 ${OVERLAY_SURFACE}`}
    >
      <span className={endLabel}>Secure</span>

      <div className="flex items-center gap-0.5">
        {steps.map((step) => {
          const active = hoveredThreatLevel === step.key;
          const dimmed = hoveredThreatLevel !== null && !active;
          return (
            <button
              key={step.key}
              onClick={() => setHoveredThreatLevel(active ? null : step.key)}
              aria-pressed={active}
              aria-label={step.label}
              title={`${step.label} — ${step.range} incidents. Click to highlight on the map.`}
              disabled={loading}
              className={`group flex h-6 w-6 cursor-pointer items-center justify-center outline-none focus-visible:outline-none! ${
                dimmed ? "opacity-35" : "opacity-100"
              } transition-opacity duration-200 disabled:cursor-default`}
            >
              <span
                className={`block w-full rounded-full transition-all duration-200 ${
                  active ? "h-2.5" : "h-1.5 group-hover:h-2.5"
                } ${loading ? "animate-pulse bg-slate-300 dark:bg-white/20" : ""}`}
                style={loading ? undefined : { backgroundColor: THREAT_COLORS[step.key] }}
              />
            </button>
          );
        })}
      </div>

      <span className={endLabel}>Critical</span>
    </div>
  );
}
