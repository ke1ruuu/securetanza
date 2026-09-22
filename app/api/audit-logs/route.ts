import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getSession } from '@/lib/auth';
import { getClientIp, getUserAgent } from '@/lib/request-context';

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
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: { action?: string; createdAt?: { gte?: Date; lte?: Date } } = {};

    if (action) where.action = action;

    // The client sends local start-of-day / end-of-day instants, so the range it
    // asks for is the range the officer sees in their own timezone.
    if (startDate || endDate) {
      const range: { gte?: Date; lte?: Date } = {};
      const from = startDate ? new Date(startDate) : null;
      const to = endDate ? new Date(endDate) : null;
      if (from && !isNaN(from.getTime())) range.gte = from;
      if (to && !isNaN(to.getTime())) range.lte = to;
      if (range.gte || range.lte) where.createdAt = range;
    }

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
    // This had no auth check at all before, and trusted `user`/`ip`/`session`
    // verbatim from the client body — any signed-in caller could forge an
    // entry claiming to be a different user, from a different IP, in a
    // different session. Identity and connection info now come from the
    // authenticated session and the request itself; the body only supplies
    // what the server genuinely can't know on its own (what happened).
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Basic validation
    if (!body.action || !body.details) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (action, details)' },
        { status: 400 }
      );
    }

    const log = await prisma.auditLog.create({
      data: {
        action: body.action,
        details: body.details,
        user: session.fullName || session.accountNumber,
        ip: getClientIp(request) || 'unknown',
        session: session.sessionId,
        userAgent: getUserAgent(request),
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
