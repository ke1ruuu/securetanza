import { useState, useEffect } from 'react'
import { fetchCrimeStats } from '@/lib/api'
import { useMapContext } from '@/context/MapContext'
import { useTimeRangeData } from '@/hooks/useTimeRangeData'

interface CrimeHoverStats {
  totalCrimes: number
  safetyIndex: string
  crimesByType: Array<{ type: string; count: number }>
}

export function useCrimeHoverStats(barangayName: string | null) {
  const [stats, setStats] = useState<CrimeHoverStats | null>(null)
  const [loading, setLoading] = useState(false)
  const { selectedYear, timeRange } = useMapContext()
  const dateRanges = useTimeRangeData()

  useEffect(() => {
    if (!barangayName) {
      setStats(null)
      return
    }

    async function loadStats() {
      try {
        setLoading(true)

        if (dateRanges.length > 0) {
          const results = await Promise.all(
            dateRanges.map(r =>
              fetchCrimeStats({
                barangay: barangayName || undefined,
                startDate: r.start.toISOString(),
                endDate: r.end.toISOString(),
              })
            )
          )

          let totalCrimes = 0
          const typeMap: Record<string, number> = {}

          results.forEach(res => {
            if (res) {
              totalCrimes += res.totalCrimes || 0
              if (res.crimesByType) {
                res.crimesByType.forEach(c => {
                  typeMap[c.type] = (typeMap[c.type] || 0) + c.count
                })
              }
            }
          })

          const crimesByType = Object.entries(typeMap).map(([type, count]) => ({ type, count }))
          const safetyScore = Math.max(0, Math.min(100, Math.round(100 - totalCrimes * 2)))

          setStats({
            totalCrimes,
            safetyIndex: `${safetyScore}%`,
            crimesByType,
          })
        } else {
          const crimeStats = await fetchCrimeStats({
            barangay: barangayName || undefined,
            year: selectedYear || undefined,
          })

          if (crimeStats) {
            setStats({
              totalCrimes: crimeStats.totalCrimes,
              safetyIndex: crimeStats.safetyIndex,
              crimesByType: crimeStats.crimesByType,
            })
          } else {
            setStats(null)
          }
        }
      } catch (error) {
        console.error('Error loading hover stats:', error)
        setStats(null)
      } finally {
        setLoading(false)
      }
    }

    // Small debounce to avoid redundant calls during hover
    const timeoutId = setTimeout(loadStats, 150)
    return () => clearTimeout(timeoutId)
  }, [barangayName, selectedYear, timeRange, dateRanges])

  return { stats, loading }
}