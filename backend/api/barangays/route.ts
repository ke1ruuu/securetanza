import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { BarangayService } from '@/backend/services/barangay.service';

const barangaySchema = z.object({
  name: z.string().min(1, 'Barangay name is required'),
  coordinates: z.any().optional(),
  population: z.number().int().positive().optional(),
  area: z.number().positive().optional(),
});

// GET /api/barangays - Fetch all barangays (Cached with 1-hour TTL)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const barangays = await BarangayService.getAll(search);

    return NextResponse.json({
      success: true,
      data: barangays,
      count: barangays.length,
    });
  } catch (error) {
    console.error('Error fetching barangays:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch barangays' },
      { status: 500 }
    );
  }
}

// POST /api/barangays - Create a new barangay (with cache invalidation)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = barangaySchema.parse(body);

    const barangay = await BarangayService.create(validatedData);

    return NextResponse.json({
      success: true,
      data: barangay,
      message: 'Barangay created successfully',
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

    console.error('Error creating barangay:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create barangay' },
      { status: 500 }
    );
  }
}