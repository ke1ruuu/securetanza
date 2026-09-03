import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/backend/lib/prisma'
import { mapGeoJsonToDb } from '@/backend/lib/barangay-mapper'

// GET /api/crimes/stats - Get crime statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const barangay = searchParams.get('barangay')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const year = searchParams.get('year')

    const where: any = {}

    let dbBarangayName: string | undefined
    if (barangay) {
      // Map GeoJSON barangay name to database name (e.g., "Amaya I" -> "Daang Amaya I")
      dbBarangayName = mapGeoJsonToDb(barangay)
      where.barangay = {
        equals: dbBarangayName,
        mode: 'insensitive'
      }
    }

    if (startDate && endDate) {
      where.dateCommitted = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    } else if (year) {
      // Filter by year if specified and no date range provided
      const yearNum = parseInt(year)
      const startOfYear = new Date(yearNum, 0, 1)
      const endOfYear = new Date(yearNum, 11, 31, 23, 59, 59, 999)
      
      where.dateCommitted = {
        gte: startOfYear,
        lte: endOfYear
      }
    }

    // Calculate 7 days ago for recent crimes
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // Calculate today and tomorrow for resolved today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const resolvedStatusFilter = {
      OR: [
        { caseStatus: { equals: 'Cleared', mode: 'insensitive' as const } },
        { caseStatus: { equals: 'Solved', mode: 'insensitive' as const } },
        { caseStatus: { equals: 'Archived', mode: 'insensitive' as const } },
        { caseStatus: { equals: 'Closed', mode: 'insensitive' as const } }
      ]
    }

    const resolvedTodayWhere: any = Object.keys(where).length > 0
      ? {
          AND: [
            where,
            resolvedStatusFilter,
            { updatedAt: { gte: today, lt: tomorrow } }
          ]
        }
      : {
          ...resolvedStatusFilter,
          updatedAt: { gte: today, lt: tomorrow }
        }

    const clearedCasesWhere: any = Object.keys(where).length > 0
      ? {
          AND: [
            where,
            resolvedStatusFilter
          ]
        }
      : resolvedStatusFilter

    // Monthly stats date boundaries
    const targetYear = year ? parseInt(year, 10) : new Date().getFullYear()
    const startDateCommitted = startDate
      ? new Date(startDate)
      : new Date(`${targetYear}-01-01T00:00:00.000Z`)
    const endDateCommitted = endDate
      ? new Date(endDate)
      : new Date(`${targetYear + 1}-01-01T00:00:00.000Z`)

    const monthlyQuery = dbBarangayName
      ? prisma.$queryRaw<Array<{ month: number; count: number | bigint }>>`
          SELECT 
            EXTRACT(MONTH FROM date_committed)::integer AS month,
            COUNT(*)::integer AS count
          FROM crime_incidents
          WHERE date_committed >= ${startDateCommitted}
            AND date_committed < ${endDateCommitted}
            AND LOWER(barangay) = LOWER(${dbBarangayName})
          GROUP BY month
          ORDER BY month ASC
        `
      : prisma.$queryRaw<Array<{ month: number; count: number | bigint }>>`
          SELECT 
            EXTRACT(MONTH FROM date_committed)::integer AS month,
            COUNT(*)::integer AS count
          FROM crime_incidents
          WHERE date_committed >= ${startDateCommitted}
            AND date_committed < ${endDateCommitted}
          GROUP BY month
          ORDER BY month ASC
        `

    // Run all 7 database queries concurrently in PostgreSQL
    const [
      totalCrimes,
      crimesByType,
      crimesByBarangay,
      recentCrimes,
      resolvedToday,
      clearedCases,
      monthlyCountsRaw
    ] = await Promise.all([
      prisma.crimeIncident.count({ where }),
      prisma.crimeIncident.groupBy({
        by: ['incidentType'],
        where,
        _count: { incidentType: true },
        orderBy: { _count: { incidentType: 'desc' } }
      }),
      prisma.crimeIncident.groupBy({
        by: ['barangay'],
        where,
        _count: { barangay: true },
        orderBy: { _count: { barangay: 'desc' } }
      }),
      prisma.crimeIncident.count({
        where: {
          ...where,
          dateCommitted: { gte: sevenDaysAgo }
        }
      }),
      prisma.crimeIncident.count({ where: resolvedTodayWhere }),
      prisma.crimeIncident.count({ where: clearedCasesWhere }),
      monthlyQuery
    ])

    // Get active cases (total - cleared)
    const activeCases = Math.max(0, totalCrimes - clearedCases)

    // Format monthly counts into 12-month array
    const monthlyStats = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1
      const found = monthlyCountsRaw.find(m => Number(m.month) === month)
      return {
        month,
        count: found ? Number(found.count) : 0
      }
    })

    // Calculate safety index (percentage of cleared/solved cases)
    const safetyIndex = totalCrimes > 0 
      ? Math.round((clearedCases / totalCrimes) * 100)
      : 100

    return NextResponse.json({
      success: true,
      data: {
        totalCrimes,
        activeCases,
        resolvedToday,
        recentCrimes,
        safetyIndex: `${safetyIndex}%`,
        crimesByType: crimesByType.map(item => ({
          type: item.incidentType,
          count: item._count.incidentType
        })),
        crimesByBarangay: crimesByBarangay.map(item => ({
          barangay: item.barangay,
          count: item._count.barangay
        })),
        monthlyStats,
        activity: monthlyStats.map(stat => stat.count)
      }
    })
  } catch (error) {
    console.error('Error fetching crime statistics:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error
    })
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch crime statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}