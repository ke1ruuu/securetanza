"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { useRouter } from "next/navigation";

import {
  TANZA_CENTER,
  DEFAULT_ZOOM,
  MAP_ATTR,
} from "../../constants/map-constants";
import { useBarangayData } from "../../hooks/useBarangayData";
import TanzaBarangayLayer from "./tanza-geojson-layer";
import MapMaskLayer from "./tanza-mask-layer";
import TanzaPoliceStation from "./tanza-poi-layer";
import MapBoundsController from "./map-bounds-controller";
import MapFlyController from "./map-fly-controller";
import BarangayDrawer from "./barangay-drawer";
import HoverStatsPanel from "./hover-stats-panel";

import { useMapContext } from "@/context/MapContext";

/** Captures the Leaflet map instance into context for external controls */
function MapInstanceCapture() {
  const map = useMap();
  const { mapRef } = useMapContext();
  useEffect(() => {
    mapRef.current = map;
    return () => { mapRef.current = null; };
  }, [map, mapRef]);
  return null;
}

export default function TanzaMapRoot() {
  const router = useRouter();
  const {
    geoJsonData,
    selectedBarangay,
    setSelectedBarangay: onSelectBarangay,
    flyToStation,
    onFlyToStationComplete,
    hotspotMonth,
    hotspotYear,
  } = useMapContext();
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [clickedBarangay, setClickedBarangay] = useState<string | null>(null);

  // Use real barangay data
  const { data: barangayData, loading: barangayLoading } = useBarangayData(clickedBarangay);

  useEffect(() => {
    if (geoJsonData) {
      const tempLayer = L.geoJSON(geoJsonData);
      const calcBounds = tempLayer.getBounds();
      if (calcBounds.isValid()) {
        setBounds(calcBounds);
      }
    }
  }, [geoJsonData]);

  const handleBarangayClick = (name: string) => {
    setClickedBarangay(name);
    setDrawerOpen(true);
    onSelectBarangay(name);
  };

  const handleMoreInfo = (name: string) => {
    router.push(`/dashboard/overview?name=${name}`);
  };

  if (!geoJsonData) return null;

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={TANZA_CENTER}
        zoom={DEFAULT_ZOOM}
        minZoom={13}
        maxZoom={18}
        className="h-full w-full bg-[#0f172a]"
        zoomControl={false}
        attributionControl={false}
      >
        <MapInstanceCapture />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution={MAP_ATTR}
        />

        <MapBoundsController bounds={bounds} />

        <MapFlyController
          selectedBarangay={selectedBarangay}
          geoJsonData={geoJsonData}
          flyToStation={flyToStation}
          onFlyToStationComplete={onFlyToStationComplete}
          tanzaBounds={bounds}
        />

        <MapMaskLayer geoJsonData={geoJsonData} maskOpacity={0.4} />

        <TanzaBarangayLayer
          data={geoJsonData}
          selectedBarangay={selectedBarangay}
          onClickBarangay={handleBarangayClick}
        />

        <TanzaPoliceStation />
      </MapContainer>

      <BarangayDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        data={barangayData}
        loading={barangayLoading}
        onMoreInfo={handleMoreInfo}
      />

      <HoverStatsPanel />
    </div>
  );
}
