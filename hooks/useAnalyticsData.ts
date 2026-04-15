import { useState, useEffect } from 'react'
import { fetchCrimes, fetchCrimeStats } from '@/lib/api'

interface CrimeByType {
  type: string
  count: number
}

interface CrimeByMonth {
  month: number
  count: number
}

interface CrimeByBarangay {
  barangay: string
  count: number
}

interface TimePatterns {
  hourlyDistribution: number[]
  peakHour: number
}

interface Trends {
  monthlyChange: number
  resolutionRate: number
}

interface AnalyticsData {
  crimesByType: CrimeByType[]
  crimesByMonth: CrimeByMonth[]
  crimesByBarangay: CrimeByBarangay[]
  timePatterns: TimePatterns
  trends: Trends
  loading: boolean
  error: string | null
}

export function useAnalyticsData(barangayName?: string): AnalyticsData {
  const [data, setData] = useState<AnalyticsData>({
    crimesByType: [],
    crimesByMonth: [],
    crimesByBarangay: [],
    timePatterns: {
      hourlyDistribution: Array(24).fill(0),
      peakHour: 0
    },
    trends: {
      monthlyChange: 0,
      resolutionRate: 0
    },
    loading: true,
    error: null
  })

  useEffect(() => {
    async function loadAnalyticsData() {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }))

        // Fetch crime statistics and raw crime data
        const statsParams = barangayName && barangayName !== "General Dashboard" 
          ? { barangay: barangayName } 
          : undefined

        const [stats, crimes] = await Promise.all([
          fetchCrimeStats(statsParams),
          fetchCrimes(statsParams)
        ])

        if (!stats) {
          throw new Error('Failed to fetch statistics')
        }

        // Process hourly distribution
        const hourlyDistribution = Array(24).fill(0)
        crimes.forEach(crime => {
          const hour = new Date(crime.dateCommitted).getHours()
          hourlyDistribution[hour]++
        })

        const peakHour = hourlyDistribution.indexOf(Math.max(...hourlyDistribution))

        // Calculate monthly trends (mock calculation for now)
        const currentMonth = new Date().getMonth()
        const currentMonthCrimes = crimes.filter(crime => 
          new Date(crime.dateCommitted).getMonth() === currentMonth
        ).length
        const lastMonthCrimes = crimes.filter(crime => 
          new Date(crime.dateCommitted).getMonth() === currentMonth - 1
        ).length

        const monthlyChange = lastMonthCrimes > 0 
          ? Math.round(((currentMonthCrimes - lastMonthCrimes) / lastMonthCrimes) * 100)
          : 0

        // Calculate resolution rate
        const resolvedCrimes = crimes.filter(crime => 
          crime.stageOfFelony === 'Consummated' || 
          crime.stageOfFelony === 'Solved' || 
          crime.stageOfFelony === 'Closed'
        ).length
        const resolutionRate = crimes.length > 0 
          ? Math.round((resolvedCrimes / crimes.length) * 100)
          : 0

        // Process monthly data
        const monthlyData = Array.from({ length: 12 }, (_, i) => ({
          month: i + 1,
          count: crimes.filter(crime => 
            new Date(crime.dateCommitted).getMonth() === i
          ).length
        }))

        setData({
          crimesByType: stats.crimesByType,
          crimesByMonth: monthlyData,
          crimesByBarangay: stats.crimesByBarangay,
          timePatterns: {
            hourlyDistribution,
            peakHour
          },
          trends: {
            monthlyChange,
            resolutionRate
          },
          loading: false,
          error: null
        })

      } catch (error) {
        console.error('Error loading analytics data:', error)
        setData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to load analytics data'
        }))
      }
    }

    loadAnalyticsData()
  }, [barangayName])

  return data
}