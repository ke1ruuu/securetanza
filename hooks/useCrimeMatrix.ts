import { useState, useEffect } from 'react'
import { fetchCrimes } from '@/lib/api'
import { useMapContext } from '@/context/MapContext'
import { useTimeRangeData } from './useTimeRangeData'

interface CrimeMatrixData {
  crimeType: string
  monthlyData: number[] // 12 months
}

export function useCrimeMatrix(barangayName?: string) {
  const { timeRange } = useMapContext()
  const dateRanges = useTimeRangeData()
  const [matrixData, setMatrixData] = useState<CrimeMatrixData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Don't fetch until time range has selections
    if (dateRanges.length === 0) {
      return
    }

    async function loadMatrixData() {
      try {
        setLoading(true)

        // Fetch data for all date ranges in parallel
        const fetchPromises = dateRanges.map(async ({ start, end }) => {
          const params = barangayName && barangayName !== "General Dashboard" 
            ? { barangay: barangayName, startDateCommitted: start.toISOString(), endDateCommitted: end.toISOString() } 
            : { startDateCommitted: start.toISOString(), endDateCommitted: end.toISOString() }

          return fetchCrimes(params)
        })

        const results = await Promise.all(fetchPromises)
        
        // Aggregate all crimes
        const allCrimes = results.flat()

        // Group crimes by type and month
        const crimeTypeMap = new Map<string, number[]>()

        allCrimes.forEach(crime => {
          const crimeDate = new Date(crime.dateCommitted)
          const month = crimeDate.getMonth() // 0-11
          const type = crime.incidentType

          if (!crimeTypeMap.has(type)) {
            crimeTypeMap.set(type, Array(12).fill(0))
          }

          const monthlyData = crimeTypeMap.get(type)!
          monthlyData[month]++
        })

        // Convert map to array and sort by total count (descending)
        const matrixArray: CrimeMatrixData[] = Array.from(crimeTypeMap.entries())
          .map(([crimeType, monthlyData]) => ({
            crimeType,
            monthlyData,
          }))
          .sort((a, b) => {
            const totalA = a.monthlyData.reduce((sum, val) => sum + val, 0)
            const totalB = b.monthlyData.reduce((sum, val) => sum + val, 0)
            return totalB - totalA
          })
          .slice(0, 10) // Top 10 crime types

        setMatrixData(matrixArray)
      } catch (error) {
        console.error('Error loading crime matrix data:', error)
        setMatrixData([])
      } finally {
        setLoading(false)
      }
    }

    loadMatrixData()
  }, [barangayName, timeRange, dateRanges])

  return { matrixData, loading }
}
