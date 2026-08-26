import { PrismaClient } from '../lib/generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL or DIRECT_URL environment variable is required');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const DEFAULT_NOTIFICATION_RULES = [
  {
    ruleKey: 'RULE_DATASET_INGESTION_STATUS',
    name: 'Dataset Ingestion Status',
    description: 'Generates operational summaries and validation reports upon completion of CSV/Excel bulk upload processing.',
    category: 'DATASET_PROCESSING' as const,
    conditionType: 'UPLOAD_VALIDATION_ERROR_RATE' as const,
    parameters: { maxWarningThresholdPercent: 5 },
    severity: 'INFO' as const,
    isEnabled: true,
  },
  {
    ruleKey: 'RULE_PEAK_HOUR_SURGE',
    name: 'Peak Hour Crime Concentration',
    description: 'Detects if a single 3-hour operational window accounts for an unusually high proportion of crimes in the newly uploaded dataset.',
    category: 'PEAK_HOUR' as const,
    conditionType: 'HOURLY_PERCENT_EXCEEDS' as const,
    parameters: { windowSpanHours: 3, densityThresholdPercent: 30, minBatchSize: 10 },
    severity: 'WARNING' as const,
    isEnabled: true,
  },
  {
    ruleKey: 'RULE_BARANGAY_VOLUME_SURGE',
    name: 'Barangay Crime Volume Surge',
    description: 'Flags barangays that exhibit a marked percentage increase in crime incidents within the uploaded dataset relative to historical baseline.',
    category: 'CRIME_ACTIVITY' as const,
    conditionType: 'BARANGAY_INCREASE_PERCENT' as const,
    parameters: { surgeThresholdPercent: 35, minBarangayIncidents: 6 },
    severity: 'WARNING' as const,
    isEnabled: true,
  },
  {
    ruleKey: 'RULE_HEINOUS_CRIME_ALERT',
    name: 'Heinous, Sensational & Threat-Group Detection',
    description: 'Instantly alerts officers when violent, heinous, sensational, threat-group, or official-involved incidents are processed.',
    category: 'CRIME_ACTIVITY' as const,
    conditionType: 'HEINOUS_CRIME_DETECTED' as const,
    parameters: { triggersOnHeinous: true, triggersOnSensational: true, triggersOnThreatGroup: true, triggersOnEGO: true },
    severity: 'CRITICAL' as const,
    isEnabled: true,
  },
  {
    ruleKey: 'RULE_OFFENSE_CLUSTER_SPIKE',
    name: 'High-Impact Offense Frequency Spike',
    description: 'Monitors when priority crime categories (e.g. Theft, Robbery, Drugs) exceed safety tolerance thresholds in the imported dataset.',
    category: 'CRIME_ACTIVITY' as const,
    conditionType: 'SPECIFIC_CRIME_THRESHOLD' as const,
    parameters: { targetCrimeTypes: ['Theft', 'Robbery', 'Drug Related', 'Physical Injury'], thresholdCount: 15 },
    severity: 'WARNING' as const,
    isEnabled: true,
  },
];

export async function seedNotificationRules() {
  console.log('🔔 Initializing default notification rules...');
  for (const rule of DEFAULT_NOTIFICATION_RULES) {
    await prisma.notificationRule.upsert({
      where: { ruleKey: rule.ruleKey },
      update: {
        name: rule.name,
        description: rule.description,
        category: rule.category,
        conditionType: rule.conditionType,
        severity: rule.severity,
      },
      create: rule,
    });
  }
  console.log('✅ Default notification rules seeded successfully');
}

if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('seed-notifications')) {
  seedNotificationRules()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
