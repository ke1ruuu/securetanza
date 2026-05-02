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
  const { hotspotMode, hotspotMonth, hotspotYear, hoveredThreatLevel, setHoveredBarangay, timeFilterDate, timeFilterHour, timeFilterHourCrimeCount, isTimeFilterActive, selectedCrimeType, selectedYear } =
    useMapContext();
  
  const { barangayCrimeCounts, filteredBarangayCrimeCounts, thresholds, loading } = useThreatLevels();
  const { crimeTypeCounts, loading: crimeTypeLoading } = useCrimeTypeByBarangay();

  // Debug logging - only log once when time filter state changes
  React.useEffect(() => {
    if (isTimeFilterActive) {
      console.log('🗺️ TIME FILTER ACTIVE - Barangay Layer Update:', {
        timeFilterHour,
        timeFilterHourCrimeCount,
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
  }, [isTimeFilterActive, timeFilterHour, filteredBarangayCrimeCounts]);

  // Get the threat level color for the current hour based on total crimes using dynamic thresholds
  const getHourThreatLevel = () => {
    if (!isTimeFilterActive || timeFilterHourCrimeCount === 0) return 'secure';
    return getThreatLevelFromCount(timeFilterHourCrimeCount, thresholds);
  };

  const hourThreatLevel = getHourThreatLevel();
  const hourColor = THREAT_COLORS[hourThreatLevel];

  console.log('⏰ Hour Threat Level:', { 
    timeFilterHourCrimeCount, 
    hourThreatLevel, 
    hourColor 
  });

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
    
    // When time filter is active, ALL barangays with crimes use the hour's threat level
    // Otherwise use base counts
    if (isTimeFilterActive) {
      const hasFilteredCrimes = (filteredBarangayCrimeCounts[normalizedName] || filteredBarangayCrimeCounts[barangayName] || 0) > 0;
      if (hasFilteredCrimes) {
        console.log(`✅ ${barangayName} has crimes, using ${hourThreatLevel}`);
        return hourThreatLevel; // Use hour's overall threat level
      }
      return 'secure'; // No crimes at this hour
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
    return isTimeFilterActive && ((filteredBarangayCrimeCounts[normalizedName] || filteredBarangayCrimeCounts[barangayName] || 0) > 0);
  };

  // Don't render the layer until data is loaded to prevent color flickering
  if (loading && Object.keys(barangayCrimeCounts).length === 0) {
    return null;
  }

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

    const isSelected = selectedBarangay === name;
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
      weight: isSelected || (hoveredThreatLevel && isFocusMatch) ? 5 : 1.5,
      opacity: isSelected || (hoveredThreatLevel && isFocusMatch) ? 0.3 : 0.5,
      fillColor: color,
      fillOpacity:
        isSelected || (hoveredThreatLevel && isFocusMatch) ? 0.35 : 0.45,
      dashArray: isSelected || (hoveredThreatLevel && isFocusMatch) ? "" : "2",
    };
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    if (!(layer instanceof L.Path)) return;
    const name = feature.properties?.adm4_en;

    layer.on({
      mouseover: (e) => {
        const target = e.target;
        // Set hovered barangay for stats panel
        setHoveredBarangay(name);
        
        // Apply a subtle hover effect only, while respecting the focus style
        target.setStyle({
          fillOpacity: 0.5, // Keep it high
          opacity: 1,
          weight: 6, // Slightly thicker for hover awareness
        });
        target.bringToFront();
      },
      mouseout: (e) => {
        // Clear hovered barangay
        setHoveredBarangay(null);
        e.target.setStyle(styleFeature(feature));
      },
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
        `<div style="padding:4px 8px; background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(129, 140, 248, 0.2); border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.5)">
          <p style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#818cf8;font-weight:700;margin:0 0 2px">Barangay</p>
          <p style="font-size:14px;font-weight:700;color:#f1f5f9;margin:0 0 4px">${name}</p>
          <div style="display:flex;align-items:center;gap:6px;margin:0">
            <div style="width:8px;height:8px;border-radius:50%;background:${THREAT_COLORS[threatLevel]}"></div>
            <span style="font-size:10px;font-weight:600;color:#94a3b8;text-transform:capitalize">${threatLevel} (${countLabel})</span>
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

  return (
    <Pane name="barangay-pane" style={{ zIndex: 450 }}>
      <GeoJSON
        key={`${selectedBarangay}-${hoveredThreatLevel}-${hotspotMonth}-${hotspotYear}-${loading}-${isTimeFilterActive}-${timeFilterHour}-${timeFilterHourCrimeCount}-${Object.keys(filteredBarangayCrimeCounts).length}-${selectedCrimeType}-${Object.keys(crimeTypeCounts).length}-${selectedYear}-${Object.keys(barangayCrimeCounts).length}-${thresholds.low}-${thresholds.moderate}-${thresholds.high}-${thresholds.critical}`}
        data={data}
        style={styleFeature}
        onEachFeature={onEachFeature}
      />
    </Pane>
  );
};

export default TanzaBarangayLayer;
