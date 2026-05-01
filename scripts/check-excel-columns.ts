import * as XLSX from 'xlsx';
import * as fs from 'fs';

const excelFilePath = 'public/incidentrep_20160100448_2026-01-01-2026-04-15.xlsx';

console.log('📖 Reading Excel file:', excelFilePath);

if (!fs.existsSync(excelFilePath)) {
  console.error('❌ Excel file not found:', excelFilePath);
  process.exit(1);
}

// Read the Excel file
const workbook = XLSX.readFile(excelFilePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Get the range of the worksheet
const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');

// Extract column headers (first row)
const headers: string[] = [];
for (let col = range.s.c; col <= range.e.c; col++) {
  const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
  const cell = worksheet[cellAddress];
  if (cell && cell.v) {
    headers.push(String(cell.v));
  }
}

console.log('\n📊 Excel Columns Found:');
console.log('='.repeat(50));
headers.forEach((header, index) => {
  console.log(`${index + 1}. ${header}`);
});

console.log('\n📈 Total columns:', headers.length);

// Read a sample row to see data types
console.log('\n📋 Sample Data (First Row):');
console.log('='.repeat(50));
const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });
if (jsonData.length > 0) {
  const firstRow = jsonData[0] as any;
  headers.forEach(header => {
    const value = firstRow[header];
    const type = value === null ? 'null' : typeof value;
    console.log(`${header}: ${JSON.stringify(value)} (${type})`);
  });
}

console.log('\n✅ Done!');
