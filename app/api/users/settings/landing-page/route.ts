import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getSession, createSession } from '@/lib/auth';

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { landingPage } = await request.json();

    if (!landingPage || !['dashboard', 'map', 'analytics'].includes(landingPage)) {
      return NextResponse.json({ error: 'Invalid landing page value' }, { status: 400 });
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: { defaultLandingPage: landingPage },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    // Re-create the session to reflect the new defaultLandingPage
    const permissions = updatedUser.permissions.map(up => up.permission.permissionName);
    
    await createSession({
      id: updatedUser.id,
      accountNumber: updatedUser.accountNumber,
      fullName: updatedUser.fullName,
      permissions,
      mustChangePassword: updatedUser.mustChangePassword,
      defaultLandingPage: updatedUser.defaultLandingPage,
    });

    return NextResponse.json({ success: true, landingPage: updatedUser.defaultLandingPage });
  } catch (error) {
    console.error('Error updating landing page preference:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
