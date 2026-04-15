import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/backend/lib/prisma'
import { z } from 'zod'

const updateCrimeSchema = z.object({
  barangay: z.string().min(1).optional(),
  date: z.string().datetime().optional(),
  time: z.string().min(1).optional(),
  crimeType: z.string().min(1).optional(),
})

// GET /api/crimes/[id] - Get a specific crime incident
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const crime = await prisma.crimeIncident.findUnique({
      where: { id: params.id }
    })

    if (!crime) {
      return NextResponse.json(
        { success: false, error: 'Crime incident not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: crime
    })
  } catch (error) {
    console.error('Error fetching crime:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch crime incident' },
      { status: 500 }
    )
  }
}

// PUT /api/crimes/[id] - Update a crime incident
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateCrimeSchema.parse(body)

    const updateData: any = {}
    if (validatedData.barangay) updateData.barangay = validatedData.barangay
    if (validatedData.date) updateData.date = new Date(validatedData.date)
    if (validatedData.time) updateData.time = validatedData.time
    if (validatedData.crimeType) updateData.crimeType = validatedData.crimeType

    const crime = await prisma.crimeIncident.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      data: crime,
      message: 'Crime incident updated successfully'
    })
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

    console.error('Error updating crime:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update crime incident' },
      { status: 500 }
    )
  }
}

// DELETE /api/crimes/[id] - Delete a crime incident
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.crimeIncident.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Crime incident deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting crime:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete crime incident' },
      { status: 500 }
    )
  }
}