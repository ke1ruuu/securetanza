"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Sun,
  Moon,
  Accessibility,
  Bell,
  Shield,
  User,
  RefreshCw,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { categoryMeta, severityMeta } from "@/components/notifications/notification-meta";

interface NotificationRule {
  id: string;
  ruleKey: string;
  name: string;
  description: string | null;
  category: "PEAK_HOUR" | "CRIME_ACTIVITY" | "DATASET_PROCESSING" | "SYSTEM";
  conditionType: string;
  parameters: Record<string, unknown>;
  severity: "INFO" | "WARNING" | "CRITICAL";
  isEnabled: boolean;
  updatedAt: string;
}

interface RuleParamField {
  key: string;
  label: string;
  min: number;
  max: number;
  fallback: number;
  unit?: string;
  hint?: string;
}

/** Mirrors the parameter contract read by backend/lib/notification-engine.ts. */
const RULE_PARAMS: Record<string, RuleParamField[]> = {
  RULE_PEAK_HOUR_SURGE: [
    {
      key: "densityThresholdPercent",
      label: "Concentration",
      min: 10,
      max: 80,
      fallback: 30,
      unit: "%",
      hint: "Share of the batch that must land inside the window",
    },
    { key: "windowSpanHours", label: "Window span", min: 1, max: 6, fallback: 3, unit: "hrs" },
  ],
  RULE_BARANGAY_VOLUME_SURGE: [
    {
      key: "surgeThresholdPercent",
      label: "Above average",
      min: 15,
      max: 200,
      fallback: 35,
      unit: "%",
    },
    {
      key: "minBarangayIncidents",
      label: "Minimum incidents",
      min: 3,
      max: 50,
      fallback: 6,
      hint: "Below this count a barangay is too sparse to call a surge",
    },
  ],
  RULE_OFFENSE_CLUSTER_SPIKE: [
    { key: "thresholdCount", label: "Offence count", min: 5, max: 100, fallback: 15 },
  ],
};

const SEVERITY_OPTIONS = [
  { value: "INFO", label: "Info — notice only" },
  { value: "WARNING", label: "Warning — needs attention" },
  { value: "CRITICAL", label: "Critical — immediate action" },
] as const;

export default function ConfigTab() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState("accessibility");

  // Notification Rules State
  const [rules, setRules] = useState<NotificationRule[]>([]);
  const [rulesStatus, setRulesStatus] = useState<"initial" | "ready" | "error">("initial");
  const [savingRuleId, setSavingRuleId] = useState<string | null>(null);
  /** Per-rule status so feedback lands beside the control that caused it. */
  const [rowState, setRowState] = useState<Record<string, { msg: string; isError?: boolean }>>({});
  /** Uncommitted numeric edits, keyed `${ruleId}:${paramKey}`. Committed on blur or Enter. */
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const isAdmin =
    user?.permissions?.includes("admin_operational_officer") ||
    user?.permissions?.includes("admin");

  const subTabs = [
    { id: "accessibility", label: "Accessibility", icon: Accessibility },
    { id: "notifications", label: "Alert Rules", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "account", label: "Profile", icon: User },
  ];

  const fetchRules = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications/rules");
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Request failed");
      setRules(data.data || []);
      setRulesStatus("ready");
    } catch (err) {
      console.warn("Failed to fetch notification rules:", err);
      setRulesStatus("error");
    }
  }, []);

  useEffect(() => {
    if (activeSubTab === "notifications" && isAdmin) {
      fetchRules();
    }
  }, [activeSubTab, isAdmin, fetchRules]);

  const handleUpdateRule = async (ruleId: string, updates: Partial<NotificationRule>) => {
    if (!isAdmin) return;
    const previous = rules.find((r) => r.id === ruleId);
    if (!previous) return;

    // Paint the new value immediately — a control that waits for the round trip fights the user.
    setRules((prev) => prev.map((r) => (r.id === ruleId ? { ...r, ...updates } : r)));
    setSavingRuleId(ruleId);
    setRowState((prev) => ({ ...prev, [ruleId]: { msg: "Saving…" } }));

    try {
      const res = await fetch(`/api/notifications/rules/${ruleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Update was rejected");

      setRules((prev) => prev.map((r) => (r.id === ruleId ? { ...r, ...data.data } : r)));
      setRowState((prev) => ({ ...prev, [ruleId]: { msg: "Saved" } }));
      setTimeout(() => {
        setRowState((prev) => {
          if (prev[ruleId]?.msg !== "Saved") return prev;
          const next = { ...prev };
          delete next[ruleId];
          return next;
        });
      }, 2500);
    } catch (err) {
      // Roll back to the value the server still holds, so the UI never lies about what is stored.
      setRules((prev) => prev.map((r) => (r.id === ruleId ? previous : r)));
      setRowState((prev) => ({
        ...prev,
        [ruleId]: { msg: err instanceof Error ? err.message : "Update failed", isError: true },
      }));
    } finally {
      setSavingRuleId(null);
    }
  };

  /** Number fields commit on blur or Enter — never per keystroke — and out-of-range edits are refused. */
  const commitParam = (rule: NotificationRule, field: RuleParamField, raw: string) => {
    const draftKey = `${rule.id}:${field.key}`;
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[draftKey];
      return next;
    });

    const current = Number(rule.parameters?.[field.key] ?? field.fallback);
    const parsed = Number.parseInt(raw, 10);
    if (Number.isNaN(parsed) || parsed === current) return;

    if (parsed < field.min || parsed > field.max) {
      setRowState((prev) => ({
        ...prev,
        [rule.id]: {
          msg: `${field.label} must be between ${field.min} and ${field.max}${
            field.unit ? ` ${field.unit}` : ""
          }. Kept ${current}.`,
          isError: true,
        },
      }));
      return;
    }

    handleUpdateRule(rule.id, { parameters: { ...rule.parameters, [field.key]: parsed } });
  };


  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      {/* Sub-navigation Sidebar */}
      <div className="w-full lg:w-56 shrink-0 flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
        <h3
          className={`text-xs font-black uppercase tracking-[0.3em] mb-3 hidden lg:block ${
            theme === "dark" ? "text-slate-500" : "text-slate-400"
          }`}
        >
          System Config
        </h3>
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === tab.id
                ? theme === "dark"
                  ? "bg-[#0EA5E9]/15 text-[#0EA5E9] border border-[#0EA5E9]/30 shadow-md shadow-sky-500/10"
                  : "bg-sky-50 text-[#0284C7] border border-sky-200 shadow-sm"
                : theme === "dark"
                ? "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <tab.icon className="h-4 w-4 shrink-0" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settings Content Area */}
      <div
        className={`flex-1 rounded-3xl p-6 sm:p-8 backdrop-blur-xl border transition-all duration-700 overflow-hidden ${
          theme === "dark"
            ? "bg-white/[0.03] border-white/[0.06] shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            : "bg-white shadow-xl shadow-slate-200/50 border-slate-200"
        }`}
      >
        {/* ========================================= */}
        {/* TAB 1: ACCESSIBILITY & THEME */}
        {/* ========================================= */}
        {activeSubTab === "accessibility" && (
          <div className="space-y-8">
            <div>
              <h2
                className={`text-xl font-black mb-2 transition-colors ${
                  theme === "dark" ? "text-white" : "text-slate-900"
                }`}
              >
                Visual Interface & Theme
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                Customize the appearance of SecureTanza. Toggle between high-contrast light and stealth dark themes to optimize situational readability.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <div
                className={`p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  theme === "dark"
                    ? "bg-slate-900/50 border-white/[0.06]"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#0EA5E9]/10 border border-[#0EA5E9]/20 flex items-center justify-center">
                    {theme === "light" ? (
                      <Sun className="h-5 w-5 text-[#0EA5E9]" />
                    ) : (
                      <Moon className="h-5 w-5 text-[#0EA5E9]" />
                    )}
                  </div>
                  <div>
                    <h4
                      className={`text-sm font-bold uppercase tracking-wider transition-colors ${
                        theme === "dark" ? "text-white" : "text-slate-900"
                      }`}
                    >
                      Interface Theme
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Toggle high-contrast daylight mode or night operational dark mode.
                    </p>
                  </div>
                </div>

                <div
                  className={`flex p-1 rounded-xl border transition-colors shrink-0 ${
                    theme === "dark"
                      ? "bg-slate-950/60 border-white/5"
                      : "bg-slate-200/50 border-slate-200"
                  }`}
                >
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      theme === "light"
                        ? "bg-[#0EA5E9] text-white shadow-md shadow-sky-500/20"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Sun className="h-3.5 w-3.5" />
                    Light
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      theme === "dark"
                        ? "bg-[#0EA5E9] text-white shadow-md shadow-sky-500/20"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    <Moon className="h-3.5 w-3.5" />
                    Dark
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 2: NOTIFICATION & ALERT RULES */}
        {/* ========================================= */}
        {activeSubTab === "notifications" && (
          <div>
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
              <div>
                <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white">
                  Alert rules
                </h2>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Thresholds the analytical engine applies to each crime dataset once processing
                  finishes. Findings appear in the notification bell.
                </p>
              </div>

              {isAdmin && rulesStatus === "ready" && rules.length > 0 && (
                <div className="flex items-center gap-4">
                  <p className="text-[11.5px] tabular-nums text-slate-600 dark:text-slate-400">
                    {rules.filter((r) => r.isEnabled).length} of {rules.length} enabled
                  </p>
                  <button
                    type="button"
                    onClick={fetchRules}
                    className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11.5px] font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/[0.1] dark:text-slate-200 dark:hover:bg-white/[0.05]"
                  >
                    <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                    Reload
                  </button>
                </div>
              )}
            </div>

            {!isAdmin ? (
              <p className="mt-6 border-t border-slate-200 pt-6 text-[12.5px] leading-relaxed text-slate-600 dark:border-white/[0.06] dark:text-slate-300">
                Alert thresholds are maintained by administrator operational officers. Findings these
                rules generate are still delivered to you in the notification bell.
              </p>
            ) : rulesStatus === "initial" ? (
              <div className="mt-6 divide-y divide-slate-100 border-t border-slate-200 dark:divide-white/[0.05] dark:border-white/[0.06]">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="space-y-2.5 py-5" aria-hidden="true">
                    <div className="h-2 w-28 rounded-full bg-slate-100 dark:bg-white/[0.07]" />
                    <div className="h-3 w-1/3 rounded-full bg-slate-100 dark:bg-white/[0.07]" />
                    <div className="h-2 w-2/3 rounded-full bg-slate-100/70 dark:bg-white/[0.05]" />
                  </div>
                ))}
                <p className="sr-only">Loading alert rules</p>
              </div>
            ) : rulesStatus === "error" ? (
              <div className="mt-6 border-t border-slate-200 pt-6 dark:border-white/[0.06]">
                <p className="text-[12.5px] text-slate-600 dark:text-slate-300">
                  Alert rules could not be loaded.
                </p>
                <button
                  type="button"
                  onClick={fetchRules}
                  className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[11.5px] font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/[0.1] dark:text-slate-200 dark:hover:bg-white/[0.05]"
                >
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  Try again
                </button>
              </div>
            ) : rules.length === 0 ? (
              <p className="mt-6 border-t border-slate-200 pt-6 text-[12.5px] leading-relaxed text-slate-600 dark:border-white/[0.06] dark:text-slate-300">
                No alert rules are configured. Rules are seeded with the analytical engine.
              </p>
            ) : (
              <ul className="mt-6 divide-y divide-slate-100 border-t border-slate-200 dark:divide-white/[0.05] dark:border-white/[0.06]">
                {rules.map((rule) => {
                  const category = categoryMeta(rule.category);
                  const severity = severityMeta(rule.severity);
                  const Icon = category.icon;
                  const fields = RULE_PARAMS[rule.ruleKey] ?? [];
                  const row = rowState[rule.id];
                  const isSaving = savingRuleId === rule.id;

                  return (
                    <li key={rule.id} className="relative py-5 pl-4">
                      <span
                        aria-hidden="true"
                        className={`absolute top-5 bottom-5 left-0 w-[2px] ${severity.spine} ${
                          rule.isEnabled ? "" : "opacity-25"
                        }`}
                      />

                      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                        <div className="min-w-0">
                          <p className="flex flex-wrap items-center gap-1.5 text-[10px] font-medium tracking-[0.09em] text-slate-500 uppercase dark:text-slate-400">
                            <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
                            {category.label}
                            <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
                              /
                            </span>
                            <span className={`font-semibold ${severity.text}`}>{severity.label}</span>
                            {!rule.isEnabled && (
                              <>
                                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
                                  /
                                </span>
                                <span>Not running</span>
                              </>
                            )}
                          </p>

                          <h3 className="mt-1.5 font-heading text-[13.5px] font-semibold text-slate-900 dark:text-white">
                            {rule.name}
                          </h3>

                          {rule.description && (
                            <p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                              {rule.description}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={rule.isEnabled}
                          aria-label={`Run ${rule.name} on new datasets`}
                          disabled={isSaving}
                          onClick={() => handleUpdateRule(rule.id, { isEnabled: !rule.isEnabled })}
                          className={`relative h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                            rule.isEnabled
                              ? "bg-[#4e86fd] dark:bg-[#0EA5E9]"
                              : "bg-slate-300 dark:bg-white/25"
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
                              rule.isEnabled ? "left-[18px]" : "left-0.5"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap items-start gap-x-6 gap-y-4">
                        <div>
                          <label
                            htmlFor={`${rule.id}-severity`}
                            className="block text-[10px] font-medium tracking-[0.09em] text-slate-500 uppercase dark:text-slate-400"
                          >
                            Severity
                          </label>
                          <select
                            id={`${rule.id}-severity`}
                            value={rule.severity}
                            disabled={isSaving}
                            onChange={(e) =>
                              handleUpdateRule(rule.id, {
                                severity: e.target.value as NotificationRule["severity"],
                              })
                            }
                            className="mt-1.5 cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.1] dark:bg-[#0F172A] dark:text-slate-200"
                          >
                            {SEVERITY_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {fields.map((field) => {
                          const draftKey = `${rule.id}:${field.key}`;
                          const stored = String(rule.parameters?.[field.key] ?? field.fallback);
                          const inputId = `${rule.id}-${field.key}`;

                          return (
                            <div key={field.key}>
                              <label
                                htmlFor={inputId}
                                className="block text-[10px] font-medium tracking-[0.09em] text-slate-500 uppercase dark:text-slate-400"
                              >
                                {field.label}
                                <span className="ml-1.5 font-normal tracking-normal text-slate-400 normal-case dark:text-slate-500">
                                  {field.min}–{field.max}
                                  {field.unit ? ` ${field.unit}` : ""}
                                </span>
                              </label>

                              <div className="mt-1.5 flex items-center gap-1.5">
                                <input
                                  id={inputId}
                                  type="number"
                                  inputMode="numeric"
                                  min={field.min}
                                  max={field.max}
                                  value={drafts[draftKey] ?? stored}
                                  disabled={isSaving}
                                  aria-describedby={field.hint ? `${inputId}-hint` : undefined}
                                  onChange={(e) =>
                                    setDrafts((prev) => ({ ...prev, [draftKey]: e.target.value }))
                                  }
                                  onBlur={(e) => commitParam(rule, field, e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      e.currentTarget.blur();
                                    }
                                  }}
                                  className="w-[4.5rem] rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs tabular-nums text-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.1] dark:bg-[#0F172A] dark:text-slate-100"
                                />
                                {field.unit && (
                                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                    {field.unit}
                                  </span>
                                )}
                              </div>

                              {field.hint && (
                                <p
                                  id={`${inputId}-hint`}
                                  className="mt-1.5 max-w-[13rem] text-[10.5px] leading-relaxed text-slate-500 dark:text-slate-400"
                                >
                                  {field.hint}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <p
                        role="status"
                        aria-live="polite"
                        className={`mt-3 min-h-4 text-[11px] font-medium ${
                          row?.isError
                            ? "text-red-700 dark:text-red-400"
                            : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {row?.msg ?? ""}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 3: SECURITY & PROFILE (Informational) */}
        {/* ========================================= */}
        {activeSubTab === "security" && (
          <div className="space-y-6">
            <h2
              className={`text-xl font-black mb-2 transition-colors ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}
            >
              Security Clearances & Audit
            </h2>
            <div className="p-6 rounded-2xl border bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-white/[0.06] space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-[#0EA5E9]" />
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    Active Clearance: {user?.fullName || "Operational Officer"}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    Account: {user?.accountNumber || "ACC-000001"}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {user?.permissions?.map((p, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/20"
                  >
                    {p.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSubTab === "account" && (
          <div className="space-y-6">
            <h2
              className={`text-xl font-black mb-2 transition-colors ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}
            >
              Officer Account Profile
            </h2>
            <div className="p-6 rounded-2xl border bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-white/[0.06] space-y-3">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Authenticated Personnel
              </div>
              <div className="text-base font-bold text-slate-900 dark:text-white">
                {user?.fullName || "Operational Officer"}
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Identifier ID: {user?.accountNumber || "ACC-000001"}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
