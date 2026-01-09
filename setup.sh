#!/bin/bash

# ========================================
# ULTIMATE TELEGRAM MINI APP - AUTO SETUP
# ========================================

set -e

echo "🚀 Telegram Mini App - Automatic Setup Starting..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ========================================
# 1. CHECK REQUIREMENTS
# ========================================

echo -e "${BLUE}📋 Checking requirements...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version must be 18+. Current: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm $(npm -v)${NC}"

# ========================================
# 2. INSTALL DEPENDENCIES
# ========================================

echo ""
echo -e "${BLUE}📦 Installing dependencies...${NC}"

npm install --silent

echo -e "${GREEN}✅ Dependencies installed${NC}"

# ========================================
# 3. SETUP ENVIRONMENT
# ========================================

echo ""
echo -e "${BLUE}⚙️  Setting up environment...${NC}"

# Generate strong JWT secret
JWT_SECRET=$(openssl rand -base64 32)
ADMIN_PASSWORD=$(openssl rand -base64 16)

# Create .env file
cat > .env << EOF
# ========================================
# AUTO-GENERATED ENVIRONMENT FILE
# Generated on: $(date)
# ========================================

# Server
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Database (Railway PostgreSQL)
# IMPORTANT: Update this with your Railway DATABASE_URL
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT & Security (AUTO-GENERATED)
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=7d

# Telegram Bot (REQUIRED - You need to add this)
TELEGRAM_BOT_TOKEN=
TELEGRAM_BOT_USERNAME=

# Admin Credentials (AUTO-GENERATED)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=${ADMIN_PASSWORD}

# Game Settings
STARTING_COINS=1000
STARTING_GEMS=100
LUCK_MIN_BET=10
LUCK_MAX_BET=10000

# Redis (Optional)
REDIS_URL=

# Feature Flags
FEATURE_MULTIPLAYER=true
FEATURE_TOURNAMENTS=true
FEATURE_CLANS=true
FEATURE_SHOP=true
FEATURE_REFERRALS=true
EOF

echo -e "${GREEN}✅ .env file created${NC}"
echo -e "${YELLOW}📝 Admin password: ${ADMIN_PASSWORD}${NC}"
echo -e "${YELLOW}🔑 Save this password safely!${NC}"

# ========================================
# 4. TELEGRAM BOT TOKEN INPUT
# ========================================

echo ""
echo -e "${BLUE}🤖 Telegram Bot Setup${NC}"
echo ""
echo "To get your bot token:"
echo "1. Open Telegram and search for @BotFather"
echo "2. Send /newbot and follow instructions"
echo "3. Copy the token you receive"
echo ""

read -p "Enter your Telegram Bot Token (or press Enter to skip): " BOT_TOKEN

if [ -n "$BOT_TOKEN" ]; then
    # Update .env with bot token
    sed -i "s|TELEGRAM_BOT_TOKEN=|TELEGRAM_BOT_TOKEN=${BOT_TOKEN}|g" .env

    # Get bot username
    read -p "Enter your Bot Username (without @): " BOT_USERNAME
    if [ -n "$BOT_USERNAME" ]; then
        sed -i "s|TELEGRAM_BOT_USERNAME=|TELEGRAM_BOT_USERNAME=${BOT_USERNAME}|g" .env
    fi

    echo -e "${GREEN}✅ Telegram bot configured${NC}"
else
    echo -e "${YELLOW}⚠️  Skipped. You can add it later in .env${NC}"
fi

# ========================================
# 5. PRISMA SETUP
# ========================================

echo ""
echo -e "${BLUE}🗄️  Setting up Prisma...${NC}"

# Generate Prisma Client
npx prisma generate > /dev/null 2>&1

echo -e "${GREEN}✅ Prisma client generated${NC}"

# ========================================
# 6. RAILWAY SETUP (OPTIONAL)
# ========================================

echo ""
echo -e "${BLUE}🚂 Railway.app Setup${NC}"
echo ""
echo "Do you want to deploy to Railway.app?"
echo "1. Yes - Install Railway CLI and setup project"
echo "2. No - Skip (you can do this later)"
echo ""

read -p "Choose (1/2): " RAILWAY_CHOICE

if [ "$RAILWAY_CHOICE" = "1" ]; then
    # Check if Railway CLI is installed
    if ! command -v railway &> /dev/null; then
        echo -e "${BLUE}📥 Installing Railway CLI...${NC}"
        npm install -g @railway/cli
        echo -e "${GREEN}✅ Railway CLI installed${NC}"
    fi

    echo ""
    echo -e "${YELLOW}🔐 Railway Login Required${NC}"
    echo "A browser window will open for authentication..."
    railway login

    echo ""
    echo -e "${BLUE}🎯 Creating Railway project...${NC}"
    railway init

    echo ""
    echo -e "${BLUE}🗄️  Adding PostgreSQL...${NC}"
    echo "This will add PostgreSQL to your Railway project"
    railway add

    echo ""
    echo -e "${BLUE}📋 Getting DATABASE_URL...${NC}"
    DATABASE_URL=$(railway variables get DATABASE_URL 2>/dev/null || echo "")

    if [ -n "$DATABASE_URL" ]; then
        # Update .env with Railway DATABASE_URL
        sed -i "s|DATABASE_URL=.*|DATABASE_URL=${DATABASE_URL}|g" .env
        echo -e "${GREEN}✅ DATABASE_URL configured automatically${NC}"

        # Run database migration
        echo ""
        echo -e "${BLUE}🔄 Running database migration...${NC}"
        npx prisma db push --skip-generate
        echo -e "${GREEN}✅ Database tables created${NC}"
    else
        echo -e "${YELLOW}⚠️  Could not get DATABASE_URL automatically${NC}"
        echo -e "${YELLOW}📝 Please run: railway variables${NC}"
        echo -e "${YELLOW}   Then copy DATABASE_URL to .env file${NC}"
    fi

    echo ""
    echo -e "${BLUE}🚀 Setting environment variables...${NC}"
    railway variables set JWT_SECRET="${JWT_SECRET}"
    railway variables set ADMIN_PASSWORD="${ADMIN_PASSWORD}"

    if [ -n "$BOT_TOKEN" ]; then
        railway variables set TELEGRAM_BOT_TOKEN="${BOT_TOKEN}"
        railway variables set TELEGRAM_BOT_USERNAME="${BOT_USERNAME}"
    fi

    echo -e "${GREEN}✅ Railway environment configured${NC}"

    echo ""
    echo -e "${YELLOW}🚀 Ready to deploy!${NC}"
    echo -e "${YELLOW}   Run: npm run deploy${NC}"

else
    echo -e "${YELLOW}⚠️  Railway setup skipped${NC}"
fi

# ========================================
# 7. FINAL CHECKS
# ========================================

echo ""
echo -e "${BLUE}🔍 Final checks...${NC}"

# Check if DATABASE_URL is set
if grep -q "DATABASE_URL=postgresql://" .env; then
    echo -e "${GREEN}✅ Database configured${NC}"

    # Try to connect and push schema
    if npx prisma db push --skip-generate > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Database tables created${NC}"
    else
        echo -e "${YELLOW}⚠️  Database connection pending${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Database not configured yet${NC}"
fi

# ========================================
# 8. SETUP COMPLETE
# ========================================

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}🎉 SETUP COMPLETE!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""

echo -e "${BLUE}📝 Next Steps:${NC}"
echo ""

if ! grep -q "DATABASE_URL=postgresql://" .env; then
    echo -e "${YELLOW}1. Update DATABASE_URL in .env file${NC}"
    echo "   - Get it from Railway: railway variables"
    echo "   - Or use local PostgreSQL"
    echo ""
fi

if [ -z "$BOT_TOKEN" ]; then
    echo -e "${YELLOW}2. Add Telegram Bot Token to .env${NC}"
    echo "   - Get from @BotFather on Telegram"
    echo ""
fi

echo -e "${GREEN}3. Start the server:${NC}"
echo "   Development: npm run dev"
echo "   Production:  npm start"
echo ""

echo -e "${GREEN}4. Deploy to Railway (if configured):${NC}"
echo "   railway up"
echo ""

echo -e "${BLUE}📊 Admin Credentials:${NC}"
echo "   Username: admin"
echo "   Password: ${ADMIN_PASSWORD}"
echo ""

echo -e "${BLUE}🔗 API Documentation:${NC}"
echo "   Health Check: http://localhost:3000/api/health"
echo "   Postman Collection: Telegram-Mini-App.postman_collection.json"
echo ""

echo -e "${BLUE}🎮 Game Modes Available:${NC}"
echo "   - LUCK (Random 1-100)"
echo "   - SLOTS (3x3 Slot Machine)"
echo "   - SPIN (Wheel of Fortune)"
echo "   - DICE (Prediction Game)"
echo "   - FLIP (Coin Flip)"
echo "   - CARDS (Higher/Lower)"
echo "   - SCRATCH (Scratch Cards)"
echo ""

echo -e "${GREEN}✨ Happy Gaming! 🎰${NC}"
