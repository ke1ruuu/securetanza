"use client";

import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Tooltip, useMap } from "react-leaflet";
import type { Layer } from "leaflet";
import L from "leaflet";
import { TANZA_CENTER, TILE_URL, MAP_ATTR } from "@/constants/map-constants";
import type { CrimeIncident } from "@/lib/api";
import { rampColorForTheme, rgbToCss } from "@/lib/report-theme";
import { normalizeBarangayName as norm } from "@/lib/analytics-slice";

/**
 * Sizes and frames the map.
 *
 * Both halves have to happen here, in this order, because they're coupled:
 * Leaflet measures its container on mount, and inside a Dialog that container
 * is still zero-sized (or mid-animation) at that moment — which both produces
 * the classic grey half-rendered map *and* makes any fitBounds computed
 * against the wrong viewport. Splitting these into two components racing on
 * separate timers is how the frame silently ends up ignored.
 *
 * The ResizeObserver then keeps both correct if the modal is resized later.
 */
function FrameMap({ bounds }: { bounds: L.LatLngBounds | null }) {
  const map = useMap();

  useEffect(() => {
    const apply = () => {
      map.invalidateSize();
      if (bounds && bounds.isValid()) {
        map.fitBounds(bounds, { padding: [16, 16], maxZoom: 14 });
      }
    };

    // Once immediately, once after the dialog's open animation settles.
    const raf = requestAnimationFrame(apply);
    const timer = setTimeout(apply, 260);

    const observer = new ResizeObserver(apply);
    observer.observe(map.getContainer());

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [map, bounds]);

  return null;
}

export default function SliceMiniMapInner({
  incidents,
  theme,
}: {
  incidents: CrimeIncident[];
  theme: string;
}) {
  const [geo, setGeo] = useState<any>(null);
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/tanza_cavite.geojson")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setGeo(data);
      })
      .catch(() => {
        /* map is supplementary — a failed fetch just leaves the base tiles */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /** How many of this slice's incidents fall in each barangay. */
  const countsByBarangay = useMemo(() => {
    const counts = new Map<string, number>();
    incidents.forEach((c) => {
      const key = norm(c.barangay);
      if (!key) return;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return counts;
  }, [incidents]);

  const maxCount = useMemo(
    () => Math.max(...Array.from(countsByBarangay.values()), 1),
    [countsByBarangay]
  );

  const pins = useMemo(
    () =>
      incidents.filter(
        (c) => typeof c.latitude === "number" && typeof c.longitude === "number"
      ),
    [incidents]
  );

  // Colour the involved barangays on the same ramp the bars use, so the map
  // reads as part of this page rather than a transplant from the Map tab.
  const styleFeature = (feature: any) => {
    const count = countsByBarangay.get(norm(feature?.properties?.adm4_en)) ?? 0;
    if (count === 0) {
      return {
        fillColor: theme === "dark" ? "#1e293b" : "#f1f5f9",
        fillOpacity: 0.35,
        color: theme === "dark" ? "rgba(255,255,255,0.10)" : "#cbd5e1",
        weight: 1,
      };
    }
    return {
      fillColor: rgbToCss(
        rampColorForTheme(count / maxCount, theme === "dark" ? "dark" : "light")
      ),
      fillOpacity: 0.75,
      color: theme === "dark" ? "#38bdf8" : "#0369a1",
      weight: 1.5,
    };
  };

  const onEachFeature = (feature: any, layer: Layer) => {
    const name = feature?.properties?.adm4_en;
    const count = countsByBarangay.get(norm(name)) ?? 0;
    if (count > 0) {
      layer.bindTooltip(`${name}: ${count} incident${count === 1 ? "" : "s"}`, { sticky: true });
    }
  };

  // Recompute the frame whenever the highlighted set changes.
  useEffect(() => {
    if (!geo) return;
    const involved = L.latLngBounds([]);
    geo.features?.forEach((feature: any) => {
      if ((countsByBarangay.get(norm(feature?.properties?.adm4_en)) ?? 0) === 0) return;
      try {
        involved.extend(L.geoJSON(feature).getBounds());
      } catch {
        /* skip malformed geometry rather than losing the whole frame */
      }
    });
    setBounds(involved.isValid() ? involved : null);
  }, [geo, countsByBarangay]);

  const accent = theme === "dark" ? "#38bdf8" : "#0369a1";

  return (
    <MapContainer
      center={TANZA_CENTER}
      zoom={12}
      style={{ height: 220, width: "100%" }}
      scrollWheelZoom={false}
      attributionControl={false}
    >
      <TileLayer url={TILE_URL} attribution={MAP_ATTR} />
      {geo && (
        <GeoJSON
          // Re-style when the slice changes — Leaflet caches layer styles.
          key={`${countsByBarangay.size}-${maxCount}-${theme}`}
          data={geo}
          style={styleFeature}
          onEachFeature={onEachFeature}
        />
      )}
      {pins.map((c, i) => (
        <CircleMarker
          key={c.id ?? i}
          center={[c.latitude as number, c.longitude as number]}
          radius={5}
          // markerPane (z 600) sits above overlayPane (z 400) where the
          // polygons live — without this the GeoJSON layer re-adds itself on
          // every restyle and buries the pins underneath it.
          pane="markerPane"
          pathOptions={{ color: "#ffffff", weight: 1.5, fillColor: accent, fillOpacity: 0.95 }}
        >
          <Tooltip>
            {c.blotterNo ?? "Incident"} · {c.barangay}
          </Tooltip>
        </CircleMarker>
      ))}
      <FrameMap bounds={bounds} />
    </MapContainer>
  );
}
