import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getSession } from '@/lib/auth';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { randomBytes } from 'crypto';

// Validation schema for user creation/update
const userSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  permissionIds: z.array(z.number().int().positive()).min(1, 'At least one permission is required'),
});

// Helper to generate a random unique account number
async function generateNextAccountNumber() {
  let isUnique = false;
  let accountNum = '';
  while (!isUnique) {
    const randomHex = randomBytes(4).toString('hex').toUpperCase().substring(0, 6);
    accountNum = `ACC-${randomHex}`;
    const existing = await prisma.user.findFirst({ where: { accountNumber: accountNum } });
    if (!existing) {
      isUnique = true;
    }
  }
  return accountNum;
}

function generateSecurePassword() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 10; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}

// GET /api/users - Fetch all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || !session.permissions.includes('admin_operational_officer')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedUsers = users.map(user => ({
      id: user.id,
      accountNumber: user.accountNumber,
      fullName: user.fullName,
      permissions: user.permissions.map(up => ({
        id: up.permission.id,
        name: up.permission.permissionName,
        description: up.permission.description,
      })),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: formattedUsers,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || !session.permissions.includes('admin_operational_officer')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = userSchema.parse(body);

    // Automatically generate next account number
    const accountNumber = await generateNextAccountNumber();

    // Auto-generate temporary password if none provided
    const tempPassword = validatedData.password || generateSecurePassword();

    // Hash password
    const passwordHash = await hash(tempPassword, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        accountNumber,
        fullName: validatedData.fullName,
        passwordHash,
      },
    });

    // Assign permissions
    await Promise.all(validatedData.permissionIds.map(pid => 
      prisma.userPermission.create({
        data: {
          userId: user.id,
          permissionId: pid,
          assignedBy: session.userId,
        },
      })
    ));

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: 'Settings',
        user: session.accountNumber,
        resource: `User:${user.id}`,
        details: `Created new user account for ${user.fullName}`,
        outcome: 'success',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: {
        id: user.id,
        accountNumber: user.accountNumber,
        fullName: user.fullName,
        tempPassword, // return so frontend can show to user
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
