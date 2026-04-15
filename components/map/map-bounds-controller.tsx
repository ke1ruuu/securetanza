"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface MapBoundsControllerProps {
  bounds: L.LatLngBounds | null;
}

export default function MapBoundsController({ bounds }: MapBoundsControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [40, 40], animate: true });
    }
  }, [bounds, map]);

  useEffect(() => {
    const handleMoveEnd = () => {
      if (bounds && !map.getBounds().intersects(bounds)) {
        map.fitBounds(bounds, { padding: [50, 50], animate: false });
      }
    };
    map.on("moveend", handleMoveEnd);
    return () => {
      map.off("moveend", handleMoveEnd);
    };
  }, [bounds, map]);

  return null;
}
