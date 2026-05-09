"use client";

import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { useMapContext } from "@/context/MapContext";

interface MapBoundsControllerProps {
  bounds: L.LatLngBounds | null;
}

export default function MapBoundsController({ bounds }: MapBoundsControllerProps) {
  const map = useMap();
  const { setInitialBounds } = useMapContext();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (bounds && !isInitialized) {
      // Set bounds immediately without animation on first load
      map.fitBounds(bounds, { padding: [40, 40], animate: false });
      // Save the initial bounds to context for reset functionality
      setInitialBounds(bounds);
      setIsInitialized(true);
    }
  }, [bounds, map, setInitialBounds, isInitialized]);

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
