"use client";

import React from "react";
import { Lightbulb } from "lucide-react";

export function DocsPredictive() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Predictive Analytics & ARIMA Forecasting
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
          SecureTanza integrates an AutoRegressive Integrated Moving Average (<strong>ARIMA</strong>) time-series forecasting engine to forecast monthly crime counts up to 12 months ahead.
        </p>
      </div>

      {/* Model Metrics */}
      <div className="p-6 rounded-2xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Model Performance & Validation Metrics
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          The ARIMA model is trained on multi-year historical monthly aggregations and evaluated using standard statistical accuracy metrics:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            <div className="font-semibold text-slate-900 dark:text-white text-sm">MAPE (Mean Absolute % Error)</div>
            <div className="text-xs text-slate-500 mt-1">Measures average relative prediction error:</div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 mt-2 space-y-1">
              <li className="text-emerald-600 dark:text-emerald-400 font-medium">🟢 &lt; 15%: Highly Accurate</li>
              <li className="text-sky-600 dark:text-sky-400 font-medium">🔵 15% - 25%: Good Accuracy</li>
              <li className="text-yellow-600 dark:text-yellow-400 font-medium">🟡 25% - 40%: Moderate</li>
              <li className="text-red-600 dark:text-red-400 font-medium">🔴 &gt; 40%: Low Accuracy</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            <div className="font-semibold text-slate-900 dark:text-white text-sm">MAE (Mean Absolute Error)</div>
            <div className="text-xs text-slate-500 mt-1">Average absolute incident deviation:</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              Represents the exact average number of incidents by which the forecast deviates from actual ground truth.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            <div className="font-semibold text-slate-900 dark:text-white text-sm">95% Confidence Bounds</div>
            <div className="text-xs text-slate-500 mt-1">Upper & Lower Bounds:</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              Provides statistically derived upper and lower limits to account for variability and unexpected anomalies.
            </p>
          </div>
        </div>
      </div>

      {/* Operational Application */}
      <div className="p-5 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          Strategic Application of Forecasts
        </h3>
        <ol className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-decimal list-inside">
          <li><strong>Budget & Logistics Planning:</strong> Justify fuel, checkpoint personnel, and patrol equipment allocations before seasonal crime surges.</li>
          <li><strong>Targeted Interventions:</strong> Launch community awareness programs and barangay curfew enforcement in areas showing rising trend lines.</li>
          <li><strong>Validation Tracking:</strong> Review the month-by-month validation table to inspect actual counts versus forecast accuracy.</li>
        </ol>
      </div>
    </div>
  );
}
