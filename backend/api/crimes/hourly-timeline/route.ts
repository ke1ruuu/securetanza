import { NextRequest, NextResponse } from 'next/server';
import { CrimeService } from '@/backend/services/crime.service';

// GET /api/crimes/hourly-timeline - Date x hour incident histogram in one aggregate query
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const result = await CrimeService.getHourlyTimeline({
      year: searchParams.get('year'),
      incidentType: searchParams.get('incidentType'),
      barangay: searchParams.get('barangay'),
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching hourly crime timeline:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch hourly crime timeline',
        // Surface the cause while developing; the dev server log has the stack.
        details: process.env.NODE_ENV === 'production' ? undefined : (error as Error)?.message,
      },
      { status: 500 }
    );
  }
}
