import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/backend/lib/prisma'
import { z } from 'zod'
import { mapGeoJsonToDb } from '@/backend/lib/barangay-mapper'

// Validation schema for crime incident
const crimeIncidentSchema = z.object({
  // Required fields
  barangay: z.string().min(1, 'Barangay is required'),
  dateReported: z.string().datetime('Invalid date reported format'),
  timeReported: z.string().min(1, 'Time reported is required'),
  dateCommitted: z.string().datetime('Invalid date committed format'),
  timeCommitted: z.string().min(1, 'Time committed is required'),
  incidentType: z.string().min(1, 'Incident type is required'),
  
  // Optional fields
  ppo: z.string().optional(),
  stn: z.string().optional(),
  pcp: z.string().optional(),
  region: z.string().optional(),
  province: z.string().optional(),
  municipal: z.string().optional(),
  street: z.string().optional(),
  typeOfPlace: z.string().optional(),
  isCrime: z.boolean().optional().default(true),
  modeReporting: z.string().optional(),
  stageOfFelony: z.string().optional(),
  offense: z.string().optional(),
  offenseType: z.string().optional(),
  section: z.string().optional(),
  modus: z.string().optional(),
  suspectMotive: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
})

// GET /api/crimes - Fetch all crime incidents with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const barangay = searchParams.get('barangay')
    const region = searchParams.get('region')
    const province = searchParams.get('province')
    const municipal = searchParams.get('municipal')
    const incidentType = searchParams.get('incidentType')
    const startDateReported = searchParams.get('startDateReported')
    const endDateReported = searchParams.get('endDateReported')
    const startDateCommitted = searchParams.get('startDateCommitted')
    const endDateCommitted = searchParams.get('endDateCommitted')
    const modeReporting = searchParams.get('modeReporting')
    const stageOfFelony = searchParams.get('stageOfFelony')
    const caseStatus = searchParams.get('caseStatus')
    const offenseType = searchParams.get('offenseType')
    const modus = searchParams.get('modus')
    const typeOfPlace = searchParams.get('typeOfPlace')
    const limit = searchParams.get('limit')
    const hour = searchParams.get('hour') // Optional hour filter (0-23)
    const year = searchParams.get('year') // Optional year filter

    const where: any = {}

    if (barangay) {
      // Map GeoJSON barangay name to database name (e.g., "Amaya I" -> "Daang Amaya I")
      const dbBarangayName = mapGeoJsonToDb(barangay)
      where.barangay = {
        equals: dbBarangayName,
        mode: 'insensitive'
      }
    }

    if (region) {
      where.region = {
        contains: region,
        mode: 'insensitive'
      }
    }

    if (province) {
      where.province = {
        contains: province,
        mode: 'insensitive'
      }
    }

    if (municipal) {
      where.municipal = {
        contains: municipal,
        mode: 'insensitive'
      }
    }

    if (incidentType) {
      where.incidentType = {
        contains: incidentType,
        mode: 'insensitive'
      }
    }

    if (startDateReported && endDateReported) {
      where.dateReported = {
        gte: new Date(startDateReported),
        lte: new Date(endDateReported)
      }
    }

    if (startDateCommitted && endDateCommitted) {
      where.dateCommitted = {
        gte: new Date(startDateCommitted),
        lte: new Date(endDateCommitted)
      }
    }

    if (modeReporting) {
      where.modeReporting = {
        contains: modeReporting,
        mode: 'insensitive'
      }
    }

    if (stageOfFelony) {
      where.stageOfFelony = {
        contains: stageOfFelony,
        mode: 'insensitive'
      }
    }

    if (caseStatus) {
      where.caseStatus = {
        contains: caseStatus,
        mode: 'insensitive'
      }
    }

    if (offenseType) {
      where.offenseType = {
        contains: offenseType,
        mode: 'insensitive'
      }
    }

    if (modus) {
      where.modus = {
        contains: modus,
        mode: 'insensitive'
      }
    }

    if (typeOfPlace) {
      where.typeOfPlace = {
        contains: typeOfPlace,
        mode: 'insensitive'
      }
    }

    // Filter by year if specified
    if (year) {
      const yearNum = parseInt(year)
      const startOfYear = new Date(yearNum, 0, 1) // January 1st
      const endOfYear = new Date(yearNum, 11, 31, 23, 59, 59, 999) // December 31st
      
      where.dateCommitted = {
        ...where.dateCommitted,
        gte: startOfYear,
        lte: endOfYear
      }
    }

    const crimes = await prisma.crimeIncident.findMany({
      where,
      orderBy: {
        dateCommitted: 'desc'
      },
      take: limit ? parseInt(limit) : undefined
    })

    // Filter by hour if specified
    let filteredCrimes = crimes
    if (hour !== null && hour !== undefined) {
      const targetHour = parseInt(hour)
      filteredCrimes = crimes.filter(crime => {
        const timeParts = crime.timeCommitted.split(':')
        const crimeHour = parseInt(timeParts[0])
        return crimeHour === targetHour
      })
    }

    return NextResponse.json({
      success: true,
      data: filteredCrimes,
      count: filteredCrimes.length
    })
  } catch (error) {
    console.error('Error fetching crimes:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch crime data' },
      { status: 500 }
    )
  }
}

// POST /api/crimes - Create a new crime incident
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = crimeIncidentSchema.parse(body)

    const crime = await prisma.crimeIncident.create({
      data: {
        barangay: validatedData.barangay,
        dateReported: new Date(validatedData.dateReported),
        timeReported: validatedData.timeReported,
        dateCommitted: new Date(validatedData.dateCommitted),
        timeCommitted: validatedData.timeCommitted,
        incidentType: validatedData.incidentType,
        ppo: validatedData.ppo,
        stn: validatedData.stn,
        pcp: validatedData.pcp,
        region: validatedData.region,
        province: validatedData.province,
        municipal: validatedData.municipal,
        street: validatedData.street,
        typeOfPlace: validatedData.typeOfPlace,
        isCrime: validatedData.isCrime ?? true,
        modeReporting: validatedData.modeReporting,
        stageOfFelony: validatedData.stageOfFelony,
        offense: validatedData.offense,
        offenseType: validatedData.offenseType,
        section: validatedData.section,
        modus: validatedData.modus,
        suspectMotive: validatedData.suspectMotive,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
      }
    })

    const ip = request.headers.get('x-forwarded-for') || 'Unknown IP'
    await prisma.auditLog.create({
      data: {
        action: 'Import', // We'll use Import to represent data ingestion, or maybe 'Auth'? No, Import fits data creation best. Wait, the system considers it Import.
        details: `Created single crime incident in ${validatedData.barangay}`,
        user: 'System/API', // We don't have session auth imported here, so we fallback
        resource: `CrimeData:${crime.id}`,
        ip,
        session: 'Unknown',
        outcome: 'success'
      }
    })

    return NextResponse.json({
      success: true,
      data: crime,
      message: 'Crime incident created successfully'
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: error.issues
        },
        { status: 400 }
      )
    }

    console.error('Error creating crime:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create crime incident' },
      { status: 500 }
    )
  }
}