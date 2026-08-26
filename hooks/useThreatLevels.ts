import { useState, useEffect } from 'react'
import { useMapContext } from '@/context/MapContext'
import { useTimeRangeData } from '@/hooks/useTimeRangeData'

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

// Calculate dynamic thresholds based on quartiles of actual crime data
function calculateDynamicThresholds(crimeCounts: number[]): ThreatThresholds {
  // Filter out zeros and sort
  const nonZeroCounts = crimeCounts.filter(count => count > 0).sort((a, b) => a - b);
  
  if (nonZeroCounts.length === 0) {
    // Fallback to fixed thresholds if no data
    return {
      low: 2,
      moderate: 5,
      high: 10,
      critical: 15
    };
  }
  
  // Calculate quartiles (Q1, Q2/median, Q3)
  const q1Index = Math.floor(nonZeroCounts.length * 0.25);
  const q2Index = Math.floor(nonZeroCounts.length * 0.50);
  const q3Index = Math.floor(nonZeroCounts.length * 0.75);
  
  const q1 = nonZeroCounts[q1Index] || 1;
  const q2 = nonZeroCounts[q2Index] || 2;
  const q3 = nonZeroCounts[q3Index] || 5;
  
  return {
    low: Math.ceil(q1),           // 0-25th percentile
    moderate: Math.ceil(q2),      // 25th-50th percentile
    high: Math.ceil(q3),          // 50th-75th percentile
    critical: Math.ceil(q3) + 1   // 75th+ percentile
  };
}

export function useThreatLevels() {
  const [stats, setStats] = useState<ThreatLevelStats>({
    secure: 0,
    low: 0,
    moderate: 0,
    high: 0,
    critical: 0
  })
  const [thresholds, setThresholds] = useState<ThreatThresholds>({
    low: 2,
    moderate: 5,
    high: 10,
    critical: 15
  })
  const [barangayCrimeCounts, setBarangayCrimeCounts] = useState<Record<string, number>>({})
  const [filteredBarangayCrimeCounts, setFilteredBarangayCrimeCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  
  const { timeFilterDate, timeFilterHour, isTimeFilterActive, selectedYear, timeRange } = useMapContext()
  const dateRanges = useTimeRangeData()

  // Fetch base crime data (all crimes or filtered by timeRange / year)
  useEffect(() => {
    // Wait until timeRange selections or selectedYear is set
    if (dateRanges.length === 0 && selectedYear === null) {
      console.log('⏳ Waiting for temporal filter to be initialized...')
      return
    }
    
    async function loadBaseThreatData() {
      try {
        setLoading(true)
        const mergedCounts: Record<string, number> = {}

        if (dateRanges.length > 0) {
          // Multi-Range / Granular TimeRange (Year, Quarter, Month, Half-Year, Day)
          const results = await Promise.all(
            dateRanges.map(async ({ start, end }) => {
              const params = new URLSearchParams()
              params.set('startDateCommitted', start.toISOString())
              params.set('endDateCommitted', end.toISOString())
              const response = await fetch(`/api/crimes/barangay-counts?${params}`)
              if (!response.ok) return null
              return response.json()
            })
          )

          results.forEach(result => {
            if (result?.success && result.data?.barangayCounts) {
              Object.entries(result.data.barangayCounts).forEach(([barangay, count]) => {
                mergedCounts[barangay] = (mergedCounts[barangay] || 0) + (count as number)
              })
            }
          })
        } else if (selectedYear) {
          // Fallback to year filter
          const params = new URLSearchParams()
          params.set('year', selectedYear.toString())
          const response = await fetch(`/api/crimes/barangay-counts?${params}`)
          const result = await response.json()
          if (result.success && result.data?.barangayCounts) {
            Object.assign(mergedCounts, result.data.barangayCounts)
          }
        }

        setBarangayCrimeCounts(mergedCounts)
        
        // Calculate dynamic thresholds based on actual data distribution
        const crimeCounts = Object.values(mergedCounts) as number[];
        const dynamicThresholds = calculateDynamicThresholds(crimeCounts);
        setThresholds(dynamicThresholds);
        
        // Calculate threat level distribution using dynamic thresholds
        const threatStats = {
          secure: 0,
          low: 0,
          moderate: 0,
          high: 0,
          critical: 0
        }
        
        Object.values(mergedCounts).forEach(count => {
          const level = getThreatLevelFromCount(count as number, dynamicThresholds)
          threatStats[level]++
        })
        
        // Add barangays with no crimes as secure
        const totalKnownBarangays = 24 // Total barangays in Tanza
        const barangaysWithCrimes = Object.keys(mergedCounts).length
        threatStats.secure += Math.max(0, totalKnownBarangays - barangaysWithCrimes)
        
        setStats(threatStats)
      } catch (error) {
        console.error('Error loading threat data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBaseThreatData()
  }, [selectedYear, timeRange, dateRanges])

  // Fetch filtered crime data when time filter is active
  useEffect(() => {
    async function loadFilteredThreatData() {
      if (!isTimeFilterActive || !timeFilterDate) {
        setFilteredBarangayCrimeCounts({})
        return
      }

      try {
        const params = new URLSearchParams()
        
        // Use the EXACT selected date for the entire day
        const startDate = new Date(timeFilterDate)
        startDate.setHours(0, 0, 0, 0)
        
        const endDate = new Date(timeFilterDate)
        endDate.setHours(23, 59, 59, 999)
        
        // Convert to ISO string for API
        params.set('startDateCommitted', startDate.toISOString())
        params.set('endDateCommitted', endDate.toISOString())
        
        if (timeFilterHour !== null) {
          params.set('hour', timeFilterHour.toString())
        }
        
        if (selectedYear) {
          params.set('year', selectedYear.toString())
        }
        
        const response = await fetch(`/api/crimes/barangay-counts?${params}`)
        const result = await response.json()
        
        if (result.success) {
          const counts = result.data.barangayCounts;
          setFilteredBarangayCrimeCounts(counts);
        }
      } catch (error) {
        console.error('Error loading filtered threat data:', error)
      }
    }

    loadFilteredThreatData()
  }, [timeFilterDate, timeFilterHour, isTimeFilterActive, selectedYear])

  return { 
    stats, 
    thresholds, 
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