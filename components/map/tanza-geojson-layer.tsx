"use client";

import React from "react";
import { GeoJSON, Pane } from "react-leaflet";
import L from "leaflet";
import { useMapContext } from "@/context/MapContext";
import { useThreatLevels, getThreatLevelFromCount, THREAT_COLORS } from "@/hooks/useThreatLevels";
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
  const { hotspotMode, hotspotMonth, hotspotYear, hoveredThreatLevel, setHoveredBarangay } =
    useMapContext();
  
  const { barangayCrimeCounts, loading } = useThreatLevels();

  const getThreatLevel = (barangayName: string) => {
    // Always use the fixed thresholds for consistency
    const count = barangayCrimeCounts[barangayName] || 0;
    return getThreatLevelFromCount(count, {
      low: 2,
      moderate: 5, 
      high: 10,
      critical: 15
    });
  };

  // Don't render the layer until data is loaded to prevent color flickering
  if (loading && Object.keys(barangayCrimeCounts).length === 0) {
    return null;
  }

  const styleFeature = (feature: any) => {
    const name = feature.properties?.adm4_en;
    const level = getThreatLevel(name);
    const color = THREAT_COLORS[level];

    const isSelected = selectedBarangay === name;
    const isFocusMatch = hoveredThreatLevel
      ? level === hoveredThreatLevel.toLowerCase()
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
      const threatLevel = getThreatLevel(name);
      
      layer.bindTooltip(
        `<div style="padding:4px 8px; background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(129, 140, 248, 0.2); border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.5)">
          <p style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#818cf8;font-weight:700;margin:0 0 2px">Barangay</p>
          <p style="font-size:14px;font-weight:700;color:#f1f5f9;margin:0 0 4px">${name}</p>
          <div style="display:flex;align-items:center;gap:6px;margin:0">
            <div style="width:8px;height:8px;border-radius:50%;background:${THREAT_COLORS[threatLevel]}"></div>
            <span style="font-size:10px;font-weight:600;color:#94a3b8;text-transform:capitalize">${threatLevel} (${crimeCount} crimes)</span>
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
        key={`${selectedBarangay}-${hoveredThreatLevel}-${hotspotMonth}-${hotspotYear}-${loading}`}
        data={data}
        style={styleFeature}
        onEachFeature={onEachFeature}
      />
    </Pane>
  );
};

export default TanzaBarangayLayer;
