export interface BarangayFeature {
  type: "Feature";
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: any[];
  };
  properties: {
    adm4_en: string;
    adm4_psgc: number;
    adm3_psgc: number;
    adm2_psgc: number;
    adm1_psgc: number;
    geo_level: string;
    area_km2: number;
    [key: string]: any;
  };
}

export type GeoJSONData = any; // Simplifying for this example
