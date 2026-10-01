"use client";

import { Check } from "lucide-react";
import { useMapContext } from "@/context/MapContext";
import { useCrimeTypes, getCrimeTypeColor } from "@/hooks/useCrimeTypes";
import { CRIME_GROUPS } from "@/lib/crime-groups";
import { OVERLAY_LABEL, OVERLAY_ITEM, OVERLAY_ITEM_ACTIVE } from "@/lib/map-overlay";

/**
 * The crime type picker's body — "All", the preset groups, then every incident
 * type recorded in the current period with its count. Reads and writes the
 * nearest MapProvider, so the map's filter bar and each side of the compare
 * view get the same list. `onPick` closes whatever dropdown holds it.
 */
export default function CrimeTypeOptions({ onPick }: { onPick: () => void }) {
  const { selectedCrimeType, setSelectedCrimeType } = useMapContext();
  const { stats: crimeStats, loading: crimeLoading } = useCrimeTypes();

  const pick = (type: string | null) => {
    setSelectedCrimeType(type);
    onPick();
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/[0.06]">
        <span className={OVERLAY_LABEL}>Incident Classification</span>
        {selectedCrimeType && (
          <button
            onClick={() => setSelectedCrimeType(null)}
            className="text-xs font-semibold text-sky-600 transition-colors hover:text-sky-500 dark:text-sky-400"
          >
            Reset
          </button>
        )}
      </div>

      <div className="overflow-y-auto overscroll-contain max-h-[300px] p-1 dropdown-scroll">
        <button
          onClick={() => pick(null)}
          className={`flex items-center justify-between w-full text-left px-3 py-2.5 text-[13px] ${
            !selectedCrimeType ? OVERLAY_ITEM_ACTIVE : `${OVERLAY_ITEM} font-medium`
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-400/50" />
            <span>All Crime Types</span>
          </div>
          {!selectedCrimeType && <Check className="h-3.5 w-3.5" />}
        </button>

        {/* Preset groups */}
        {CRIME_GROUPS.map((group) => {
          const isSelected = selectedCrimeType === group.label;
          return (
            <button
              key={group.label}
              onClick={() => pick(group.label)}
              title={group.description}
              className={`flex items-center justify-between w-full text-left px-3 py-2.5 text-[13px] ${
                isSelected ? OVERLAY_ITEM_ACTIVE : `${OVERLAY_ITEM} font-medium`
              }`}
            >
              <div className="flex items-center gap-2.5 truncate pr-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: group.color }} />
                <span className="truncate">{group.label}</span>
              </div>
              {isSelected && <Check className="h-3.5 w-3.5" />}
            </button>
          );
        })}
        <div className="my-1 h-px bg-slate-100 dark:bg-white/[0.06]" />

        {crimeLoading ? (
          <div className="p-4 text-[13px] text-slate-400 text-center">Loading crime types...</div>
        ) : crimeStats.length === 0 ? (
          <div className="p-4 text-[13px] text-slate-400 text-center">No crime types recorded</div>
        ) : (
          crimeStats.map((item) => {
            const isSelected = selectedCrimeType === item.type;
            return (
              <button
                key={item.type}
                onClick={() => pick(item.type)}
                className={`flex items-center justify-between w-full text-left px-3 py-2.5 text-[13px] ${
                  isSelected ? OVERLAY_ITEM_ACTIVE : `${OVERLAY_ITEM} font-medium`
                }`}
              >
                <div className="flex items-center gap-2.5 truncate pr-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: getCrimeTypeColor(item.type) }}
                  />
                  <span className="truncate">{item.type}</span>
                </div>
                <span
                  className={`shrink-0 text-[12px] font-semibold tabular-nums ${
                    isSelected ? "" : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {item.count}
                </span>
              </button>
            );
          })
        )}
      </div>
    </>
  );
}
