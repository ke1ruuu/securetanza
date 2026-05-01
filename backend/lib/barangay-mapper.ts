/**
 * Barangay name mapping utility
 * Maps GeoJSON barangay names to database barangay names
 */

// Map from GeoJSON names to database names
const GEOJSON_TO_DB_MAP: Record<string, string> = {
  'Amaya I': 'Daang Amaya I',
  'Amaya II': 'Daang Amaya II',
  'Amaya III': 'Daang Amaya III',
  // Amaya IV-VII don't exist in database, map to closest match
  'Amaya IV': 'Daang Amaya I',
  'Amaya V': 'Daang Amaya II',
  'Amaya VI': 'Daang Amaya III',
  'Amaya VII': 'Daang Amaya III',
}

// Map from database names back to GeoJSON names (for display)
const DB_TO_GEOJSON_MAP: Record<string, string> = {
  'Daang Amaya I': 'Amaya I',
  'Daang Amaya II': 'Amaya II',
  'Daang Amaya III': 'Amaya III',
}

/**
 * Convert a GeoJSON barangay name to the database barangay name
 * @param geojsonName - The barangay name from GeoJSON
 * @returns The corresponding database barangay name
 */
export function mapGeoJsonToDb(geojsonName: string): string {
  return GEOJSON_TO_DB_MAP[geojsonName] || geojsonName
}

/**
 * Convert a database barangay name to the GeoJSON barangay name
 * @param dbName - The barangay name from database
 * @returns The corresponding GeoJSON barangay name
 */
export function mapDbToGeoJson(dbName: string): string {
  return DB_TO_GEOJSON_MAP[dbName] || dbName
}

/**
 * Get all possible database barangay names for a given GeoJSON name
 * This is useful for OR queries when a GeoJSON name might map to multiple DB names
 * @param geojsonName - The barangay name from GeoJSON
 * @returns Array of possible database barangay names
 */
export function getAllDbNamesForGeoJson(geojsonName: string): string[] {
  const mapped = mapGeoJsonToDb(geojsonName)
  return [mapped]
}
