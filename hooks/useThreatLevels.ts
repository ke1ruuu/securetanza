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
  
  const { timeFilterDate, timeFilterHour, isTimeFilterActive, selectedYear } = useMapContext()

  // Fetch base crime data (all crimes or filtered by year)
  useEffect(() => {
    // Don't fetch until selectedYear is set (wait for MapContext to initialize)
    if (selectedYear === null) {
      console.log('⏳ Waiting for selectedYear to be set...')
      return
    }
    
    async function loadBaseThreatData() {
      try {
        setLoading(true)
        
        console.log('🎯 useThreatLevels Effect Triggered:', {
          selectedYear,
          selectedYearType: typeof selectedYear,
          timestamp: new Date().toISOString()
        })
        
        // Build query params
        const params = new URLSearchParams()
        if (selectedYear) {
          params.set('year', selectedYear.toString())
        }
        
        console.log('🗺️ Fetching Threat Levels:', {
          selectedYear,
          hasYear: !!selectedYear,
          url: `/api/crimes/barangay-counts?${params}`,
          paramsString: params.toString(),
          timestamp: new Date().toISOString()
        })
        
        // Fetch all barangay crime counts (with optional year filter)
        const response = await fetch(`/api/crimes/barangay-counts?${params}`)
        const result = await response.json()
        
        console.log('🗺️ Threat Levels Response:', {
          selectedYear,
          success: result.success,
          totalCrimes: result.data?.totalCrimes,
          barangayCount: result.data?.barangayCount,
          barangayCounts: result.data?.barangayCounts,
          timestamp: new Date().toISOString()
        })
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch barangay counts')
        }
        
        const { barangayCounts } = result.data
        setBarangayCrimeCounts(barangayCounts)
        
        // Calculate dynamic thresholds based on actual data distribution
        const crimeCounts = Object.values(barangayCounts) as number[];
        const dynamicThresholds = calculateDynamicThresholds(crimeCounts);
        setThresholds(dynamicThresholds);
        
        console.log('📊 Dynamic Thresholds Calculated:', {
          low: `1-${dynamicThresholds.low}`,
          moderate: `${dynamicThresholds.low + 1}-${dynamicThresholds.moderate}`,
          high: `${dynamicThresholds.moderate + 1}-${dynamicThresholds.high}`,
          critical: `${dynamicThresholds.high + 1}+`,
          dataPoints: crimeCounts.length
        });
        
        // Calculate threat level distribution using dynamic thresholds
        const threatStats = {
          secure: 0,
          low: 0,
          moderate: 0,
          high: 0,
          critical: 0
        }
        
        Object.values(barangayCounts).forEach(count => {
          const level = getThreatLevelFromCount(count as number, dynamicThresholds)
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
  }, [selectedYear])

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
        
        // Use the EXACT selected date, not a 60-day range
        // This ensures we only show crimes from the specific date being viewed
        const startDate = new Date(timeFilterDate)
        startDate.setHours(0, 0, 0, 0)
        
        const endDate = new Date(timeFilterDate)
        endDate.setHours(23, 59, 59, 999)
        
        // Convert to ISO string for API
        params.set('startDateCommitted', startDate.toISOString())
        params.set('endDateCommitted', endDate.toISOString())
        
        // Pass hour as a parameter to the API
        if (timeFilterHour !== null) {
          params.set('hour', timeFilterHour.toString())
        }
        
        // Add year filter if selected
        if (selectedYear) {
          params.set('year', selectedYear.toString())
        }
        
        console.log('🔍 Fetching filtered crimes for SPECIFIC DATE:', {
          date: timeFilterDate.toLocaleDateString(),
          hour: timeFilterHour,
          year: selectedYear,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        })
        
        const response = await fetch(`/api/crimes/barangay-counts?${params}`)
        const result = await response.json()
        
        console.log('📊 Filtered crime counts result:', {
          totalCrimes: result.data?.totalCrimes,
          barangayCount: result.data?.barangayCount,
          barangayCounts: result.data?.barangayCounts
        })
        
        if (result.success) {
          setFilteredBarangayCrimeCounts(result.data.barangayCounts)
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