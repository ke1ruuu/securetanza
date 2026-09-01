import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const schedule = await prisma.exportSchedule.findFirst({
      where: { userId: session.userId },
    });

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

    // Validate if necessary, but we'll trust the frontend types for now.
    
    // Upsert the schedule
    const schedule = await prisma.exportSchedule.findFirst({
      where: { userId: session.userId },
    });

    let updatedSchedule;
    if (schedule) {
      updatedSchedule = await prisma.exportSchedule.update({
        where: { id: schedule.id },
        data: { enabled, frequency, dayOfWeek, dayOfMonth, monthlyOn, deliveryMode },
      });
    } else {
      updatedSchedule = await prisma.exportSchedule.create({
        data: {
          userId: session.userId,
          enabled,
          frequency,
          dayOfWeek,
          dayOfMonth,
          monthlyOn,
          deliveryMode,
        },
      });
    }

    return NextResponse.json({ success: true, schedule: updatedSchedule });
  } catch (error) {
    console.error('Error saving export schedule:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
