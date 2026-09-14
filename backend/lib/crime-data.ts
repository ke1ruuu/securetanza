import { prisma } from './prisma'
import type { CrimeIncident as PrismaCrimeIncident } from './generated/prisma'

export interface CrimeIncident {
  id: string
  barangay: string
  date: Date
  time: string
  crimeType: string
  createdAt: Date
  updatedAt: Date
}

export interface CrimeStats {
  totalCrimes: number
  recentCrimes: number
  crimesByType: { type: string; count: number }[]
  crimesByBarangay: { barangay: string; count: number }[]
  monthlyStats: { month: number; count: number }[]
}

// Get crimes for a specific barangay and date range
export async function getCrimesForBarangay(
  barangayName: string,
  startDate?: Date,
  endDate?: Date,
  limit: number = 200
): Promise<CrimeIncident[]> {
  try {
    const where: any = {
      barangay: {
        equals: barangayName,
        mode: 'insensitive'
      }
    }

    if (startDate && endDate) {
      where.dateCommitted = {
        gte: startDate,
        lte: endDate
      }
    }

    const crimes = await prisma.crimeIncident.findMany({
      where,
      orderBy: {
        dateCommitted: 'desc'
      },
      take: Math.min(Math.max(1, limit), 1000)
    })

    // Map Prisma model to CrimeIncident interface
    return crimes.map(crime => ({
      id: crime.id,
      barangay: crime.barangay,
      date: crime.dateCommitted,
      time: crime.timeCommitted,
      crimeType: crime.incidentType,
      createdAt: crime.createdAt,
      updatedAt: crime.updatedAt
    }))
  } catch (error) {
    console.error('Error fetching crimes for barangay:', error)
    return []
  }
}

// Get crime statistics for dashboard
export async function getCrimeStats(
  barangayName?: string,
  startDate?: Date,
  endDate?: Date
): Promise<CrimeStats> {
  try {
    const where: any = {}

    if (barangayName) {
      where.barangay = {
        equals: barangayName,
        mode: 'insensitive'
      }
    }

    if (startDate && endDate) {
      where.dateCommitted = {
        gte: startDate,
        lte: endDate
      }
    }

    // Get recent crimes (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // Get monthly stats for current year (or date range year)
    const currentYear = new Date().getFullYear()
    const yearStart = startDate || new Date(`${currentYear}-01-01T00:00:00.000Z`)
    const yearEnd = endDate || new Date(`${currentYear + 1}-01-01T00:00:00.000Z`)

    const monthlyQuery = barangayName
      ? prisma.$queryRaw<Array<{ month: number; count: number | bigint }>>`
          SELECT 
            EXTRACT(MONTH FROM date_committed)::integer AS month,
            COUNT(*)::integer AS count
          FROM crime_incidents
          WHERE date_committed >= ${yearStart}
            AND date_committed < ${yearEnd}
            AND LOWER(barangay) = LOWER(${barangayName})
          GROUP BY month
          ORDER BY month ASC
        `
      : prisma.$queryRaw<Array<{ month: number; count: number | bigint }>>`
          SELECT 
            EXTRACT(MONTH FROM date_committed)::integer AS month,
            COUNT(*)::integer AS count
          FROM crime_incidents
          WHERE date_committed >= ${yearStart}
            AND date_committed < ${yearEnd}
          GROUP BY month
          ORDER BY month ASC
        `

    // Run all aggregate queries concurrently in PostgreSQL
    const [
      totalCrimes,
      recentCrimes,
      crimesByType,
      crimesByBarangay,
      monthlyCountsRaw
    ] = await Promise.all([
      prisma.crimeIncident.count({ where }),
      prisma.crimeIncident.count({
        where: {
          ...where,
          dateCommitted: {
            gte: sevenDaysAgo
          }
        }
      }),
      prisma.crimeIncident.groupBy({
        by: ['incidentType'],
        where,
        _count: {
          incidentType: true
        },
        orderBy: {
          _count: {
            incidentType: 'desc'
          }
        }
      }),
      prisma.crimeIncident.groupBy({
        by: ['barangay'],
        where,
        _count: {
          barangay: true
        },
        orderBy: {
          _count: {
            barangay: 'desc'
          }
        }
      }),
      monthlyQuery
    ])

    // Process monthly stats
    const monthlyStats = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1
      const found = monthlyCountsRaw.find(m => Number(m.month) === month)
      return {
        month,
        count: found ? Number(found.count) : 0
      }
    })

    return {
      totalCrimes,
      recentCrimes,
      crimesByType: crimesByType.map(item => ({
        type: item.incidentType,
        count: item._count.incidentType
      })),
      crimesByBarangay: crimesByBarangay.map(item => ({
        barangay: item.barangay,
        count: item._count.barangay
      })),
      monthlyStats
    }
  } catch (error) {
    console.error('Error fetching crime statistics:', error)
    return {
      totalCrimes: 0,
      recentCrimes: 0,
      crimesByType: [],
      crimesByBarangay: [],
      monthlyStats: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, count: 0 }))
    }
  }
}

// Get threat level based on crime count (matches your existing logic)
export function getThreatLevel(crimeCount: number): string {
  if (crimeCount <= 1) return "secure"
  if (crimeCount <= 3) return "low"
  if (crimeCount <= 5) return "moderate"
  if (crimeCount <= 6) return "high"
  return "critical"
}

// Convert database crimes to your existing incident format
export function convertToIncidentFormat(crimes: CrimeIncident[]) {
  return crimes.map(crime => ({
    id: crime.id,
    type: crime.crimeType,
    date: crime.date.toLocaleDateString(),
    time: crime.time,
    status: 'Active', // You can add status logic based on your needs
    location: crime.barangay
  }))
}