import { useState, useEffect } from 'react'
import { fetchCrimes, fetchCrimeStats, transformCrimeToIncident } from '@/lib/api'
import { BarangayData } from '@/constants/dummy'

export function useBarangayData(barangayName: string | null) {
  const [data, setData] = useState<BarangayData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!barangayName) {
      setData(null)
      return
    }

    async function loadBarangayData() {
      try {
        setLoading(true)
        setError(null)

        // Fetch barangay-specific data
        const [stats, crimes] = await Promise.all([
          fetchCrimeStats({ barangay: barangayName! }),
          fetchCrimes({ barangay: barangayName!, limit: 5 })
        ])

        if (!stats) {
          throw new Error('Failed to fetch statistics')
        }

        // Transform crimes to incidents
        const incidents = crimes.map(transformCrimeToIncident)

        // Calculate active patrols based on active cases
        const activePatrols = Math.max(1, Math.floor(stats.activeCases / 10))

        // Determine status and risk based on active cases
        const status = stats.activeCases > 20 ? "Alert" : stats.activeCases > 10 ? "Nominal" : "Secure"
        const risk = stats.activeCases > 20 ? "High" : stats.activeCases > 10 ? "Medium" : "Low"

        // Create barangay data object
        const barangayData: BarangayData = {
          name: barangayName!,
          stats: {
            activeCases: stats.activeCases,
            resolvedToday: stats.resolvedToday,
            safetyIndex: stats.safetyIndex,
            activePatrols,
            status,
            risk
          },
          activity: stats.activity,
          incidents,
          analysis: {
            safetyPerformance: stats.activeCases > 20 ? "Critical Zone" : "Stable Output",
            description: `Real-time security metrics for ${barangayName!}. Current threat assessment based on active incidents and resolution rates.`,
            distribution: stats.crimesByType.slice(0, 3).map(crime => ({
              label: crime.type,
              val: crime.count
            })),
            hotspots: [
              `${barangayName!} Main Area`,
              `${barangayName!} Commercial District`
            ]
          }
        }

        setData(barangayData)
      } catch (error) {
        console.error('Error loading barangay data:', error)
        setError(error instanceof Error ? error.message : 'Failed to load barangay data')
      } finally {
        setLoading(false)
      }
    }

    loadBarangayData()
  }, [barangayName])

  return { data, loading, error }
}