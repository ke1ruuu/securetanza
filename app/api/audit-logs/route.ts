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
    const action = searchParams.get('action');

    const where = action ? { action } : {};

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        take: limit,
        skip: offset,
      }),
      prisma.auditLog.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: logs,
      meta: {
        total,
        limit,
        offset
      }
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.action || !body.details || !body.user) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (action, details, user)' },
        { status: 400 }
      );
    }

    const log = await prisma.auditLog.create({
      data: {
        action: body.action,
        details: body.details,
        user: body.user,
        ip: body.ip,
        session: body.session,
        resource: body.resource,
        severity: body.severity || 'low',
        outcome: body.outcome || 'success',
        fileName: body.fileName,
        fileSize: body.fileSize,
        recordsImported: body.recordsImported,
        errorMessage: body.errorMessage
      }
    });

    return NextResponse.json({ success: true, data: log });
  } catch (error) {
    console.error('Error creating audit log:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create audit log' },
      { status: 500 }
    );
  }
}
