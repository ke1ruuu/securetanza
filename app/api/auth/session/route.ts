import { NextResponse } from 'next/server';
import { getSession, deleteSession } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const hasSessionCookie = Boolean(cookieStore.get('session')?.value);

    // If there is no session cookie at all (e.g. visitor on login page), return unauthenticated cleanly
    if (!hasSessionCookie) {
      return NextResponse.json(
        { success: false, authenticated: false, user: null },
        { status: 200 }
      );
    }

    const session = await getSession(true);

    if (!session) {
      await deleteSession();
      return NextResponse.json(
        { success: false, authenticated: false, error: 'Session expired or access revoked', user: null },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: session.userId,
        accountNumber: session.accountNumber,
        fullName: session.fullName,
        permissions: session.permissions,
        mustChangePassword: session.mustChangePassword,
        defaultLandingPage: session.defaultLandingPage,
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
