#!/usr/bin/env node
/**
 * Railway Startup Script
 * Handles database migration and server startup gracefully
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

console.log('🚀 Railway Startup Script');
console.log('================================');

async function start() {
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.log('⚠️  WARNING: DATABASE_URL not set!');
    console.log('⚠️  Skipping database migration');
    console.log('⚠️  Server will start without database connection');
    console.log('');
  } else {
    console.log('✅ DATABASE_URL found');
    console.log('🔄 Running database migration...');
    console.log('');

    try {
      const { stdout, stderr } = await execPromise('npx prisma db push --skip-generate');
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
      console.log('✅ Database migration successful');
      console.log('');
    } catch (error) {
      console.error('⚠️  Database migration failed:', error.message);
      console.error('⚠️  Continuing anyway...');
      console.log('');
    }
  }

  console.log('🚀 Starting server...');
  console.log('================================');
  console.log('');

  // Start the server
  require('../server.js');
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
  process.exit(1);
});

// Run
start().catch((error) => {
  console.error('❌ Startup failed:', error);
  process.exit(1);
});
