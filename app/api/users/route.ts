import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getSession } from '@/lib/auth';
import { hash } from 'bcryptjs';
import { z } from 'zod';

// Validation schema for user creation/update
const userSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  permissionIds: z.array(z.number().int().positive()).min(1, 'At least one permission is required'),
});

// Helper to generate next account number
async function generateNextAccountNumber() {
  const lastUser = await prisma.user.findFirst({
    where: {
      accountNumber: {
        startsWith: 'ACC-',
      },
    },
    orderBy: {
      accountNumber: 'desc',
    },
  });

  if (!lastUser) {
    return 'ACC-000001';
  }

  const lastNumMatch = lastUser.accountNumber.match(/ACC-(\d+)/);
  if (!lastNumMatch) {
    return 'ACC-000001';
  }

  const nextNum = parseInt(lastNumMatch[1]) + 1;
  return `ACC-${nextNum.toString().padStart(6, '0')}`;
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

    // Hash password
    const passwordHash = await hash(validatedData.password || 'default123', 10);

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
        user: session.userId.toString(),
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
