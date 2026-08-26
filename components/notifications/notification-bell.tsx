"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Bell, RotateCw, Archive } from "lucide-react";
import NotificationHistoryModal from "./notification-history-modal";
import {
  absoluteTime,
  categoryMeta,
  isoTime,
  relativeTime,
  severityMeta,
  type NotificationItem,
} from "./notification-meta";

const POLL_MS = 45000;
const PREVIEW_LIMIT = 8;

const FILTERS = [
  { key: "ALL", label: "All" },
  { key: "ALERTS", label: "Alerts" },
  { key: "DATASETS", label: "Datasets" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

function matchesFilter(item: NotificationItem, filter: FilterKey) {
  if (filter === "ALERTS") return item.category === "PEAK_HOUR" || item.category === "CRIME_ACTIVITY";
  if (filter === "DATASETS") return item.category === "DATASET_PROCESSING";
  return true;
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<"initial" | "ready" | "error">("initial");
  const [filter, setFilter] = useState<FilterKey>("ALL");
  const [announcement, setAnnouncement] = useState("");

  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const lastUnreadRef = useRef<number | null>(null);

  useEffect(() => {
    pausedRef.current = isOpen || historyOpen;
  }, [isOpen, historyOpen]);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/notifications?limit=${PREVIEW_LIMIT}&view=active`);
      if (!res.ok) {
        setStatus("error");
        return;
      }
      const data = await res.json();
      if (!data?.success) {
        setStatus("error");
        return;
      }

      const nextUnread = data.unreadCount || 0;
      setNotifications(data.data || []);
      setUnreadCount(nextUnread);
      setTotal(data.activeCount ?? data.total ?? 0);
      setStatus("ready");

      const previous = lastUnreadRef.current;
      if (previous !== null && nextUnread > previous) {
        const delta = nextUnread - previous;
        setAnnouncement(`${delta} new notification${delta === 1 ? "" : "s"}.`);
      }
      lastUnreadRef.current = nextUnread;
    } catch (err) {
      console.warn("Could not retrieve notifications at this time:", err);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(() => {
      if (!pausedRef.current) load();
    }, POLL_MS);
    return () => clearInterval(interval);
  }, [load]);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) panelRef.current?.focus();
  }, [isOpen]);

  const markReadAndArchive = async (ids: string[]) => {
    const body = ids.length === 1 ? { notificationIds: ids, isRead: true } : { markAllAsRead: true };
    // Automatically archive once read
    setNotifications((prev) =>
      prev.map((n) =>
        ids.includes(n.id) || ids.length !== 1
          ? { ...n, isRead: true, isArchived: true, readAt: new Date().toISOString(), archivedAt: new Date().toISOString() }
          : n
      )
    );
    setUnreadCount((c) => (ids.length === 1 ? Math.max(0, c - 1) : 0));
    lastUnreadRef.current = null;
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      load();
    } catch (err) {
      console.error("Failed to update read & archive state:", err);
      load();
    }
  };

  const visible = useMemo(
    () => notifications.filter((n) => matchesFilter(n, filter)),
    [notifications, filter]
  );
  const criticalUnread = notifications.filter((n) => !n.isRead && n.severity === "CRITICAL").length;

  const triggerLabel = unreadCount
    ? `Notifications, ${unreadCount} unread${criticalUnread ? `, ${criticalUnread} critical` : ""}`
    : "Notifications, none unread";

  return (
    <>
      <div ref={wrapperRef} className="relative">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-controls="notification-popover"
          aria-label={triggerLabel}
          className={`relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border transition-colors duration-200 sm:h-10 sm:w-10 ${
            isOpen
              ? "border-[#4e86fd]/40 bg-[#4e86fd]/10 text-[#4e86fd] dark:border-[#0EA5E9]/40 dark:bg-[#0EA5E9]/15 dark:text-[#0EA5E9]"
              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-white"
          }`}
        >
          <Bell className="h-4 w-4" aria-hidden="true" />

          {unreadCount > 0 && (
            <span
              aria-hidden="true"
              className={`absolute -top-1 -right-1 min-w-[17px] rounded-full px-[3px] text-center text-[10px] font-semibold leading-[17px] tabular-nums text-white ring-2 ring-white dark:ring-[#0f172a] ${
                criticalUnread > 0 ? "bg-red-600" : "bg-[#4e86fd] dark:bg-[#0EA5E9]"
              }`}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        <p role="status" aria-live="polite" className="sr-only">
          {announcement}
        </p>

        {isOpen && (
          <div
            id="notification-popover"
            ref={panelRef}
            role="dialog"
            aria-label="Notifications"
            tabIndex={-1}
            className="absolute top-[calc(100%+10px)] right-0 z-50 w-[min(24.5rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_18px_44px_-14px_rgba(15,23,42,0.3)] outline-none animate-in fade-in-0 slide-in-from-top-1 duration-150 dark:border-white/[0.08] dark:bg-[#0F172A] dark:shadow-[0_24px_60px_-16px_rgba(0,0,0,0.85)]"
          >
            <div className="flex items-baseline justify-between gap-3 px-4 pt-3.5 pb-3">
              <div className="flex items-baseline gap-2">
                <h2 className="font-heading text-[13px] font-semibold text-slate-900 dark:text-white">
                  Notifications
                </h2>
                <span className="text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
                  {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                </span>
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markReadAndArchive([])}
                  className="cursor-pointer text-[11px] font-medium text-[#2b62d8] underline-offset-2 hover:underline dark:text-[#38BDF8]"
                >
                  Mark all read & archive
                </button>
              )}
            </div>

            {criticalUnread > 0 && (
              <p className="border-t border-slate-100 px-4 py-2 text-[11px] font-medium text-red-700 dark:border-white/[0.05] dark:text-red-400">
                {criticalUnread} critical finding{criticalUnread === 1 ? "" : "s"} awaiting review
              </p>
            )}

            <div
              role="group"
              aria-label="Filter notifications"
              className="flex items-center gap-5 border-y border-slate-100 px-4 dark:border-white/[0.05]"
            >
              {FILTERS.map((tab) => {
                const active = filter === tab.key;
                const count = notifications.filter((n) => matchesFilter(n, tab.key)).length;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setFilter(tab.key)}
                    aria-pressed={active}
                    className={`relative cursor-pointer py-2.5 text-[11px] font-medium tracking-[0.08em] uppercase transition-colors ${
                      active
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200"
                    }`}
                  >
                    {tab.label}
                    <span className="ml-1.5 tabular-nums text-slate-400 dark:text-slate-600">{count}</span>
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[#4e86fd] dark:bg-[#0EA5E9]"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {status === "initial" ? (
              <div className="divide-y divide-slate-100 dark:divide-white/[0.05]">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="space-y-2 px-4 py-3.5" aria-hidden="true">
                    <div className="h-2 w-24 rounded-full bg-slate-100 dark:bg-white/[0.07]" />
                    <div className="h-2.5 w-3/4 rounded-full bg-slate-100 dark:bg-white/[0.07]" />
                    <div className="h-2 w-full rounded-full bg-slate-100/70 dark:bg-white/[0.05]" />
                  </div>
                ))}
                <p className="sr-only">Loading notifications</p>
              </div>
            ) : status === "error" ? (
              <div className="px-4 py-8 text-center">
                <p className="text-[12.5px] text-slate-600 dark:text-slate-300">
                  Notifications could not be loaded.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStatus("initial");
                    load();
                  }}
                  className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[11.5px] font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/[0.1] dark:text-slate-200 dark:hover:bg-white/[0.05]"
                >
                  <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
                  Try again
                </button>
              </div>
            ) : visible.length === 0 ? (
              <div className="px-4 py-9 text-center">
                <p className="text-[12px] leading-relaxed text-slate-500 dark:text-slate-400">
                  {filter === "ALL"
                    ? "No active unread findings. Read notifications are automatically archived."
                    : "No active notifications in this category."}
                </p>
              </div>
            ) : (
              <ul className="custom-scrollbar max-h-[22rem] divide-y divide-slate-100 overflow-y-auto dark:divide-white/[0.05]">
                {visible.map((item) => {
                  const category = categoryMeta(item.category);
                  const severity = severityMeta(item.severity);
                  const Icon = category.icon;
                  const target = item.metadata?.targetUrl as string | undefined;
                  const datasetYear = item.metadata?.datasetYear as string | undefined;

                  return (
                    <li key={item.id} className="relative">
                      <span
                        aria-hidden="true"
                        className={`absolute top-0 left-0 h-full w-[2px] ${severity.spine} ${
                          item.isRead ? "opacity-25" : ""
                        }`}
                      />
                      <div className="py-3 pr-3 pl-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="flex min-w-0 items-center gap-1.5 text-[10px] font-medium tracking-[0.09em] text-slate-500 uppercase dark:text-slate-400">
                            <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
                            <span className="truncate">{category.label}</span>
                            {item.severity !== "INFO" && (
                              <>
                                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
                                  /
                                </span>
                                <span className={`shrink-0 font-semibold ${severity.text}`}>
                                  {severity.label}
                                </span>
                              </>
                            )}
                            {datasetYear && (
                              <span className="shrink-0 rounded bg-slate-100 px-1 py-0.2 text-[9px] font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                                {datasetYear}
                              </span>
                            )}
                          </span>

                          <span className="flex shrink-0 items-center gap-1">
                            <time
                              dateTime={isoTime(item.createdAt)}
                              title={`Notified: ${absoluteTime(item.createdAt)}`}
                              className="text-[10px] tabular-nums text-slate-400 dark:text-slate-500"
                            >
                              {relativeTime(item.createdAt)}
                            </time>
                            {!item.isRead && (
                              <button
                                type="button"
                                onClick={() => markReadAndArchive([item.id])}
                                title={`Mark as read and archive: "${item.title}"`}
                                aria-label={`Mark "${item.title}" as read and archive`}
                                className="-mr-1 grid h-6 w-6 cursor-pointer place-items-center rounded-full transition-colors hover:bg-slate-100 dark:hover:bg-white/[0.08]"
                              >
                                <span
                                  aria-hidden="true"
                                  className="h-[7px] w-[7px] rounded-full bg-[#4e86fd] dark:bg-[#0EA5E9]"
                                />
                              </button>
                            )}
                          </span>
                        </div>

                        <h3 className="mt-1.5 font-heading text-[12.5px] leading-snug font-semibold text-slate-900 dark:text-white">
                          {target ? (
                            <Link
                              href={target}
                              onClick={() => {
                                setIsOpen(false);
                                if (!item.isRead) markReadAndArchive([item.id]);
                              }}
                              className="underline-offset-2 hover:underline"
                            >
                              {item.title}
                            </Link>
                          ) : (
                            item.title
                          )}
                        </h3>

                        <p className="mt-1 line-clamp-2 text-[11.5px] leading-relaxed text-slate-500 dark:text-slate-400">
                          {item.message}
                        </p>

                        <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
                          <span>Notified: {absoluteTime(item.createdAt)}</span>
                          {item.isArchived && (
                            <span className="flex items-center gap-1 text-slate-400">
                              <Archive className="h-2.5 w-2.5" /> Archived
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="border-t border-slate-100 p-2 dark:border-white/[0.05]">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setHistoryOpen(true);
                }}
                className="flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-[11.5px] font-medium text-[#2b62d8] transition-colors hover:bg-slate-50 dark:text-[#38BDF8] dark:hover:bg-white/[0.04]"
              >
                <span>Open notification center (Active & Archive)</span>
                <span className="tabular-nums text-slate-400 dark:text-slate-500">{total} active</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <NotificationHistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onRefreshParent={load}
      />
    </>
  );
}
