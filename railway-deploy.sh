#!/bin/bash

# ========================================
# RAILWAY DEPLOYMENT SCRIPT
# ========================================

set -e

echo "🚂 Railway.app Deployment Script"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ========================================
# 1. CHECK RAILWAY CLI
# ========================================

if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}📥 Railway CLI not found. Installing...${NC}"
    npm install -g @railway/cli
    echo -e "${GREEN}✅ Railway CLI installed${NC}"
fi

# ========================================
# 2. LOGIN
# ========================================

echo -e "${BLUE}🔐 Checking Railway authentication...${NC}"

if ! railway whoami &> /dev/null; then
    echo -e "${YELLOW}🔑 Login required${NC}"
    railway login
fi

echo -e "${GREEN}✅ Authenticated${NC}"

# ========================================
# 3. CHECK PROJECT
# ========================================

echo ""
echo -e "${BLUE}🎯 Checking Railway project...${NC}"

if ! railway status &> /dev/null; then
    echo -e "${YELLOW}⚠️  No Railway project found${NC}"
    echo -e "${BLUE}🆕 Initializing new project...${NC}"
    railway init
fi

echo -e "${GREEN}✅ Railway project ready${NC}"

# ========================================
# 4. CHECK POSTGRESQL
# ========================================

echo ""
echo -e "${BLUE}🗄️  Checking PostgreSQL...${NC}"

DATABASE_URL=$(railway variables get DATABASE_URL 2>/dev/null || echo "")

if [ -z "$DATABASE_URL" ]; then
    echo -e "${YELLOW}⚠️  PostgreSQL not found${NC}"
    echo -e "${BLUE}📦 Adding PostgreSQL...${NC}"

    railway add

    echo ""
    echo -e "${BLUE}⏳ Waiting for database to initialize (10 seconds)...${NC}"
    sleep 10

    DATABASE_URL=$(railway variables get DATABASE_URL)

    if [ -n "$DATABASE_URL" ]; then
        echo -e "${GREEN}✅ PostgreSQL added successfully${NC}"
    else
        echo -e "${RED}❌ Failed to get DATABASE_URL${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ PostgreSQL already configured${NC}"
fi

# ========================================
# 5. UPDATE LOCAL .ENV
# ========================================

echo ""
echo -e "${BLUE}📝 Updating local .env...${NC}"

if [ -f .env ]; then
    sed -i "s|DATABASE_URL=.*|DATABASE_URL=${DATABASE_URL}|g" .env
    echo -e "${GREEN}✅ .env updated with Railway DATABASE_URL${NC}"
fi

# ========================================
# 6. SET ENVIRONMENT VARIABLES
# ========================================

echo ""
echo -e "${BLUE}⚙️  Setting Railway environment variables...${NC}"

# Read from .env file
if [ -f .env ]; then
    # JWT_SECRET
    JWT_SECRET=$(grep "^JWT_SECRET=" .env | cut -d'=' -f2)
    if [ -n "$JWT_SECRET" ]; then
        railway variables set JWT_SECRET="${JWT_SECRET}" > /dev/null 2>&1
        echo -e "${GREEN}✅ JWT_SECRET set${NC}"
    fi

    # Admin password
    ADMIN_PASSWORD=$(grep "^ADMIN_PASSWORD=" .env | cut -d'=' -f2)
    if [ -n "$ADMIN_PASSWORD" ]; then
        railway variables set ADMIN_PASSWORD="${ADMIN_PASSWORD}" > /dev/null 2>&1
        echo -e "${GREEN}✅ ADMIN_PASSWORD set${NC}"
    fi

    # Telegram Bot Token
    BOT_TOKEN=$(grep "^TELEGRAM_BOT_TOKEN=" .env | cut -d'=' -f2)
    if [ -n "$BOT_TOKEN" ]; then
        railway variables set TELEGRAM_BOT_TOKEN="${BOT_TOKEN}" > /dev/null 2>&1
        railway variables set TELEGRAM_BOT_USERNAME="$(grep "^TELEGRAM_BOT_USERNAME=" .env | cut -d'=' -f2)" > /dev/null 2>&1
        echo -e "${GREEN}✅ Telegram credentials set${NC}"
    fi

    # NODE_ENV
    railway variables set NODE_ENV=production > /dev/null 2>&1
    echo -e "${GREEN}✅ NODE_ENV set${NC}"
fi

# ========================================
# 7. RUN DATABASE MIGRATION
# ========================================

echo ""
echo -e "${BLUE}🔄 Running database migration...${NC}"

# Use Railway's DATABASE_URL
DATABASE_URL="${DATABASE_URL}" npx prisma db push --skip-generate

echo -e "${GREEN}✅ Database schema deployed${NC}"

# ========================================
# 8. DEPLOY APPLICATION
# ========================================

echo ""
echo -e "${BLUE}🚀 Deploying application to Railway...${NC}"

railway up --detach

echo -e "${GREEN}✅ Deployment started${NC}"

# ========================================
# 9. GET DEPLOYMENT URL
# ========================================

echo ""
echo -e "${BLUE}⏳ Waiting for deployment (20 seconds)...${NC}"
sleep 20

echo ""
echo -e "${BLUE}🔗 Getting deployment URL...${NC}"

DEPLOY_URL=$(railway domain 2>/dev/null || echo "")

if [ -n "$DEPLOY_URL" ]; then
    echo -e "${GREEN}✅ Deployment URL: https://${DEPLOY_URL}${NC}"
else
    echo -e "${YELLOW}⚠️  No custom domain configured${NC}"
    echo -e "${YELLOW}💡 Generate domain: railway domain${NC}"
fi

# ========================================
# 10. SHOW STATUS
# ========================================

echo ""
echo -e "${BLUE}📊 Deployment Status:${NC}"
railway status

# ========================================
# 11. FINAL INFO
# ========================================

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}🎉 DEPLOYMENT COMPLETE!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""

echo -e "${BLUE}📝 Next Steps:${NC}"
echo ""

if [ -z "$DEPLOY_URL" ]; then
    echo -e "${YELLOW}1. Generate public URL:${NC}"
    echo "   railway domain"
    echo ""
fi

echo -e "${GREEN}2. Test your API:${NC}"
if [ -n "$DEPLOY_URL" ]; then
    echo "   curl https://${DEPLOY_URL}/api/health"
else
    echo "   railway run curl http://localhost:3000/api/health"
fi
echo ""

echo -e "${GREEN}3. View logs:${NC}"
echo "   railway logs"
echo ""

echo -e "${GREEN}4. Open Prisma Studio:${NC}"
echo "   railway run npx prisma studio"
echo ""

echo -e "${BLUE}🔗 Useful Commands:${NC}"
echo "   railway status       - Check deployment status"
echo "   railway logs         - View application logs"
echo "   railway variables    - List environment variables"
echo "   railway open         - Open Railway dashboard"
echo ""

echo -e "${GREEN}✨ Your Telegram Mini App is LIVE! 🚀${NC}"
