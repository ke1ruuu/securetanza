import 'dotenv/config'
import { prisma } from '../lib/prisma'
import * as XLSX from 'xlsx'
import * as fs from 'fs'

// Barangay names from Tanza, Cavite
const TANZA_BARANGAYS = [
  'Bagtas',
  'Biga', 
  'Bucal',
  'Buenavista',
  'Capipisa',
  'Daang Amaya I',
  'Daang Amaya II',
  'Daang Amaya III',
  'Gonzalez',
  'Halayhay',
  'Lambingan',
  'Mulawin',
  'Paradahan I',
  'Paradahan II',
  'Pob. I (Barangay I)',
  'Pob. II (Barangay II)',
  'Pob. III (Barangay III)',
  'Pob. IV (Barangay IV)',
  'Sahud-Ulan',
  'San Juan I',
  'San Juan II',
  'Santol',
  'Talisay',
  'Tres Cruses'
]

// Barangay name mapping from Excel to our database
const BARANGAY_NAME_MAP: { [key: string]: string } = {
  'BIWAS': 'Biga',
  'TRES CRUSES': 'Tres Cruses',
  'AMAYA I': 'Daang Amaya I',
  'AMAYA II': 'Daang Amaya II',
  'AMAYA III': 'Daang Amaya III',
  'DAANG AMAYA I': 'Daang Amaya I',
  'DAANG AMAYA II': 'Daang Amaya II',
  'DAANG AMAYA III': 'Daang Amaya III',
  'PUNTA I': 'Pob. I (Barangay I)',
  'PUNTA II': 'Pob. II (Barangay II)',
  'SAHUD ULAN': 'Sahud-Ulan',
  'HALAYHAY': 'Halayhay',
  'SANTOL': 'Santol',
  'PARADAHAN I': 'Paradahan I',
  'PARADAHAN II': 'Paradahan II',
  'TANAUAN': 'Talisay',
  'BUCAL': 'Bucal',
  'BAGTAS': 'Bagtas',
  'JULUGAN VIII': 'San Juan II',
  'LAMBINGAN': 'Lambingan',
  'BARANGAY I (POB.)': 'Pob. I (Barangay I)',
  'BARANGAY II (POB.)': 'Pob. II (Barangay II)',
  'BARANGAY III (POB.)': 'Pob. III (Barangay III)',
  'BARANGAY IV (POB.)': 'Pob. IV (Barangay IV)',
}

function normalizeBarangayName(name: string): string {
  const upperName = name.toUpperCase().trim()
  return BARANGAY_NAME_MAP[upperName] || name
}

function extractIncidentType(incidentType: string): string {
  // Remove "(Incident)" prefix if present
  return incidentType.replace(/^\(Incident\)\s*/i, '').trim()
}

function parseDateTime(dateStr: string, timeStr: string): Date {
  if (!dateStr || !timeStr) {
    throw new Error(`Invalid date/time: ${dateStr} ${timeStr}`)
  }
  return new Date(`${dateStr}T${timeStr}`)
}

function readExcelFile(filePath: string): any[] {
  try {
    console.log(`📖 Reading Excel file: ${filePath}`)
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`Excel file not found: ${filePath}`)
    }

    // Read the Excel file
    const workbook = XLSX.readFile(filePath)
    const sheetName = workbook.SheetNames[0] // Get first sheet
    const worksheet = workbook.Sheets[sheetName]
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet)
    
    console.log(`📊 Found ${jsonData.length} rows in Excel file`)
    return jsonData
    
  } catch (error) {
    console.error('❌ Error reading Excel file:', error)
    throw error
  }
}

function processExcelRow(row: any): any {
  try {
    // Map Excel columns to our database fields
    return {
      ppo: row.ppo || '',
      stn: row.stn || '',
      pcp: row.pcp || '',
      region: row.region || '',
      province: row.province || '',
      municipal: row.municipal || '',
      barangay: normalizeBarangayName(row.barangay || ''),
      street: row.street || '',
      typeOfPlace: row.typeofPlace || '',
      dateReported: row.dateReported,
      timeReported: row.timeReported,
      dateCommitted: row.dateCommitted,
      timeCommitted: row.timeCommitted,
      incidentType: extractIncidentType(row.incidentType || ''),
      isCrime: (row.iscime || '').toUpperCase() === 'YES',
      modeReporting: row.mode_reporting || '',
      stageOfFelony: row.stageoffelony || '',
      offense: row.offense || '',
      offenseType: row.offenseType || '',
      section: row.section || '',
      modus: row.modus || '',
      suspectMotive: row.suspectMotive || '',
      latitude: parseFloat(row.lat) || null,
      longitude: parseFloat(row.lng) || null,
    }
  } catch (error) {
    console.error('❌ Error processing row:', row, error)
    throw error
  }
}

async function main() {
  console.log('🌱 Starting database seed from Excel file...')

  try {
    // Look for Excel file in the project root or data directory
    const possiblePaths = [
      'PROJECT-MAPPING.xlsx',
      'data/PROJECT-MAPPING.xlsx',
      'backend/data/PROJECT-MAPPING.xlsx',
      '../PROJECT-MAPPING.xlsx'
    ]

    let excelFilePath = ''
    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        excelFilePath = filePath
        break
      }
    }

    if (!excelFilePath) {
      console.error('❌ Excel file not found. Please place PROJECT-MAPPING.xlsx in one of these locations:')
      possiblePaths.forEach(p => console.log(`   - ${p}`))
      process.exit(1)
    }

    // Read Excel data
    const excelData = readExcelFile(excelFilePath)
    
    if (excelData.length === 0) {
      console.log('⚠️ No data found in Excel file')
      return
    }

    // Clear existing data
    console.log('🗑️ Clearing existing data...')
    await prisma.crimeIncident.deleteMany()
    await prisma.barangay.deleteMany()

    // Create barangays
    console.log('📍 Creating barangays...')
    for (const barangayName of TANZA_BARANGAYS) {
      await prisma.barangay.create({
        data: {
          name: barangayName,
          population: Math.floor(Math.random() * 5000) + 1000,
          area: Math.random() * 10 + 1,
        }
      })
    }

    // Process and create crime incidents
    console.log('🚨 Processing and creating crime incidents from Excel...')
    
    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < excelData.length; i++) {
      try {
        const row = excelData[i]
        const processedData = processExcelRow(row)
        
        // Skip rows with missing required data
        if (!processedData.barangay || !processedData.dateReported || !processedData.dateCommitted) {
          console.log(`⚠️ Skipping row ${i + 1}: Missing required data`)
          continue
        }

        await prisma.crimeIncident.create({
          data: {
            ppo: processedData.ppo,
            stn: processedData.stn,
            pcp: processedData.pcp || null,
            region: processedData.region,
            province: processedData.province,
            municipal: processedData.municipal,
            barangay: processedData.barangay,
            street: processedData.street || null,
            typeOfPlace: processedData.typeOfPlace,
            dateReported: parseDateTime(processedData.dateReported, processedData.timeReported),
            timeReported: processedData.timeReported,
            dateCommitted: parseDateTime(processedData.dateCommitted, processedData.timeCommitted),
            timeCommitted: processedData.timeCommitted,
            incidentType: processedData.incidentType,
            isCrime: processedData.isCrime,
            modeReporting: processedData.modeReporting,
            stageOfFelony: processedData.stageOfFelony,
            offense: processedData.offense,
            offenseType: processedData.offenseType,
            section: processedData.section || null,
            modus: processedData.modus,
            suspectMotive: processedData.suspectMotive || null,
            latitude: processedData.latitude,
            longitude: processedData.longitude,
          }
        })
        
        successCount++
        
      } catch (error) {
        errorCount++
        console.error(`❌ Error processing row ${i + 1}:`, error)
      }
    }

    console.log('✅ Database seeded successfully!')
    console.log(`📊 Created ${TANZA_BARANGAYS.length} barangays`)
    console.log(`🚨 Successfully imported ${successCount} crime incidents`)
    if (errorCount > 0) {
      console.log(`⚠️ Failed to import ${errorCount} rows`)
    }
    
    // Get statistics
    const totalCrimes = await prisma.crimeIncident.count()
    const crimesByType = await prisma.crimeIncident.groupBy({
      by: ['incidentType'],
      _count: {
        incidentType: true
      }
    })
    
    console.log(`📈 Total crimes in database: ${totalCrimes}`)
    console.log('📊 Crimes by type:')
    crimesByType.forEach(crime => {
      console.log(`   ${crime.incidentType}: ${crime._count.incidentType}`)
    })

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error('💥 Seed failed:', e)
    process.exit(1)
  })