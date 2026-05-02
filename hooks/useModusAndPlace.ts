import { useState, useEffect } from 'react'
import { fetchCrimes } from '@/lib/api'
import { useMapContext } from '@/context/MapContext'

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
  const { selectedYear } = useMapContext()
  const [data, setData] = useState<ModusAndPlaceData>({
    modusList: [],
    placesList: [],
    loading: true,
  })

  useEffect(() => {
    // Don't fetch until selectedYear is set (wait for MapContext to initialize)
    if (selectedYear === null) {
      console.log('⏳ ModusAndPlace: Waiting for selectedYear to be set...')
      return
    }
    
    async function loadData() {
      try {
        setData(prev => ({ ...prev, loading: true }))

        const params = barangayName && barangayName !== "General Dashboard" 
          ? { barangay: barangayName, year: selectedYear } 
          : { year: selectedYear }

        const crimes = await fetchCrimes(params)

        // Group by modus
        const modusMap = new Map<string, number>()
        crimes.forEach(crime => {
          if (crime.modus && crime.modus.trim() !== '') {
            const modus = crime.modus.trim()
            modusMap.set(modus, (modusMap.get(modus) || 0) + 1)
          }
        })

        // Group by type of place
        const placeMap = new Map<string, number>()
        crimes.forEach(crime => {
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
  }, [barangayName, selectedYear])

  return data
}
