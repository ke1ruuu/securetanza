import { PrismaClient } from '../lib/generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { hash } from 'bcryptjs';

// Initialize Prisma client with adapter
const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL or DIRECT_URL environment variable is required');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Cleaning up existing authentication data...');
  
  // Clear existing data in reverse order of dependencies
  await prisma.userPermission.deleteMany();
  await prisma.user.deleteMany();
  await prisma.permission.deleteMany();

  console.log('🌱 Seeding authentication data...');

  // 1. Create Granular Permissions
  const permissionsData = [
    { name: 'admin_operational_officer', desc: 'Full administrative and operational control over the system.' },
    { name: 'privileged_map_view', desc: 'Authorized to view and interact with the Interactive Tanza Map and analytics.' },
    { name: 'privileged_analytics_view', desc: 'Access to analytics dashboards, visualizations, and trend analysis.' },
    { name: 'privileged_cases_view', desc: 'Access to the Cases Dashboard for searching and filtering records.' },
  ];

  const createdPermissions: Record<string, any> = {};
  for (const p of permissionsData) {
    const perm = await prisma.permission.create({
      data: { 
        permissionName: p.name, 
        description: p.desc 
      },
    });
    createdPermissions[p.name] = perm;
  }

  console.log('✅ Permissions initialized');

  // 2. Create main admin accounts
  const adminPasswordHash = await hash('admin123', 10);
  
  const admins = [
    { accountNumber: 'ACC-000001', fullName: 'Administrator 1' },
    { accountNumber: 'ACC-000002', fullName: 'Administrator 2' },
  ];

  for (const admin of admins) {
    const user = await prisma.user.create({
      data: {
        accountNumber: admin.accountNumber,
        fullName: admin.fullName,
        passwordHash: adminPasswordHash,
      },
    });

    await prisma.userPermission.create({
      data: {
        userId: user.id,
        permissionId: createdPermissions['admin_operational_officer'].id,
      },
    });
  }

  console.log('✅ Admin accounts created (admin1, admin2)');

  console.log('\n🎉 Authentication seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
