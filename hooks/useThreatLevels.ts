import { useState, useEffect } from 'react'
import { useMapContext } from '@/context/MapContext'

export interface ThreatLevelStats {
  secure: number
  low: number
  moderate: number
  high: number
  critical: number
}

export interface ThreatThresholds {
  low: number
  moderate: number
  high: number
  critical: number
}

// Fixed thresholds based on crime data analysis to ensure consistent coloring
const FIXED_THRESHOLDS: ThreatThresholds = {
  low: 2,      // 1-2 crimes = Low threat
  moderate: 5,  // 3-5 crimes = Moderate threat  
  high: 10,     // 6-10 crimes = High threat
  critical: 15  // 11+ crimes = Critical threat
}

export function useThreatLevels() {
  const [stats, setStats] = useState<ThreatLevelStats>({
    secure: 0,
    low: 0,
    moderate: 0,
    high: 0,
    critical: 0
  })
  const [barangayCrimeCounts, setBarangayCrimeCounts] = useState<Record<string, number>>({})
  const [filteredBarangayCrimeCounts, setFilteredBarangayCrimeCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  
  const { timeFilterDate, timeFilterHour, isTimeFilterActive } = useMapContext()

  // Fetch base crime data (all crimes)
  useEffect(() => {
    async function loadBaseThreatData() {
      try {
        setLoading(true)
        
        // Fetch all barangay crime counts (no filter)
        const response = await fetch('/api/crimes/barangay-counts')
        const result = await response.json()
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch barangay counts')
        }
        
        const { barangayCounts } = result.data
        setBarangayCrimeCounts(barangayCounts)
        
        // Calculate threat level distribution using fixed thresholds
        const threatStats = {
          secure: 0,
          low: 0,
          moderate: 0,
          high: 0,
          critical: 0
        }
        
        Object.values(barangayCounts).forEach(count => {
          const level = getThreatLevelFromCount(count as number, FIXED_THRESHOLDS)
          threatStats[level]++
        })
        
        // Add barangays with no crimes as secure
        const totalKnownBarangays = 24 // Total barangays in Tanza
        const barangaysWithCrimes = Object.keys(barangayCounts).length
        threatStats.secure += Math.max(0, totalKnownBarangays - barangaysWithCrimes)
        
        setStats(threatStats)
      } catch (error) {
        console.error('Error loading threat data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBaseThreatData()
  }, [])

  // Fetch filtered crime data when time filter is active
  useEffect(() => {
    async function loadFilteredThreatData() {
      if (!isTimeFilterActive || !timeFilterDate) {
        console.log('Time filter not active or no date, clearing filtered counts')
        setFilteredBarangayCrimeCounts({})
        return
      }

      try {
        const params = new URLSearchParams()
        
        // Use the selected date for filtering
        const startDate = new Date(timeFilterDate)
        const endDate = new Date(timeFilterDate)
        
        if (timeFilterHour !== null) {
          // Filter by specific hour - set date range to that day
          startDate.setHours(0, 0, 0, 0)
          endDate.setHours(23, 59, 59, 999)
          
          // Pass hour as a parameter to the API
          params.set('hour', timeFilterHour.toString())
        } else {
          // Filter by entire day
          startDate.setHours(0, 0, 0, 0)
          endDate.setHours(23, 59, 59, 999)
        }
        
        // Convert to ISO string for API
        params.set('startDateCommitted', startDate.toISOString())
        params.set('endDateCommitted', endDate.toISOString())
        
        console.log('🔍 Fetching filtered crimes:', {
          date: timeFilterDate.toLocaleDateString(),
          hour: timeFilterHour,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        })
        
        const response = await fetch(`/api/crimes/barangay-counts?${params}`)
        const result = await response.json()
        
        console.log('📊 Filtered crime counts result:', result.data)
        
        if (result.success) {
          setFilteredBarangayCrimeCounts(result.data.barangayCounts)
        }
      } catch (error) {
        console.error('Error loading filtered threat data:', error)
      }
    }

    loadFilteredThreatData()
  }, [timeFilterDate, timeFilterHour, isTimeFilterActive])

  return { 
    stats, 
    thresholds: FIXED_THRESHOLDS, 
    barangayCrimeCounts, 
    filteredBarangayCrimeCounts,
    loading 
  }
}

export function getThreatLevelFromCount(count: number, thresholds: ThreatThresholds): keyof ThreatLevelStats {
  if (count === 0) return 'secure'
  if (count <= thresholds.low) return 'low'
  if (count <= thresholds.moderate) return 'moderate'
  if (count <= thresholds.high) return 'high'
  return 'critical'
}

export const THREAT_COLORS = {
  secure: "#0ea5e9", // Sky Blue
  low: "#10b981", // Emerald
  moderate: "#eab308", // Yellow
  high: "#f97316", // Orange
  critical: "#ef4444", // Red
}