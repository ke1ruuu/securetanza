import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getSession } from '@/lib/auth';

// PUT /api/notifications/rules/[id] - Update a notification rule (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin =
      session.permissions.includes('admin_operational_officer') ||
      session.permissions.includes('admin');

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden: Admin privilege required' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, isEnabled, severity, parameters } = body;

    const updatedRule = await prisma.notificationRule.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(isEnabled !== undefined && { isEnabled }),
        ...(severity !== undefined && { severity }),
        ...(parameters !== undefined && { parameters }),
        updatedBy: session.userId,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: 'Settings',
        user: session.accountNumber,
        resource: `NotificationRule:${id}`,
        details: `Updated notification rule settings for ${updatedRule.name || id}`,
        outcome: 'success',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Notification rule updated successfully',
      data: updatedRule,
    });
  } catch (error) {
    console.error('Error updating notification rule:', error);
    return NextResponse.json({ error: 'Failed to update notification rule' }, { status: 500 });
  }
}
