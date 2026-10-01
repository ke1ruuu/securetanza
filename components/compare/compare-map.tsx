"use client";

import { useEffect, useMemo, useRef } from "react";
import { GeoJSON, MapContainer, Pane, TileLayer, useMap } from "react-leaflet";
import type { Feature } from "geojson";
import L from "leaflet";
import { TANZA_CENTER, DEFAULT_ZOOM, MAP_ATTR, TILE_URL } from "@/constants/map-constants";
import { THREAT_COLORS } from "@/hooks/useThreatLevels";
import { threatLevelOf, type ThreatThresholds } from "@/lib/geo-threat";
import MapMaskLayer from "@/components/map/tanza-mask-layer";
import { countKey, type Side } from "./compare-data";
import type { MapLink } from "./map-link";

interface CompareMapProps {
  side: Side;
  /** The barangay boundaries, as MapProvider loads them. The map only mounts once they have. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geoJsonData: any;
  counts: Record<string, number>;
  /** The scale both maps share. Null until both sides have been counted once: the shapes stay neutral until then. */
  thresholds: ThreatThresholds | null;
  hovered: string | null;
  onHover: (key: string | null) => void;
  onFocus: (key: string) => void;
  link: MapLink;
}

/** Joins this map to its partner through the link, once Leaflet has created it. */
function LinkCapture({ side, link, geoJsonData }: { side: Side; link: MapLink; geoJsonData: unknown }) {
  const map = useMap();
  useEffect(() => {
    link.setHome(geoJsonData as Parameters<MapLink["setHome"]>[0]);
    return link.attach(side, map);
  }, [side, link, map, geoJsonData]);
  return null;
}

const NEUTRAL = "#94a3b8";

export default function CompareMap({
  side,
  geoJsonData,
  counts,
  thresholds,
  hovered,
  onHover,
  onFocus,
  link,
}: CompareMapProps) {
  const layerRef = useRef<L.GeoJSON | null>(null);
  // onEachFeature binds once per shape, so it reads the current handlers through a ref.
  const handlers = useRef({ onHover, onFocus });
  useEffect(() => {
    handlers.current = { onHover, onFocus };
  }, [onHover, onFocus]);

  const style = useMemo(
    () =>
      (feature?: Feature): L.PathOptions => {
        const key = countKey(String(feature?.properties?.adm4_en ?? ""));
        if (!thresholds) {
          return { color: NEUTRAL, weight: 1.5, opacity: 0.6, fillColor: NEUTRAL, fillOpacity: 0.12, dashArray: "4 4" };
        }
        const color = THREAT_COLORS[threatLevelOf(counts[key] ?? 0, thresholds)];
        const isHovered = hovered === key;
        const dimmed = hovered !== null && !isHovered;
        return {
          color: isHovered ? "#ffffff" : color,
          weight: isHovered ? 4 : 2,
          opacity: dimmed ? 0.35 : isHovered ? 1 : 0.75,
          fillColor: color,
          fillOpacity: isHovered ? 0.75 : dimmed ? 0.2 : 0.45,
          dashArray: "",
        };
      },
    [counts, thresholds, hovered]
  );

  // The highlighted shape is drawn over its neighbours, so its white edge isn't hidden under theirs.
  useEffect(() => {
    if (!hovered) return;
    layerRef.current?.eachLayer((layer) => {
      const feature = (layer as L.GeoJSON & { feature?: Feature }).feature;
      if (countKey(String(feature?.properties?.adm4_en ?? "")) === hovered) (layer as L.Path).bringToFront();
    });
  }, [hovered, style]);

  return (
    <MapContainer
      center={TANZA_CENTER}
      zoom={DEFAULT_ZOOM}
      minZoom={12}
      maxZoom={18}
      // Quarter steps, so fitting Tanza to the pane lands close to its edges instead of a whole zoom level short.
      zoomSnap={0.25}
      className="h-full w-full bg-[#0f172a]"
      zoomControl={false}
      attributionControl={false}
    >
      <LinkCapture side={side} link={link} geoJsonData={geoJsonData} />
      <TileLayer url={TILE_URL} attribution={MAP_ATTR} />
      <MapMaskLayer geoJsonData={geoJsonData} maskOpacity={0.4} />
      <Pane name="barangay-pane" style={{ zIndex: 450 }}>
        <GeoJSON
          ref={layerRef}
          data={geoJsonData}
          style={style}
          onEachFeature={(feature, layer) => {
            const key = countKey(String(feature.properties?.adm4_en ?? ""));
            layer.on({
              mouseover: () => handlers.current.onHover(key),
              mouseout: () => handlers.current.onHover(null),
              click: () => handlers.current.onFocus(key),
            });
          }}
        />
      </Pane>
    </MapContainer>
  );
}
