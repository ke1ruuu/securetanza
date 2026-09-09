import { PrismaClient } from './generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pgPool: Pool | undefined
}

function getOrCreatePool(): Pool {
  if (globalForPrisma.pgPool) {
    return globalForPrisma.pgPool
  }

  let connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    try {
      // Fallback for standalone scripts/workers running outside Next.js runtime
      const { config } = require('dotenv')
      config({ path: '.env.local' })
      config({ path: '.env' })
      connectionString = process.env.DATABASE_URL
    } catch {}
  }

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  const pool = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  })

  pool.on('error', (err) => {
    console.error('Unexpected error on idle pg client pool:', err)
  })

  globalForPrisma.pgPool = pool
  return pool
}

function createPrismaClient(): PrismaClient {
  const pool = getOrCreatePool()
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()
globalForPrisma.prisma = prisma

export async function disconnectPrisma(): Promise<void> {
  try {
    await prisma.$disconnect()
  } catch (e) {
    console.error('Error disconnecting Prisma client:', e)
  }
  if (globalForPrisma.pgPool) {
    try {
      await globalForPrisma.pgPool.end()
      globalForPrisma.pgPool = undefined
    } catch (e) {
      console.error('Error ending pg pool:', e)
    }
  }
}

export function getPoolStats() {
  const pool = globalForPrisma.pgPool
  if (!pool) {
    return {
      max: 10,
      totalCount: 0,
      idleCount: 0,
      waitingCount: 0,
      activeCount: 0,
    }
  }
  const total = pool.totalCount ?? 0
  const idle = pool.idleCount ?? 0
  const active = Math.max(0, total - idle)
  return {
    max: 10,
    totalCount: total,
    idleCount: idle,
    waitingCount: pool.waitingCount ?? 0,
    activeCount: active,
  }
}