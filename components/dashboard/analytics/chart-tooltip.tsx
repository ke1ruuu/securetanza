"use client";

import React, { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface TooltipRow {
  label: string;
  value: string;
  /** Renders a small colour chip before the label — used to echo the bar's
   *  own ramp colour so the tooltip is visibly tied to what's hovered. */
  swatch?: string;
}

export interface TooltipPayload {
  title: string;
  subtitle?: string;
  rows: TooltipRow[];
  /** Shown at the bottom in muted text, e.g. "Click to see incidents". */
  hint?: string;
}

interface TooltipState extends TooltipPayload {
  x: number;
  y: number;
}

const OFFSET = 14;
const EST_WIDTH = 230;
const EST_HEIGHT = 130;

/**
 * A single cursor-following tooltip shared by every datum in one chart.
 *
 * Deliberately not Radix HoverCard: the Analytics page has ~100 hoverable data
 * elements (ranked-bar rows, chart columns, heatmap cells) and mounting a
 * HoverCard per datum is both heavy and laggy — HoverCard is built for
 * deliberate, delayed reveals, not instant chart readout. One portal node
 * driven by mouse events is what charting libraries do, and it's what the
 * native `title=` attributes this replaces were failing to be.
 *
 * Usage:
 *   const { tooltip, bind } = useChartTooltip();
 *   <div {...bind({ title, rows })} />   // per datum
 *   {tooltip}                            // once per chart
 */
export function useChartTooltip(theme: string) {
  const [state, setState] = useState<TooltipState | null>(null);
  // Payload is kept in a ref so that mousemove only ever updates coordinates —
  // re-deriving the payload on every pixel of movement would be wasteful.
  const payloadRef = useRef<TooltipPayload | null>(null);

  const show = useCallback((e: React.MouseEvent, payload: TooltipPayload) => {
    payloadRef.current = payload;
    setState({ ...payload, x: e.clientX, y: e.clientY });
  }, []);

  const move = useCallback((e: React.MouseEvent) => {
    const payload = payloadRef.current;
    if (!payload) return;
    setState({ ...payload, x: e.clientX, y: e.clientY });
  }, []);

  const hide = useCallback(() => {
    payloadRef.current = null;
    setState(null);
  }, []);

  /**
   * Spread onto each hoverable datum. `onEnter` is for the chart's own
   * per-datum state (e.g. which row to highlight) and runs alongside showing
   * the tooltip — passing it here rather than adding a second onMouseEnter
   * prop matters, because a second prop would silently overwrite this one.
   *
   * Note there's deliberately no onMouseLeave: if each datum hid the tooltip
   * on leave, sliding from one row to the next would fire hide-then-show and
   * flicker. The chart's container calls hide() on its own onMouseLeave
   * instead, so moving within a chart just re-points the tooltip.
   */
  const bind = useCallback(
    (payload: TooltipPayload, onEnter?: () => void) => ({
      onMouseEnter: (e: React.MouseEvent) => {
        onEnter?.();
        show(e, payload);
      },
      onMouseMove: move,
    }),
    [show, move]
  );

  const tooltip = state ? <ChartTooltip state={state} theme={theme} /> : null;

  return { tooltip, bind, hide };
}

function ChartTooltip({ state, theme }: { state: TooltipState; theme: string }) {
  if (typeof document === "undefined") return null;

  const dark = theme === "dark";

  // Flip to the other side of the cursor when there isn't room, so the tooltip
  // never gets clipped at the viewport edge (same approach as the portal
  // dropdown in components/dashboard/barangay-multi-select.tsx).
  const flipX = state.x + OFFSET + EST_WIDTH > window.innerWidth;
  const flipY = state.y + OFFSET + EST_HEIGHT > window.innerHeight;

  const left = flipX ? state.x - OFFSET : state.x + OFFSET;
  const top = flipY ? state.y - OFFSET : state.y + OFFSET;

  return createPortal(
    <div
      role="tooltip"
      className={`fixed z-[70] rounded-lg border shadow-lg ${
        dark ? "border-white/10 bg-[#0f172a] text-slate-200" : "border-slate-200 bg-white text-slate-700"
      }`}
      style={{
        left,
        top,
        // The tooltip must never eat the mouse events that are driving it —
        // without this it would sit under the cursor and cause flicker.
        pointerEvents: "none",
        transform: `translate(${flipX ? "-100%" : "0"}, ${flipY ? "-100%" : "0"})`,
        padding: "10px 12px",
        minWidth: 160,
        maxWidth: EST_WIDTH,
      }}
    >
      <div className={`font-heading text-[0.8rem] font-bold ${dark ? "text-white" : "text-slate-900"}`}>
        {state.title}
      </div>
      {state.subtitle && (
        <div className={`text-[0.68rem] mt-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>
          {state.subtitle}
        </div>
      )}

      <div className="mt-2 flex flex-col gap-1">
        {state.rows.map((row, i) => (
          <div key={i} className="flex items-center justify-between gap-4 text-[0.75rem]">
            <span className={`flex items-center gap-1.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>
              {row.swatch && (
                <span
                  className="inline-block rounded-[2px]"
                  style={{ width: 8, height: 8, background: row.swatch }}
                />
              )}
              {row.label}
            </span>
            <span className={`font-bold tabular-nums ${dark ? "text-white" : "text-slate-900"}`}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {state.hint && (
        <div
          className={`mt-2 pt-2 border-t text-[0.68rem] ${
            dark ? "border-white/10 text-slate-500" : "border-slate-100 text-slate-400"
          }`}
        >
          {state.hint}
        </div>
      )}
    </div>,
    document.body
  );
}
