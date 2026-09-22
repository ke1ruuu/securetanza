import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { CrimeService } from '@/backend/services/crime.service';
import { prisma } from '@/backend/lib/prisma';
import { getSession } from '@/lib/auth';
import { getClientIp, getUserAgent } from '@/lib/request-context';

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
});

// GET /api/crimes - Fetch all crime incidents with optional filters (Cached)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');

    const crimes = await CrimeService.getCrimes({
      barangay: searchParams.get('barangay'),
      region: searchParams.get('region'),
      province: searchParams.get('province'),
      municipal: searchParams.get('municipal'),
      incidentType: searchParams.get('incidentType'),
      startDateReported: searchParams.get('startDateReported'),
      endDateReported: searchParams.get('endDateReported'),
      startDateCommitted: searchParams.get('startDateCommitted'),
      endDateCommitted: searchParams.get('endDateCommitted'),
      modeReporting: searchParams.get('modeReporting'),
      stageOfFelony: searchParams.get('stageOfFelony'),
      caseStatus: searchParams.get('caseStatus'),
      offenseType: searchParams.get('offenseType'),
      modus: searchParams.get('modus'),
      typeOfPlace: searchParams.get('typeOfPlace'),
      hour: searchParams.get('hour'),
      year: searchParams.get('year'),
      limit: limit ? parseInt(limit, 10) : 500,
    });

    return NextResponse.json({
      success: true,
      data: crimes,
      count: crimes.length,
    });
  } catch (error) {
    console.error('Error fetching crimes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch crime data' },
      { status: 500 }
    );
  }
}

// POST /api/crimes - Create a new crime incident (with cache invalidation)
export async function POST(request: NextRequest) {
  try {
    // /api/crimes is in middleware.ts's publicApiRoutes allowlist (so the public
    // map's GET reads work without login) — but that allowlist matches by prefix,
    // which was also silently waiving auth on this write endpoint. Checked here
    // explicitly, same as the sibling upload route.
    const session = await getSession();
    if (!session || (!session.permissions.includes('admin_operational_officer') && !session.permissions.includes('admin'))) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Administrative access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = crimeIncidentSchema.parse(body);

    const crime = await CrimeService.createIncident({
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
    });

    await prisma.auditLog.create({
      data: {
        action: 'Import',
        details: `Created single crime incident in ${validatedData.barangay}`,
        user: session.fullName || session.accountNumber,
        resource: `CrimeData:${crime.id}`,
        ip: getClientIp(request) || 'unknown',
        session: session.sessionId,
        userAgent: getUserAgent(request),
        outcome: 'success',
      },
    });

    return NextResponse.json({
      success: true,
      data: crime,
      message: 'Crime incident created successfully',
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    console.error('Error creating crime:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create crime incident' },
      { status: 500 }
    );
  }
}