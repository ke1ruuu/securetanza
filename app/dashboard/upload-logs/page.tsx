"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RefreshCw } from "lucide-react";
import MapHeader from "@/components/layout/map-header";
import DashboardBarangaySelector from "@/components/dashboard/dashboard-barangay-selector";
import { MapProvider } from "@/context/MapContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { absoluteTime, isoTime, relativeTime } from "@/components/notifications/notification-meta";
import { formatFileSize, uploadStatusMeta } from "@/components/upload/upload-meta";

interface UploadLog {
  id: string;
  fileName: string | null;
  fileSize: number | null;
  recordsImported: number;
  outcome: string;
  status: string;
  errorMessage?: string | null;
  user?: string | null;
  uploadedBy?: string | null;
  createdAt: string;
  uploadedAt: string;
}

const SECTION = "text-[10px] font-semibold tracking-[0.11em] uppercase text-slate-500 dark:text-slate-400";
const TH = `pb-2 align-bottom ${SECTION}`;
const CELL = "py-3 align-top text-[11.5px] text-slate-500 dark:text-slate-400";
const SKELETON = "h-2 rounded-full bg-slate-100 dark:bg-white/[0.07]";
const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4e86fd]/50 dark:focus-visible:ring-[#0EA5E9]/50";

function Separator() {
  return (
    <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
      /
    </span>
  );
}

function UploadLogsContent() {
  const searchParams = useSearchParams();
  const rawParamName = searchParams.get("name");
  const barangayName = rawParamName || "General Dashboard";

  const [logs, setLogs] = useState<UploadLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/audit-logs?action=Import&limit=100");
      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || "The register did not respond.");
      }

      const rawLogs = Array.isArray(data.data) ? data.data : (Array.isArray(data.logs) ? data.logs : []);
      const mappedLogs: UploadLog[] = rawLogs.map((log: any) => {
        const rawStatus = log.outcome || log.status || "success";
        const dateStr = log.createdAt || log.created_at || log.uploadedAt || new Date().toISOString();
        const userName = log.user || log.uploadedBy || null;
        return {
          id: String(log.id),
          fileName: log.fileName ?? log.file_name ?? null,
          fileSize: typeof log.fileSize === "number" ? log.fileSize : (typeof log.file_size === "number" ? log.file_size : null),
          recordsImported: Number(log.recordsImported ?? log.records_imported ?? 0),
          outcome: rawStatus,
          status: rawStatus,
          errorMessage: log.errorMessage ?? log.error_message ?? null,
          user: userName,
          uploadedBy: userName,
          createdAt: dateStr,
          uploadedAt: dateStr,
        };
      });

      setLogs(mappedLogs);
      setTotal(Number(data?.meta?.total ?? data?.total ?? mappedLogs.length));
    } catch (err) {
      console.error("Error loading upload logs:", err);
      // An empty table would read as "nothing has ever been imported", which is a different fact.
      setError("The register could not be read. Check the connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const tally = useMemo(() => {
    let imported = 0;
    let partial = 0;
    let failed = 0;
    let records = 0;
    for (const log of logs) {
      const status = log.status || log.outcome;
      if (status === "success") imported++;
      else if (status === "partial") partial++;
      else failed++;
      records += (log.recordsImported || 0);
    }
    return { imported, partial, failed, records };
  }, [logs]);

  const windowed = logs.length < total;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f1f5f9] font-sans text-slate-900 transition-colors duration-700 dark:bg-[#0f172a] dark:text-slate-100">
      <MapHeader isVisible={true} />

      <div className="flex shrink-0 items-center gap-4 border-b border-slate-200/60 bg-white/60 px-6 py-3 dark:border-white/[0.04] dark:bg-[#0f172a]/80">
        <DashboardBarangaySelector currentBarangay={barangayName} />
        <div className="h-5 w-px bg-slate-200 dark:bg-white/10" />
        <span className="text-sm font-medium text-slate-400 dark:text-slate-500">Upload register</span>
      </div>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="custom-scrollbar flex-1 overflow-x-hidden overflow-y-auto scroll-smooth">
          <div className="mx-auto w-full max-w-5xl px-6 py-6">
            <header className="border-b border-slate-200 pb-4 dark:border-white/[0.06]">
              <p className={SECTION}>Ingestion</p>
              <h1 className="font-heading mt-1.5 text-[19px] font-semibold tracking-tight text-slate-900 dark:text-white">
                Upload register
              </h1>
              <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Every workbook filed against the crime register, newest first. A row is skipped when a
                required value is blank — the reason is kept on the entry.
              </p>
            </header>

            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-slate-200 py-2.5 dark:border-white/[0.06]">
              {loading ? (
                <span className="flex items-center gap-2" aria-hidden="true">
                  <span className={`${SKELETON} w-24 animate-pulse`} />
                  <span className={`${SKELETON} w-16 animate-pulse`} />
                  <span className={`${SKELETON} w-20 animate-pulse`} />
                </span>
              ) : (
                <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] text-slate-500 tabular-nums dark:text-slate-400">
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {total.toLocaleString("en-US")} {total === 1 ? "entry" : "entries"}
                  </span>
                  {windowed && (
                    <>
                      <Separator />
                      <span>latest {logs.length.toLocaleString("en-US")} shown</span>
                    </>
                  )}
                  <Separator />
                  <span>{tally.imported.toLocaleString("en-US")} imported</span>
                  {tally.partial > 0 && (
                    <>
                      <Separator />
                      <span className="text-amber-700 dark:text-amber-400">
                        {tally.partial.toLocaleString("en-US")} partial
                      </span>
                    </>
                  )}
                  {tally.failed > 0 && (
                    <>
                      <Separator />
                      <span className="text-red-700 dark:text-red-400">
                        {tally.failed.toLocaleString("en-US")} failed
                      </span>
                    </>
                  )}
                  <Separator />
                  <span>
                    {tally.records.toLocaleString("en-US")} records{windowed ? " in view" : ""}
                  </span>
                </p>
              )}

              <button
                type="button"
                onClick={loadLogs}
                disabled={loading}
                className={`ml-auto flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11.5px] font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.1] dark:text-slate-200 dark:hover:bg-white/[0.05] ${FOCUS}`}
              >
                <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
                Refresh
              </button>
            </div>

            {error ? (
              <div role="alert" className="py-14">
                <h2 className="font-heading text-[15px] font-semibold text-slate-900 dark:text-white">
                  Register unavailable
                </h2>
                <p className="mt-1.5 max-w-md text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {error}
                </p>
                <button
                  type="button"
                  onClick={loadLogs}
                  className={`mt-3 cursor-pointer rounded-lg bg-[#4e86fd] px-3.5 py-1.5 text-[11.5px] font-semibold text-white transition-colors hover:bg-[#3d74e8] dark:bg-[#0EA5E9] dark:hover:bg-[#0b8fcd] ${FOCUS}`}
                >
                  Try again
                </button>
              </div>
            ) : !loading && logs.length === 0 ? (
              <div className="py-14">
                <h2 className="font-heading text-[15px] font-semibold text-slate-900 dark:text-white">
                  Nothing imported yet
                </h2>
                <p className="mt-1.5 max-w-md text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  Use the upload button in the header to import an Excel workbook. Each import is filed
                  here with its record count, the officer who filed it, and any rows that were skipped.
                </p>
              </div>
            ) : (
              <table className="w-full table-fixed border-collapse text-left">
                <caption className="sr-only">
                  Upload history, newest first: file name, records imported, outcome, who filed it, and
                  when.
                </caption>
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/[0.06]">
                    <th scope="col" className={`${TH} pl-4`}>
                      File
                    </th>
                    <th scope="col" className={`${TH} hidden w-24 text-right md:table-cell`}>
                      Records
                    </th>
                    <th scope="col" className={`${TH} hidden w-24 md:table-cell`}>
                      Outcome
                    </th>
                    <th scope="col" className={`${TH} hidden w-44 lg:table-cell`}>
                      Filed by
                    </th>
                    <th scope="col" className={`${TH} hidden w-24 text-right md:table-cell`}>
                      Filed
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
                  {loading
                    ? Array.from({ length: 8 }).map((_, i) => (
                        <tr key={i} className="animate-pulse" aria-hidden="true">
                          <td className={`${CELL} pl-4`}>
                            <span className={`${SKELETON} block w-2/3`} />
                          </td>
                          <td className={`${CELL} hidden md:table-cell`}>
                            <span className={`${SKELETON} ml-auto block w-10`} />
                          </td>
                          <td className={`${CELL} hidden md:table-cell`}>
                            <span className={`${SKELETON} block w-14`} />
                          </td>
                          <td className={`${CELL} hidden lg:table-cell`}>
                            <span className={`${SKELETON} block w-24`} />
                          </td>
                          <td className={`${CELL} hidden md:table-cell`}>
                            <span className={`${SKELETON} ml-auto block w-12`} />
                          </td>
                        </tr>
                      ))
                    : logs.map((log) => {
                        const status = uploadStatusMeta(log.status);
                        return (
                          <tr
                            key={log.id}
                            className="transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                          >
                            <td className={`${CELL} relative pl-4`}>
                              <span
                                aria-hidden="true"
                                className={`absolute top-3 bottom-3 left-0 w-[2px] ${status.spine}`}
                              />
                              <span className="font-heading block leading-snug font-semibold break-all text-slate-900 dark:text-white">
                                {log.fileName || "Unnamed file"}
                              </span>

                              {/* Narrow screens have no columns to read, so the same facts flow inline. */}
                              <span className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] tabular-nums md:hidden">
                                <span className={`font-semibold ${status.text}`}>{status.label}</span>
                                <Separator />
                                <span>
                                  {log.recordsImported.toLocaleString("en-US")}{" "}
                                  {log.recordsImported === 1 ? "record" : "records"}
                                </span>
                                <Separator />
                                <span>{relativeTime(log.uploadedAt)}</span>
                              </span>

                              <span className="mt-1 flex flex-wrap items-center gap-x-1.5 text-[11px] text-slate-400 tabular-nums dark:text-slate-500">
                                <span>{log.fileSize ? formatFileSize(log.fileSize) : "—"}</span>
                                {log.uploadedBy && (
                                  <span className="lg:hidden">
                                    <Separator /> {log.uploadedBy}
                                  </span>
                                )}
                              </span>

                              {log.errorMessage && (
                                <span
                                  title={log.errorMessage}
                                  className="mt-1.5 line-clamp-2 block text-[11px] leading-relaxed text-slate-500 dark:text-slate-400"
                                >
                                  {log.errorMessage}
                                </span>
                              )}
                            </td>

                            <td
                              className={`${CELL} hidden text-right font-semibold tabular-nums text-slate-900 md:table-cell dark:text-slate-100`}
                            >
                              {log.recordsImported.toLocaleString("en-US")}
                            </td>

                            <td className={`${CELL} hidden md:table-cell`}>
                              <span className={`font-semibold ${status.text}`}>{status.label}</span>
                            </td>

                            <td className={`${CELL} hidden truncate lg:table-cell`}>
                              {log.uploadedBy || "—"}
                            </td>

                            <td className={`${CELL} hidden text-right tabular-nums md:table-cell`}>
                              <time dateTime={isoTime(log.uploadedAt)} title={absoluteTime(log.uploadedAt)}>
                                {relativeTime(log.uploadedAt)}
                              </time>
                            </td>
                          </tr>
                        );
                      })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function UploadLogsPage() {
  return (
    <ThemeProvider>
      <MapProvider>
        <Suspense
          fallback={
            <div className="flex h-screen items-center justify-center bg-[#f1f5f9] text-[11px] tracking-[0.09em] text-slate-500 uppercase dark:bg-[#0f172a] dark:text-slate-400">
              Loading register
            </div>
          }
        >
          <UploadLogsContent />
        </Suspense>
      </MapProvider>
    </ThemeProvider>
  );
}
