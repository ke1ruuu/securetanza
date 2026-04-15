import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/backend/lib/prisma'
import { z } from 'zod'

const barangaySchema = z.object({
  name: z.string().min(1, 'Barangay name is required'),
  coordinates: z.any().optional(),
  population: z.number().int().positive().optional(),
  area: z.number().positive().optional(),
})

// GET /api/barangays - Fetch all barangays
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    const where: any = {}

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive'
      }
    }

    const barangays = await prisma.barangay.findMany({
      where,
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      data: barangays,
      count: barangays.length
    })
  } catch (error) {
    console.error('Error fetching barangays:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch barangays' },
      { status: 500 }
    )
  }
}

// POST /api/barangays - Create a new barangay
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = barangaySchema.parse(body)

    const barangay = await prisma.barangay.create({
      data: validatedData
    })

    return NextResponse.json({
      success: true,
      data: barangay,
      message: 'Barangay created successfully'
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: error.errors
        },
        { status: 400 }
      )
    }

    console.error('Error creating barangay:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create barangay' },
      { status: 500 }
    )
  }
}