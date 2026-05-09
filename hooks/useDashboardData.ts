import { useState, useEffect } from 'react'
import { fetchCrimes, fetchCrimeStats, transformCrimeToIncident, CrimeStats } from '@/lib/api'
import { Incident } from '@/constants/dummy'
import { useMapContext } from '@/context/MapContext'
import { useTimeRangeData } from './useTimeRangeData'

interface DashboardData {
  stats: {
    totalCrimes: number
    activeCases: number
    resolvedToday: number
    safetyIndex: string
    activePatrols: number
  }
  activity: number[]
  crimesByType: Array<{ type: string; count: number }>
  incidents: Incident[]
  loading: boolean
  error: string | null
}

export function useDashboardData(barangayName?: string) {
  const { timeRange } = useMapContext()
  const dateRanges = useTimeRangeData()
  const [data, setData] = useState<DashboardData>({
    stats: {
      totalCrimes: 0,
      activeCases: 0,
      resolvedToday: 0,
      safetyIndex: "0%",
      activePatrols: 0
    },
    activity: Array(12).fill(0),
    crimesByType: [],
    incidents: [],
    loading: true,
    error: null
  })

  useEffect(() => {
    // Don't fetch until time range has selections
    if (dateRanges.length === 0) {
      console.log('⏳ Dashboard: Waiting for time range selections...')
      return
    }
    
    async function loadData() {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }))

        console.log('📊 Loading Dashboard Data:', {
          barangayName,
          timeRange,
          dateRanges: dateRanges.map(r => ({ start: r.start.toISOString(), end: r.end.toISOString() })),
          timestamp: new Date().toISOString()
        })

        // Fetch data for all date ranges in parallel
        const fetchPromises = dateRanges.map(async ({ start, end }) => {
          const statsParams = barangayName && barangayName !== "General Dashboard" 
            ? { barangay: barangayName, startDate: start.toISOString(), endDate: end.toISOString() } 
            : { startDate: start.toISOString(), endDate: end.toISOString() }

          const [stats, crimes] = await Promise.all([
            fetchCrimeStats(statsParams),
            fetchCrimes({ 
              barangay: statsParams?.barangay,
              startDateCommitted: start.toISOString(),
              endDateCommitted: end.toISOString(),
              limit: 50 
            })
          ])
          
          return { stats, crimes }
        })

        const results = await Promise.all(fetchPromises)
        
        // Aggregate all results
        let allCrimes: any[] = []
        let aggregatedStats = {
          totalCrimes: 0,
          activeCases: 0,
          resolvedToday: 0,
          crimesByType: new Map<string, number>(),
          activity: Array(12).fill(0)
        }

        results.forEach(({ stats, crimes }) => {
          if (stats) {
            aggregatedStats.totalCrimes += stats.totalCrimes
            aggregatedStats.activeCases += stats.activeCases
            aggregatedStats.resolvedToday += stats.resolvedToday
            
            // Aggregate crimes by type
            stats.crimesByType.forEach((item: any) => {
              const current = aggregatedStats.crimesByType.get(item.type) || 0
              aggregatedStats.crimesByType.set(item.type, current + item.count)
            })
            
            // Aggregate monthly activity
            stats.activity.forEach((count: number, index: number) => {
              aggregatedStats.activity[index] += count
            })
          }
          
          allCrimes = allCrimes.concat(crimes)
        })

        // Calculate safety index from aggregated data
        const safetyIndex = aggregatedStats.totalCrimes > 0
          ? `${Math.round((aggregatedStats.totalCrimes - aggregatedStats.activeCases) / aggregatedStats.totalCrimes * 100)}%`
          : "100%"

        // Transform crimes to incidents (limit to 50 most recent)
        const incidents = allCrimes
          .sort((a, b) => new Date(b.dateCommitted).getTime() - new Date(a.dateCommitted).getTime())
          .slice(0, 50)
          .map(transformCrimeToIncident)

        // Calculate active patrols (mock calculation based on active cases)
        const activePatrols = Math.max(1, Math.floor(aggregatedStats.activeCases / 10))

        setData({
          stats: {
            totalCrimes: aggregatedStats.totalCrimes,
            activeCases: aggregatedStats.activeCases,
            resolvedToday: aggregatedStats.resolvedToday,
            safetyIndex,
            activePatrols
          },
          activity: aggregatedStats.activity,
          crimesByType: Array.from(aggregatedStats.crimesByType.entries()).map(([type, count]) => ({ type, count })),
          incidents,
          loading: false,
          error: null
        })

      } catch (error) {
        console.error('Error loading dashboard data:', error)
        
        setData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to load data'
        }))
      }
    }

    loadData()
  }, [barangayName, timeRange, dateRanges])

  return data
}