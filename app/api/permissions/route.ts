import { NextRequest, NextResponse } from 'next/server';
import { PermissionService } from '@/backend/services/permission.service';
import { getSession } from '@/lib/auth';

// GET /api/permissions - Fetch all permissions (admin only, Cached)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || (!session.permissions.includes('admin_operational_officer') && !session.permissions.includes('admin'))) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const permissions = await PermissionService.getAllPermissions();

    return NextResponse.json({
      success: true,
      data: permissions,
    });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch permissions' },
      { status: 500 }
    );
  }
}
