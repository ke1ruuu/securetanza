"use client";

import React, { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, FileSpreadsheet, Loader2, X } from "lucide-react";
import * as XLSX from "xlsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  checkColumns,
  columnCheckSummary,
  formatFileSize,
  normaliseHeader,
  uploadStatusMeta,
  type ColumnCheck,
} from "@/components/upload/upload-meta";

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Supplied by callers that refresh their own data; without it the page reloads once an entry is filed. */
  onUploaded?: () => void;
}

const MAX_BYTES = 10 * 1024 * 1024;

/** idle → reading → staged → importing → done. One value, so two states can never both be true. */
type Phase = "idle" | "reading" | "staged" | "importing" | "done";

interface SheetFacts {
  name: string;
  headerCount: number;
  rowCount: number;
}

interface Receipt {
  total: number;
  inserted: number;
  skipped: number;
  errors: string[];
  findings: number;
}

const MICRO = "text-[10px] font-medium tracking-[0.09em] uppercase text-slate-500 dark:text-slate-400";
const SECTION = "text-[10px] font-semibold tracking-[0.11em] uppercase text-slate-500 dark:text-slate-400";
const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4e86fd]/50 dark:focus-visible:ring-[#0EA5E9]/50";
const GHOST =
  "cursor-pointer rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11.5px] font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[0.1] dark:text-slate-200 dark:hover:bg-white/[0.05]";
const PRIMARY =
  "flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#4e86fd] px-3.5 py-1.5 text-[11.5px] font-semibold text-white transition-colors hover:bg-[#3d74e8] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[#0EA5E9] dark:hover:bg-[#0b8fcd]";
const MONO_LIST = "mt-1.5 font-mono text-[11px] leading-relaxed break-words";

/** Key/value line, borrowed verbatim from the notification centre's findings list. */
function LedgerRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-slate-200/80 py-2 last:border-b-0 dark:border-white/[0.06]">
      <dt className="text-[11.5px] text-slate-500 dark:text-slate-400">{label}</dt>
      <dd
        className={`text-right text-[11.5px] font-semibold tabular-nums ${
          tone ?? "text-slate-900 dark:text-slate-100"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function ColumnDisclosure({
  label,
  columns,
  tone,
}: {
  label: string;
  columns: string[];
  tone: string;
}) {
  return (
    <details className="group mt-4 border-t border-slate-200 pt-3 dark:border-white/[0.06]">
      <summary
        className={`flex cursor-pointer list-none items-center justify-between gap-3 rounded [&::-webkit-details-marker]:hidden ${SECTION} ${FOCUS}`}
      >
        <span>{label}</span>
        <span className="flex items-center gap-1.5 tabular-nums text-slate-400 dark:text-slate-500">
          {columns.length}
          <ChevronDown
            className="h-3 w-3 transition-transform duration-200 group-open:rotate-180"
            aria-hidden="true"
          />
        </span>
      </summary>
      <p className={`${MONO_LIST} ${tone}`}>{columns.join(", ")}</p>
    </details>
  );
}

export default function UploadModal({ open, onOpenChange, onUploaded }: UploadModalProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [sheet, setSheet] = useState<SheetFacts | null>(null);
  const [check, setCheck] = useState<ColumnCheck | null>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  /** Bumped whenever a read is superseded, so a resolved read cannot repopulate a cleared dialog. */
  const readToken = useRef(0);

  const clearFile = useCallback(() => {
    readToken.current += 1;
    setPhase("idle");
    setFile(null);
    setSheet(null);
    setCheck(null);
    setReceipt(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      onOpenChange(true);
      return;
    }
    // Never abandon a write that is already in flight.
    if (phase === "importing") return;

    const wasFiled = phase === "done";
    clearFile();
    onOpenChange(false);
    if (wasFiled) {
      if (onUploaded) onUploaded();
      else window.location.reload();
    }
  };

  /** Reads the header row locally so the officer learns about a bad file before anything is sent. */
  const readFile = useCallback(
    async (candidate: File) => {
      setError(null);
      setCheck(null);
      setSheet(null);
      setReceipt(null);

      if (!/\.(xlsx|xls)$/i.test(candidate.name)) {
        clearFile();
        setError("That is not an Excel workbook. Choose a .xlsx or .xls file.");
        return;
      }

      if (candidate.size > MAX_BYTES) {
        clearFile();
        setError(
          `${formatFileSize(candidate.size)} is over the 10 MB limit. Split the workbook by year or by station and import each part.`
        );
        return;
      }

      setFile(candidate);
      setPhase("reading");
      const token = (readToken.current += 1);

      try {
        const buffer = await candidate.arrayBuffer();
        if (readToken.current !== token) return;

        const workbook = XLSX.read(buffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const firstSheet = sheetName ? workbook.Sheets[sheetName] : undefined;
        const rows = firstSheet
          ? (XLSX.utils.sheet_to_json(firstSheet, { header: 1, blankrows: false }) as unknown[][])
          : [];

        if (rows.length === 0) {
          clearFile();
          setError("The workbook has no rows. Export it again with the header row included.");
          return;
        }

        const headers = (rows[0] ?? []).map(normaliseHeader);

        setSheet({
          name: sheetName || "Sheet 1",
          headerCount: headers.filter(Boolean).length,
          rowCount: Math.max(0, rows.length - 1),
        });
        setCheck(checkColumns(headers));
        setPhase("staged");
      } catch (err) {
        if (readToken.current !== token) return;
        console.error("Could not read the workbook:", err);
        clearFile();
        setError(
          "The workbook could not be read. It may be password protected or saved in an older format — re-save it as .xlsx and try again."
        );
      }
    },
    [clearFile]
  );

  const importDataset = async () => {
    if (!file || !check?.isValid || phase !== "staged") return;

    setPhase("importing");
    setError(null);

    try {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/crimes/upload", { method: "POST", body });
      const payload = await res.json();

      if (!res.ok || !payload?.success) {
        throw new Error(payload?.error || "The register refused the file.");
      }

      // The backend writes the register entry itself, so the client must not file a second one.
      const data = payload.data ?? {};
      setReceipt({
        total: Number(data.total ?? sheet?.rowCount ?? 0),
        inserted: Number(data.inserted ?? 0),
        skipped: Number(data.skipped ?? 0),
        errors: Array.isArray(data.errors) ? data.errors : [],
        findings: Number(payload.notificationsGenerated ?? 0),
      });
      setPhase("done");
    } catch (err) {
      console.error("Import failed:", err);
      setError(err instanceof Error ? err.message : "The import did not finish. Try again.");
      setPhase("staged");
    }
  };

  const busy = phase === "reading" || phase === "importing";

  const outcome = receipt
    ? receipt.inserted === 0
      ? "failed"
      : receipt.skipped > 0
        ? "partial"
        : "success"
    : "success";
  const outcomeMeta = uploadStatusMeta(outcome);

  const verdictMeta = uploadStatusMeta(check?.isValid ? "success" : "failed");
  const verdictLabel = check?.isValid ? "Ready" : "Blocked";

  const statusLine =
    phase === "reading"
      ? "Reading the header row."
      : phase === "importing"
        ? "Writing rows to the register. A large workbook can take a minute."
        : phase === "done"
          ? "Entry filed."
          : check && !check.isValid
            ? "Correct the header row in Excel, then choose the file again."
            : check && sheet
              ? `${sheet.rowCount.toLocaleString("en-US")} rows ready to import.`
              : "";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[88vh] w-[calc(100%-1.5rem)] max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-xl border-0 bg-white p-0 ring-slate-900/10 sm:max-w-2xl dark:bg-[#0F172A] dark:ring-white/[0.12]"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-white/[0.06]">
          <div className="min-w-0">
            <DialogTitle className="font-heading text-[15px] font-semibold text-slate-900 dark:text-white">
              Import crime dataset
            </DialogTitle>
            <DialogDescription className="mt-1 max-w-xl text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              The header row is checked against the crime register before any row is written.
              Analytical findings are generated once the entry is filed.
            </DialogDescription>
          </div>

          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            disabled={phase === "importing"}
            className={`cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-white/[0.06] dark:hover:text-white ${FOCUS}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Close the import dialog</span>
          </button>
        </header>

        {/* Indeterminate, because neither the read nor the write reports real progress. */}
        <div className="h-[2px] shrink-0 overflow-hidden" aria-hidden="true">
          {busy && (
            <div className="h-full w-1/3 animate-pulse rounded-full bg-[#4e86fd] dark:bg-[#0EA5E9]" />
          )}
        </div>

        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-5">
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (selected) readFile(selected);
            }}
          />

          <div className="divide-y divide-slate-200 dark:divide-white/[0.06]">
            {phase === "idle" && (
              <section className="py-4">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const dropped = e.dataTransfer.files[0];
                    if (dropped) readFile(dropped);
                  }}
                  className={`flex w-full cursor-pointer flex-col items-start gap-2.5 rounded-xl border border-dashed px-6 py-10 text-left transition-colors ${FOCUS} ${
                    isDragging
                      ? "border-[#4e86fd] bg-[#4e86fd]/[0.06] dark:border-[#0EA5E9] dark:bg-[#0EA5E9]/[0.08]"
                      : "border-slate-300 hover:border-slate-400 hover:bg-slate-50 dark:border-white/[0.14] dark:hover:border-white/25 dark:hover:bg-white/[0.025]"
                  }`}
                >
                  <span className={`flex items-center gap-1.5 ${MICRO}`}>
                    <FileSpreadsheet className="h-3 w-3 shrink-0" aria-hidden="true" />
                    Source file
                  </span>
                  <span className="font-heading text-[15px] leading-snug font-semibold text-slate-900 dark:text-white">
                    Drop an Excel workbook here, or click to browse
                  </span>
                  <span className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    .xlsx or .xls, up to 10 MB. The first sheet is read.
                  </span>
                </button>

                {error && (
                  <p
                    role="alert"
                    className="mt-3 text-xs leading-relaxed text-red-700 dark:text-red-400"
                  >
                    <span className="font-semibold">File refused. </span>
                    {error}
                  </p>
                )}
              </section>
            )}

            {file && phase !== "idle" && (
              <section className="py-4">
                <p className={SECTION}>Source file</p>
                <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5">
                  <h3 className="min-w-0 font-heading text-[13.5px] leading-snug font-semibold break-all text-slate-900 dark:text-white">
                    {file.name}
                  </h3>
                  {phase !== "importing" && (
                    <button
                      type="button"
                      onClick={clearFile}
                      className={`shrink-0 cursor-pointer rounded text-[11.5px] font-medium text-[#2b62d8] underline-offset-2 hover:underline dark:text-[#38BDF8] ${FOCUS}`}
                    >
                      {phase === "done" ? "Import another file" : "Choose another file"}
                    </button>
                  )}
                </div>

                <dl className="mt-2">
                  <LedgerRow label="Size" value={formatFileSize(file.size)} />
                  {sheet && (
                    <>
                      <LedgerRow label="Sheet" value={sheet.name} />
                      <LedgerRow
                        label="Rows in sheet"
                        value={sheet.rowCount.toLocaleString("en-US")}
                      />
                      <LedgerRow
                        label="Headers read"
                        value={sheet.headerCount.toLocaleString("en-US")}
                      />
                    </>
                  )}
                </dl>
              </section>
            )}

            {check && phase !== "done" && (
              <section className="relative py-4 pl-4">
                <span
                  aria-hidden="true"
                  className={`absolute top-4 bottom-4 left-0 w-[2px] ${verdictMeta.spine}`}
                />

                <p className={`flex flex-wrap items-center gap-1.5 ${MICRO}`}>
                  Column check
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
                    /
                  </span>
                  <span className={`font-semibold ${verdictMeta.text}`}>{verdictLabel}</span>
                </p>

                <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {columnCheckSummary(check)}
                </p>

                <dl className="mt-3">
                  <LedgerRow
                    label="Recognised"
                    value={String(check.recognised.length)}
                  />
                  {check.missingRequired.length > 0 && (
                    <LedgerRow
                      label="Required, not present"
                      value={String(check.missingRequired.length)}
                      tone="text-red-700 dark:text-red-400"
                    />
                  )}
                  <LedgerRow
                    label="Optional, not present"
                    value={String(check.missingOptional.length)}
                  />
                  {check.unknown.length > 0 && (
                    <LedgerRow
                      label="Not in the register"
                      value={String(check.unknown.length)}
                      tone="text-red-700 dark:text-red-400"
                    />
                  )}
                </dl>

                {check.missingRequired.length > 0 && (
                  <div className="mt-4">
                    <p className={SECTION}>Add these to the header row</p>
                    <p className={`${MONO_LIST} text-red-700 dark:text-red-400`}>
                      {check.missingRequired.join(", ")}
                    </p>
                  </div>
                )}

                {check.unknown.length > 0 && (
                  <div className="mt-4">
                    <p className={SECTION}>Remove these from the header row</p>
                    <p className={`${MONO_LIST} text-red-700 dark:text-red-400`}>
                      {check.unknown.join(", ")}
                    </p>
                  </div>
                )}

                {check.missingOptional.length > 0 && (
                  <ColumnDisclosure
                    label="Optional columns left empty"
                    columns={check.missingOptional}
                    tone="text-slate-500 dark:text-slate-400"
                  />
                )}

                {check.recognised.length > 0 && (
                  <ColumnDisclosure
                    label="Recognised columns"
                    columns={check.recognised}
                    tone="text-slate-600 dark:text-slate-300"
                  />
                )}

                {error && (
                  <p
                    role="alert"
                    className="mt-4 border-t border-slate-200 pt-3 text-xs leading-relaxed text-red-700 dark:border-white/[0.06] dark:text-red-400"
                  >
                    <span className="font-semibold">Import stopped. </span>
                    {error}
                  </p>
                )}
              </section>
            )}

            {receipt && phase === "done" && (
              <section className="relative py-4 pl-4">
                <span
                  aria-hidden="true"
                  className={`absolute top-4 bottom-4 left-0 w-[2px] ${outcomeMeta.spine}`}
                />

                <p className={`flex flex-wrap items-center gap-1.5 ${MICRO}`}>
                  Import receipt
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
                    /
                  </span>
                  <span className={`font-semibold ${outcomeMeta.text}`}>{outcomeMeta.label}</span>
                </p>

                <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {receipt.inserted === 0
                    ? "No rows could be written. Every row was missing a barangay, a date or an incident type."
                    : receipt.skipped > 0
                      ? `${receipt.skipped.toLocaleString("en-US")} row${
                          receipt.skipped === 1 ? " was" : "s were"
                        } left out because required values were blank. The rest are in the register.`
                      : "Every row in the workbook was written to the register."}
                </p>

                <dl className="mt-3">
                  <LedgerRow label="Rows read" value={receipt.total.toLocaleString("en-US")} />
                  <LedgerRow
                    label="Records imported"
                    value={receipt.inserted.toLocaleString("en-US")}
                  />
                  <LedgerRow
                    label="Rows skipped"
                    value={receipt.skipped.toLocaleString("en-US")}
                    tone={
                      receipt.skipped > 0
                        ? "text-amber-700 dark:text-amber-400"
                        : undefined
                    }
                  />
                  <LedgerRow
                    label="Findings generated"
                    value={receipt.findings.toLocaleString("en-US")}
                  />
                </dl>

                {receipt.errors.length > 0 && (
                  <div className="mt-4">
                    <p className={SECTION}>First skipped rows</p>
                    <ul className="mt-1.5 space-y-1">
                      {receipt.errors.slice(0, 3).map((message, i) => (
                        <li
                          key={i}
                          className="font-mono text-[11px] leading-relaxed break-words text-slate-500 dark:text-slate-400"
                        >
                          {message}
                        </li>
                      ))}
                    </ul>
                    {receipt.errors.length > 3 && (
                      <p className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                        {(receipt.errors.length - 3).toLocaleString("en-US")} more are kept on the
                        register entry.
                      </p>
                    )}
                  </div>
                )}

                <p className="mt-4 border-t border-slate-200 pt-3 text-xs leading-relaxed text-slate-500 dark:border-white/[0.06] dark:text-slate-400">
                  The entry is filed in{" "}
                  <Link
                    href="/dashboard/upload-logs"
                    onClick={() => handleOpenChange(false)}
                    className="font-medium text-[#2b62d8] underline-offset-2 hover:underline dark:text-[#38BDF8]"
                  >
                    upload history
                  </Link>
                  {receipt.findings > 0
                    ? ". The new findings are waiting in the notification bell."
                    : "."}
                </p>
              </section>
            )}
          </div>
        </div>

        {phase !== "idle" && (
          <footer className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-slate-200 px-5 py-3.5 dark:border-white/[0.06]">
            <p
              role="status"
              aria-live="polite"
              className="min-h-4 text-[11px] tabular-nums text-slate-500 dark:text-slate-400"
            >
              {statusLine}
            </p>

            <div className="ml-auto flex items-center gap-2">
              {phase === "done" ? (
                <button type="button" onClick={() => handleOpenChange(false)} className={`${PRIMARY} ${FOCUS}`}>
                  Done
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleOpenChange(false)}
                    disabled={phase === "importing"}
                    className={`${GHOST} ${FOCUS}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={importDataset}
                    disabled={phase !== "staged" || !check?.isValid}
                    className={`${PRIMARY} ${FOCUS}`}
                  >
                    {phase === "importing" && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                    )}
                    {phase === "importing" ? "Importing" : "Import dataset"}
                  </button>
                </>
              )}
            </div>
          </footer>
        )}
      </DialogContent>
    </Dialog>
  );
}
