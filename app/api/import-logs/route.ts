import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (!session.permissions.includes('admin_operational_officer') && !session.permissions.includes('admin'))) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Administrative access required' },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where = { action: 'Import' };

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      prisma.auditLog.count({ where }),
    ]);

    const formattedLogs = logs.map((log) => ({
      id: String(log.id),
      fileName: log.fileName || 'Excel Dataset',
      fileSize: log.fileSize || 0,
      recordsImported: log.recordsImported || 0,
      status: log.outcome || 'success',
      errorMessage: log.errorMessage || null,
      importedBy: log.user || 'System',
      importedAt: log.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      logs: formattedLogs,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching import logs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch import logs' },
      { status: 500 }
    );
  }
}
