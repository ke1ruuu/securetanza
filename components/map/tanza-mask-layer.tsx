"use client";

import React, { useMemo } from "react";
import { GeoJSON, Pane } from "react-leaflet";
import { createWorldMask } from "../../utils/geo-utils";

interface MapMaskLayerProps {
  geoJsonData: any;
  blurAmount?: string;
  maskOpacity?: number;
}

const MapMaskLayer: React.FC<MapMaskLayerProps> = ({
  geoJsonData,
  maskOpacity = 1.0, 
}) => {
  const maskGeoJSON = useMemo(() => {
    if (!geoJsonData) return null;
    return createWorldMask(geoJsonData);
  }, [geoJsonData]);

  if (!maskGeoJSON) return null;

  return (
    <Pane name="mask-pane" style={{ zIndex: 350 }}>
      {/* Re-applying the blur class and transparency to show the map outside Tanza */}
      <GeoJSON
        data={maskGeoJSON as any}
        style={{
          fillColor: "#0f172a", // Match dashboard bg
          stroke: false,
          fillOpacity: 0.4, // Semi-transparent for blur effect
          className: "leaflet-mask-blur", // Applies the 20px blur from globals.css
        }}
        interactive={false}
      />
    </Pane>
  );
};

export default MapMaskLayer;
