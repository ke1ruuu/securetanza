import { useState, useEffect } from 'react'
import { fetchCrimes, fetchCrimeStats, transformCrimeToIncident, CrimeStats } from '@/lib/api'
import { Incident } from '@/constants/dummy'

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
    async function loadData() {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }))

        // Fetch statistics
        const statsParams = barangayName && barangayName !== "General Dashboard" 
          ? { barangay: barangayName } 
          : undefined

        const [stats, crimes] = await Promise.all([
          fetchCrimeStats(statsParams),
          fetchCrimes({ 
            barangay: statsParams?.barangay, 
            limit: 50 
          })
        ])

        if (!stats) {
          throw new Error('Failed to fetch statistics')
        }

        // Transform crimes to incidents
        const incidents = crimes.map(transformCrimeToIncident)

        // Calculate active patrols (mock calculation based on active cases)
        const activePatrols = Math.max(1, Math.floor(stats.activeCases / 10))

        setData({
          stats: {
            totalCrimes: stats.totalCrimes,
            activeCases: stats.activeCases,
            resolvedToday: stats.resolvedToday,
            safetyIndex: stats.safetyIndex,
            activePatrols
          },
          activity: stats.activity,
          crimesByType: stats.crimesByType,
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
  }, [barangayName])

  return data
}