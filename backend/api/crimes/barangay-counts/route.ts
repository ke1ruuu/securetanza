import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/backend/lib/prisma'

// GET /api/crimes/barangay-counts - Get crime counts per barangay for threat level calculation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDateCommitted = searchParams.get('startDateCommitted')
    const endDateCommitted = searchParams.get('endDateCommitted')
    const hour = searchParams.get('hour') // Optional hour filter (0-23)
    const year = searchParams.get('year') // Optional year filter
    const incidentType = searchParams.get('incidentType') // Optional crime type filter
    const barangay = searchParams.get('barangay') // Optional single barangay filter

    console.log('🔍 Barangay Counts API Request:', { 
      startDateCommitted, 
      endDateCommitted, 
      hour, 
      year,
      incidentType,
      barangay,
      url: request.url 
    })

    // Build where clause for filtering
    const where: any = {}

    if (incidentType) {
      where.incidentType = {
        contains: incidentType,
        mode: 'insensitive'
      }
    }

    if (barangay) {
      where.barangay = {
        equals: barangay,
        mode: 'insensitive'
      }
    }
    
    if (startDateCommitted && endDateCommitted) {
      where.dateCommitted = {
        gte: new Date(startDateCommitted),
        lte: new Date(endDateCommitted)
      }
    } else if (year) {
      const yearNum = parseInt(year, 10)
      const startOfYear = new Date(yearNum, 0, 1)
      const endOfYear = new Date(yearNum, 11, 31, 23, 59, 59, 999)
      
      where.dateCommitted = {
        gte: startOfYear,
        lte: endOfYear
      }
    }

    // Push hour filtering down to database query (supports padded "09:" and unpadded "9:")
    if (hour !== null && hour !== undefined && hour !== '') {
      const targetHour = parseInt(hour, 10)
      if (!isNaN(targetHour)) {
        const padded = targetHour.toString().padStart(2, '0')
        const unpadded = targetHour.toString()
        where.OR = [
          { timeCommitted: { startsWith: `${padded}:` } },
          { timeCommitted: { startsWith: `${unpadded}:` } },
        ]
      }
    }

    // Execute aggregated counts and total count concurrently in PostgreSQL
    const [barangayCounts, totalCrimes] = await Promise.all([
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
      prisma.crimeIncident.count({ where })
    ])

    const counts: Record<string, number> = {}
    barangayCounts.forEach(item => {
      counts[item.barangay] = item._count.barangay
    })

    return NextResponse.json({
      success: true,
      data: {
        barangayCounts: counts,
        totalCrimes,
        barangayCount: barangayCounts.length
      }
    })
  } catch (error) {
    console.error('Error fetching barangay crime counts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch barangay crime counts' },
      { status: 500 }
    )
  }
}