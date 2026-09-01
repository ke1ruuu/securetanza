"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Bell,
  Clock,
  Flame,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  CalendarRange,
  Shield,
  Sliders,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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

const RULE_PARAMS: Record<string, RuleParamField[]> = {
  RULE_PEAK_HOUR_SURGE: [
    {
      key: "densityThresholdPercent",
      label: "Concentration",
      min: 10,
      max: 80,
      fallback: 30,
      unit: "%",
      hint: "Share of batch records landing in the temporal window",
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
      hint: "Percentage increase above the batch average per barangay",
    },
    {
      key: "minBarangayIncidents",
      label: "Minimum incidents",
      min: 3,
      max: 50,
      fallback: 6,
      hint: "Minimum incidents required to classify as a surge",
    },
  ],
  RULE_OFFENSE_CLUSTER_SPIKE: [
    { key: "thresholdCount", label: "Offense count threshold", min: 5, max: 100, fallback: 15 },
  ],
};

const SEVERITY_OPTIONS = [
  { value: "INFO", label: "INFO (Notice Only)" },
  { value: "WARNING", label: "WARNING (Operational Attention)" },
  { value: "CRITICAL", label: "CRITICAL (Immediate Action)" },
] as const;

export default function NotificationSettingsTab() {
  const { user } = useAuth();
  const isAdmin =
    user?.permissions?.includes("admin_operational_officer") ||
    user?.permissions?.includes("admin");

  // General Notification Preferences State
  const [notifyUploads, setNotifyUploads] = useState(true);
  const [notifyHeinous, setNotifyHeinous] = useState(true);
  const [notifySensational, setNotifySensational] = useState(true);
  const [defaultDateRange, setDefaultDateRange] = useState("last30");
  const [generalSaved, setGeneralSaved] = useState(false);

  // Analytical Notification Rules State
  const [rules, setRules] = useState<NotificationRule[]>([]);
  const [rulesStatus, setRulesStatus] = useState<"initial" | "ready" | "error">("initial");
  const [savingRuleId, setSavingRuleId] = useState<string | null>(null);
  const [rowState, setRowState] = useState<Record<string, { msg: string; isError?: boolean }>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});

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
    fetchRules();
  }, [fetchRules]);

  const handleUpdateRule = async (ruleId: string, updates: Partial<NotificationRule>) => {
    if (!isAdmin) return;
    if (savingRuleId === ruleId) return;
    const previous = rules.find((r) => r.id === ruleId);
    if (!previous) return;

    setRules((prev) => prev.map((r) => (r.id === ruleId ? { ...r, ...updates } : r)));
    setSavingRuleId(ruleId);
    setRowState((prev) => ({ ...prev, [ruleId]: { msg: "Saving changes..." } }));

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
      setRules((prev) => prev.map((r) => (r.id === ruleId ? previous : r)));
      setRowState((prev) => ({
        ...prev,
        [ruleId]: { msg: err instanceof Error ? err.message : "Update failed", isError: true },
      }));
    } finally {
      setSavingRuleId(null);
    }
  };

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

  const handleSaveGeneral = () => {
    setGeneralSaved(true);
    setTimeout(() => setGeneralSaved(false), 3000);
  };

  return (
    <div className="flex flex-col items-center w-full h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-full max-w-4xl flex flex-col gap-10 pb-16">
        {/* Header */}
        <div className="flex justify-between items-end pb-4 border-b border-slate-200 dark:border-white/10">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Notification & Alert Engine
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Configure post-ingestion analytical triggers, mathematical detection thresholds, and in-app alerts.
            </p>
          </div>
          {generalSaved ? (
            <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" /> Preferences Saved
            </div>
          ) : (
            <Button
              onClick={handleSaveGeneral}
              className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              Save Preferences
            </Button>
          )}
        </div>

        {/* Section 1: Post-Ingestion Analytical Rules Engine */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="h-5 w-5 text-[#0EA5E9]" />
                Analytical Rule Engine
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Automated conditions evaluated across crime datasets upon CSV/Excel upload.
              </p>
            </div>
            {rules.length > 0 && (
              <span className="text-xs font-semibold tabular-nums px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-500/10 text-[#0284C7] dark:text-[#38BDF8] border border-sky-200 dark:border-sky-500/20">
                {rules.filter((r) => r.isEnabled).length} of {rules.length} Rules Active
              </span>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
            {rulesStatus === "initial" ? (
              <div className="divide-y divide-slate-100 dark:divide-white/5 p-6">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="py-4 space-y-2" aria-hidden="true">
                    <div className="h-3 w-40 rounded-full bg-slate-100 dark:bg-white/10" />
                    <div className="h-2.5 w-3/4 rounded-full bg-slate-100 dark:bg-white/10" />
                  </div>
                ))}
              </div>
            ) : rulesStatus === "error" ? (
              <div className="p-8 text-center space-y-3">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Notification rules could not be synchronized from the server.
                </p>
                <Button variant="outline" size="sm" onClick={fetchRules} className="gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5" /> Try Again
                </Button>
              </div>
            ) : rules.length === 0 ? (
              <p className="p-8 text-center text-sm text-slate-500">No notification rules found.</p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {rules.map((rule) => {
                  const category = categoryMeta(rule.category);
                  const severity = severityMeta(rule.severity);
                  const Icon = category.icon;
                  const fields = RULE_PARAMS[rule.ruleKey] ?? [];
                  const row = rowState[rule.id];
                  const isSaving = savingRuleId === rule.id;

                  return (
                    <div key={rule.id} className="p-6 space-y-4">
                      {/* Top Bar */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                          <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-[#0284C7] dark:text-[#38BDF8] border border-sky-200/60 dark:border-sky-500/20 mt-0.5">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                                {rule.name}
                              </h4>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                                {rule.ruleKey}
                              </span>
                            </div>
                            {rule.description && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                                {rule.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Switch
                            checked={rule.isEnabled}
                            disabled={!isAdmin || isSaving}
                            onCheckedChange={(val) => handleUpdateRule(rule.id, { isEnabled: val })}
                          />
                        </div>
                      </div>

                      {/* Parameter Controls */}
                      <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-slate-100 dark:border-white/5">
                        <div>
                          <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                            Severity Level
                          </Label>
                          <Select
                            value={rule.severity}
                            disabled={!isAdmin || isSaving}
                            onValueChange={(val) =>
                              handleUpdateRule(rule.id, {
                                severity: val as NotificationRule["severity"],
                              })
                            }
                          >
                            <SelectTrigger className="h-9 w-44 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {SEVERITY_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {fields.map((field) => {
                          const draftKey = `${rule.id}:${field.key}`;
                          const stored = String(rule.parameters?.[field.key] ?? field.fallback);

                          return (
                            <div key={field.key} className="space-y-1">
                              <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                                {field.label}
                                <span className="ml-1 text-slate-400 normal-case font-normal">
                                  ({field.min}–{field.max}
                                  {field.unit ? ` ${field.unit}` : ""})
                                </span>
                              </Label>
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="number"
                                  min={field.min}
                                  max={field.max}
                                  value={drafts[draftKey] ?? stored}
                                  disabled={!isAdmin || isSaving}
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
                                  className="h-9 w-20 px-2.5 text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0EA5E9]"
                                />
                                {field.unit && (
                                  <span className="text-xs font-bold text-slate-500">{field.unit}</span>
                                )}
                              </div>
                            </div>
                          );
                        })}

                        {row?.msg && (
                          <div
                            className={`text-xs font-medium self-end pb-1.5 ${
                              row.isError ? "text-red-500" : "text-emerald-500"
                            }`}
                          >
                            {row.msg}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Section 2: General Alerts & Delivery */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#0EA5E9]" />
              System Alerts & Delivery
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Control prompt alerts and instant triggers for priority incidents.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/5">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold text-slate-900 dark:text-white">
                  Failed Dataset Upload Alerts
                </Label>
                <p className="text-xs text-slate-500">
                  Trigger an immediate notification if any bulk dataset upload encounters validation errors.
                </p>
              </div>
              <Switch checked={notifyUploads} onCheckedChange={setNotifyUploads} />
            </div>

            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/5">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold text-slate-900 dark:text-white">
                  Critical & Heinous Crime Alerts
                </Label>
                <p className="text-xs text-slate-500">
                  Emit priority alerts when newly uploaded records contain offenses flagged as Heinous.
                </p>
              </div>
              <Switch checked={notifyHeinous} onCheckedChange={setNotifyHeinous} />
            </div>

            <div className="flex items-center justify-between p-6">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold text-slate-900 dark:text-white">
                  Sensational Incident Alerts
                </Label>
                <p className="text-xs text-slate-500">
                  Emit priority warnings when newly uploaded records contain sensational crime incidents.
                </p>
              </div>
              <Switch checked={notifySensational} onCheckedChange={setNotifySensational} />
            </div>
          </div>
        </div>

        {/* Section 3: Default Dashboard Filters */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarRange className="h-5 w-5 text-[#0EA5E9]" />
              Default Temporal Scope
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Set the default timeframe when navigating to analytics and map overviews.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
            <div className="max-w-md space-y-2">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                Initial Date Filter Range
              </Label>
              <Select value={defaultDateRange} onValueChange={setDefaultDateRange}>
                <SelectTrigger className="h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarRange className="h-4 w-4 text-slate-400" />
                    <SelectValue placeholder="Select date range" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="last7">Last 7 Days</SelectItem>
                  <SelectItem value="last30">Last 30 Days</SelectItem>
                  <SelectItem value="thisQuarter">This Quarter</SelectItem>
                  <SelectItem value="thisYear">Current Year</SelectItem>
                  <SelectItem value="all">All Available Records</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
