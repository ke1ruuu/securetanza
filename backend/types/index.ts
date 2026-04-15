// Backend type definitions

export interface CrimeIncident {
  id: string
  
  // Police Organization Structure
  ppo?: string                    // Police Provincial Office
  stn?: string                    // Station
  pcp?: string                    // Police Community Precinct
  
  // Administrative Location
  region?: string
  province?: string
  municipal?: string              // Municipality
  barangay: string
  street?: string
  
  // Location Details
  typeOfPlace?: string            // Type of place where incident occurred
  
  // Reporting Information
  dateReported: Date
  timeReported: string            // HH:MM:SS format
  
  // Incident Information
  dateCommitted: Date
  timeCommitted: string           // HH:MM:SS format
  incidentType: string            // Type of incident
  isCrime: boolean                // YES/NO from iscime column
  
  // Process Information
  modeReporting?: string          // How the crime was reported
  stageOfFelony?: string          // Stage of the felony
  
  // Legal Information
  offense?: string                // Legal offense description
  offenseType?: string            // Type of offense (Republic Act, etc.)
  section?: string                // Legal section reference
  
  // Crime Details
  modus?: string                  // Method of operation
  suspectMotive?: string          // Motive of the suspect
  
  // Geographic Coordinates
  latitude?: number
  longitude?: number
  
  // System Timestamps
  createdAt: Date
  updatedAt: Date
}

export interface Barangay {
  id: string
  name: string
  coordinates?: any
  population?: number
  area?: number
  createdAt: Date
  updatedAt: Date
}

export interface CrimeStats {
  totalCrimes: number
  recentCrimes: number
  crimesByType: { type: string; count: number }[]
  crimesByBarangay: { barangay: string; count: number }[]
  crimesByModus: { modus: string; count: number }[]
  crimesByLocation: { typeOfPlace: string; count: number }[]
  monthlyStats: { month: number; count: number }[]
  geographicStats: { barangay: string; latitude?: number; longitude?: number; count: number }[]
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  count?: number
}

export interface CrimeFilters {
  barangay?: string
  region?: string
  province?: string
  municipal?: string
  incidentType?: string
  startDateReported?: string
  endDateReported?: string
  startDateCommitted?: string
  endDateCommitted?: string
  modeReporting?: string
  stageOfFelony?: string
  offenseType?: string
  modus?: string
  typeOfPlace?: string
  limit?: string
}

export interface CreateCrimeRequest {
  // Required fields
  barangay: string
  dateReported: string
  timeReported: string
  dateCommitted: string
  timeCommitted: string
  incidentType: string
  
  // Optional fields
  ppo?: string
  stn?: string
  pcp?: string
  region?: string
  province?: string
  municipal?: string
  street?: string
  typeOfPlace?: string
  isCrime?: boolean
  modeReporting?: string
  stageOfFelony?: string
  offense?: string
  offenseType?: string
  section?: string
  modus?: string
  suspectMotive?: string
  latitude?: number
  longitude?: number
}

export interface UpdateCrimeRequest {
  barangay?: string
  dateReported?: string
  timeReported?: string
  dateCommitted?: string
  timeCommitted?: string
  incidentType?: string
  ppo?: string
  stn?: string
  pcp?: string
  region?: string
  province?: string
  municipal?: string
  street?: string
  typeOfPlace?: string
  isCrime?: boolean
  modeReporting?: string
  stageOfFelony?: string
  offense?: string
  offenseType?: string
  section?: string
  modus?: string
  suspectMotive?: string
  latitude?: number
  longitude?: number
}

export interface CreateBarangayRequest {
  name: string
  coordinates?: any
  population?: number
  area?: number
}