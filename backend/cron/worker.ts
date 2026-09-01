import { config } from 'dotenv';
config({ path: '.env' });

import cron from 'node-cron';
import * as xlsx from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

console.log('🕒 Starting Scheduled Data Exports background worker...');

// Run every minute to check for scheduled exports
cron.schedule('* * * * *', async () => {
  try {
    const { prisma } = await import('../lib/prisma.js');
    const now = new Date();
    const dayOfWeek = now.toLocaleString('en-US', { weekday: 'long' });
    const dayOfMonth = now.getDate().toString();
    const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"

    // Check for schedules that should run today
    const schedules = await prisma.exportSchedule.findMany({
      where: { enabled: true },
      include: { user: true }
    });

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

      if (shouldRun) {
        console.log(`[CRON] Generating export for user ${schedule.user.accountNumber} (Frequency: ${schedule.frequency})`);
        
        // Mock generating an excel file
        const data = [
          { Incident: 'Theft', Date: new Date().toISOString() },
          { Incident: 'Vandalism', Date: new Date().toISOString() }
        ];

        const ws = xlsx.utils.json_to_sheet(data);
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, "Incidents");
        
        const dir = path.join(process.cwd(), 'exports');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);

        const filename = `export_${schedule.userId}_${Date.now()}.xlsx`;
        const filepath = path.join(dir, filename);
        
        xlsx.writeFile(wb, filepath);
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
            }
          });
        }
      }
    }
  } catch (error) {
    console.error('Error running cron job:', error);
  }
});
