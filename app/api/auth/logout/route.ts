import { NextRequest, NextResponse } from 'next/server';
import { getSession, deleteSession } from '@/lib/auth';
import { prisma } from '@/backend/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    await deleteSession();
    
    if (session) {
      await prisma.auditLog.create({
        data: {
          action: 'Auth',
          user: session.accountNumber,
          ip: request.headers.get('x-forwarded-for') || (request as any).ip || 'unknown',
          session: session.sessionId,
          details: 'User logged out',
          outcome: 'success',
        },
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
