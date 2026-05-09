import { useState, useEffect } from 'react'
import { fetchCrimes } from '@/lib/api'
import { useMapContext } from '@/context/MapContext'
import { useTimeRangeData } from './useTimeRangeData'

interface ModusData {
  modus: string
  count: number
}

interface PlaceData {
  place: string
  count: number
}

interface ModusAndPlaceData {
  modusList: ModusData[]
  placesList: PlaceData[]
  loading: boolean
}

export function useModusAndPlace(barangayName?: string): ModusAndPlaceData {
  const { timeRange } = useMapContext()
  const dateRanges = useTimeRangeData()
  const [data, setData] = useState<ModusAndPlaceData>({
    modusList: [],
    placesList: [],
    loading: true,
  })

  useEffect(() => {
    // Don't fetch until time range has selections
    if (dateRanges.length === 0) {
      console.log('⏳ ModusAndPlace: Waiting for time range selections...')
      return
    }
    
    async function loadData() {
      try {
        setData(prev => ({ ...prev, loading: true }))

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

        // Group by modus
        const modusMap = new Map<string, number>()
        allCrimes.forEach(crime => {
          if (crime.modus && crime.modus.trim() !== '') {
            const modus = crime.modus.trim()
            modusMap.set(modus, (modusMap.get(modus) || 0) + 1)
          }
        })

        // Group by type of place
        const placeMap = new Map<string, number>()
        allCrimes.forEach(crime => {
          if (crime.typeOfPlace && crime.typeOfPlace.trim() !== '') {
            const place = crime.typeOfPlace.trim()
            placeMap.set(place, (placeMap.get(place) || 0) + 1)
          }
        })

        // Convert to arrays and sort by count (descending)
        const modusList = Array.from(modusMap.entries())
          .map(([modus, count]) => ({ modus, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10) // Top 10

        const placesList = Array.from(placeMap.entries())
          .map(([place, count]) => ({ place, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10) // Top 10

        setData({
          modusList,
          placesList,
          loading: false,
        })
      } catch (error) {
        console.error('Error loading modus and place data:', error)
        setData({
          modusList: [],
          placesList: [],
          loading: false,
        })
      }
    }

    loadData()
  }, [barangayName, timeRange, dateRanges])

  return data
}
