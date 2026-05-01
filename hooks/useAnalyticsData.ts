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
  trendLevel: 'secure' | 'low' | 'moderate' | 'high' | 'critical'
  trendDirection: 'improved' | 'worsened' | 'stable'
  currentThreatLevel: 'secure' | 'low' | 'moderate' | 'high' | 'critical'
  previousThreatLevel: 'secure' | 'low' | 'moderate' | 'high' | 'critical'
  currentQuarterCrimes: number
  previousQuarterCrimes: number
  currentQuarterLabel: string
  previousQuarterLabel: string
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
      resolutionRate: 0,
      trendLevel: 'secure',
      trendDirection: 'stable',
      currentThreatLevel: 'secure',
      previousThreatLevel: 'secure',
      currentQuarterCrimes: 0,
      previousQuarterCrimes: 0,
      currentQuarterLabel: '',
      previousQuarterLabel: ''
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

        // Threat level thresholds (matching map legend)
        const THREAT_THRESHOLDS = {
          low: 2,
          moderate: 5,
          high: 10,
          critical: 15
        }

        // Helper function to get threat level from crime count
        const getThreatLevel = (count: number): 'secure' | 'low' | 'moderate' | 'high' | 'critical' => {
          if (count === 0) return 'secure'
          if (count <= THREAT_THRESHOLDS.low) return 'low'
          if (count <= THREAT_THRESHOLDS.moderate) return 'moderate'
          if (count <= THREAT_THRESHOLDS.high) return 'high'
          return 'critical'
        }

        // Helper function to get quarter info
        const getQuarterInfo = (date: Date) => {
          const year = date.getFullYear()
          const month = date.getMonth() // 0-11
          const quarter = Math.floor(month / 3) + 1 // 1-4
          
          // Calculate quarter start and end dates
          const quarterStartMonth = (quarter - 1) * 3
          const quarterStart = new Date(year, quarterStartMonth, 1)
          const quarterEnd = new Date(year, quarterStartMonth + 3, 0, 23, 59, 59, 999)
          
          const quarterLabel = `Q${quarter} ${year}`
          
          return { quarter, year, quarterStart, quarterEnd, quarterLabel }
        }

        // Calculate quarterly trend: Current quarter vs Previous quarter
        const now = new Date()
        const currentQuarter = getQuarterInfo(now)
        
        // Get previous quarter
        const previousQuarterDate = new Date(now)
        previousQuarterDate.setMonth(previousQuarterDate.getMonth() - 3)
        const previousQuarter = getQuarterInfo(previousQuarterDate)
        
        // Filter crimes by quarters
        const currentQuarterCrimes = crimes.filter(crime => {
          const crimeDate = new Date(crime.dateCommitted)
          return crimeDate >= currentQuarter.quarterStart && crimeDate <= currentQuarter.quarterEnd
        }).length
        
        const previousQuarterCrimes = crimes.filter(crime => {
          const crimeDate = new Date(crime.dateCommitted)
          return crimeDate >= previousQuarter.quarterStart && crimeDate <= previousQuarter.quarterEnd
        }).length

        // Calculate percentage change with capping to avoid extreme values
        let quarterlyTrend = 0
        if (previousQuarterCrimes > 0) {
          quarterlyTrend = Math.round(((currentQuarterCrimes - previousQuarterCrimes) / previousQuarterCrimes) * 100)
          // Cap the percentage at -90% and +90% to avoid -100% or +100%
          quarterlyTrend = Math.max(-90, Math.min(90, quarterlyTrend))
        } else if (currentQuarterCrimes > 0) {
          // When going from 0 to some crimes, cap at +90%
          quarterlyTrend = 90
        }

        // Calculate threat levels for current and previous quarters
        const currentThreatLevel = getThreatLevel(currentQuarterCrimes)
        const previousThreatLevel = getThreatLevel(previousQuarterCrimes)

        console.log('📊 Quarterly Trend Calculation:', {
          barangayName,
          currentQuarter: currentQuarter.quarterLabel,
          currentQuarterCrimes,
          previousQuarter: previousQuarter.quarterLabel,
          previousQuarterCrimes,
          quarterlyTrend,
          currentThreatLevel,
          previousThreatLevel
        })

        // Determine trend direction based on crime count changes
        let trendDirection: 'improved' | 'worsened' | 'stable' = 'stable'
        if (currentQuarterCrimes < previousQuarterCrimes) {
          trendDirection = 'improved' // Crime decreased
        } else if (currentQuarterCrimes > previousQuarterCrimes) {
          trendDirection = 'worsened' // Crime increased
        }

        // Calculate resolution rate based on caseStatus
        const resolvedCrimes = crimes.filter(crime => {
          if (!crime.caseStatus) return false
          const statusLower = crime.caseStatus.toLowerCase()
          return statusLower.includes('cleared') || 
                 statusLower.includes('solved') || 
                 statusLower.includes('archived') || 
                 statusLower.includes('closed')
        }).length
        
        const resolutionRate = crimes.length > 0 
          ? Math.round((resolvedCrimes / crimes.length) * 100)
          : 0

        // Process monthly data using stats.activity to match the Overview tab
        const monthlyData = stats.activity.map((count, i) => ({
          month: i + 1,
          count
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
            monthlyChange: quarterlyTrend,
            resolutionRate,
            trendLevel: currentThreatLevel,
            trendDirection,
            currentThreatLevel,
            previousThreatLevel,
            currentQuarterCrimes,
            previousQuarterCrimes,
            currentQuarterLabel: currentQuarter.quarterLabel,
            previousQuarterLabel: previousQuarter.quarterLabel
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
