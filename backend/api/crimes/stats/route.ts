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

    if (barangay) {
      // Map GeoJSON barangay name to database name (e.g., "Amaya I" -> "Daang Amaya I")
      const dbBarangayName = mapGeoJsonToDb(barangay)
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

    // Get total count (all time)
    const totalCrimes = await prisma.crimeIncident.count({ where })

    // Get crimes by type
    const crimesByType = await prisma.crimeIncident.groupBy({
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
    })

    // Get crimes by barangay
    const crimesByBarangay = await prisma.crimeIncident.groupBy({
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
    })

    // Get recent crimes (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentCrimes = await prisma.crimeIncident.count({
      where: {
        ...where,
        dateCommitted: {
          gte: sevenDaysAgo
        }
      }
    })

    // Get crimes resolved today (based on updatedAt and caseStatus)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const resolvedTodayWhere: any = Object.keys(where).length > 0
      ? {
          AND: [
            where,
            {
              OR: [
                { caseStatus: { equals: 'Cleared', mode: 'insensitive' } },
                { caseStatus: { equals: 'Solved', mode: 'insensitive' } },
                { caseStatus: { equals: 'Archived', mode: 'insensitive' } },
                { caseStatus: { equals: 'Closed', mode: 'insensitive' } }
              ]
            },
            {
              updatedAt: {
                gte: today,
                lt: tomorrow
              }
            }
          ]
        }
      : {
          OR: [
            { caseStatus: { equals: 'Cleared', mode: 'insensitive' } },
            { caseStatus: { equals: 'Solved', mode: 'insensitive' } },
            { caseStatus: { equals: 'Archived', mode: 'insensitive' } },
            { caseStatus: { equals: 'Closed', mode: 'insensitive' } }
          ],
          updatedAt: {
            gte: today,
            lt: tomorrow
          }
        }

    const resolvedToday = await prisma.crimeIncident.count({
      where: resolvedTodayWhere
    })

    // Get cleared/solved cases for safety index calculation
    const clearedCasesWhere: any = Object.keys(where).length > 0 
      ? {
          AND: [
            where,
            {
              OR: [
                { caseStatus: { equals: 'Cleared', mode: 'insensitive' } },
                { caseStatus: { equals: 'Solved', mode: 'insensitive' } },
                { caseStatus: { equals: 'Archived', mode: 'insensitive' } },
                { caseStatus: { equals: 'Closed', mode: 'insensitive' } }
              ]
            }
          ]
        }
      : {
          OR: [
            { caseStatus: { equals: 'Cleared', mode: 'insensitive' } },
            { caseStatus: { equals: 'Solved', mode: 'insensitive' } },
            { caseStatus: { equals: 'Archived', mode: 'insensitive' } },
            { caseStatus: { equals: 'Closed', mode: 'insensitive' } }
          ]
        }
    
    const clearedCases = await prisma.crimeIncident.count({
      where: clearedCasesWhere
    })

    // Get active cases (total - cleared)
    const activeCases = totalCrimes - clearedCases

    // Get crimes by month for the selected year or current year
    const targetYear = year ? parseInt(year) : new Date().getFullYear()
    
    // Build the where clause for monthly stats
    // If where already has dateCommitted (from year filter), use it
    // Otherwise, set it to the target year
    const monthlyWhere: any = { ...where }
    if (!monthlyWhere.dateCommitted) {
      monthlyWhere.dateCommitted = {
        gte: new Date(`${targetYear}-01-01`),
        lt: new Date(`${targetYear + 1}-01-01`)
      }
    }
    
    const crimesByMonth = await prisma.crimeIncident.groupBy({
      by: ['dateCommitted'],
      where: monthlyWhere,
      _count: {
        dateCommitted: true
      }
    })

    // Process monthly data for activity chart
    const monthlyStats = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1
      const monthCrimes = crimesByMonth.filter(crime => 
        crime.dateCommitted.getMonth() + 1 === month
      )
      return {
        month,
        count: monthCrimes.reduce((sum, crime) => sum + crime._count.dateCommitted, 0)
      }
    })

    // Calculate safety index (percentage of cleared/solved cases)
    const safetyIndex = totalCrimes > 0 
      ? Math.round((clearedCases / totalCrimes) * 100)
      : 100

    console.log('📊 Stats API Response:', {
      year,
      targetYear,
      totalCrimes,
      monthlyStatsSum: monthlyStats.reduce((sum, m) => sum + m.count, 0),
      activitySum: monthlyStats.map(s => s.count).reduce((a, b) => a + b, 0),
      activity: monthlyStats.map(s => s.count),
      crimesByMonthLength: crimesByMonth.length
    })

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
        activity: monthlyStats.map(stat => stat.count) // Return actual raw counts instead of scaled percentages
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