import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/backend/lib/prisma'
import * as XLSX from 'xlsx'
import { mapGeoJsonToDb } from '@/backend/lib/barangay-mapper'
import { NotificationEngine, BatchRecordItem } from '@/backend/lib/notification-engine'
import { getSession } from '@/lib/auth'

// POST /api/crimes/upload - Upload Excel/CSV file with crime data
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session || (!session.permissions.includes('admin_operational_officer') && !session.permissions.includes('admin'))) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Administrative access required' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type (supports xlsx, xls, csv)
    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Please upload an Excel (.xlsx, .xls) or CSV file.' },
        { status: 400 }
      )
    }

    // Read Excel/CSV file
    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = XLSX.utils.sheet_to_json(firstSheet) as any[]

    if (jsonData.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Uploaded file is empty' },
        { status: 400 }
      )
    }

    console.log(`📊 Processing ${jsonData.length} rows from ${file.name}`)

    // Process and insert data
    const results = {
      total: jsonData.length,
      inserted: 0,
      skipped: 0,
      errors: [] as string[],
    }

    const insertedBatchRecords: BatchRecordItem[] = []

    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i]

      try {
        // Normalize column names (handle different casing and spacing)
        const normalizedRow: any = {}
        Object.keys(row).forEach(key => {
          const normalizedKey = key.toLowerCase().trim().replace(/\s+/g, '_')
          normalizedRow[normalizedKey] = row[key]
        })

        // Validate required fields
        if (!normalizedRow.barangay || !normalizedRow.date_reported || !normalizedRow.date_committed || !normalizedRow.incident_type) {
          results.skipped++
          results.errors.push(`Row ${i + 2}: Missing required fields (barangay, date_reported, date_committed, or incident_type)`)
          continue
        }

        // Map barangay name if needed
        const barangayName = mapGeoJsonToDb(normalizedRow.barangay)

        // Parse dates
        const dateReported = parseExcelDate(normalizedRow.date_reported)
        const dateCommitted = parseExcelDate(normalizedRow.date_committed)
        const dateEncoded = normalizedRow.date_encoded ? parseExcelDate(normalizedRow.date_encoded) : null

        if (!dateReported || !dateCommitted) {
          results.skipped++
          results.errors.push(`Row ${i + 2}: Invalid date format`)
          continue
        }

        // Parse time fields (ensure HH:MM:SS format)
        const timeReported = normalizeTime(normalizedRow.time_reported)
        const timeCommitted = normalizeTime(normalizedRow.time_committed)

        // Parse boolean fields
        const isCrime = parseBoolean(normalizedRow.iscime)
        const heinous = parseBoolean(normalizedRow.heinous)
        const sensational = parseBoolean(normalizedRow.sensational)
        const threatGrp = parseBoolean(normalizedRow.threat_grp)
        const suspectIsEGO = parseBoolean(normalizedRow.suspect_is_ego)
        const victimIsEGO = parseBoolean(normalizedRow.victim_is_ego)

        // Parse numeric fields
        const suspectCount = normalizedRow.suspect_count ? parseInt(normalizedRow.suspect_count) : null
        const victimCount = normalizedRow.victim_count ? parseInt(normalizedRow.victim_count) : null
        const latitude = normalizedRow.lat ? parseFloat(normalizedRow.lat) : null
        const longitude = normalizedRow.lng ? parseFloat(normalizedRow.lng) : null

        // Insert into database
        const createdIncident = await prisma.crimeIncident.create({
          data: {
            blotterNo: normalizedRow.blotter_no || null,
            dateEncoded: dateEncoded,
            pro: normalizedRow.police_regional_office || null,
            ppo: normalizedRow.police_provincial_office || null,
            stn: normalizedRow.station || null,
            pcp: normalizedRow.police_community_precinct || null,
            region: normalizedRow.region || null,
            province: normalizedRow.province || null,
            municipal: normalizedRow.municipality || null,
            barangay: barangayName,
            street: normalizedRow.street || null,
            typeOfPlace: normalizedRow.type_of_place || null,
            dateReported,
            timeReported,
            dateCommitted,
            timeCommitted,
            incidentType: normalizedRow.incident_type,
            isCrime,
            modeReporting: normalizedRow.mode_reporting || null,
            stageOfFelony: normalizedRow.stage_of_felony || null,
            offense: normalizedRow.offense || null,
            offenseType: normalizedRow.offense_type || null,
            section: normalizedRow.section || null,
            modus: normalizedRow.modus || null,
            suspectMotive: normalizedRow.suspect_motive || null,
            suspectSubMotive: normalizedRow.suspect_sub_motive || null,
            heinous,
            sensational,
            threatGrp,
            grpAffiliation: normalizedRow.grp_affiliation || null,
            incidentTypeThreatGrp: normalizedRow.incident_type_threat_grp || null,
            mrs: normalizedRow.mrs || null,
            suspectIsEGO,
            suspectEGOPosition: normalizedRow.suspect_ego_position || null,
            suspectEGOClass: normalizedRow.suspect_ego_class || null,
            suspectCount,
            victimIsEGO,
            victimEGOPosition: normalizedRow.victim_ego_position || null,
            victimEGOClass: normalizedRow.victim_ego_class || null,
            victimCount,
            caseStatus: normalizedRow.case_status || null,
            investigator: normalizedRow.investigator || null,
            headInves: normalizedRow.head_investigator || null,
            latitude,
            longitude,
          },
        })

        insertedBatchRecords.push({
          id: createdIncident.id,
          barangay: createdIncident.barangay,
          incidentType: createdIncident.incidentType,
          dateCommitted: createdIncident.dateCommitted,
          timeCommitted: createdIncident.timeCommitted,
          isCrime: createdIncident.isCrime,
          heinous: createdIncident.heinous,
          sensational: createdIncident.sensational,
          threatGrp: createdIncident.threatGrp,
          suspectIsEGO: createdIncident.suspectIsEGO,
          victimIsEGO: createdIncident.victimIsEGO,
          offense: createdIncident.offense,
          modus: createdIncident.modus,
        })

        results.inserted++
      } catch (error) {
        results.skipped++
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        results.errors.push(`Row ${i + 2}: ${errorMessage}`)
        console.error(`Error processing row ${i + 2}:`, error)
      }
    }

    console.log(`✅ Upload complete: ${results.inserted} inserted, ${results.skipped} skipped`)

    // 1. Record AuditLog
    const ip = request.headers.get('x-forwarded-for') || (request as any).ip || 'Unknown IP';
    const uploadLog = await prisma.auditLog.create({
      data: {
        action: 'Import',
        details: `Imported ${results.inserted} records from ${file.name}`,
        user: session?.fullName || session?.accountNumber || 'Operational Officer',
        resource: 'CrimeData',
        ip: ip,
        session: session?.accountNumber || 'Unknown',
        fileName: file.name,
        fileSize: file.size,
        recordsImported: results.inserted,
        outcome: results.inserted === 0 ? 'failed' : results.skipped > 0 ? 'partial' : 'success',
        errorMessage: results.errors.length > 0 ? results.errors.slice(0, 5).join('; ') : null,
      },
    })

    // 2. Trigger Post-Ingestion Notification Engine
    const generatedNotifsCount = await NotificationEngine.evaluateBatch({
      uploadLogId: uploadLog.id,
      fileName: file.name,
      totalRows: jsonData.length,
      insertedRecords: insertedBatchRecords,
      skippedRows: results.skipped,
      errors: results.errors,
    })

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${results.inserted} records. Generated ${generatedNotifsCount} analytical notification(s).`,
      data: results,
      uploadLogId: uploadLog.id,
      notificationsGenerated: generatedNotifsCount,
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to upload file' 
      },
      { status: 500 }
    )
  }
}

// Helper function to parse Excel date
function parseExcelDate(value: any): Date | null {
  if (!value) return null

  // If it's already a Date object
  if (value instanceof Date) {
    return value
  }

  // If it's an Excel serial number
  if (typeof value === 'number') {
    // Excel dates are days since 1900-01-01 (with a bug for 1900 being a leap year)
    const excelEpoch = new Date(1899, 11, 30)
    const date = new Date(excelEpoch.getTime() + value * 86400000)
    return date
  }

  // If it's a string, try to parse it
  if (typeof value === 'string') {
    const date = new Date(value)
    if (!isNaN(date.getTime())) {
      return date
    }
  }

  return null
}

// Helper function to normalize time to HH:MM:SS format
function normalizeTime(value: any): string {
  if (!value) return '00:00:00'

  // If it's already a string in correct format
  if (typeof value === 'string') {
    // Check if it matches HH:MM or HH:MM:SS
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(value)) {
      const parts = value.split(':')
      const hours = parts[0].padStart(2, '0')
      const minutes = parts[1].padStart(2, '0')
      const seconds = parts[2] ? parts[2].padStart(2, '0') : '00'
      return `${hours}:${minutes}:${seconds}`
    }
  }

  // If it's an Excel time (fraction of a day)
  if (typeof value === 'number' && value >= 0 && value < 1) {
    const totalSeconds = Math.round(value * 86400)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return '00:00:00'
}

// Helper function to parse boolean values
function parseBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim()
    return lower === 'yes' || lower === 'true' || lower === '1' || lower === 'y'
  }
  if (typeof value === 'number') return value === 1
  return false
}
