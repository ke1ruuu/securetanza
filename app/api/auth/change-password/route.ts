import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getSession, hashPassword, createSession } from '@/lib/auth';
import { z } from 'zod';

const changePasswordSchema = z.object({
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { newPassword } = changePasswordSchema.parse(body);

    // Hash the new password
    const passwordHash = await hashPassword(newPassword);

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        passwordHash,
        mustChangePassword: false,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    const permissions = updatedUser.permissions.map(up => up.permission.permissionName);

    // Refresh the session with the new mustChangePassword flag
    const sessionId = await createSession({
      id: updatedUser.id,
      accountNumber: updatedUser.accountNumber,
      fullName: updatedUser.fullName,
      permissions,
      mustChangePassword: false,
    });

    // Audit log
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    await prisma.auditLog.create({
      data: {
        action: 'Auth',
        user: session.accountNumber,
        ip,
        session: sessionId,
        details: 'User successfully completed forced password change',
        outcome: 'success',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
