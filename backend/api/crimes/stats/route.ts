import { NextRequest, NextResponse } from 'next/server';
import { CrimeService } from '@/backend/services/crime.service';

// GET /api/crimes/stats - Get crime statistics backed by Server-Side Caching Layer
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const barangay = searchParams.get('barangay');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const year = searchParams.get('year');

    const stats = await CrimeService.getStats({
      barangay,
      startDate,
      endDate,
      year,
    });

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching crime statistics:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch crime statistics',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}