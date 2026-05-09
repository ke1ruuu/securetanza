"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap, GeoJSON } from "react-leaflet";
import L from "leaflet";
import { useRouter } from "next/navigation";

import {
  TANZA_CENTER,
  DEFAULT_ZOOM,
  MAP_ATTR,
} from "../../constants/map-constants";
import TanzaBarangayLayer from "./tanza-geojson-layer";
import MapMaskLayer from "./tanza-mask-layer";
import MapBoundsController from "./map-bounds-controller";
import MapFlyController from "./map-fly-controller";
import BarangayDrawer from "./barangay-drawer";

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

/** Captures the skeleton map instance to fit bounds */
function SkeletonMapCapture({ onMapReady }: { onMapReady: (map: L.Map) => void }) {
  const map = useMap();
  useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);
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
  } = useMapContext();
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [clickedBarangay, setClickedBarangay] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [skeletonMapRef, setSkeletonMapRef] = useState<L.Map | null>(null);

  useEffect(() => {
    if (geoJsonData) {
      const tempLayer = L.geoJSON(geoJsonData);
      const calcBounds = tempLayer.getBounds();
      if (calcBounds.isValid()) {
        setBounds(calcBounds);
        // Fit skeleton map to bounds immediately
        if (skeletonMapRef && !isMapReady) {
          skeletonMapRef.fitBounds(calcBounds, { padding: [40, 40], animate: false });
        }
        // Start fade out after delay
        setTimeout(() => {
          setIsFadingOut(true);
          // Remove overlay after fade completes
          setTimeout(() => setIsMapReady(true), 500);
        }, 800);
      }
    }
  }, [geoJsonData, skeletonMapRef, isMapReady]);

  const handleBarangayClick = (name: string) => {
    setClickedBarangay(name);
    setDrawerOpen(true);
    onSelectBarangay(name);
  };

  const handleMoreInfo = (name: string) => {
    router.push(`/dashboard/overview?name=${name}`);
  };

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

        {/* Police Station marker removed */}
      </MapContainer>

      {/* Loading Overlay - Covers map until ready */}
      {!isMapReady && geoJsonData && (
        <div className={`absolute inset-0 z-[9999] bg-[#0f172a] transition-opacity duration-500 ease-out ${
          isFadingOut ? 'opacity-0' : 'opacity-100'
        }`}>
          {/* Render actual map in background for skeleton */}
          <MapContainer
            center={TANZA_CENTER}
            zoom={DEFAULT_ZOOM}
            minZoom={13}
            maxZoom={18}
            className="h-full w-full bg-[#0f172a]"
            zoomControl={false}
            attributionControl={false}
          >
            <SkeletonMapCapture onMapReady={setSkeletonMapRef} />
            {/* No tile layer - keep it pure dark */}
            <GeoJSON
              data={geoJsonData}
              style={(feature) => {
                const index = geoJsonData.features.indexOf(feature);
                // Use theme colors - cyan/blue shades
                const colors = ['#0EA5E9', '#06b6d4', '#3b82f6', '#0284c7', '#0891b2', '#2563eb'];
                const randomColor = colors[index % colors.length];
                
                return {
                  fillColor: randomColor,
                  fillOpacity: 0,
                  color: '#06b6d4',
                  weight: 3,
                  opacity: 1
                };
              }}
              onEachFeature={(feature, layer) => {
                if (layer instanceof L.Path) {
                  const index = geoJsonData.features.indexOf(feature);
                  const animationDelay = (index * 150) % 2000;
                  
                  // Animate fill opacity
                  let opacity = 0;
                  let increasing = true;
                  
                  const animate = () => {
                    if (increasing) {
                      opacity += 0.008;
                      if (opacity >= 0.25) increasing = false;
                    } else {
                      opacity -= 0.008;
                      if (opacity <= 0) increasing = true;
                    }
                    layer.setStyle({ fillOpacity: opacity });
                  };
                  
                  setTimeout(() => {
                    const interval = setInterval(animate, 30);
                    // Clean up interval when component unmounts
                    return () => clearInterval(interval);
                  }, animationDelay);
                }
              }}
            />
          </MapContainer>
          
          {/* Loading Message */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[10000]">
            {/* Blur overlay */}
            <div className="absolute inset-0 backdrop-blur-md bg-[#0f172a]/30"></div>
            
            {/* Message card */}
            <div className="relative flex flex-col items-center gap-4 px-8 py-6 rounded-2xl bg-[#0f172a]/95 backdrop-blur-xl border border-white/[0.1] shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#06b6d4] animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-[#0EA5E9] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <p className="text-slate-100 text-sm font-semibold tracking-wide">
                Loading map layers...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Show loading overlay if GeoJSON hasn't loaded yet */}
      {!geoJsonData && (
        <div className="absolute inset-0 z-[9999] bg-[#0f172a] flex items-center justify-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-[#0EA5E9]/20 animate-ping"></div>
            </div>
            <div className="relative flex items-center justify-center w-16 h-16">
              <svg className="w-10 h-10 text-[#0EA5E9] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
          </div>
        </div>
      )}

      <BarangayDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        barangayName={clickedBarangay}
        onMoreInfo={handleMoreInfo}
      />
    </div>
  );
}
