// API utility functions for fetching data from backend

export interface CrimeIncident {
  id: string
  blotterNo?: string
  dateEncoded?: string
  pro?: string
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
  suspectSubMotive?: string
  heinous?: boolean
  sensational?: boolean
  threatGrp?: boolean
  grpAffiliation?: string
  incidentTypeThreatGrp?: string
  mrs?: string
  suspectIsEGO?: boolean
  suspectEGOPosition?: string
  suspectEGOClass?: string
  suspectCount?: number
  victimIsEGO?: boolean
  victimEGOPosition?: string
  victimEGOClass?: string
  victimCount?: number
  caseStatus?: string
  investigator?: string
  headInves?: string
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
  startDateCommitted?: string
  endDateCommitted?: string
  startHour?: number
  endHour?: number
  year?: number
}): Promise<CrimeIncident[]> {
  try {
    const searchParams = new URLSearchParams()
    if (params?.barangay) searchParams.set('barangay', params.barangay)
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.incidentType) searchParams.set('incidentType', params.incidentType)
    if (params?.startDateCommitted) searchParams.set('startDateCommitted', params.startDateCommitted)
    if (params?.endDateCommitted) searchParams.set('endDateCommitted', params.endDateCommitted)
    if (params?.year) searchParams.set('year', params.year.toString())

    const response = await fetch(`/api/crimes?${searchParams}`)
    if (!response.ok) {
      return []
    }
    const result: ApiResponse<CrimeIncident[]> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch crimes')
    }
    
    // Filter by hour if specified
    let crimes = result.data || []
    if (params?.startHour !== undefined || params?.endHour !== undefined) {
      crimes = crimes.filter(crime => {
        const hour = new Date(crime.dateCommitted).getHours()
        if (params.startHour !== undefined && hour < params.startHour) return false
        if (params.endHour !== undefined && hour > params.endHour) return false
        return true
      })
    }
    
    return crimes
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
  year?: number
}): Promise<CrimeStats | null> {
  try {
    const searchParams = new URLSearchParams()
    if (params?.barangay) searchParams.set('barangay', params.barangay)
    if (params?.startDate) searchParams.set('startDate', params.startDate)
    if (params?.endDate) searchParams.set('endDate', params.endDate)
    if (params?.year) searchParams.set('year', params.year.toString())

    const response = await fetch(`/api/crimes/stats?${searchParams}`)
    if (!response.ok) {
      return null
    }
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
    if (!response.ok) {
      return []
    }
    const result: ApiResponse<Barangay[]> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch barangays')
    }
    
    return result.data || []
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
  status: "Cleared" | "Under Investigation" | "Filed in Court" | "Archived" | "Pending"
  severity: "High" | "Medium" | "Low"
  location: string
  timeReported?: string
  dateCommitted?: string
  timeCommitted?: string
} {
  // Determine status based on caseStatus field (primary) or stageOfFelony (fallback)
  let status: "Cleared" | "Under Investigation" | "Filed in Court" | "Archived" | "Pending" = "Pending"
  
  if (crime.caseStatus) {
    const caseStatusLower = crime.caseStatus.toLowerCase()
    if (caseStatusLower.includes('cleared') || caseStatusLower.includes('solved')) {
      status = "Cleared"
    } else if (caseStatusLower.includes('investigation') || caseStatusLower.includes('investigating')) {
      status = "Under Investigation"
    } else if (caseStatusLower.includes('filed') || caseStatusLower.includes('court')) {
      status = "Filed in Court"
    } else if (caseStatusLower.includes('archived') || caseStatusLower.includes('closed')) {
      status = "Archived"
    }
  } else if (crime.stageOfFelony) {
    // Fallback to stageOfFelony if caseStatus is not available
    const stageLower = crime.stageOfFelony.toLowerCase()
    if (stageLower.includes('consummated') || stageLower.includes('solved') || stageLower.includes('closed')) {
      status = "Cleared"
    } else if (stageLower.includes('attempted') || stageLower.includes('frustrated')) {
      status = "Under Investigation"
    }
  }

  // Determine severity based on incident type and heinous flag
  let severity: "High" | "Medium" | "Low" = "Medium"
  
  // Check heinous flag first
  if (crime.heinous) {
    severity = "High"
  } else {
    const highSeverityTypes = ['murder', 'homicide', 'rape', 'robbery', 'kidnapping', 'arson']
    const lowSeverityTypes = ['theft', 'vandalism', 'trespass', 'public disorder', 'alarm']
    
    const incidentTypeLower = crime.incidentType.toLowerCase()
    if (highSeverityTypes.some(type => incidentTypeLower.includes(type))) {
      severity = "High"
    } else if (lowSeverityTypes.some(type => incidentTypeLower.includes(type))) {
      severity = "Low"
    }
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
    location: crime.barangay,
    timeReported: crime.timeReported,
    dateCommitted: crime.dateCommitted,
    timeCommitted: crime.timeCommitted
  }
}