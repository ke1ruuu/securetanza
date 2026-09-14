import { NextRequest, NextResponse } from 'next/server';
import { CrimeService } from '@/backend/services/crime.service';

// GET /api/crimes/barangay-counts - Get crime counts per barangay backed by Server-Side Caching Layer
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDateCommitted = searchParams.get('startDateCommitted');
    const endDateCommitted = searchParams.get('endDateCommitted');
    const hour = searchParams.get('hour');
    const year = searchParams.get('year');
    const incidentType = searchParams.get('incidentType');
    const barangay = searchParams.get('barangay');

    const result = await CrimeService.getBarangayCounts({
      startDateCommitted,
      endDateCommitted,
      hour,
      year,
      incidentType,
      barangay,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching barangay crime counts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch barangay crime counts' },
      { status: 500 }
    );
  }
}