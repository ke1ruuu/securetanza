"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Search,
  Trash2,
  X,
  Archive,
  ArchiveRestore,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CATEGORY_FILTERS,
  HIDDEN_METADATA_KEYS,
  SEVERITY_FILTERS,
  absoluteTime,
  categoryMeta,
  isoTime,
  metadataLabel,
  metadataValue,
  relativeTime,
  severityMeta,
  type NotificationItem,
} from "./notification-meta";

export type { NotificationItem };

interface NotificationHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshParent?: () => void;
}

const PAGE_SIZE = 15;

type ArchiveViewMode = "active" | "archived" | "all";

/** Reading a notification archives it, so Active is the working queue and Archived the record. */
const VIEW_TABS = [
  { key: "active", label: "Active" },
  { key: "archived", label: "Archived" },
  { key: "all", label: "All" },
] as const;

export default function NotificationHistoryModal({
  isOpen,
  onClose,
  onRefreshParent,
}: NotificationHistoryModalProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [status, setStatus] = useState<"initial" | "refreshing" | "ready" | "error">("initial");
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [archivedCount, setArchivedCount] = useState(0);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string>("ALL");
  const [severity, setSeverity] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<ArchiveViewMode>("active");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [mobilePane, setMobilePane] = useState<"list" | "detail">("list");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchNotifications = useCallback(async () => {
    setStatus((prev) => (prev === "ready" ? "refreshing" : prev === "error" ? "initial" : prev));
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
        category,
        severity,
        view: viewMode,
        unreadOnly: String(unreadOnly),
      });
      if (search) params.set("search", search);

      const res = await fetch(`/api/notifications?${params.toString()}`);
      if (!res.ok) {
        setStatus("error");
        return;
      }
      const data = await res.json();
      if (!data?.success) {
        setStatus("error");
        return;
      }

      setNotifications(data.data || []);
      setTotal(data.total || 0);
      setUnreadCount(data.unreadCount || 0);
      setActiveCount(data.activeCount || 0);
      setArchivedCount(data.archivedCount || 0);
      setStatus("ready");
    } catch (err) {
      console.warn("Failed to fetch notification history:", err);
      setStatus("error");
    }
  }, [page, category, severity, viewMode, unreadOnly, search]);

  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen, fetchNotifications]);

  const selected = useMemo(
    () => notifications.find((n) => n.id === selectedId) ?? null,
    [notifications, selectedId]
  );

  /** Derived, not synced: a selection that filters out of the page falls back to the list. */
  const showDetail = mobilePane === "detail" && selected !== null;

  // Mark single as read and auto-archive
  const markAsReadAndArchive = async (id: string) => {
    const now = new Date().toISOString();
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, isRead: true, readAt: now, isArchived: true, archivedAt: now } : n
      )
    );
    setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: [id], isRead: true }),
      });
      onRefreshParent?.();
      fetchNotifications();
    } catch (err) {
      console.error("Error marking notification as read & archiving:", err);
      fetchNotifications();
    }
  };

  // Restore/Unarchive notification
  const toggleArchiveStatus = async (id: string, currentlyArchived: boolean) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notificationIds: [id],
          isArchived: !currentlyArchived,
          unarchive: currentlyArchived,
        }),
      });
      onRefreshParent?.();
      fetchNotifications();
    } catch (err) {
      console.error("Error updating archive status:", err);
      fetchNotifications();
    }
  };

  // Mark all unread as read and auto-archive
  const markAllReadAndArchive = async () => {
    const now = new Date().toISOString();
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true, readAt: now, isArchived: true, archivedAt: now }))
    );
    setUnreadCount(0);
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllAsRead: true }),
      });
      onRefreshParent?.();
      fetchNotifications();
    } catch (err) {
      console.error("Error marking all read & archiving:", err);
      fetchNotifications();
    }
  };

  const deleteNotification = async (id: string) => {
    setConfirmDeleteId(null);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setTotal((t) => Math.max(0, t - 1));
    try {
      await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      onRefreshParent?.();
    } catch (err) {
      console.error("Error deleting notification:", err);
      fetchNotifications();
    }
  };

  const selectNotification = (item: NotificationItem) => {
    setSelectedId(item.id);
    setMobilePane("detail");
    setConfirmDeleteId(null);
    if (!item.isRead) markAsReadAndArchive(item.id);
  };

  const filtersActive = category !== "ALL" || severity !== "ALL" || unreadOnly || search !== "" || viewMode !== "active";
  const clearFilters = () => {
    setCategory("ALL");
    setSeverity("ALL");
    setViewMode("active");
    setUnreadOnly(false);
    setSearchInput("");
    setPage(1);
  };

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const firstRow = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastRow = Math.min(page * PAGE_SIZE, total);
  const busy = status === "initial" || status === "refreshing";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="flex h-[88vh] max-h-[48rem] w-[calc(100%-1.5rem)] max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-xl border-0 bg-white p-0 ring-slate-900/10 sm:max-w-5xl dark:bg-[#0F172A] dark:ring-white/[0.12]"
      >
        {/* Header */}
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-white/[0.06]">
          <div className="min-w-0">
            <div className="flex items-baseline gap-2.5">
              <DialogTitle className="font-heading text-[17px] font-semibold text-slate-900 dark:text-white">
                Analytical Notification & Intelligence Center
              </DialogTitle>
              <span className="text-xs tabular-nums text-slate-500 dark:text-slate-400">
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
              </span>
            </div>
            <DialogDescription className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Automated analytical findings and crime notifications generated post dataset ingestion. Read notifications are automatically archived.
            </DialogDescription>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllReadAndArchive}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-[#2b62d8] transition-colors hover:bg-slate-100 dark:border-white/10 dark:text-[#38BDF8] dark:hover:bg-white/[0.06]"
              >
                <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Mark all read & archive
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/[0.06] dark:hover:text-white"
            >
              <X className="h-4.5 w-4.5" aria-hidden="true" />
              <span className="sr-only">Close notification center</span>
            </button>
          </div>
        </header>

        {/* Primary axis — which shelf of the ledger is being read */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 px-5 dark:border-white/[0.06]">
          <div
            role="group"
            aria-label="Notification shelf"
            className="custom-scrollbar flex items-center gap-5 overflow-x-auto"
          >
            {VIEW_TABS.map((tab) => {
              const active = viewMode === tab.key;
              const count =
                tab.key === "active"
                  ? activeCount
                  : tab.key === "archived"
                    ? archivedCount
                    : activeCount + archivedCount;
              return (
                <button
                  key={tab.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setViewMode(tab.key);
                    setPage(1);
                  }}
                  className={`relative shrink-0 cursor-pointer py-2.5 text-[11px] font-medium tracking-[0.08em] whitespace-nowrap uppercase transition-colors ${
                    active
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200"
                  }`}
                >
                  {tab.label}
                  <span className="ml-1.5 tabular-nums text-slate-400 dark:text-slate-600">
                    {count}
                  </span>
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

          <p className="hidden shrink-0 text-[11px] tabular-nums text-slate-400 sm:block dark:text-slate-500">
            {total === 0 ? "No results" : `${firstRow}–${lastRow} of ${total}`}
          </p>
        </div>

        {/* Refinements bar */}
        <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-b border-slate-200 px-5 py-2.5 dark:border-white/[0.06]">
          <div className="relative min-w-[12rem] flex-1 sm:max-w-[15rem]">
            <label htmlFor="notification-search" className="sr-only">
              Search notifications
            </label>
            <Search
              className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              id="notification-search"
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search titles and messages"
              className="w-full rounded-lg border border-slate-200 bg-white py-1 pr-2.5 pl-8 text-xs text-slate-900 placeholder-slate-400 dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-white dark:placeholder-slate-500"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <label
              htmlFor="notification-category"
              className="text-[10px] font-medium tracking-[0.09em] text-slate-400 uppercase dark:text-slate-500"
            >
              Category
            </label>
            <select
              id="notification-category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 dark:border-white/[0.1] dark:bg-[#0F172A] dark:text-slate-200"
            >
              {CATEGORY_FILTERS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <label
              htmlFor="notification-severity"
              className="text-[10px] font-medium tracking-[0.09em] text-slate-400 uppercase dark:text-slate-500"
            >
              Severity
            </label>
            <select
              id="notification-severity"
              value={severity}
              onChange={(e) => {
                setSeverity(e.target.value);
                setPage(1);
              }}
              className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 dark:border-white/[0.1] dark:bg-[#0F172A] dark:text-slate-200"
            >
              {SEVERITY_FILTERS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-600 select-none dark:text-slate-300">
            <input
              type="checkbox"
              checked={unreadOnly}
              onChange={(e) => {
                setUnreadOnly(e.target.checked);
                setPage(1);
              }}
              className="h-4 w-4 cursor-pointer rounded-[4px] border-slate-300 accent-[#4e86fd] dark:border-white/20 dark:accent-[#0EA5E9]"
            />
            Unread only
          </label>

          {filtersActive && (
            <button
              type="button"
              onClick={clearFilters}
              className="cursor-pointer text-xs font-medium text-slate-500 underline-offset-2 hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-white"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Refresh progress */}
        <div className="h-[2px] shrink-0 overflow-hidden bg-transparent">
          {busy && (
            <div className="h-full w-1/3 animate-pulse rounded-full bg-[#4e86fd] dark:bg-[#0EA5E9]" />
          )}
        </div>

        {/* Body */}
        <div className="flex min-h-0 flex-1">
          {/* Ledger / List */}
          <div
            className={`min-w-0 flex-1 flex-col md:flex md:border-r md:border-slate-200 md:dark:border-white/[0.06] ${
              showDetail ? "hidden" : "flex"
            }`}
          >
            <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto" aria-busy={busy}>
              {status === "initial" ? (
                <ul className="divide-y divide-slate-100 dark:divide-white/[0.05]">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <li key={i} className="space-y-2.5 px-5 py-4" aria-hidden="true">
                      <div className="h-2 w-28 rounded-full bg-slate-100 dark:bg-white/[0.07]" />
                      <div className="h-3 w-2/3 rounded-full bg-slate-100 dark:bg-white/[0.07]" />
                      <div className="h-2 w-full rounded-full bg-slate-100/70 dark:bg-white/[0.05]" />
                    </li>
                  ))}
                </ul>
              ) : status === "error" ? (
                <div className="px-6 py-16 text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Notifications could not be loaded.
                  </p>
                  <button
                    type="button"
                    onClick={fetchNotifications}
                    className="mt-3 cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/[0.1] dark:text-slate-200 dark:hover:bg-white/[0.05]"
                  >
                    Try again
                  </button>
                </div>
              ) : notifications.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <h3 className="font-heading text-sm font-semibold text-slate-900 dark:text-white">
                    {viewMode === "archived"
                      ? "No archived notifications"
                      : filtersActive
                        ? "No matching notifications"
                        : "No active findings"}
                  </h3>
                  <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {viewMode === "archived"
                      ? "Notifications marked as read will appear here in the archive."
                      : filtersActive
                        ? "Nothing matches the current filters."
                        : "Analytical findings are generated automatically after a crime dataset is uploaded."}
                  </p>
                  {filtersActive && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-3 cursor-pointer text-xs font-medium text-[#2b62d8] underline-offset-2 hover:underline dark:text-[#38BDF8]"
                    >
                      Reset filters
                    </button>
                  )}
                </div>
              ) : (
                <ul className="divide-y divide-slate-100 dark:divide-white/[0.05]">
                  {notifications.map((item) => {
                    const cat = categoryMeta(item.category);
                    const sev = severityMeta(item.severity);
                    const Icon = cat.icon;
                    const isSelected = item.id === selectedId;
                    const barangay = item.metadata?.barangay as string | undefined;
                    const datasetYear = item.metadata?.datasetYear as string | undefined;

                    return (
                      <li key={item.id} className="relative">
                        <span
                          aria-hidden="true"
                          className={`absolute top-0 left-0 h-full w-[3px] ${sev.spine} ${
                            item.isRead && !isSelected ? "opacity-25" : ""
                          }`}
                        />
                        <div
                          onClick={() => selectNotification(item)}
                          className={`cursor-pointer py-3.5 pr-3 pl-5 transition-colors ${
                            isSelected
                              ? "bg-[#4e86fd]/[0.07] dark:bg-[#0EA5E9]/[0.09]"
                              : "hover:bg-slate-50 dark:hover:bg-white/[0.025]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="flex min-w-0 items-center gap-1.5 text-[10px] font-medium tracking-[0.09em] text-slate-500 uppercase dark:text-slate-400">
                              <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
                              <span className="truncate">{cat.label}</span>
                              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
                                /
                              </span>
                              <span className={`shrink-0 font-semibold ${sev.text}`}>{sev.label}</span>
                              {datasetYear && (
                                <span className="shrink-0 tabular-nums">/ {datasetYear}</span>
                              )}
                              {!item.isRead && (
                                <span className="shrink-0 font-semibold text-[#2b62d8] dark:text-[#38BDF8]">
                                  / Unread
                                </span>
                              )}
                              {item.isArchived && <span className="shrink-0">/ Archived</span>}
                            </span>

                            <span className="flex shrink-0 items-center gap-1">
                              <time
                                dateTime={isoTime(item.createdAt)}
                                title={absoluteTime(item.createdAt)}
                                className="mr-1 text-[11px] tabular-nums text-slate-400 dark:text-slate-500"
                              >
                                {relativeTime(item.createdAt)}
                              </time>

                              {!item.isRead && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsReadAndArchive(item.id);
                                  }}
                                  title="Mark as read"
                                  className="cursor-pointer rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-200/70 hover:text-slate-700 dark:hover:bg-white/[0.1] dark:hover:text-white"
                                >
                                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                                  <span className="sr-only">
                                    Mark &ldquo;{item.title}&rdquo; as read
                                  </span>
                                </button>
                              )}

                              {item.isArchived ? (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleArchiveStatus(item.id, true);
                                  }}
                                  title="Restore to active"
                                  className="cursor-pointer rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-200/70 hover:text-slate-700 dark:hover:bg-white/[0.1] dark:hover:text-white"
                                >
                                  <ArchiveRestore className="h-3.5 w-3.5" aria-hidden="true" />
                                  <span className="sr-only">
                                    Restore &ldquo;{item.title}&rdquo; to active
                                  </span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleArchiveStatus(item.id, false);
                                  }}
                                  title="Archive"
                                  className="cursor-pointer rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-200/70 hover:text-slate-700 dark:hover:bg-white/[0.1] dark:hover:text-white"
                                >
                                  <Archive className="h-3.5 w-3.5" aria-hidden="true" />
                                  <span className="sr-only">
                                    Archive &ldquo;{item.title}&rdquo;
                                  </span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmDeleteId(item.id);
                                }}
                                title="Delete notification"
                                className="cursor-pointer rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-200/70 hover:text-red-700 dark:hover:bg-white/[0.1] dark:hover:text-red-400"
                              >
                                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                                <span className="sr-only">Delete &ldquo;{item.title}&rdquo;</span>
                              </button>
                            </span>
                          </div>

                          <h3 className="mt-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                selectNotification(item);
                              }}
                              aria-current={isSelected ? "true" : undefined}
                              className="cursor-pointer text-left font-heading text-[13.5px] leading-snug font-semibold text-slate-900 underline-offset-2 hover:underline dark:text-white"
                            >
                              {item.title}
                            </button>
                          </h3>

                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                            {item.message}
                          </p>

                          {(item.uploadLog?.fileName || barangay) && (
                            <p className="mt-1.5 truncate text-[11px] text-slate-400 dark:text-slate-500">
                              {[item.uploadLog?.fileName, barangay].filter(Boolean).join("  ·  ")}
                            </p>
                          )}

                          {confirmDeleteId === item.id && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="mt-2.5 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-2.5 dark:border-white/[0.08]"
                            >
                              <p className="text-[11.5px] text-slate-600 dark:text-slate-300">
                                Delete this notification permanently?
                              </p>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => deleteNotification(item.id)}
                                  className="cursor-pointer rounded-md bg-red-600 px-2.5 py-1 text-[11.5px] font-semibold text-white transition-colors hover:bg-red-700"
                                >
                                  Delete
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="cursor-pointer text-[11.5px] font-medium text-slate-500 underline-offset-2 hover:underline dark:text-slate-400"
                                >
                                  Keep
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {total > PAGE_SIZE && (
              <nav
                aria-label="Notification pages"
                className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 px-5 py-3 dark:border-white/[0.06]"
              >
                <p className="text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
                  Page {page} of {pageCount}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11.5px] font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[0.1] dark:text-slate-200 dark:hover:bg-white/[0.05]"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={page >= pageCount}
                    onClick={() => setPage((p) => p + 1)}
                    className="flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11.5px] font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[0.1] dark:text-slate-200 dark:hover:bg-white/[0.05]"
                  >
                    Next
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </nav>
            )}
          </div>

          {/* Detail Pane */}
          <aside
            className={`custom-scrollbar min-w-0 flex-1 flex-col overflow-y-auto bg-slate-50/60 md:flex md:w-[22.5rem] md:flex-none dark:bg-white/[0.015] ${
              showDetail ? "flex" : "hidden"
            }`}
            aria-label="Notification detail"
          >
            {selected ? (
              <div className="px-5 py-4">
                <button
                  type="button"
                  onClick={() => setMobilePane("list")}
                  className="mb-4 flex cursor-pointer items-center gap-1 text-[11.5px] font-medium text-[#2b62d8] md:hidden dark:text-[#38BDF8]"
                >
                  <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  All notifications
                </button>

                {(() => {
                  const cat = categoryMeta(selected.category);
                  const sev = severityMeta(selected.severity);
                  const Icon = cat.icon;
                  const target = selected.metadata?.targetUrl as string | undefined;
                  const findings = Object.entries(selected.metadata ?? {})
                    .filter(([key]) => !HIDDEN_METADATA_KEYS.has(key))
                    .map(([key, value]) => [metadataLabel(key), metadataValue(key, value)] as const)
                    .filter((entry): entry is readonly [string, string] => entry[1] !== null);

                  return (
                    <>
                      <div className="flex items-center justify-between gap-2">
                        <p className="flex items-center gap-1.5 text-[10px] font-medium tracking-[0.09em] text-slate-500 uppercase dark:text-slate-400">
                          <Icon className="h-3 w-3" aria-hidden="true" />
                          {cat.label}
                          <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
                            /
                          </span>
                          <span className={`font-semibold ${sev.text}`}>{sev.label}</span>
                        </p>

                        <button
                          type="button"
                          onClick={() => toggleArchiveStatus(selected.id, !!selected.isArchived)}
                          className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
                        >
                          {selected.isArchived ? (
                            <>
                              <ArchiveRestore className="h-3 w-3" aria-hidden="true" /> Restore
                            </>
                          ) : (
                            <>
                              <Archive className="h-3 w-3" aria-hidden="true" /> Archive
                            </>
                          )}
                        </button>
                      </div>

                      <h3 className="mt-2 font-heading text-[15px] leading-snug font-semibold text-slate-900 dark:text-white">
                        {selected.title}
                      </h3>

                      <time
                        dateTime={isoTime(selected.createdAt)}
                        className="mt-1.5 block text-[11px] tabular-nums text-slate-400 dark:text-slate-500"
                      >
                        {absoluteTime(selected.createdAt)}
                        {selected.isArchived && (selected.archivedAt || selected.readAt)
                          ? ` · archived ${relativeTime((selected.archivedAt || selected.readAt)!)}`
                          : ""}
                      </time>

                      <p className="mt-4 border-t border-slate-200 pt-4 text-xs leading-relaxed text-slate-700 dark:border-white/[0.07] dark:text-slate-300">
                        {selected.message}
                      </p>

                      {findings.length > 0 && (
                        <section className="mt-6">
                          <h4 className="text-[10px] font-semibold tracking-[0.11em] text-slate-500 uppercase dark:text-slate-400">
                            Analytical Findings & Parameters
                          </h4>
                          <dl className="mt-2">
                            {findings.map(([label, value]) => (
                              <div
                                key={label}
                                className="flex items-baseline justify-between gap-4 border-b border-slate-200/80 py-2 last:border-b-0 dark:border-white/[0.06]"
                              >
                                <dt className="text-[11.5px] text-slate-500 dark:text-slate-400">
                                  {label}
                                </dt>
                                <dd className="text-right text-[11.5px] font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                                  {value}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        </section>
                      )}

                      {selected.uploadLog && (
                        <section className="mt-6">
                          <h4 className="text-[10px] font-semibold tracking-[0.11em] text-slate-500 uppercase dark:text-slate-400">
                            Source Dataset
                          </h4>
                          <dl className="mt-2">
                            <div className="flex items-baseline justify-between gap-4 border-b border-slate-200/80 py-2 dark:border-white/[0.06]">
                              <dt className="shrink-0 text-[11.5px] text-slate-500 dark:text-slate-400">
                                File Name
                              </dt>
                              <dd className="truncate text-right text-[11.5px] font-semibold text-slate-900 dark:text-slate-100">
                                {selected.uploadLog.fileName}
                              </dd>
                            </div>
                            <div className="flex items-baseline justify-between gap-4 border-b border-slate-200/80 py-2 dark:border-white/[0.06]">
                              <dt className="text-[11.5px] text-slate-500 dark:text-slate-400">
                                Records Ingested
                              </dt>
                              <dd className="text-right text-[11.5px] font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                                {selected.uploadLog.recordsImported.toLocaleString("en-US")}
                              </dd>
                            </div>
                            <div className="flex items-baseline justify-between gap-4 py-2">
                              <dt className="text-[11.5px] text-slate-500 dark:text-slate-400">
                                Ingestion Time
                              </dt>
                              <dd className="text-right text-[11.5px] font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                                {absoluteTime(selected.uploadLog.uploadedAt)}
                              </dd>
                            </div>
                          </dl>
                        </section>
                      )}

                      {target && (
                        <Link
                          href={target}
                          onClick={onClose}
                          className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-[#4e86fd] py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#3d74e8] dark:bg-[#0EA5E9] dark:hover:bg-[#0b8fcd]"
                        >
                          Open in analytics module
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                      )}
                    </>
                  );
                })()}
              </div>
            ) : (
              <p className="m-auto max-w-[15rem] px-6 text-center text-xs leading-relaxed text-slate-400 dark:text-slate-500">
                Select a notification to view its complete findings, timestamps, and source dataset.
              </p>
            )}
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}
