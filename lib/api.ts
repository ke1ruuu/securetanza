// API utility functions for fetching data from backend

export interface CrimeIncident {
  id: string
  ppo?: string
  stn?: string
  pcp?: string
  region?: string
  province?: string
  municipal?: string
  barangay: string
  street?: string
  typeOfPlace?: string
  dateReported: string
  timeReported: string
  dateCommitted: string
  timeCommitted: string
  incidentType: string
  isCrime: boolean
  modeReporting?: string
  stageOfFelony?: string
  offense?: string
  offenseType?: string
  section?: string
  modus?: string
  suspectMotive?: string
  latitude?: number
  longitude?: number
  createdAt: string
  updatedAt: string
}

export interface CrimeStats {
  totalCrimes: number
  activeCases: number
  resolvedToday: number
  recentCrimes: number
  safetyIndex: string
  crimesByType: Array<{ type: string; count: number }>
  crimesByBarangay: Array<{ barangay: string; count: number }>
  monthlyStats: Array<{ month: number; count: number }>
  activity: number[]
}

export interface Barangay {
  id: string
  name: string
  coordinates?: any
  population?: number
  area?: number
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  count?: number
  error?: string
}

// Fetch crime incidents
export async function fetchCrimes(params?: {
  barangay?: string
  limit?: number
  incidentType?: string
}): Promise<CrimeIncident[]> {
  try {
    const searchParams = new URLSearchParams()
    if (params?.barangay) searchParams.set('barangay', params.barangay)
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.incidentType) searchParams.set('incidentType', params.incidentType)

    const response = await fetch(`/api/crimes?${searchParams}`)
    const result: ApiResponse<CrimeIncident[]> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch crimes')
    }
    
    return result.data
  } catch (error) {
    console.error('Error fetching crimes:', error)
    return []
  }
}

// Fetch crime statistics
export async function fetchCrimeStats(params?: {
  barangay?: string
  startDate?: string
  endDate?: string
}): Promise<CrimeStats | null> {
  try {
    const searchParams = new URLSearchParams()
    if (params?.barangay) searchParams.set('barangay', params.barangay)
    if (params?.startDate) searchParams.set('startDate', params.startDate)
    if (params?.endDate) searchParams.set('endDate', params.endDate)

    const response = await fetch(`/api/crimes/stats?${searchParams}`)
    const result: ApiResponse<CrimeStats> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch crime statistics')
    }
    
    return result.data
  } catch (error) {
    console.error('Error fetching crime statistics:', error)
    return null
  }
}

// Fetch barangays
export async function fetchBarangays(search?: string): Promise<Barangay[]> {
  try {
    const searchParams = new URLSearchParams()
    if (search) searchParams.set('search', search)

    const response = await fetch(`/api/barangays?${searchParams}`)
    const result: ApiResponse<Barangay[]> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch barangays')
    }
    
    return result.data
  } catch (error) {
    console.error('Error fetching barangays:', error)
    return []
  }
}

// Transform crime incident to match frontend Incident interface
export function transformCrimeToIncident(crime: CrimeIncident): {
  id: string
  type: string
  date: string
  status: "Active" | "Solved" | "Investigating" | "Pending"
  severity: "High" | "Medium" | "Low"
  location: string
} {
  // Determine status based on stage of felony
  let status: "Active" | "Solved" | "Investigating" | "Pending" = "Active"
  if (crime.stageOfFelony === 'Consummated' || crime.stageOfFelony === 'Solved' || crime.stageOfFelony === 'Closed') {
    status = "Solved"
  } else if (crime.stageOfFelony === 'Attempted' || crime.stageOfFelony === 'Frustrated') {
    status = "Investigating"
  } else if (crime.stageOfFelony === 'Preparatory Acts') {
    status = "Pending"
  }

  // Determine severity based on incident type
  let severity: "High" | "Medium" | "Low" = "Medium"
  const highSeverityTypes = ['murder', 'homicide', 'rape', 'robbery', 'kidnapping', 'arson']
  const lowSeverityTypes = ['theft', 'vandalism', 'trespass', 'public disorder']
  
  const incidentTypeLower = crime.incidentType.toLowerCase()
  if (highSeverityTypes.some(type => incidentTypeLower.includes(type))) {
    severity = "High"
  } else if (lowSeverityTypes.some(type => incidentTypeLower.includes(type))) {
    severity = "Low"
  }

  // Format date
  const dateCommitted = new Date(crime.dateCommitted)
  const now = new Date()
  const diffHours = Math.floor((now.getTime() - dateCommitted.getTime()) / (1000 * 60 * 60))
  
  let dateString = ""
  if (diffHours < 1) {
    dateString = "Just now"
  } else if (diffHours < 24) {
    dateString = `${diffHours}h ago`
  } else if (diffHours < 48) {
    dateString = "Yesterday"
  } else {
    dateString = dateCommitted.toLocaleDateString()
  }

  return {
    id: crime.id,
    type: crime.incidentType,
    date: dateString,
    status,
    severity,
    location: crime.barangay
  }
}