import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/backend/lib/prisma'
import { mapGeoJsonToDb } from '@/backend/lib/barangay-mapper'

// GET /api/crimes/latest - Fetch latest crime incident and database metadata
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const barangay = searchParams.get('barangay')

    const where: any = {}
    if (barangay && barangay !== 'General Dashboard') {
      const dbBarangayName = mapGeoJsonToDb(barangay)
      where.barangay = {
        equals: dbBarangayName,
        mode: 'insensitive'
      }
    }

    const [latestIncident, totalCount, lastUpload] = await Promise.all([
      prisma.crimeIncident.findFirst({
        where,
        orderBy: [
          { dateCommitted: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.crimeIncident.count({ where }),
      prisma.auditLog.findFirst({
        where: {
          action: 'Import',
          outcome: 'success'
        },
        orderBy: { createdAt: 'desc' }
      })
    ])

    return NextResponse.json({
      success: true,
      data: {
        latestIncident,
        totalCount,
        lastUpload: lastUpload
          ? {
              fileName: lastUpload.fileName,
              recordsImported: lastUpload.recordsImported,
              createdAt: lastUpload.createdAt
            }
          : null,
        serverTime: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error fetching latest crime data:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch latest crime data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
