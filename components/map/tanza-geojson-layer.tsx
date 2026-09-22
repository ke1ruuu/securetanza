"use client";

import React from "react";
import { GeoJSON, Pane } from "react-leaflet";
import L from "leaflet";
import { useMapContext } from "@/context/MapContext";
import { useThreatLevels, getThreatLevelFromCount, THREAT_COLORS } from "@/hooks/useThreatLevels";
import { useCrimeTypeByBarangay } from "@/hooks/useCrimeTypeByBarangay";
import {
  getHistoricalIncidents,
  getHotspotSectorForDate,
} from "@/constants/dummy";

interface BarangayLayerProps {
  data: any;
  selectedBarangay: string | null;
  onClickBarangay?: (name: string) => void;
}

const TanzaBarangayLayer: React.FC<BarangayLayerProps> = ({
  data,
  selectedBarangay,
  onClickBarangay,
}) => {
  const {
    hotspotMode,
    hotspotMonth,
    hotspotYear,
    hoveredThreatLevel,
    hoveredBarangay,
    setHoveredBarangay,
    timeFilterDate,
    timeFilterHour,
    isTimeFilterActive,
    selectedCrimeType,
    selectedYear,
    timeRange,
  } = useMapContext();

  // Registered per polygon in onEachFeature, so a hover that originates
  // *outside* the map — e.g. a row in the crime-type breakdown list — can
  // apply the exact same highlight a direct map hover would, by calling
  // Leaflet's setStyle directly instead of remounting the whole GeoJSON
  // layer (which the key below already does for the rarer, discrete
  // hoveredThreatLevel case — too heavy to also do on every casual mouse
  // pass over the map).
  const layerRegistryRef = React.useRef<Map<string, { layer: L.Path; feature: any }>>(new Map());
  const previousHoverKeyRef = React.useRef<string | null>(null);
  
  const { barangayCrimeCounts, filteredBarangayCrimeCounts, thresholds, loading } = useThreatLevels();
  const { crimeTypeCounts, loading: crimeTypeLoading } = useCrimeTypeByBarangay();

  // Debug logging - only log once when time filter state changes
  React.useEffect(() => {
    if (isTimeFilterActive) {
      console.log('🗺️ TIME FILTER ACTIVE - Barangay Layer Update:', {
        timeFilterDate: timeFilterDate?.toLocaleDateString(),
        timeFilterHour,
        filteredBarangaysLength: Object.keys(filteredBarangayCrimeCounts).length,
        filteredCounts: filteredBarangayCrimeCounts,
      });
      
      // Log which barangays will be highlighted
      const barangaysWithCrimes = Object.entries(filteredBarangayCrimeCounts)
        .filter(([_, count]) => count > 0)
        .map(([name, count]) => `${name}: ${count}`);
      
      if (barangaysWithCrimes.length > 0) {
        console.log('🎨 Barangays to highlight:', barangaysWithCrimes.join(', '));
      } else {
        console.log('⚪ No barangays to highlight (all transparent)');
      }
    }
  }, [isTimeFilterActive, timeFilterDate, timeFilterHour, filteredBarangayCrimeCounts]);

  const getThreatLevel = (barangayName: string) => {
    // Normalize barangay name to uppercase for matching
    const normalizedName = barangayName.toUpperCase();
    
    // When crime type is selected, use crime type counts with dynamic thresholds
    if (selectedCrimeType) {
      const count = crimeTypeCounts[normalizedName] || crimeTypeCounts[barangayName] || 0;
      // Use scaled thresholds for crime type filtering (typically lower counts)
      const scaledThresholds = {
        low: Math.max(1, Math.floor(thresholds.low / 2)),
        moderate: Math.max(2, Math.floor(thresholds.moderate / 2)),
        high: Math.max(3, Math.floor(thresholds.high / 2)),
        critical: Math.max(4, Math.floor(thresholds.critical / 2))
      };
      return getThreatLevelFromCount(count, scaledThresholds);
    }
    
    // When time filter is active (hour-based filtering)
    // Calculate dynamic thresholds based on THIS HOUR's data distribution
    if (isTimeFilterActive) {
      const count = filteredBarangayCrimeCounts[normalizedName] || filteredBarangayCrimeCounts[barangayName] || 0;
      
      if (count === 0) return 'secure';
      
      // Calculate thresholds based on this hour's crime distribution
      const hourCrimeCounts = Object.values(filteredBarangayCrimeCounts).filter(c => c > 0);
      
      if (hourCrimeCounts.length === 0) return 'secure';
      
      // Use quartiles of THIS HOUR's data
      const sortedCounts = [...hourCrimeCounts].sort((a, b) => a - b);
      const q1Index = Math.floor(sortedCounts.length * 0.25);
      const q2Index = Math.floor(sortedCounts.length * 0.50);
      const q3Index = Math.floor(sortedCounts.length * 0.75);
      
      const hourThresholds = {
        low: Math.max(1, sortedCounts[q1Index] || 1),
        moderate: Math.max(2, sortedCounts[q2Index] || 2),
        high: Math.max(3, sortedCounts[q3Index] || 3),
        critical: Math.max(4, (sortedCounts[q3Index] || 3) + 1)
      };
      
      return getThreatLevelFromCount(count, hourThresholds);
    }
    
    // Normal mode: use individual barangay counts with dynamic thresholds
    const count = barangayCrimeCounts[normalizedName] || barangayCrimeCounts[barangayName] || 0;
    return getThreatLevelFromCount(count, thresholds);
  };

  const hasFilteredCrimes = (barangayName: string) => {
    const normalizedName = barangayName.toUpperCase();
    
    // Check if crime type filter is active
    if (selectedCrimeType) {
      return (crimeTypeCounts[normalizedName] || crimeTypeCounts[barangayName] || 0) > 0;
    }
    
    // Check if this barangay has crimes in the filtered time period
    // When time filter is active (date-based), check filteredBarangayCrimeCounts
    if (isTimeFilterActive) {
      const count = filteredBarangayCrimeCounts[normalizedName] || filteredBarangayCrimeCounts[barangayName] || 0;
      return count > 0;
    }
    
    return false;
  };

  // Don't render the layer until data is loaded to prevent color flickering.
  // Checked again just before the JSX return below, not here — every hook in
  // this component (including the hoveredBarangay effect further down) has
  // to run on every render regardless, or React's hook-order tracking breaks
  // the moment `loading` flips between renders.
  const skipRender = loading && Object.keys(barangayCrimeCounts).length === 0;

  const styleFeature = (feature: any) => {
    const name = feature.properties?.adm4_en;
    const hasActiveCrimes = hasFilteredCrimes(name);
    
    // When time filter is active, handle styling differently
    if (isTimeFilterActive) {
      if (hasActiveCrimes) {
        // Only get threat level and color for barangays WITH crimes
        const level = getThreatLevel(name);
        const color = THREAT_COLORS[level];
        
        // Highlight barangays with crimes at this time with their threat level color
        return {
          color: "#ffffff",
          weight: 3,
          opacity: 0.9,
          fillColor: color,
          fillOpacity: 0.75,
          dashArray: "",
        };
      } else {
        // Barangays without crimes at this time - completely transparent/no fill
        return {
          color: "#64748b",
          weight: 1,
          opacity: 0.15,
          fillColor: "transparent",
          fillOpacity: 0,
          dashArray: "3",
        };
      }
    }
    
    // Normal mode (no time filter) - get threat level for all barangays
    const level = getThreatLevel(name);
    const color = THREAT_COLORS[level];

    const isSelected = Boolean(
      selectedBarangay &&
      (selectedBarangay.toLowerCase().trim() === name?.toLowerCase().trim() ||
       selectedBarangay.toLowerCase().trim().endsWith(name?.toLowerCase().trim()))
    );
    const isFocusMatch = hoveredThreatLevel
      ? level === hoveredThreatLevel
      : true;

    const isHotspot =
      hotspotMode &&
      getHotspotSectorForDate(hotspotMonth, hotspotYear) === name;

    if (isHotspot) {
      return {
        color: "#ffffff",
        weight: 5,
        opacity: 0.3,
        fillColor: "#ef4444",
        fillOpacity: 0.85,
      };
    }

    // When crime type filter is active
    if (selectedCrimeType) {
      if (hasActiveCrimes) {
        // Highlight barangays with this crime type
        return {
          color: "#ffffff",
          weight: 3,
          opacity: 0.9,
          fillColor: color,
          fillOpacity: 0.75,
          dashArray: "",
        };
      } else {
        // Show barangays without this crime type in blue (secure color)
        return {
          color: "#0ea5e9",
          weight: 1.5,
          opacity: 0.5,
          fillColor: "#0ea5e9",
          fillOpacity: 0.45,
          dashArray: "2",
        };
      }
    }

    // Normal state (no time filter)
    return {
      color:
        isSelected || (hoveredThreatLevel && isFocusMatch) ? "#ffffff" : color,
      weight: isSelected || (hoveredThreatLevel && isFocusMatch) ? 5 : 2.5,
      opacity: isSelected || (hoveredThreatLevel && isFocusMatch) ? 0.9 : 0.7,
      fillColor: color,
      fillOpacity:
        isSelected || (hoveredThreatLevel && isFocusMatch) ? 0.35 : 0.45,
      dashArray: isSelected || (hoveredThreatLevel && isFocusMatch) ? "" : "",
    };
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    if (!(layer instanceof L.Path)) return;
    const name = feature.properties?.adm4_en;

    if (name) {
      layerRegistryRef.current.set(name.toLowerCase().trim(), { layer, feature });
    }

    layer.on({
      // The actual highlight is applied by the hoveredBarangay effect below —
      // this just reports the hover, the same way a list row hovering it would.
      mouseover: () => setHoveredBarangay(name),
      mouseout: () => setHoveredBarangay(null),
      click: () => {
        if (onClickBarangay) onClickBarangay(name);
      },
    });

    if (name) {
      const normalizedName = name.toUpperCase();
      const crimeCount = barangayCrimeCounts[normalizedName] || barangayCrimeCounts[name] || 0;
      const filteredCount = filteredBarangayCrimeCounts[normalizedName] || filteredBarangayCrimeCounts[name] || 0;
      const crimeTypeCount = crimeTypeCounts[normalizedName] || crimeTypeCounts[name] || 0;
      const threatLevel = getThreatLevel(name);
      
      let displayCount = crimeCount;
      let countLabel = `${crimeCount} total crimes`;
      
      if (selectedCrimeType) {
        displayCount = crimeTypeCount;
        countLabel = `${crimeTypeCount} ${selectedCrimeType} crimes`;
      } else if (isTimeFilterActive) {
        displayCount = filteredCount;
        countLabel = `${filteredCount} crimes at this time`;
      }
      
      layer.bindTooltip(
        `<div class="map-tip">
          <p class="map-tip__label">Barangay</p>
          <p class="map-tip__name">${name}</p>
          <div class="map-tip__row">
            <span class="map-tip__dot" style="background:${THREAT_COLORS[threatLevel]}"></span>
            <span>${threatLevel} (${countLabel})</span>
          </div>
        </div>`,
        {
          sticky: true,
          className: "custom-tooltip-revert",
          direction: "top",
          opacity: 1,
        },
      );
    }
  };

  // Applies/clears the hover highlight from wherever hoveredBarangay was set —
  // a direct map hover (via onEachFeature above) or an external one, like a
  // row in the crime-type breakdown list. One place decides what "hovered"
  // looks like, regardless of who reported it.
  React.useEffect(() => {
    const nextKey = hoveredBarangay ? hoveredBarangay.toLowerCase().trim() : null;
    const prevKey = previousHoverKeyRef.current;

    if (prevKey && prevKey !== nextKey) {
      const prevEntry = layerRegistryRef.current.get(prevKey);
      if (prevEntry) {
        prevEntry.layer.setStyle(styleFeature(prevEntry.feature));
      }
    }

    if (nextKey) {
      const nextEntry = layerRegistryRef.current.get(nextKey);
      if (nextEntry) {
        nextEntry.layer.setStyle({ fillOpacity: 0.5, opacity: 1, weight: 6 });
        nextEntry.layer.bringToFront();
      }
    }

    previousHoverKeyRef.current = nextKey;
    // styleFeature is intentionally omitted: it's a new function identity every
    // render, so including it would fire this on every render instead of only
    // when the hover actually changes. It's still always the current render's
    // styleFeature via closure — any staleness self-corrects on the next data
    // change anyway, since that remounts the whole layer via the key below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredBarangay]);

  const timeRangeKey = `${timeRange.mode}-${timeRange.selections.map(s => `${s.year}_${s.quarter ?? ''}_${s.month ?? ''}_${s.halfYear ?? ''}_${s.day ? new Date(s.day).getTime() : ''}`).join(',')}`;
  const crimeCountsKey = Object.entries(crimeTypeCounts).map(([b, c]) => `${b}:${c}`).join('|');
  const baseCountsKey = Object.entries(barangayCrimeCounts).map(([b, c]) => `${b}:${c}`).join('|');

  // The actual "don't render the layer until data is loaded" bail-out — see
  // the skipRender comment above for why this can't happen any earlier.
  if (skipRender) {
    return null;
  }

  return (
    <Pane name="barangay-pane" style={{ zIndex: 450 }}>
      <GeoJSON
        key={`${selectedBarangay}-${hoveredThreatLevel}-${hotspotMonth}-${hotspotYear}-${loading}-${crimeTypeLoading}-${isTimeFilterActive}-${timeFilterDate?.getTime()}-${timeFilterHour}-${selectedCrimeType}-${timeRangeKey}-${crimeCountsKey}-${baseCountsKey}-${thresholds.low}-${thresholds.moderate}-${thresholds.high}-${thresholds.critical}`}
        data={data}
        style={styleFeature}
        onEachFeature={onEachFeature}
      />
    </Pane>
  );
};

export default TanzaBarangayLayer;
