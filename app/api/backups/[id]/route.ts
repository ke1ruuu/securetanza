import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getSession } from '@/lib/auth';
import { BackupService } from '@/backend/services/backup.service';

function isAdmin(permissions: string[]) {
  return permissions.includes('admin_operational_officer') || permissions.includes('admin');
}

// GET /api/backups/[id] - Stream one archived file back
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !isAdmin(session.permissions)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Administrative access required' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const backup = await BackupService.getWithContent(id);

    if (!backup) {
      return NextResponse.json({ success: false, error: 'Backup not found' }, { status: 404 });
    }

    // Quoted so filenames with spaces survive the header intact.
    return new NextResponse(new Uint8Array(backup.content), {
      status: 200,
      headers: {
        'Content-Type': backup.mimeType,
        'Content-Length': String(backup.sizeBytes),
        'Content-Disposition': `attachment; filename="${backup.fileName.replace(/"/g, '')}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error downloading backup:', error);
    return NextResponse.json({ success: false, error: 'Failed to download backup' }, { status: 500 });
  }
}

// DELETE /api/backups/[id] - Remove one archived file
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !isAdmin(session.permissions)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Administrative access required' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const removed = await BackupService.remove(id);

    if (!removed) {
      return NextResponse.json({ success: false, error: 'Backup not found' }, { status: 404 });
    }

    await prisma.auditLog.create({
      data: {
        action: 'Settings',
        user: session.accountNumber,
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        session: session.sessionId,
        resource: `Backup:${removed.id}`,
        details: `Deleted archived backup ${removed.fileName}`,
        severity: 'high',
        outcome: 'success',
      },
    });

    return NextResponse.json({ success: true, message: 'Backup deleted' });
  } catch (error) {
    console.error('Error deleting backup:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete backup' }, { status: 500 });
  }
}
