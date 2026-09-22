"use client";

import React from "react";
import { ACCENT, ACCENT_DEEP, rgbToCss } from "@/lib/report-theme";

const ACCENT_CSS = rgbToCss(ACCENT);
const ACCENT_DEEP_CSS = rgbToCss(ACCENT_DEEP);

/** Numbered section header, mirroring lib/pdf-generator.ts's section() —
 *  same accent-deep numeral + rule the PDF's own table of contents uses. */
export function SectionHeader({ no, title, theme }: { no: string; title: string; theme: string }) {
  return (
    <div className="flex items-baseline gap-2.5 mb-4">
      <span
        className="font-heading text-[0.95rem] font-extrabold tabular-nums"
        style={{ color: theme === "dark" ? ACCENT_CSS : ACCENT_DEEP_CSS }}
      >
        {no}
      </span>
      <span className={`font-heading text-[1.15rem] font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
        {title}
      </span>
      <span className={`flex-1 h-px ml-1.5 ${theme === "dark" ? "bg-white/10" : "bg-slate-200"}`} />
    </div>
  );
}

/** Bespoke card shell for every panel on this page — deliberately not the
 *  shared shadcn Card/CardHeader/CardContent/CardFooter primitives, whose
 *  built-in padding (px-4, gap-4) doesn't match this page's own spacing
 *  system. Values here (22px padding, 18px under the title block, a 16px/
 *  14px rule before the footnote) mirror the page's design reference
 *  pixel-for-pixel rather than approximating with the nearest round
 *  Tailwind spacing step. */
export function Panel({
  theme,
  title,
  subtitle,
  help,
  footer,
  children,
  className = "",
  bodyClassName = "",
}: {
  theme: string;
  title: string;
  subtitle?: string;
  help?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div
      className={`rounded-xl border flex flex-col ${theme === "dark" ? "border-white/[0.06] bg-[#1e293b]" : "border-slate-200 bg-white"} ${className}`}
      style={{ padding: 22 }}
    >
      <div style={{ marginBottom: 18 }}>
        <div className="flex items-center gap-2" style={{ marginBottom: 3 }}>
          <h3 className={`font-heading text-[0.95rem] font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
            {title}
          </h3>
          {help}
        </div>
        {subtitle && (
          <p className={`text-[0.78rem] ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
            {subtitle}
          </p>
        )}
      </div>
      <div className={`flex-1 flex flex-col ${bodyClassName}`}>{children}</div>
      {footer && (
        <div
          className={`text-[0.8rem] space-y-1 border-t ${theme === "dark" ? "border-white/[0.06]" : "border-slate-100"}`}
          style={{ marginTop: 16, paddingTop: 14 }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
