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
  const { hotspotMode, hotspotMonth, hotspotYear, hoveredThreatLevel, setHoveredBarangay, timeFilterDate, timeFilterHour, timeFilterHourCrimeCount, isTimeFilterActive, selectedCrimeType } =
    useMapContext();
  
  const { barangayCrimeCounts, filteredBarangayCrimeCounts, loading } = useThreatLevels();
  const { crimeTypeCounts, loading: crimeTypeLoading } = useCrimeTypeByBarangay();

  // Debug logging
  React.useEffect(() => {
    console.log('🗺️ Barangay Layer Update:', {
      isTimeFilterActive,
      timeFilterHour,
      timeFilterHourCrimeCount,
      selectedCrimeType,
      filteredBarangays: Object.keys(filteredBarangayCrimeCounts),
      filteredCounts: filteredBarangayCrimeCounts,
      crimeTypeCounts
    });
  }, [isTimeFilterActive, timeFilterHour, timeFilterHourCrimeCount, filteredBarangayCrimeCounts, selectedCrimeType, crimeTypeCounts]);

  // Get the threat level color for the current hour based on total crimes
  const getHourThreatLevel = () => {
    if (!isTimeFilterActive || timeFilterHourCrimeCount === 0) return 'secure';
    if (timeFilterHourCrimeCount <= 2) return 'low';
    if (timeFilterHourCrimeCount <= 5) return 'moderate';
    if (timeFilterHourCrimeCount <= 10) return 'high';
    return 'critical';
  };

  const hourThreatLevel = getHourThreatLevel();
  const hourColor = THREAT_COLORS[hourThreatLevel];

  console.log('⏰ Hour Threat Level:', { 
    timeFilterHourCrimeCount, 
    hourThreatLevel, 
    hourColor 
  });

  const getThreatLevel = (barangayName: string) => {
    // When crime type is selected, use crime type counts
    if (selectedCrimeType) {
      const count = crimeTypeCounts[barangayName] || 0;
      return getThreatLevelFromCount(count, {
        low: 1,
        moderate: 2,
        high: 4,
        critical: 6
      });
    }
    
    // When time filter is active, ALL barangays with crimes use the hour's threat level
    // Otherwise use base counts
    if (isTimeFilterActive) {
      const hasFilteredCrimes = filteredBarangayCrimeCounts[barangayName] > 0;
      if (hasFilteredCrimes) {
        console.log(`✅ ${barangayName} has crimes, using ${hourThreatLevel}`);
        return hourThreatLevel; // Use hour's overall threat level
      }
      return 'secure'; // No crimes at this hour
    }
    
    // Normal mode: use individual barangay counts
    const count = barangayCrimeCounts[barangayName] || 0;
    return getThreatLevelFromCount(count, {
      low: 2,
      moderate: 5, 
      high: 10,
      critical: 15
    });
  };

  const hasFilteredCrimes = (barangayName: string) => {
    // Check if crime type filter is active
    if (selectedCrimeType) {
      return crimeTypeCounts[barangayName] > 0;
    }
    // Check if this barangay has crimes in the filtered time period
    return isTimeFilterActive && filteredBarangayCrimeCounts[barangayName] > 0;
  };

  // Don't render the layer until data is loaded to prevent color flickering
  if (loading && Object.keys(barangayCrimeCounts).length === 0) {
    return null;
  }

  const styleFeature = (feature: any) => {
    const name = feature.properties?.adm4_en;
    const level = getThreatLevel(name);
    const color = THREAT_COLORS[level];
    const hasActiveCrimes = hasFilteredCrimes(name);

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

    // When time filter is active
    if (isTimeFilterActive) {
      if (hasActiveCrimes) {
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
        // Dim barangays without crimes at this time
        return {
          color: "#64748b",
          weight: 1,
          opacity: 0.2,
          fillColor: "#64748b",
          fillOpacity: 0.1,
          dashArray: "3",
        };
      }
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
      const crimeCount = barangayCrimeCounts[name] || 0;
      const filteredCount = filteredBarangayCrimeCounts[name] || 0;
      const crimeTypeCount = crimeTypeCounts[name] || 0;
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
        key={`${selectedBarangay}-${hoveredThreatLevel}-${hotspotMonth}-${hotspotYear}-${loading}-${isTimeFilterActive}-${timeFilterHour}-${timeFilterHourCrimeCount}-${Object.keys(filteredBarangayCrimeCounts).length}-${selectedCrimeType}-${Object.keys(crimeTypeCounts).length}`}
        data={data}
        style={styleFeature}
        onEachFeature={onEachFeature}
      />
    </Pane>
  );
};

export default TanzaBarangayLayer;
