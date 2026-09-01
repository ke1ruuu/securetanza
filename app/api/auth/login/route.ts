import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { verifyPassword, createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { accountNumber, password } = await request.json();
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    // Validate input
    if (!accountNumber || !password) {
      return NextResponse.json(
        { error: 'Account number and password are required' },
        { status: 400 }
      );
    }

    // Find user by account number
    const user = await prisma.user.findUnique({
      where: { accountNumber },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!user) {
      await prisma.auditLog.create({
        data: {
          action: 'Auth',
          user: accountNumber,
          ip,
          details: 'Failed login attempt',
          errorMessage: 'Invalid credentials (User not found)',
          outcome: 'failed',
          severity: 'medium',
        },
      });
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      await prisma.auditLog.create({
        data: {
          action: 'Auth',
          user: accountNumber,
          ip,
          details: 'Failed login attempt',
          errorMessage: 'Invalid credentials (Wrong password)',
          outcome: 'failed',
          severity: 'medium',
        },
      });
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Extract permissions
    const permissions = user.permissions.map(up => up.permission.permissionName);

    // Create session
    const sessionId = await createSession({
      id: user.id,
      accountNumber: user.accountNumber,
      fullName: user.fullName,
      permissions,
      mustChangePassword: user.mustChangePassword,
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: 'Auth',
        user: user.accountNumber,
        ip,
        session: sessionId,
        details: 'User logged in successfully',
        outcome: 'success',
      },
    });

    return NextResponse.json({
      success: true,
      mustChangePassword: user.mustChangePassword,
      user: {
        id: user.id,
        accountNumber: user.accountNumber,
        fullName: user.fullName,
        permissions,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
