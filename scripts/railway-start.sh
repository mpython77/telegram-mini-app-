#!/bin/bash
# Railway Startup Script - Graceful database migration

set -e  # Exit on error

echo "🚀 Starting Railway deployment..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  WARNING: DATABASE_URL not set!"
  echo "⚠️  Skipping database migration"
  echo "⚠️  Server will start without database connection"
else
  echo "✅ DATABASE_URL found"
  echo "🔄 Running database migration..."

  # Try to run prisma db push
  if npm run db:push; then
    echo "✅ Database migration successful"
  else
    echo "⚠️  Database migration failed, but continuing..."
  fi
fi

echo "🚀 Starting server..."
npm start
