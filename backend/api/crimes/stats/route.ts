import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/backend/lib/prisma'

// GET /api/crimes/stats - Get crime statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const barangay = searchParams.get('barangay')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {}

    if (barangay) {
      where.barangay = {
        contains: barangay,
        mode: 'insensitive'
      }
    }

    if (startDate && endDate) {
      where.dateCommitted = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    // Get total count
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

    // Get crimes resolved today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const resolvedToday = await prisma.crimeIncident.count({
      where: {
        ...where,
        stageOfFelony: {
          in: ['Consummated', 'Solved', 'Closed']
        },
        updatedAt: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    // Get active cases (not resolved)
    const activeCases = await prisma.crimeIncident.count({
      where: {
        ...where,
        stageOfFelony: {
          notIn: ['Consummated', 'Solved', 'Closed']
        }
      }
    })

    // Get crimes by month for the current year
    const currentYear = new Date().getFullYear()
    const crimesByMonth = await prisma.crimeIncident.groupBy({
      by: ['dateCommitted'],
      where: {
        ...where,
        dateCommitted: {
          gte: new Date(`${currentYear}-01-01`),
          lt: new Date(`${currentYear + 1}-01-01`)
        }
      },
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

    // Calculate safety index (percentage of resolved cases)
    const safetyIndex = totalCrimes > 0 
      ? Math.round(((totalCrimes - activeCases) / totalCrimes) * 100)
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
        activity: monthlyStats.map(stat => Math.min(100, (stat.count * 10))) // Convert to percentage for chart
      }
    })
  } catch (error) {
    console.error('Error fetching crime statistics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch crime statistics' },
      { status: 500 }
    )
  }
}