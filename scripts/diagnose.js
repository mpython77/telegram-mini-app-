#!/usr/bin/env node
/**
 * Diagnostic Script - Check Railway environment
 */

console.log('🔍 Railway Environment Diagnostics');
console.log('===================================\n');

// 1. Node version
console.log('📌 Node.js Version:', process.version);
console.log('📌 Platform:', process.platform);
console.log('📌 Architecture:', process.arch);
console.log('');

// 2. Environment variables (masked)
console.log('🔐 Environment Variables:');
console.log('  PORT:', process.env.PORT || 'NOT SET');
console.log('  NODE_ENV:', process.env.NODE_ENV || 'NOT SET');
console.log('  DATABASE_URL:', process.env.DATABASE_URL ? '✅ SET (masked)' : '❌ NOT SET');
console.log('  TELEGRAM_BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN ? '✅ SET (masked)' : '❌ NOT SET');
console.log('  TELEGRAM_BOT_USERNAME:', process.env.TELEGRAM_BOT_USERNAME || '❌ NOT SET');
console.log('');

// 3. Check file existence
const fs = require('fs');
const path = require('path');

console.log('📁 File Structure Check:');
const files = [
  'server.js',
  'package.json',
  'prisma/schema.prisma',
  'src/config/index.js',
  'src/database/client.js',
  'src/utils/logger.js',
  'src/routes/api.js',
  'src/routes/admin.js',
];

files.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, '..', file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});
console.log('');

// 4. Try to load critical modules
console.log('📦 Module Loading Test:');
const modules = [
  'express',
  'dotenv',
  '@prisma/client',
  'winston',
];

modules.forEach(mod => {
  try {
    require(mod);
    console.log(`  ✅ ${mod}`);
  } catch (error) {
    console.log(`  ❌ ${mod}: ${error.message}`);
  }
});
console.log('');

// 5. Try to load config
console.log('⚙️  Configuration Test:');
try {
  require('dotenv').config();
  const config = require('../src/config');
  console.log('  ✅ Config loaded successfully');
  console.log('  - Server Port:', config.server?.port || 'NOT SET');
  console.log('  - API Version:', config.app?.version || 'NOT SET');
} catch (error) {
  console.log('  ❌ Config load failed:', error.message);
}
console.log('');

// 6. Test Prisma Client
console.log('💾 Prisma Client Test:');
try {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  console.log('  ✅ Prisma Client instantiated');
} catch (error) {
  console.log('  ❌ Prisma Client failed:', error.message);
}
console.log('');

console.log('✅ Diagnostics Complete!');
console.log('===================================');
