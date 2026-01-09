/**
 * Prisma Database Client
 * Singleton pattern for database connection
 */

const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

// Prisma Client instance
let prisma = null;

/**
 * Initialize Prisma Client with configuration
 */
function createPrismaClient() {
  const client = new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'event',
        level: 'error',
      },
      {
        emit: 'event',
        level: 'info',
      },
      {
        emit: 'event',
        level: 'warn',
      },
    ],
    errorFormat: 'pretty',
  });

  // Log queries in development
  if (process.env.NODE_ENV === 'development') {
    client.$on('query', (e) => {
      logger.debug('Query: ' + e.query);
      logger.debug('Duration: ' + e.duration + 'ms');
    });
  }

  // Log errors
  client.$on('error', (e) => {
    logger.error('Prisma Error:', e);
  });

  // Log info
  client.$on('info', (e) => {
    logger.info('Prisma Info:', e.message);
  });

  // Log warnings
  client.$on('warn', (e) => {
    logger.warn('Prisma Warning:', e.message);
  });

  return client;
}

/**
 * Get Prisma Client instance (Singleton)
 */
function getPrismaClient() {
  if (!prisma) {
    prisma = createPrismaClient();
    logger.info('Prisma Client initialized');
  }
  return prisma;
}

/**
 * Connect to database
 */
async function connectDatabase() {
  try {
    const client = getPrismaClient();
    await client.$connect();
    logger.info('✅ Database connected successfully');
    return client;
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    throw error;
  }
}

/**
 * Disconnect from database
 */
async function disconnectDatabase() {
  try {
    if (prisma) {
      await prisma.$disconnect();
      logger.info('Database disconnected');
      prisma = null;
    }
  } catch (error) {
    logger.error('Error disconnecting database:', error);
    throw error;
  }
}

/**
 * Check database health
 */
async function checkDatabaseHealth() {
  try {
    const client = getPrismaClient();
    await client.$queryRaw`SELECT 1`;
    return { status: 'healthy', connected: true };
  } catch (error) {
    logger.error('Database health check failed:', error);
    return { status: 'unhealthy', connected: false, error: error.message };
  }
}

/**
 * Execute database transaction
 */
async function executeTransaction(callback) {
  const client = getPrismaClient();
  return await client.$transaction(callback);
}

/**
 * Reset database (DANGEROUS - Only for development)
 */
async function resetDatabase() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Cannot reset database in production!');
  }

  try {
    const client = getPrismaClient();

    // Get all table names
    const tables = await client.$queryRaw`
      SELECT tablename FROM pg_tables
      WHERE schemaname = 'public'
    `;

    // Truncate all tables
    for (const { tablename } of tables) {
      if (tablename !== '_prisma_migrations') {
        await client.$executeRawUnsafe(
          `TRUNCATE TABLE "${tablename}" RESTART IDENTITY CASCADE;`
        );
      }
    }

    logger.info('Database reset successfully');
  } catch (error) {
    logger.error('Database reset failed:', error);
    throw error;
  }
}

module.exports = {
  getPrismaClient,
  connectDatabase,
  disconnectDatabase,
  checkDatabaseHealth,
  executeTransaction,
  resetDatabase,
};
