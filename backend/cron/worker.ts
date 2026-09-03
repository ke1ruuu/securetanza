import { config } from 'dotenv';
// Load .env.local first (standard for Next.js), then fallback to .env
config({ path: '.env.local' });
config({ path: '.env' });

import cron from 'node-cron';
import * as xlsx from 'xlsx';
import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import * as path from 'path';
import { prisma, disconnectPrisma } from '../lib/prisma';

console.log('🕒 Starting Scheduled Data Exports background worker...');

const EXPORTS_DIR = path.join(process.cwd(), 'exports');
const RETENTION_DAYS = 14;
const RETENTION_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000;

/**
 * Clean up export files older than RETENTION_DAYS to prevent disk bloating
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

// Initial cleanup on worker boot
cleanOldExports();

// Schedule daily cleanup at 03:00 AM
const cleanupTask = cron.schedule('0 3 * * *', () => {
  cleanOldExports();
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

    // Ensure exports directory exists asynchronously
    if (!existsSync(EXPORTS_DIR)) {
      await fs.mkdir(EXPORTS_DIR, { recursive: true });
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

        // Fetch recent incident summary data for export
        const incidents = await prisma.crimeIncident.findMany({
          take: 500,
          orderBy: { dateCommitted: 'desc' },
          select: {
            barangay: true,
            incidentType: true,
            dateCommitted: true,
            timeCommitted: true,
            caseStatus: true,
            isCrime: true,
          },
        });

        const data = incidents.length > 0
          ? incidents.map((inc) => ({
              Barangay: inc.barangay,
              Incident: inc.incidentType,
              Date: inc.dateCommitted.toISOString().split('T')[0],
              Time: inc.timeCommitted,
              Status: inc.caseStatus || 'Unspecified',
              Crime: inc.isCrime ? 'Yes' : 'No',
            }))
          : [
              { Incident: 'No incidents found', Date: new Date().toISOString() },
            ];

        const ws = xlsx.utils.json_to_sheet(data);
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'Incidents');

        const filename = `export_${schedule.userId}_${Date.now()}.xlsx`;
        const filepath = path.join(EXPORTS_DIR, filename);

        // Asynchronous non-blocking file write
        const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
        await fs.writeFile(filepath, buffer);
        console.log(`[CRON] Saved export to ${filepath}`);

        if (schedule.deliveryMode === 'auto') {
          // Notify user
          await prisma.notification.create({
            data: {
              category: 'SYSTEM',
              severity: 'INFO',
              title: 'Scheduled Export Ready',
              message: `Your scheduled ${schedule.frequency} data export is ready.`,
              metadata: { link: `/exports/${filename}`, userId: schedule.userId },
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
