import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getSession, invalidateSessionCache } from '@/lib/auth';
import { hash } from 'bcryptjs';

/** Mirrors the generator used when an account is first created. */
function generateSecurePassword() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 10; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}

// POST /api/users/[id]/unlock - Clear a lockout and issue a temporary password (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    if (!session || !session.permissions.includes('admin_operational_officer')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user id' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { id: userId } });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!existingUser.lockedAt) {
      return NextResponse.json(
        { error: 'This account is not locked.' },
        { status: 400 }
      );
    }

    // The old password stops working the moment the lock is cleared: whoever ran the
    // account into the lock may have been guessing at it.
    const tempPassword = generateSecurePassword();

    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: await hash(tempPassword, 10),
        mustChangePassword: true,
        failedLoginAttempts: 0,
        lockedAt: null,
      },
    });

    invalidateSessionCache(userId);

    await prisma.auditLog.create({
      data: {
        action: 'Settings',
        user: session.accountNumber,
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        session: session.sessionId,
        resource: `User:${existingUser.accountNumber}`,
        details: `Unlocked account ${existingUser.accountNumber} and issued a temporary password`,
        severity: 'high',
        outcome: 'success',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Account unlocked',
      data: {
        id: existingUser.id,
        accountNumber: existingUser.accountNumber,
        fullName: existingUser.fullName,
        tempPassword,
      },
    });
  } catch (error) {
    console.error('Error unlocking user:', error);
    return NextResponse.json(
      { error: 'Failed to unlock account' },
      { status: 500 }
    );
  }
}
