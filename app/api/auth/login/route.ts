import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { verifyPassword, createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { accountNumber, password } = await request.json();

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
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Extract permissions
    const permissions = user.permissions.map(up => up.permission.permissionName);

    // Create session
    await createSession({
      id: user.id,
      accountNumber: user.accountNumber,
      fullName: user.fullName,
      permissions,
    });

    return NextResponse.json({
      success: true,
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
