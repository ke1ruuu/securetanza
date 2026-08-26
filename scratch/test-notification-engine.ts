import { NotificationEngine, BatchRecordItem } from '../backend/lib/notification-engine';
import { prisma } from '../backend/lib/prisma';

async function testEngine() {
  console.log('🧪 Testing Notification Engine with simulated bulk upload dataset...');

  // Sample batch with peak hour concentration in Daang Amaya 2 between 21:00 and 23:00
  const sampleRecords: BatchRecordItem[] = [
    {
      id: 'test-1',
      barangay: 'DAANG AMAYA 2',
      incidentType: 'Theft',
      dateCommitted: new Date('2025-08-10'),
      timeCommitted: '21:30:00',
      isCrime: true,
      heinous: false,
    },
    {
      id: 'test-2',
      barangay: 'DAANG AMAYA 2',
      incidentType: 'Theft',
      dateCommitted: new Date('2025-08-11'),
      timeCommitted: '22:15:00',
      isCrime: true,
      heinous: false,
    },
    {
      id: 'test-3',
      barangay: 'DAANG AMAYA 2',
      incidentType: 'Robbery',
      dateCommitted: new Date('2025-08-12'),
      timeCommitted: '22:45:00',
      isCrime: true,
      heinous: true, // Heinous incident
      offense: 'Armed Robbery with Violence',
    },
    {
      id: 'test-4',
      barangay: 'DAANG AMAYA 2',
      incidentType: 'Theft',
      dateCommitted: new Date('2025-08-13'),
      timeCommitted: '21:10:00',
      isCrime: true,
      heinous: false,
    },
    {
      id: 'test-5',
      barangay: 'DAANG AMAYA 2',
      incidentType: 'Theft',
      dateCommitted: new Date('2025-08-14'),
      timeCommitted: '22:00:00',
      isCrime: true,
      heinous: false,
    },
    {
      id: 'test-6',
      barangay: 'DAANG AMAYA 2',
      incidentType: 'Theft',
      dateCommitted: new Date('2025-08-15'),
      timeCommitted: '23:00:00',
      isCrime: true,
      heinous: false,
    },
    {
      id: 'test-7',
      barangay: 'DAANG AMAYA 2',
      incidentType: 'Physical Injury',
      dateCommitted: new Date('2025-08-16'),
      timeCommitted: '22:30:00',
      isCrime: true,
      heinous: false,
    },
    {
      id: 'test-8',
      barangay: 'POBLACION 1',
      incidentType: 'Theft',
      dateCommitted: new Date('2025-08-10'),
      timeCommitted: '10:00:00',
      isCrime: true,
      heinous: false,
    },
    {
      id: 'test-9',
      barangay: 'POBLACION 1',
      incidentType: 'Theft',
      dateCommitted: new Date('2025-08-11'),
      timeCommitted: '14:00:00',
      isCrime: true,
      heinous: false,
    },
    {
      id: 'test-10',
      barangay: 'POBLACION 2',
      incidentType: 'Theft',
      dateCommitted: new Date('2025-08-12'),
      timeCommitted: '15:00:00',
      isCrime: true,
      heinous: false,
    },
    {
      id: 'test-11',
      barangay: 'JULUGAN 1',
      incidentType: 'Theft',
      dateCommitted: new Date('2025-08-13'),
      timeCommitted: '16:00:00',
      isCrime: true,
      heinous: false,
    },
    {
      id: 'test-12',
      barangay: 'JULUGAN 2',
      incidentType: 'Theft',
      dateCommitted: new Date('2025-08-14'),
      timeCommitted: '18:00:00',
      isCrime: true,
      heinous: false,
    },
  ];

  const generatedCount = await NotificationEngine.evaluateBatch({
    fileName: 'PNP_Blotter_Dataset_Q3_2025.xlsx',
    totalRows: 12,
    insertedRecords: sampleRecords,
    skippedRows: 0,
    errors: [],
  });

  console.log(`Generated ${generatedCount} notifications in test.`);

  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  console.log('Recent notifications created:');
  notifications.forEach((n) => {
    console.log(`[${n.severity}] [${n.category}] ${n.title}`);
    console.log(`  ${n.message}`);
    console.log(`  Metadata:`, n.metadata);
  });
}

testEngine()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
