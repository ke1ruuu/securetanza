import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const [logs, total] = await Promise.all([
      prisma.uploadLog.findMany({
        orderBy: {
          uploadedAt: 'desc'
        },
        take: limit,
        skip: offset
      }),
      prisma.uploadLog.count()
    ]);

    return NextResponse.json({
      success: true,
      logs,
      total,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching upload logs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch upload logs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName, fileSize, recordsImported, status, errorMessage, uploadedBy } = body;

    const log = await prisma.uploadLog.create({
      data: {
        fileName,
        fileSize,
        recordsImported,
        status: status || 'success',
        errorMessage,
        uploadedBy
      }
    });

    return NextResponse.json({
      success: true,
      log
    });
  } catch (error) {
    console.error('Error creating upload log:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create upload log' },
      { status: 500 }
    );
  }
}
