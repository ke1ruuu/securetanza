import { NextRequest, NextResponse } from 'next/server';
import { ConfigService } from '@/backend/services/config.service';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const schedule = await ConfigService.getExportSchedule(session.userId);

    return NextResponse.json({ schedule });
  } catch (error) {
    console.error('Error fetching export schedule:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { enabled, frequency, dayOfWeek, dayOfMonth, monthlyOn, deliveryMode } = data;

    const updatedSchedule = await ConfigService.saveExportSchedule(session.userId, {
      enabled,
      frequency,
      dayOfWeek,
      dayOfMonth,
      monthlyOn,
      deliveryMode,
    });

    return NextResponse.json({ success: true, schedule: updatedSchedule });
  } catch (error) {
    console.error('Error saving export schedule:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
