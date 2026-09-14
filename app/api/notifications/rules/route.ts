import { NextResponse } from 'next/server';
import { ConfigService } from '@/backend/services/config.service';
import { getSession } from '@/lib/auth';

// GET /api/notifications/rules - Fetch all notification rules (Admin only, Cached)
export async function GET() {
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

    const rules = await ConfigService.getNotificationRules();

    return NextResponse.json({
      success: true,
      data: rules,
    });
  } catch (error) {
    console.error('Error fetching notification rules:', error);
    return NextResponse.json({ error: 'Failed to fetch notification rules' }, { status: 500 });
  }
}
