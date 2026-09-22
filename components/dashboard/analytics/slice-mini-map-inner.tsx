"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Minus, RotateCcw } from "lucide-react";
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

/**
 * Draws the outer Tanza boundary — the silhouette of all barangays together.
 *
 * The GeoJSON is 41 separate barangay polygons whose shared borders don't
 * line up vertex-for-vertex, so there's no reliable way to dissolve them into
 * one outline by matching edges. Instead this paints on a canvas: stroke every
 * barangay thick, then erase each barangay's interior. Inner borders are
 * covered from both sides and vanish; only the band outside the outer edge
 * survives. The canvas sits in its own pane between the polygons and the pins
 * and ignores pointer events, so tooltips underneath keep working.
 */
function TanzaOutline({ geo, theme }: { geo: any; theme: string }) {
  const map = useMap();

  useEffect(() => {
    if (!geo?.features) return;

    const paneName = "tanza-outline-pane";
    const pane = map.getPane(paneName) ?? map.createPane(paneName);
    pane.style.zIndex = "450";
    pane.style.pointerEvents = "none";

    const canvas = L.DomUtil.create("canvas", "", pane) as HTMLCanvasElement;
    canvas.style.position = "absolute";
    const color = theme === "dark" ? "rgba(226,232,240,0.9)" : "rgba(15,23,42,0.85)";

    const rings: number[][][] = [];
    geo.features.forEach((f: any) => {
      const g = f?.geometry;
      if (g?.type === "Polygon") rings.push(...g.coordinates);
      else if (g?.type === "MultiPolygon") g.coordinates.forEach((p: any) => rings.push(...p));
    });

    const draw = () => {
      // Paint twice the viewport so a drag doesn't reveal blank edges.
      const size = map.getSize();
      const origin = map.containerPointToLayerPoint([-size.x / 2, -size.y / 2]);
      const dpr = window.devicePixelRatio || 1;
      const w = size.x * 2;
      const h = size.y * 2;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      L.DomUtil.setPosition(canvas, origin);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);

      const trace = () => {
        ctx.beginPath();
        rings.forEach((ring) => {
          ring.forEach(([lng, lat], i) => {
            const p = map.latLngToLayerPoint([lat, lng]);
            const x = p.x - origin.x;
            const y = p.y - origin.y;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.closePath();
        });
      };

      ctx.lineJoin = "round";
      trace();
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.stroke();

      // Erase interiors, plus a hairline stroke to clear slivers where
      // neighbouring polygons don't quite touch.
      ctx.globalCompositeOperation = "destination-out";
      trace();
      ctx.fillStyle = "#000";
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.globalCompositeOperation = "source-over";

      canvas.style.visibility = "visible";
    };

    // Stale during the zoom animation, so hide until it lands.
    const hide = () => {
      canvas.style.visibility = "hidden";
    };

    map.on("zoomstart", hide);
    map.on("moveend zoomend resize", draw);
    draw();

    return () => {
      map.off("zoomstart", hide);
      map.off("moveend zoomend resize", draw);
      canvas.remove();
    };
  }, [map, geo, theme]);

  return null;
}

/**
 * Zoom in / zoom out / reset-to-original-frame buttons.
 *
 * The global stylesheet hides Leaflet's built-in zoom control (the main map
 * uses sidebar controls instead), so the mini map carries its own. "Reset"
 * re-applies the same frame FrameMap computed — the involved barangays — or
 * the default Tanza view when nothing is highlighted.
 */
function ZoomControls({ bounds, theme }: { bounds: L.LatLngBounds | null; theme: string }) {
  const map = useMap();
  const ref = useRef<HTMLDivElement>(null);

  // Keep clicks/drags on the buttons from leaking through to the map.
  useEffect(() => {
    if (ref.current) {
      L.DomEvent.disableClickPropagation(ref.current);
      L.DomEvent.disableScrollPropagation(ref.current);
    }
  }, []);

  const reset = () => {
    if (bounds && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [16, 16], maxZoom: 14 });
    } else {
      map.setView(TANZA_CENTER, 12);
    }
  };

  const btn =
    "flex h-7 w-7 items-center justify-center transition-colors " +
    (theme === "dark"
      ? "bg-slate-800 text-slate-200 hover:bg-slate-700"
      : "bg-white text-slate-700 hover:bg-slate-100");

  return (
    <div
      ref={ref}
      className={`absolute right-2 top-2 z-1000 flex flex-col overflow-hidden rounded-md border shadow-sm divide-y ${
        theme === "dark" ? "border-white/10 divide-white/10" : "border-slate-300 divide-slate-200"
      }`}
    >
      <button type="button" className={btn} onClick={() => map.zoomIn()} aria-label="Zoom in" title="Zoom in">
        <Plus size={14} />
      </button>
      <button type="button" className={btn} onClick={() => map.zoomOut()} aria-label="Zoom out" title="Zoom out">
        <Minus size={14} />
      </button>
      <button type="button" className={btn} onClick={reset} aria-label="Reset view" title="Reset view">
        <RotateCcw size={13} />
      </button>
    </div>
  );
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
      <TanzaOutline geo={geo} theme={theme} />
      <FrameMap bounds={bounds} />
      <ZoomControls bounds={bounds} theme={theme} />
    </MapContainer>
  );
}
