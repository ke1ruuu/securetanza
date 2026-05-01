import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/backend/lib/prisma'

// GET /api/crimes/barangay-counts - Get crime counts per barangay for threat level calculation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDateCommitted = searchParams.get('startDateCommitted')
    const endDateCommitted = searchParams.get('endDateCommitted')
    const hour = searchParams.get('hour') // Optional hour filter (0-23)

    console.log('🔍 API Request:', { startDateCommitted, endDateCommitted, hour })

    // Build where clause for date filtering
    const where: any = {}
    
    if (startDateCommitted && endDateCommitted) {
      where.dateCommitted = {
        gte: new Date(startDateCommitted),
        lte: new Date(endDateCommitted)
      }
    }

    // If hour is specified, we need to filter by timeCommitted field
    // Since timeCommitted is stored as string (HH:MM:SS), we need to fetch all and filter in memory
    let crimes
    if (hour !== null && hour !== undefined) {
      // Fetch all crimes in the date range
      crimes = await prisma.crimeIncident.findMany({
        where,
        select: {
          barangay: true,
          timeCommitted: true,
          dateCommitted: true
        }
      })

      console.log(`📊 Found ${crimes.length} crimes in date range before hour filter`)

      // Filter by hour from timeCommitted string (format: "HH:MM:SS" or "HH:MM")
      const targetHour = parseInt(hour)
      crimes = crimes.filter(crime => {
        const timeParts = crime.timeCommitted.split(':')
        const crimeHour = parseInt(timeParts[0])
        return crimeHour === targetHour
      })

      console.log(`⏰ After filtering by hour ${targetHour}: ${crimes.length} crimes`)

      // Count by barangay manually
      const counts: Record<string, number> = {}
      crimes.forEach(crime => {
        counts[crime.barangay] = (counts[crime.barangay] || 0) + 1
      })

      const totalCrimes = crimes.length
      const barangayCount = Object.keys(counts).length

      console.log('✅ Barangay counts:', counts)

      return NextResponse.json({
        success: true,
        data: {
          barangayCounts: counts,
          totalCrimes,
          barangayCount
        }
      })
    }

    // No hour filter - use groupBy for efficiency
    const barangayCounts = await prisma.crimeIncident.groupBy({
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

    // Transform to a simple object for easier use
    const counts: Record<string, number> = {}
    barangayCounts.forEach(item => {
      counts[item.barangay] = item._count.barangay
    })

    // Get total crime count for statistics
    const totalCrimes = await prisma.crimeIncident.count({ where })

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