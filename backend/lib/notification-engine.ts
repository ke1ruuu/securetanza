import { prisma } from './prisma';

export interface BatchRecordItem {
  id: string;
  barangay: string;
  incidentType: string;
  dateCommitted: Date;
  timeCommitted: string;
  isCrime: boolean;
  heinous?: boolean;
  sensational?: boolean;
  threatGrp?: boolean;
  suspectIsEGO?: boolean;
  victimIsEGO?: boolean;
  offense?: string | null;
  modus?: string | null;
}

export interface IngestionBatchSummary {
  uploadLogId?: string;
  fileName: string;
  totalRows: number;
  insertedRecords: BatchRecordItem[];
  skippedRows: number;
  errors: string[];
}

export interface GeneratedNotificationPayload {
  title: string;
  message: string;
  category: 'PEAK_HOUR' | 'CRIME_ACTIVITY' | 'DATASET_PROCESSING' | 'SYSTEM';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  uploadLogId?: string;
  metadata?: Record<string, any>;
}

export class NotificationEngine {
  /**
   * Helper: extract dataset year and date span from batch records
   */
  private static extractDatasetTimeframe(records: BatchRecordItem[]): { yearStr: string; dateSpan: string; primaryYear?: number } {
    const dates = records
      .map((r) => new Date(r.dateCommitted).getTime())
      .filter((t) => !isNaN(t));

    if (dates.length === 0) {
      const currentYear = new Date().getFullYear().toString();
      return { yearStr: currentYear, dateSpan: currentYear, primaryYear: new Date().getFullYear() };
    }

    const minD = new Date(Math.min(...dates));
    const maxD = new Date(Math.max(...dates));
    const minYear = minD.getFullYear();
    const maxYear = maxD.getFullYear();

    const minMonthYear = minD.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const maxMonthYear = maxD.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    const yearStr = minYear === maxYear ? `${minYear}` : `${minYear}–${maxYear}`;
    const dateSpan = minMonthYear === maxMonthYear ? minMonthYear : `${minMonthYear} – ${maxMonthYear}`;

    return { yearStr, dateSpan, primaryYear: maxYear };
  }

  /**
   * Main entry point: evaluate analytical conditions on a newly ingested dataset batch
   */
  static async evaluateBatch(summary: IngestionBatchSummary): Promise<number> {
    try {
      console.log(`🔔 Notification Engine: Evaluating rules for batch "${summary.fileName}" (${summary.insertedRecords.length} records)`);

      // 1. Fetch active rules
      const rules = await prisma.notificationRule.findMany({
        where: { isEnabled: true },
      });

      const rulesMap = new Map(rules.map((r) => [r.ruleKey, r]));
      const generatedNotifications: GeneratedNotificationPayload[] = [];

      // 2. Evaluate Submodule 4: Dataset Processing Notifications
      const datasetNotifs = this.evaluateDatasetProcessing(summary, rulesMap.get('RULE_DATASET_INGESTION_STATUS'));
      generatedNotifications.push(...datasetNotifs);

      // If no records were successfully inserted, skip crime analytics
      if (summary.insertedRecords.length === 0) {
        await this.persistNotifications(generatedNotifications, summary.uploadLogId);
        return generatedNotifications.length;
      }

      // 3. Evaluate Submodule 2: Peak Hour Crime Notifications
      const peakHourRule = rulesMap.get('RULE_PEAK_HOUR_SURGE');
      if (peakHourRule?.isEnabled) {
        const peakNotif = this.evaluatePeakHourSpikes(summary.insertedRecords, peakHourRule);
        if (peakNotif) generatedNotifications.push(peakNotif);
      }

      // 4. Evaluate Submodule 3A: Heinous, Sensational & Threat Group Detection
      const heinousRule = rulesMap.get('RULE_HEINOUS_CRIME_ALERT');
      if (heinousRule?.isEnabled) {
        const heinousNotif = this.evaluateHighRiskCrimes(summary.insertedRecords, heinousRule);
        if (heinousNotif) generatedNotifications.push(heinousNotif);
      }

      // 5. Evaluate Submodule 3B: Barangay Volume Surge
      const barangaySurgeRule = rulesMap.get('RULE_BARANGAY_VOLUME_SURGE');
      if (barangaySurgeRule?.isEnabled) {
        const barangayNotifs = await this.evaluateBarangaySurges(summary.insertedRecords, barangaySurgeRule);
        generatedNotifications.push(...barangayNotifs);
      }

      // 6. Evaluate Submodule 3C: Specific Crime Category Spike
      const crimeSpikeRule = rulesMap.get('RULE_OFFENSE_CLUSTER_SPIKE');
      if (crimeSpikeRule?.isEnabled) {
        const crimeSpikeNotifs = this.evaluateCrimeTypeSpikes(summary.insertedRecords, crimeSpikeRule);
        generatedNotifications.push(...crimeSpikeNotifs);
      }

      // 7. Persist all generated notifications
      await this.persistNotifications(generatedNotifications, summary.uploadLogId);

      console.log(`✅ Notification Engine: Generated ${generatedNotifications.length} notifications for batch.`);
      return generatedNotifications.length;
    } catch (error) {
      console.error('❌ Error evaluating notification rules:', error);
      return 0;
    }
  }

  /**
   * Submodule 4: Dataset Processing Evaluation
   */
  private static evaluateDatasetProcessing(
    summary: IngestionBatchSummary,
    ruleConfig?: { severity: 'INFO' | 'WARNING' | 'CRITICAL'; parameters: any }
  ): GeneratedNotificationPayload[] {
    const notifs: GeneratedNotificationPayload[] = [];
    const { fileName, totalRows, insertedRecords, skippedRows, errors } = summary;
    const timeframe = this.extractDatasetTimeframe(insertedRecords);

    if (insertedRecords.length === 0 && totalRows > 0) {
      // Ingestion failed completely
      notifs.push({
        title: 'Dataset Ingestion Failed',
        message: `Failed to process uploaded file "${fileName}". None of the ${totalRows} rows could be imported. Please verify column formatting.`,
        category: 'DATASET_PROCESSING',
        severity: 'CRITICAL',
        metadata: {
          fileName,
          totalRows,
          skippedRows,
          errorSummary: errors.slice(0, 5),
          targetUrl: '/dashboard/config',
        },
      });
    } else if (skippedRows > 0) {
      // Partial ingestion with skipped rows/errors
      const errorRate = Math.round((skippedRows / totalRows) * 100);
      notifs.push({
        title: `Dataset Imported with Warnings (${timeframe.yearStr})`,
        message: `Dataset "${fileName}" for year ${timeframe.yearStr} (${timeframe.dateSpan}) processed: ${insertedRecords.length} records imported successfully, but ${skippedRows} rows (${errorRate}%) were skipped due to formatting discrepancies.`,
        category: 'DATASET_PROCESSING',
        severity: 'WARNING',
        metadata: {
          fileName,
          datasetYear: timeframe.yearStr,
          dateSpan: timeframe.dateSpan,
          totalRows,
          insertedCount: insertedRecords.length,
          skippedRows,
          errorRate,
          sampleErrors: errors.slice(0, 3),
          targetUrl: '/dashboard/upload-logs',
        },
      });
    } else if (insertedRecords.length > 0) {
      const uniqueBarangays = new Set(insertedRecords.map((r) => r.barangay)).size;

      notifs.push({
        title: `Dataset Ingested & Analyzed (${timeframe.yearStr})`,
        message: `Successfully processed "${fileName}" (${timeframe.yearStr} dataset). Imported ${insertedRecords.length} crime incident records across ${uniqueBarangays} barangays (${timeframe.dateSpan}). Analytical patterns evaluated.`,
        category: 'DATASET_PROCESSING',
        severity: ruleConfig?.severity || 'INFO',
        metadata: {
          fileName,
          datasetYear: timeframe.yearStr,
          dateSpan: timeframe.dateSpan,
          insertedCount: insertedRecords.length,
          barangayCoverageCount: uniqueBarangays,
          targetUrl: '/dashboard/overview',
        },
      });
    }

    return notifs;
  }

  /**
   * Submodule 2: Peak Hour Crime Density Evaluation
   */
  private static evaluatePeakHourSpikes(
    records: BatchRecordItem[],
    rule: { severity: 'INFO' | 'WARNING' | 'CRITICAL'; parameters: any }
  ): GeneratedNotificationPayload | null {
    const params = (rule.parameters || {}) as {
      windowSpanHours?: number;
      densityThresholdPercent?: number;
      minBatchSize?: number;
    };

    const minBatchSize = params.minBatchSize ?? 10;
    if (records.length < minBatchSize) return null;

    const windowSpan = params.windowSpanHours ?? 3;
    const densityThreshold = params.densityThresholdPercent ?? 30;
    const timeframe = this.extractDatasetTimeframe(records);

    // 1. Bin records by hour (0 - 23)
    const hourlyCounts = new Array(24).fill(0);
    const hourlyRecords: BatchRecordItem[][] = Array.from({ length: 24 }, () => []);

    for (const r of records) {
      if (!r.timeCommitted) continue;
      const hourPart = parseInt(r.timeCommitted.split(':')[0], 10);
      if (!isNaN(hourPart) && hourPart >= 0 && hourPart < 24) {
        hourlyCounts[hourPart]++;
        hourlyRecords[hourPart].push(r);
      }
    }

    // 2. Sliding window to find max concentration
    let maxWindowCount = 0;
    let peakStartHour = 0;

    for (let h = 0; h < 24; h++) {
      let windowSum = 0;
      for (let w = 0; w < windowSpan; w++) {
        const hourIndex = (h + w) % 24;
        windowSum += hourlyCounts[hourIndex];
      }

      if (windowSum > maxWindowCount) {
        maxWindowCount = windowSum;
        peakStartHour = h;
      }
    }

    const peakDensityPercent = Math.round((maxWindowCount / records.length) * 100);

    if (peakDensityPercent >= densityThreshold) {
      const peakEndHour = (peakStartHour + windowSpan) % 24;
      const startStr = `${peakStartHour.toString().padStart(2, '0')}:00`;
      const endStr = `${peakEndHour.toString().padStart(2, '0')}:00`;

      // Collect records inside the peak window
      const peakRecords: BatchRecordItem[] = [];
      for (let w = 0; w < windowSpan; w++) {
        const h = (peakStartHour + w) % 24;
        peakRecords.push(...hourlyRecords[h]);
      }

      // Determine top crime type in this window
      const typeCounts: Record<string, number> = {};
      const barangayCounts: Record<string, number> = {};

      for (const pr of peakRecords) {
        typeCounts[pr.incidentType] = (typeCounts[pr.incidentType] || 0) + 1;
        barangayCounts[pr.barangay] = (barangayCounts[pr.barangay] || 0) + 1;
      }

      const topCrimeType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Incidents';
      const topBarangay = Object.entries(barangayCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Municipality-wide';

      return {
        title: `Peak Hour Anomaly (${startStr} – ${endStr}) [${timeframe.yearStr}]`,
        message: `Analytical evaluation of newly processed dataset for ${timeframe.yearStr} (${timeframe.dateSpan}) identified an acute temporal peak: ${peakDensityPercent}% (${maxWindowCount} incidents) occurred between ${startStr} and ${endStr}. Primary offense: ${topCrimeType}, with highest incidence in ${topBarangay}.`,
        category: 'PEAK_HOUR',
        severity: rule.severity || 'WARNING',
        metadata: {
          datasetYear: timeframe.yearStr,
          dateSpan: timeframe.dateSpan,
          peakWindow: `${startStr} - ${endStr}`,
          densityPercent: peakDensityPercent,
          incidentCount: maxWindowCount,
          primaryCrime: topCrimeType,
          topBarangay,
          targetUrl: '/dashboard/analytics',
        },
      };
    }

    return null;
  }

  /**
   * Submodule 3A: Heinous, Sensational & Threat Group Detection
   */
  private static evaluateHighRiskCrimes(
    records: BatchRecordItem[],
    rule: { severity: 'INFO' | 'WARNING' | 'CRITICAL'; parameters: any }
  ): GeneratedNotificationPayload | null {
    const highRiskRecords = records.filter(
      (r) => r.heinous || r.sensational || r.threatGrp || r.suspectIsEGO || r.victimIsEGO
    );

    if (highRiskRecords.length === 0) return null;

    const timeframe = this.extractDatasetTimeframe(records);
    const heinousCount = highRiskRecords.filter((r) => r.heinous).length;
    const sensationalCount = highRiskRecords.filter((r) => r.sensational).length;
    const threatGrpCount = highRiskRecords.filter((r) => r.threatGrp).length;
    const egoCount = highRiskRecords.filter((r) => r.suspectIsEGO || r.victimIsEGO).length;

    const affectedBarangays = Array.from(new Set(highRiskRecords.map((r) => r.barangay))).slice(0, 3);
    const barangayStr = affectedBarangays.join(', ') + (affectedBarangays.length > 3 ? ' and other barangays' : '');

    const details: string[] = [];
    if (heinousCount > 0) details.push(`${heinousCount} Heinous`);
    if (sensationalCount > 0) details.push(`${sensationalCount} Sensational`);
    if (threatGrpCount > 0) details.push(`${threatGrpCount} Threat-Group related`);
    if (egoCount > 0) details.push(`${egoCount} Official-involved`);

    return {
      title: `Critical Incident Alert: ${highRiskRecords.length} High-Risk Crime${highRiskRecords.length > 1 ? 's' : ''} (${timeframe.yearStr})`,
      message: `The newly imported ${timeframe.yearStr} dataset contains ${highRiskRecords.length} high-priority crime incident(s) (${details.join(', ')}) committed in ${timeframe.dateSpan}. Affected areas include ${barangayStr}. Immediate operational review is advised.`,
      category: 'CRIME_ACTIVITY',
      severity: rule.severity || 'CRITICAL',
      metadata: {
        datasetYear: timeframe.yearStr,
        dateSpan: timeframe.dateSpan,
        totalHighRisk: highRiskRecords.length,
        heinousCount,
        sensationalCount,
        threatGrpCount,
        egoCount,
        affectedBarangays,
        targetUrl: '/dashboard/cases?heinous=true',
      },
    };
  }

  /**
   * Submodule 3B: Barangay Crime Volume Surge Evaluation
   */
  private static async evaluateBarangaySurges(
    records: BatchRecordItem[],
    rule: { severity: 'INFO' | 'WARNING' | 'CRITICAL'; parameters: any }
  ): Promise<GeneratedNotificationPayload[]> {
    const notifs: GeneratedNotificationPayload[] = [];
    const params = (rule.parameters || {}) as {
      surgeThresholdPercent?: number;
      minBarangayIncidents?: number;
    };

    const surgeThreshold = params.surgeThresholdPercent ?? 35;
    const minIncidents = params.minBarangayIncidents ?? 6;
    const timeframe = this.extractDatasetTimeframe(records);

    // Count batch records per barangay
    const batchBarangayCounts: Record<string, number> = {};
    for (const r of records) {
      if (r.barangay) {
        batchBarangayCounts[r.barangay] = (batchBarangayCounts[r.barangay] || 0) + 1;
      }
    }

    // Compare with overall historical distribution average per barangay
    const allBarangays = Object.keys(batchBarangayCounts);
    if (allBarangays.length === 0) return notifs;

    const totalBatchCrimes = records.length;
    const avgPerBarangayInBatch = totalBatchCrimes / Math.max(allBarangays.length, 1);

    // Identify barangays exceeding threshold concentration
    for (const [barangay, count] of Object.entries(batchBarangayCounts)) {
      if (count >= minIncidents && count >= avgPerBarangayInBatch * (1 + surgeThreshold / 100)) {
        // Calculate percentage share of batch
        const sharePercent = Math.round((count / totalBatchCrimes) * 100);

        // Find primary crime in this barangay
        const barangayRecords = records.filter((r) => r.barangay === barangay);
        const crimeTypeMap: Record<string, number> = {};
        for (const br of barangayRecords) {
          crimeTypeMap[br.incidentType] = (crimeTypeMap[br.incidentType] || 0) + 1;
        }
        const dominantCrime = Object.entries(crimeTypeMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Crime';

        notifs.push({
          title: `Barangay Activity Surge: ${barangay} (${timeframe.yearStr})`,
          message: `In the ${timeframe.yearStr} dataset (${timeframe.dateSpan}), ${barangay} accounts for ${count} incidents (${sharePercent}% of total uploaded records), indicating an elevated crime concentration. Leading category: ${dominantCrime} (${crimeTypeMap[dominantCrime]} cases).`,
          category: 'CRIME_ACTIVITY',
          severity: rule.severity || 'WARNING',
          metadata: {
            datasetYear: timeframe.yearStr,
            dateSpan: timeframe.dateSpan,
            barangay,
            incidentCount: count,
            sharePercent,
            dominantCrime,
            targetUrl: `/dashboard/cases?name=${encodeURIComponent(barangay)}`,
          },
        });
      }
    }

    // Cap at top 2 barangay surge notifications per batch to prevent alert fatigue
    return notifs.slice(0, 2);
  }

  /**
   * Submodule 3C: Specific Crime Category Frequency Spikes
   */
  private static evaluateCrimeTypeSpikes(
    records: BatchRecordItem[],
    rule: { severity: 'INFO' | 'WARNING' | 'CRITICAL'; parameters: any }
  ): GeneratedNotificationPayload[] {
    const notifs: GeneratedNotificationPayload[] = [];
    const params = (rule.parameters || {}) as {
      targetCrimeTypes?: string[];
      thresholdCount?: number;
    };

    const targetTypes = params.targetCrimeTypes || ['Theft', 'Robbery', 'Drug Related', 'Physical Injury'];
    const threshold = params.thresholdCount ?? 15;
    const timeframe = this.extractDatasetTimeframe(records);

    const crimeCounts: Record<string, number> = {};
    for (const r of records) {
      if (r.incidentType) {
        crimeCounts[r.incidentType] = (crimeCounts[r.incidentType] || 0) + 1;
      }
    }

    for (const targetType of targetTypes) {
      const count = crimeCounts[targetType] || 0;
      if (count >= threshold) {
        const topBarangays = records
          .filter((r) => r.incidentType === targetType)
          .map((r) => r.barangay);

        const bCounts: Record<string, number> = {};
        for (const b of topBarangays) bCounts[b] = (bCounts[b] || 0) + 1;
        const leadingBarangay = Object.entries(bCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Various';

        notifs.push({
          title: `High Frequency Spike: ${targetType} (${count} Cases, ${timeframe.yearStr})`,
          message: `The imported ${timeframe.yearStr} dataset shows ${count} cases of ${targetType} (${timeframe.dateSpan}), exceeding the operational threshold of ${threshold}. Highest frequency reported in ${leadingBarangay}.`,
          category: 'CRIME_ACTIVITY',
          severity: rule.severity || 'WARNING',
          metadata: {
            datasetYear: timeframe.yearStr,
            dateSpan: timeframe.dateSpan,
            crimeType: targetType,
            incidentCount: count,
            threshold,
            leadingBarangay,
            targetUrl: `/dashboard/analytics?crime=${encodeURIComponent(targetType)}`,
          },
        });
      }
    }

    return notifs;
  }

  /**
   * Persist generated notifications to database
   */
  private static async persistNotifications(
    notifications: GeneratedNotificationPayload[],
    uploadLogId?: string
  ): Promise<void> {
    if (notifications.length === 0) return;

    for (const notif of notifications) {
      await prisma.notification.create({
        data: {
          title: notif.title,
          message: notif.message,
          category: notif.category,
          severity: notif.severity,
          uploadLogId: uploadLogId || null,
          metadata: notif.metadata || {},
        },
      });
    }
  }
}
