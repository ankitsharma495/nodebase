// ===========================================
// Prisma Client Singleton
// ===========================================

const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Prevent hot-reload from creating new connections
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({
      log: ['warn', 'error'],
    });
  }
  prisma = global.__prisma;
}

prisma.$connect()
  .then(() => logger.info('Database connected successfully'))
  .catch((err) => logger.error('Database connection failed', { error: err.message }));

module.exports = prisma;
