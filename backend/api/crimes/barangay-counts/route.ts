import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/backend/lib/prisma'

// GET /api/crimes/barangay-counts - Get crime counts per barangay for threat level calculation
export async function GET(request: NextRequest) {
  try {
    // Get crime counts grouped by barangay
    const barangayCounts = await prisma.crimeIncident.groupBy({
      by: ['barangay'],
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
    const totalCrimes = await prisma.crimeIncident.count()

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