import { NextRequest, NextResponse } from 'next/server';
import { CrimeService } from '@/backend/services/crime.service';

// GET /api/crimes/latest - Fetch latest crime incident and database metadata (Cached)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const barangay = searchParams.get('barangay');

    const result = await CrimeService.getLatest(barangay);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching latest crime data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch latest crime data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
