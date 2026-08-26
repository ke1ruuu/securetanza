import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';

// GET /api/notifications - List notifications with filters, active/archived views, & unread count
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
    const skip = (page - 1) * limit;

    const category = searchParams.get('category');
    const severity = searchParams.get('severity');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const archivedParam = searchParams.get('archived'); // 'true' | 'false' | 'all'
    const viewParam = searchParams.get('view'); // 'active' | 'archived' | 'all'
    const search = searchParams.get('search');

    const where: any = {};

    if (category && category !== 'ALL') {
      where.category = category;
    }

    if (severity && severity !== 'ALL') {
      where.severity = severity;
    }

    if (unreadOnly) {
      where.isRead = false;
    }

    // Handle Active vs Archived views
    if (archivedParam === 'true' || viewParam === 'archived') {
      where.isArchived = true;
    } else if (archivedParam === 'all' || viewParam === 'all') {
      // Show both active and archived
    } else {
      // Default: show active (non-archived) notifications
      where.isArchived = false;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [notifications, total, unreadCount, activeCount, archivedCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          uploadLog: {
            select: {
              id: true,
              fileName: true,
              uploadedAt: true,
              recordsImported: true,
            },
          },
        },
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { isRead: false } }),
      prisma.notification.count({ where: { isArchived: false } }),
      prisma.notification.count({ where: { isArchived: true } }),
    ]);

    return NextResponse.json({
      success: true,
      data: notifications,
      total,
      unreadCount,
      activeCount,
      archivedCount,
      page,
      limit,
      hasMore: skip + notifications.length < total,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

// PATCH /api/notifications - Mark notifications as read/unread, and automate archiving
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationIds, markAllAsRead, isRead = true, isArchived, unarchive = false } = body;

    const now = new Date();

    if (markAllAsRead) {
      // Automate archiving once all are read
      await prisma.notification.updateMany({
        where: { isRead: false },
        data: {
          isRead: true,
          readAt: now,
          isArchived: true,
          archivedAt: now,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read and automatically archived',
      });
    }

    if (Array.isArray(notificationIds) && notificationIds.length > 0) {
      const updateData: any = {};

      if (typeof isRead === 'boolean') {
        updateData.isRead = isRead;
        updateData.readAt = isRead ? now : null;

        // Auto-archive when marked as read, unless unarchive is explicitly requested
        if (isRead && !unarchive) {
          updateData.isArchived = true;
          updateData.archivedAt = now;
        }
      }

      if (typeof isArchived === 'boolean') {
        updateData.isArchived = isArchived;
        updateData.archivedAt = isArchived ? now : null;
      } else if (unarchive) {
        updateData.isArchived = false;
        updateData.archivedAt = null;
      }

      await prisma.notification.updateMany({
        where: { id: { in: notificationIds } },
        data: updateData,
      });

      return NextResponse.json({
        success: true,
        message: `Updated ${notificationIds.length} notification(s)`,
      });
    }

    return NextResponse.json({ error: 'No notification IDs provided' }, { status: 400 });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }
}
