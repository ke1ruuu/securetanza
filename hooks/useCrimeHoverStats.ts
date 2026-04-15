import { useState, useEffect } from 'react'
import { fetchCrimeStats } from '@/lib/api'

interface CrimeHoverStats {
  totalCrimes: number
  safetyIndex: string
  crimesByType: Array<{ type: string; count: number }>
}

export function useCrimeHoverStats(barangayName: string | null) {
  const [stats, setStats] = useState<CrimeHoverStats | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!barangayName) {
      setStats(null)
      return
    }

    async function loadStats() {
      try {
        setLoading(true)
        
        const crimeStats = await fetchCrimeStats({ barangay: barangayName })
        
        if (crimeStats) {
          setStats({
            totalCrimes: crimeStats.totalCrimes,
            safetyIndex: crimeStats.safetyIndex,
            crimesByType: crimeStats.crimesByType
          })
        } else {
          setStats(null)
        }
      } catch (error) {
        console.error('Error loading hover stats:', error)
        setStats(null)
      } finally {
        setLoading(false)
      }
    }

    // Add a small delay to prevent too many API calls during rapid hovering
    const timeoutId = setTimeout(loadStats, 150)
    
    return () => clearTimeout(timeoutId)
  }, [barangayName])

  return { stats, loading }
}