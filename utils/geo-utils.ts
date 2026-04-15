import L from "leaflet";

/**
 * Creates an inverted GeoJSON that covers the whole world but has a "hole" for Tanza.
 */
export const createWorldMask = (geoJsonData: any) => {
  // A huge rectangle covering the world
  // A smaller but safe rectangle covering the area around Tanza (avoids extreme coordinate math)
  const worldOuterRing = [
    [10, 115],
    [10, 125],
    [20, 125],
    [20, 115],
    [10, 115],
  ].map((c) => [c[1], c[0]]); // GeoJSON uses [lng, lat]

  const tanzaRings: any[] = [];

  if (geoJsonData && geoJsonData.features) {
    geoJsonData.features.forEach((feature: any) => {
      const { type, coordinates } = feature.geometry;
      if (type === "Polygon") {
        tanzaRings.push(...coordinates);
      } else if (type === "MultiPolygon") {
        coordinates.forEach((polyCoords: any) => {
          tanzaRings.push(...polyCoords);
        });
      }
    });
  }

  return {
    type: "Feature",
    properties: {
      name: "MapMask",
    },
    geometry: {
      type: "Polygon",
      coordinates: [worldOuterRing, ...tanzaRings],
    },
  };
};

/**
 * Calculates the bounding box of a GeoJSON object.
 */
export const getGeoJsonBounds = (geoJsonData: any): [[number, number], [number, number]] | null => {
  if (!geoJsonData) return null;
  const tempLayer = L.geoJSON(geoJsonData);
  const bounds = tempLayer.getBounds();
  if (!bounds.isValid()) return null;
  return [
    [bounds.getSouthWest().lat, bounds.getSouthWest().lng],
    [bounds.getNorthEast().lat, bounds.getNorthEast().lng]
  ];
};

/**
 * Generates a random hex color.
 */
export const getRandomColor = () =>
  "#" +
  Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0");
