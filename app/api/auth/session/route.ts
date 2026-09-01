import { NextResponse } from 'next/server';
import { getSession, deleteSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession(true);

    if (!session) {
      await deleteSession();
      return NextResponse.json(
        { error: 'Not authenticated or access revoked', user: null },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: session.userId,
        accountNumber: session.accountNumber,
        fullName: session.fullName,
        permissions: session.permissions,
        mustChangePassword: session.mustChangePassword,
      },
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
