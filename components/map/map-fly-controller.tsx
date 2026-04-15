"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { POLICE_STATION_COORD } from "../../constants/map-constants";

interface MapFlyControllerProps {
  selectedBarangay: string | null;
  geoJsonData: any;
  flyToStation: boolean;
  onFlyToStationComplete: () => void;
  tanzaBounds: L.LatLngBounds | null;
}

export default function MapFlyController({
  selectedBarangay,
  geoJsonData,
  flyToStation,
  onFlyToStationComplete,
  tanzaBounds,
}: MapFlyControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (flyToStation) {
      map.flyTo(POLICE_STATION_COORD, 17, { duration: 1.2 });
      onFlyToStationComplete();
    }
  }, [flyToStation, map, onFlyToStationComplete]);

  useEffect(() => {
    if (!geoJsonData) return;

    if (selectedBarangay) {
      const feature = geoJsonData.features.find(
        (f: any) => f.properties.adm4_en === selectedBarangay
      );
      if (feature) {
        const layer = L.geoJSON(feature);
        const bounds = layer.getBounds();
        if (bounds.isValid()) {
          map.flyToBounds(bounds, { padding: [100, 100], duration: 1.2 });
        }
      }
    } else if (tanzaBounds) {
      map.flyToBounds(tanzaBounds, { padding: [40, 40], duration: 1.2 });
    }
  }, [selectedBarangay, geoJsonData, map, tanzaBounds]);

  return null;
}
