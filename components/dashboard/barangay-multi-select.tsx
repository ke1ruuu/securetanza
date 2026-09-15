"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search } from "lucide-react";

interface BarangayMultiSelectProps {
  names: string[];
  selected: Set<string>;
  onToggle: (name: string) => void;
}

/** A checkbox list of barangays that lives in a portal, positioned with
 *  `fixed` coordinates computed from the trigger button — not nested inside
 *  the report card's own layout flow at all. Rendering it in-flow (the way
 *  the header's barangay selector does, via a `position: absolute` panel
 *  inside the scrolling card) was letting its full content height leak into
 *  the ancestor's scrollable area, showing as blank space past the real
 *  content. A portal can't do that: it's a sibling of the whole app shell,
 *  so however tall it gets, it never touches anyone else's layout. */
export default function BarangayMultiSelect({ names, selected, onToggle }: BarangayMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [coords, setCoords] = useState<{
    left: number;
    width: number;
    maxHeight: number;
    top?: number;
    bottom?: number;
  } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /** Opens downward when there's room; flips above the trigger otherwise,
   *  and always caps its own height to whichever side it lands on — so it
   *  can never render partially off the bottom of a short viewport. */
  const place = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const margin = 8;
    const spaceBelow = window.innerHeight - rect.bottom - margin;
    const spaceAbove = rect.top - margin;
    const preferredHeight = 320;
    const openUp = spaceBelow < preferredHeight && spaceAbove > spaceBelow;

    setCoords({
      left: Math.max(margin, Math.min(rect.left, window.innerWidth - Math.max(rect.width, 280) - margin)),
      width: Math.max(rect.width, 280),
      maxHeight: Math.min(preferredHeight, Math.max(160, openUp ? spaceAbove : spaceBelow)),
      ...(openUp ? { bottom: window.innerHeight - rect.top + 6 } : { top: rect.bottom + 6 }),
    });
  };

  const openPanel = () => {
    place();
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;

    const onOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      setOpen(false);
      setQuery("");
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    // The trigger sits inside the report card's own scroll container, not
    // the window — closing on any scroll of that ancestor (captured, since
    // the scroll event itself doesn't bubble) avoids the panel drifting
    // away from a trigger that just moved out from under it.
    const onScroll = () => setOpen(false);

    document.addEventListener("mousedown", onOutside);
    document.addEventListener("keydown", onEscape);
    window.addEventListener("resize", place);
    document.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("keydown", onEscape);
      window.removeEventListener("resize", place);
      document.removeEventListener("scroll", onScroll, true);
    };
  }, [open]);

  const filtered = names.filter((name) => name.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-label="Pick barangays for their own zoomed map"
        onClick={() => (open ? setOpen(false) : openPanel())}
        className="flex min-w-0 flex-1 items-center gap-4 text-left"
      >
        <span aria-hidden className="w-5 shrink-0" />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium text-slate-900 dark:text-white">Per-barangay map</span>
          <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-500">
            Pick any barangay for its own zoomed map — independent of this report&apos;s scope
          </span>
        </span>
        {selected.size > 0 && (
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-white/[0.06] dark:text-slate-300">
            {selected.size}
          </span>
        )}
        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open &&
        coords &&
        createPortal(
          <div
            ref={panelRef}
            style={{
              position: "fixed",
              top: coords.top,
              bottom: coords.bottom,
              left: coords.left,
              width: coords.width,
              maxHeight: coords.maxHeight,
            }}
            className="z-50 flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-300/30 dark:border-white/[0.08] dark:bg-[#0F172A] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          >
            <div className="shrink-0 border-b border-slate-100 p-2 dark:border-white/[0.06]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search barangay…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-xs text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#4e86fd] dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-600 dark:focus:border-[#0EA5E9]"
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto custom-scrollbar">
              {names.length === 0 ? (
                <p className="px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-500">Loading barangay list…</p>
              ) : filtered.length === 0 ? (
                <p className="px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-500">No results found</p>
              ) : (
                filtered.map((name) => {
                  const checked = selected.has(name);
                  return (
                    <label
                      key={name}
                      className="flex cursor-pointer items-center gap-2.5 border-b border-slate-100 px-3 py-2 transition-colors last:border-0 hover:bg-slate-50 dark:border-white/[0.04] dark:hover:bg-white/[0.05]"
                    >
                      <input type="checkbox" checked={checked} onChange={() => onToggle(name)} className="sr-only" />
                      <span
                        aria-hidden
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition-colors ${
                          checked
                            ? "border-[#4e86fd] bg-[#4e86fd] dark:border-[#0EA5E9] dark:bg-[#0EA5E9]"
                            : "border-slate-300 dark:border-slate-600"
                        }`}
                      >
                        {checked && <Check className="h-2.5 w-2.5 stroke-[3] text-white" />}
                      </span>
                      <span className="text-xs text-slate-700 dark:text-slate-300">{name}</span>
                    </label>
                  );
                })
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
