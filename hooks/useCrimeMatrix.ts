import { useState, useEffect } from 'react'
import { fetchCrimes } from '@/lib/api'
import { useMapContext } from '@/context/MapContext'

interface CrimeMatrixData {
  crimeType: string
  monthlyData: number[] // 12 months
}

export function useCrimeMatrix(barangayName?: string) {
  const [matrixData, setMatrixData] = useState<CrimeMatrixData[]>([])
  const [loading, setLoading] = useState(true)
  const { selectedYear } = useMapContext()

  useEffect(() => {
    // Don't fetch until selectedYear is set (wait for MapContext to initialize)
    if (selectedYear === null) {
      console.log('⏳ CrimeMatrix: Waiting for selectedYear to be set...')
      return
    }
    
    async function loadMatrixData() {
      try {
        setLoading(true)

        const params = barangayName && barangayName !== "General Dashboard" 
          ? { barangay: barangayName, year: selectedYear } 
          : { year: selectedYear }

        const crimes = await fetchCrimes(params)

        // Group crimes by type and month (already filtered by year from API)
        const crimeTypeMap = new Map<string, number[]>()

        crimes.forEach(crime => {
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
  }, [barangayName, selectedYear])

  return { matrixData, loading }
}
