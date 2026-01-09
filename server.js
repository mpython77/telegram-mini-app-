console.log('🚀 INITIALIZING SERVER...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT);

require('dotenv').config();

// Catch unexpected errors immediately
process.on('uncaughtException', (error) => {
  console.error('🔥 CRITICAL STARTUP ERROR:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('🔥 UNHANDLED PROMISE REJECTION:', reason);
});

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

const config = require('./src/config');
const { connectDatabase, disconnectDatabase } = require('./src/database/client');
const logger = require('./src/utils/logger');
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler');

// Routes
const apiRoutes = require('./src/routes/api');
const adminRoutes = require('./src/routes/admin');

const app = express();

// Trust proxy (for Railway, Heroku, etc.)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for Telegram WebApp
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
}));

// Compression middleware
app.use(compression());

// Body parser with limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);

// Main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Admin panel route
app.get('/admin-panel', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  const PORT = process.env.PORT || 3000;

  // Start server first (so health check works immediately)
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server listening on port ${PORT}`);
    logger.info(`🚀 Server running on port ${PORT}`);
    logger.info(`📱 Environment: ${process.env.NODE_ENV || 'production'}`);
  });

  // Then connect to database (non-blocking)
  try {
    console.log('🔄 Connecting to database...');
    await connectDatabase();
    console.log('✅ Database connected successfully');
    logger.info('✅ Database connected successfully');
    logger.info(`🎮 Telegram Mini App ready!`);
    logger.info(`💾 Database: PostgreSQL + Prisma`);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    logger.error('❌ Database connection failed:', error);
    logger.warn('⚠️ Server running without database connection');
  }

  // Graceful shutdown
  const shutdown = async (signal) => {
    console.log(`${signal} received. Shutting down...`);
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      try {
        await disconnectDatabase();
        logger.info('Server closed. Exiting process.');
        process.exit(0);
      } catch (error) {
        logger.error('Error during shutdown:', error);
        process.exit(1);
      }
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error('Forced shutdown after timeout');
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

// Start the server
startServer();
