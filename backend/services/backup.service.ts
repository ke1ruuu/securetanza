import * as XLSX from 'xlsx';
import { prisma } from '@/backend/lib/prisma';

export type BackupKind = 'crime_data' | 'report' | 'scheduled_export';

/** Row shape of the archive list — deliberately without `content`. */
export interface BackupSummary {
  id: string;
  kind: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  label: string | null;
  barangay: string | null;
  periodLabel: string | null;
  rowCount: number | null;
  createdBy: string;
  createdAt: Date;
}

const SUMMARY_FIELDS = {
  id: true,
  kind: true,
  fileName: true,
  mimeType: true,
  sizeBytes: true,
  label: true,
  barangay: true,
  periodLabel: true,
  rowCount: true,
  createdBy: true,
  createdAt: true,
} as const;

export const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function isoDate(value: Date | null | undefined): string {
  return value ? value.toISOString().split('T')[0] : '';
}

export interface CrimeDataFilters {
  barangay?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface CrimeDataSnapshot {
  buffer: Buffer;
  rowCount: number;
  periodLabel: string;
}

export class BackupService {
  /**
   * Build the workbook that backs up the register: every cleaned incident row, plus
   * the aggregates the dashboards are built from, so a restored file answers the same
   * questions the app does without needing the app.
   */
  static async buildCrimeDataWorkbook(filters: CrimeDataFilters = {}): Promise<CrimeDataSnapshot> {
    const where: {
      barangay?: { equals: string; mode: 'insensitive' };
      dateCommitted?: { gte?: Date; lte?: Date };
    } = {};

    if (filters.barangay) {
      where.barangay = { equals: filters.barangay, mode: 'insensitive' };
    }

    const from = filters.startDate ? new Date(filters.startDate) : null;
    const to = filters.endDate ? new Date(filters.endDate) : null;
    if ((from && !isNaN(from.getTime())) || (to && !isNaN(to.getTime()))) {
      where.dateCommitted = {};
      if (from && !isNaN(from.getTime())) where.dateCommitted.gte = from;
      if (to && !isNaN(to.getTime())) where.dateCommitted.lte = to;
    }

    const incidents = await prisma.crimeIncident.findMany({
      where,
      orderBy: { dateCommitted: 'desc' },
    });

    // ── Sheet 1: the register itself, one row per incident ──
    const incidentRows = incidents.map((incident) => ({
      'Blotter No': incident.blotterNo ?? '',
      'Date Encoded': isoDate(incident.dateEncoded),
      'Regional Office': incident.pro ?? '',
      'Provincial Office': incident.ppo ?? '',
      Station: incident.stn ?? '',
      Precinct: incident.pcp ?? '',
      Region: incident.region ?? '',
      Province: incident.province ?? '',
      Municipality: incident.municipal ?? '',
      Barangay: incident.barangay,
      Street: incident.street ?? '',
      'Type of Place': incident.typeOfPlace ?? '',
      'Date Reported': isoDate(incident.dateReported),
      'Time Reported': incident.timeReported,
      'Date Committed': isoDate(incident.dateCommitted),
      'Time Committed': incident.timeCommitted,
      'Incident Type': incident.incidentType,
      'Is Crime': incident.isCrime ? 'Yes' : 'No',
      'Mode of Reporting': incident.modeReporting ?? '',
      'Stage of Felony': incident.stageOfFelony ?? '',
      Offense: incident.offense ?? '',
      'Offense Type': incident.offenseType ?? '',
      Section: incident.section ?? '',
      Modus: incident.modus ?? '',
      'Suspect Motive': incident.suspectMotive ?? '',
      'Suspect Sub-Motive': incident.suspectSubMotive ?? '',
      Heinous: incident.heinous ? 'Yes' : 'No',
      Sensational: incident.sensational ? 'Yes' : 'No',
      'Threat Group': incident.threatGrp ? 'Yes' : 'No',
      'Group Affiliation': incident.grpAffiliation ?? '',
      MRS: incident.mrs ?? '',
      'Suspect Count': incident.suspectCount ?? '',
      'Suspect Arrested': incident.suspectArrested === null ? '' : incident.suspectArrested ? 'Yes' : 'No',
      'Victim Count': incident.victimCount ?? '',
      'Case Status': incident.caseStatus ?? '',
      Investigator: incident.investigator ?? '',
      'Head Investigator': incident.headInves ?? '',
      Latitude: incident.latitude ?? '',
      Longitude: incident.longitude ?? '',
    }));

    // ── Sheets 2-4: the aggregates the dashboards read ──
    const byBarangay = new Map<string, number>();
    const byType = new Map<string, number>();
    const byMonth = new Map<string, number[]>();

    for (const incident of incidents) {
      byBarangay.set(incident.barangay, (byBarangay.get(incident.barangay) ?? 0) + 1);
      byType.set(incident.incidentType, (byType.get(incident.incidentType) ?? 0) + 1);

      const months = byMonth.get(incident.incidentType) ?? new Array(12).fill(0);
      months[incident.dateCommitted.getMonth()] += 1;
      byMonth.set(incident.incidentType, months);
    }

    const total = incidents.length;
    const sortDesc = (a: [string, number], b: [string, number]) => b[1] - a[1];

    const barangayRows = [...byBarangay.entries()].sort(sortDesc).map(([barangay, count]) => ({
      Barangay: barangay,
      Incidents: count,
      'Share %': total > 0 ? Number(((count / total) * 100).toFixed(2)) : 0,
    }));

    const typeRows = [...byType.entries()].sort(sortDesc).map(([type, count]) => ({
      'Crime Type': type,
      Incidents: count,
      'Share %': total > 0 ? Number(((count / total) * 100).toFixed(2)) : 0,
    }));

    const matrixRows = [...byMonth.entries()]
      .sort((a, b) => b[1].reduce((x, y) => x + y, 0) - a[1].reduce((x, y) => x + y, 0))
      .map(([type, months]) => {
        const row: Record<string, string | number> = { 'Crime Type': type };
        MONTH_NAMES.forEach((name, index) => {
          row[name] = months[index];
        });
        row.Total = months.reduce((sum, value) => sum + value, 0);
        return row;
      });

    // ── Sheet 5: what this snapshot is ──
    const earliest = incidents.length ? incidents[incidents.length - 1].dateCommitted : null;
    const latest = incidents.length ? incidents[0].dateCommitted : null;
    const periodLabel =
      from || to
        ? `${from ? isoDate(from) : 'start'} to ${to ? isoDate(to) : 'today'}`
        : 'All records';

    const summaryRows = [
      { Field: 'Generated at', Value: new Date().toISOString() },
      { Field: 'Scope', Value: filters.barangay || 'All barangays' },
      { Field: 'Requested period', Value: periodLabel },
      { Field: 'Incidents captured', Value: total },
      { Field: 'Earliest incident', Value: isoDate(earliest) },
      { Field: 'Latest incident', Value: isoDate(latest) },
      { Field: 'Barangays represented', Value: byBarangay.size },
      { Field: 'Crime types represented', Value: byType.size },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(summaryRows), 'Summary');
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(incidentRows.length ? incidentRows : [{ Note: 'No incidents matched this scope' }]),
      'Incidents'
    );
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(barangayRows), 'By Barangay');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(typeRows), 'By Crime Type');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(matrixRows), 'Monthly Matrix');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer;

    return { buffer, rowCount: total, periodLabel };
  }

  static async list(kind?: string | null): Promise<BackupSummary[]> {
    return prisma.backup.findMany({
      where: kind ? { kind } : {},
      orderBy: { createdAt: 'desc' },
      select: SUMMARY_FIELDS,
    });
  }

  static async create(input: {
    kind: BackupKind;
    fileName: string;
    mimeType: string;
    content: Uint8Array;
    label?: string | null;
    barangay?: string | null;
    periodLabel?: string | null;
    rowCount?: number | null;
    createdBy: string;
  }): Promise<BackupSummary> {
    return prisma.backup.create({
      data: {
        kind: input.kind,
        fileName: input.fileName,
        mimeType: input.mimeType,
        sizeBytes: input.content.length,
        // Prisma's Bytes wants a plain Uint8Array, which a Buffer is not assignable to.
        content: new Uint8Array(input.content),
        label: input.label ?? null,
        barangay: input.barangay ?? null,
        periodLabel: input.periodLabel ?? null,
        rowCount: input.rowCount ?? null,
        createdBy: input.createdBy,
      },
      select: SUMMARY_FIELDS,
    });
  }

  /** Includes `content` — only for the download route. */
  static async getWithContent(id: string) {
    return prisma.backup.findUnique({ where: { id } });
  }

  static async remove(id: string): Promise<BackupSummary | null> {
    const existing = await prisma.backup.findUnique({ where: { id }, select: SUMMARY_FIELDS });
    if (!existing) return null;
    await prisma.backup.delete({ where: { id } });
    return existing;
  }
}
