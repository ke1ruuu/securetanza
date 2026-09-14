import { config } from 'dotenv';
// Load .env.local first (standard for Next.js), then fallback to .env
config({ path: '.env.local' });
config({ path: '.env' });

import cron from 'node-cron';
import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import * as path from 'path';
import { prisma, disconnectPrisma } from '../lib/prisma';
import { BackupService, XLSX_MIME } from '../services/backup.service';

console.log('🕒 Starting Scheduled Data Exports background worker...');

const EXPORTS_DIR = path.join(process.cwd(), 'exports');
const RETENTION_DAYS = 14;
const RETENTION_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000;

/**
 * Clean up export files older than RETENTION_DAYS to prevent disk bloating.
 *
 * Scheduled exports are archived in the database now, so this only drains what the
 * previous on-disk implementation left behind.
 */
async function cleanOldExports(): Promise<void> {
  try {
    if (!existsSync(EXPORTS_DIR)) return;
    const files = await fs.readdir(EXPORTS_DIR);
    const now = Date.now();

    for (const file of files) {
      if (!file.endsWith('.xlsx')) continue;
      const filePath = path.join(EXPORTS_DIR, file);
      try {
        const stats = await fs.stat(filePath);
        if (now - stats.mtimeMs > RETENTION_MS) {
          await fs.unlink(filePath);
          console.log(`[CLEANUP] Deleted expired export file: ${file}`);
        }
      } catch (err) {
        console.error(`[CLEANUP] Error checking file ${file}:`, err);
      }
    }
  } catch (error) {
    console.error('[CLEANUP] Error cleaning old exports:', error);
  }
}

/**
 * Age out scheduled snapshots from the archive. Backups an officer made by hand are
 * left alone — they were kept deliberately, and only they can decide to drop one.
 */
async function pruneScheduledBackups(): Promise<void> {
  try {
    const cutoff = new Date(Date.now() - RETENTION_MS);
    const { count } = await prisma.backup.deleteMany({
      where: { kind: 'scheduled_export', createdAt: { lt: cutoff } },
    });
    if (count > 0) {
      console.log(`[CLEANUP] Removed ${count} expired scheduled backup(s)`);
    }
  } catch (error) {
    console.error('[CLEANUP] Error pruning scheduled backups:', error);
  }
}

// Initial cleanup on worker boot
cleanOldExports();
pruneScheduledBackups();

// Schedule daily cleanup at 03:00 AM
const cleanupTask = cron.schedule('0 3 * * *', () => {
  cleanOldExports();
  pruneScheduledBackups();
});

let isRunning = false;

// Run every minute to check for scheduled exports
const task = cron.schedule('* * * * *', async () => {
  if (isRunning) {
    console.log('⏳ Previous export job still executing, skipping this tick...');
    return;
  }

  isRunning = true;
  try {
    const now = new Date();
    const dayOfWeek = now.toLocaleString('en-US', { weekday: 'long' });
    const dayOfMonth = now.getDate().toString();
    const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"

    // Fetch enabled schedules
    const schedules = await prisma.exportSchedule.findMany({
      where: { enabled: true },
      include: { user: true },
    });

    if (schedules.length === 0) {
      return;
    }

    for (const schedule of schedules) {
      let shouldRun = false;
      const targetTime = schedule.timeOfDay || '00:00';

      // Only run if the current hour and minute matches the scheduled time
      if (currentTime !== targetTime) {
        continue;
      }

      if (schedule.frequency === 'daily') {
        shouldRun = true;
      } else if (schedule.frequency === 'weekly' && schedule.dayOfWeek === dayOfWeek) {
        shouldRun = true;
      } else if (schedule.frequency === 'monthly' && schedule.dayOfMonth === dayOfMonth) {
        shouldRun = true;
      }

      if (!shouldRun) {
        continue;
      }

      try {
        console.log(`[CRON] Generating export for user ${schedule.user.accountNumber} (Frequency: ${schedule.frequency})`);

        // The same snapshot the Backups tab produces: the full cleaned register plus
        // the aggregates, kept in the database so it outlives this container.
        const snapshot = await BackupService.buildCrimeDataWorkbook();
        const stamp = new Date().toISOString().split('T')[0];

        const backup = await BackupService.create({
          kind: 'scheduled_export',
          fileName: `Scheduled-Export-${stamp}-${schedule.user.accountNumber}.xlsx`,
          mimeType: XLSX_MIME,
          content: snapshot.buffer,
          label: `${schedule.frequency} export`,
          periodLabel: snapshot.periodLabel,
          rowCount: snapshot.rowCount,
          createdBy: schedule.user.accountNumber,
        });

        console.log(
          `[CRON] Archived export ${backup.fileName} (${snapshot.rowCount} incidents, ${backup.sizeBytes} bytes)`
        );

        if (schedule.deliveryMode === 'auto') {
          // Notify user
          await prisma.notification.create({
            data: {
              category: 'SYSTEM',
              severity: 'INFO',
              title: 'Scheduled Export Ready',
              message: `Your scheduled ${schedule.frequency} data export is ready in Settings → Backups (${snapshot.rowCount} incidents).`,
              metadata: { link: `/api/backups/${backup.id}`, backupId: backup.id, userId: schedule.userId },
              isRead: false,
            },
          });
        }
      } catch (scheduleError) {
        console.error(`[CRON] Error processing schedule for user ${schedule.userId}:`, scheduleError);
      }
    }
  } catch (error) {
    console.error('Error running cron job:', error);
  } finally {
    isRunning = false;
  }
});

// Graceful shutdown
let isShuttingDown = false;
async function handleShutdown(signal: string) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`\n🛑 Received ${signal}. Gracefully stopping background worker...`);
  task.stop();
  cleanupTask.stop();
  await disconnectPrisma();
  console.log('✅ Background worker stopped cleanly.');
  process.exit(0);
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
