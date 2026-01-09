# 🎮 Ultimate Telegram Mini App

**10000x Better Gaming Experience** - Professional Telegram Mini App with 7 Game Modes, PostgreSQL + Prisma, Real-time Features, and Complete Backend Infrastructure.

## 🚀 QUICK START (1 Command!)

```bash
npm run setup
```

That's it! The setup script will:
- ✅ Install all dependencies
- ✅ Generate Prisma client
- ✅ Create .env with secure credentials
- ✅ Ask for Telegram Bot Token
- ✅ Setup Railway PostgreSQL (optional)
- ✅ Run database migrations
- ✅ Configure everything automatically

## 🎯 What You Need

Just 2 things:

### 1. **Telegram Bot Token** 🤖
1. Open Telegram
2. Search for `@BotFather`
3. Send `/newbot`
4. Follow instructions
5. Copy the token

### 2. **Railway PostgreSQL** 🗄️
The setup script will handle this automatically! Just say "yes" when prompted.

## 📦 Manual Setup (Alternative)

If you prefer manual setup:

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Edit .env and add:
#    - DATABASE_URL (from Railway)
#    - TELEGRAM_BOT_TOKEN
nano .env

# 4. Generate Prisma Client
npm run prisma:generate

# 5. Push database schema
npm run db:push

# 6. Start server
npm run dev
```

## 🎮 7 Game Modes

| Game | Description | Features |
|------|-------------|----------|
| 🍀 **LUCK** | Random luck generator (1-100) | Provably fair, crypto hashing |
| 🎰 **SLOTS** | 3x3 Slot machine | 8 symbols, multiple paylines |
| 🎡 **SPIN** | Wheel of Fortune | 10 segments with multipliers |
| 🎲 **DICE** | Dice prediction game | Higher/Lower/Equal predictions |
| 🪙 **FLIP** | Coin flip | Heads/Tails, 1.98x multiplier |
| 🃏 **CARDS** | Card guessing game | Higher/Lower/Equal card values |
| 🎫 **SCRATCH** | Scratch card lottery | 3x3 grid with prizes |

## 🚂 Deploy to Railway.app

```bash
npm run deploy
```

This automated script will:
- ✅ Install Railway CLI (if needed)
- ✅ Login to Railway
- ✅ Create/link project
- ✅ Add PostgreSQL database
- ✅ Set environment variables
- ✅ Run database migration
- ✅ Deploy your app
- ✅ Generate public URL

**That's it!** Your app will be LIVE in minutes! 🚀

## 📡 API Endpoints

### User Management
```
POST   /api/user/init                  - Initialize user
GET    /api/user/:userId/profile       - Get profile
GET    /api/user/:userId/stats         - Get stats
GET    /api/user/:userId/referrals     - Get referrals
```

### Game Endpoints
```
POST   /api/game/play                  - Play any game
GET    /api/game/:userId/history       - Game history
GET    /api/game/:userId/stats         - Game stats
GET    /api/game/popular               - Popular games
GET    /api/game/bigwins               - Recent big wins
GET    /api/game/cards/start           - Start CARDS game
GET    /api/game/spin/segments         - Get SPIN segments
```

### Leaderboards
```
GET    /api/leaderboard/coins          - Top by coins
GET    /api/leaderboard/games          - Top by games
GET    /api/leaderboard/level          - Top by level
GET    /api/leaderboard/streak         - Top by streak
GET    /api/leaderboard/rank/:userId   - User rank
```

### Achievements
```
GET    /api/achievements                      - All achievements
GET    /api/achievements/user/:userId         - User achievements
GET    /api/achievements/user/:userId/progress - Progress
```

## 🧪 Testing with Postman

Import the collection:
```
Telegram-Mini-App.postman_collection.json
```

Set variables:
- `baseUrl`: Your server URL
- `userId`: Your user UUID

## 🛠️ Development Commands

```bash
npm run dev              # Development mode with nodemon
npm start                # Production mode
npm run setup            # Automated setup
npm run deploy           # Deploy to Railway
npm run prisma:studio    # Open Prisma Studio (DB GUI)
npm run prisma:generate  # Generate Prisma Client
npm run db:push          # Push schema to database
npm run logs             # View Railway logs
```

## 🏗️ Architecture

```
telegram-mini-app-/
├── server.js                    # Express server
├── src/
│   ├── config/                  # Configuration
│   ├── database/                # Prisma client
│   ├── engines/                 # 7 game engines
│   │   ├── LuckEngine.js
│   │   ├── SlotsEngine.js
│   │   ├── SpinEngine.js
│   │   ├── DiceEngine.js
│   │   ├── FlipEngine.js
│   │   ├── CardsEngine.js
│   │   └── ScratchEngine.js
│   ├── services/                # Business logic
│   │   ├── UserService.js
│   │   ├── GameService.js
│   │   ├── LeaderboardService.js
│   │   └── AchievementService.js
│   ├── controllers/             # API controllers
│   ├── middleware/              # Express middleware
│   ├── routes/                  # API routes
│   └── utils/                   # Utilities
├── prisma/
│   └── schema.prisma            # Database schema (25 tables)
└── public/                      # Static files
```

## 💾 Database

**PostgreSQL** with **Prisma ORM**
- 25 tables
- Full relations
- Optimized indexes
- Transaction support

## 🔒 Security Features

- ✅ Helmet.js security headers
- ✅ Rate limiting
- ✅ CORS protection
- ✅ JWT authentication
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ XSS protection

## 📊 Features

- ✅ **7 Game Modes** - All provably fair
- ✅ **User System** - Registration, profiles, stats
- ✅ **Achievements** - Unlock & track achievements
- ✅ **Leaderboards** - Multiple leaderboard types
- ✅ **Economy** - Coins, gems, levels, XP
- ✅ **Referrals** - Invite friends & earn rewards
- ✅ **Logging** - Winston with file rotation
- ✅ **Validation** - Express-validator
- ✅ **Error Handling** - Comprehensive error handling

## 🚀 Performance

- **Prisma ORM** - Fast database queries
- **Connection Pooling** - Optimized connections
- **Compression** - Response compression
- **Logging** - Structured logging
- **Caching Ready** - Redis support prepared

## 🔮 Coming Soon

- 🔌 **WebSocket** - Real-time multiplayer
- 🏪 **Shop System** - Buy items with coins/gems
- 🏰 **Clans** - Create & join clans
- 🏆 **Tournaments** - Compete for prizes
- 📊 **Analytics** - Detailed statistics
- 💳 **Payments** - In-app purchases

## 📝 Environment Variables

Key variables (auto-generated by setup):

```bash
DATABASE_URL=postgresql://...      # Railway PostgreSQL
JWT_SECRET=<auto-generated>        # Secure random key
ADMIN_PASSWORD=<auto-generated>    # Admin password
TELEGRAM_BOT_TOKEN=<your-token>    # From @BotFather
```

## 🐛 Troubleshooting

### Server won't start
```bash
rm -rf node_modules package-lock.json
npm install
npm run prisma:generate
```

### Database connection error
```bash
# Check DATABASE_URL in .env
railway variables  # Get from Railway

# Or use local PostgreSQL
createdb telegram_mini_app
```

### Prisma issues
```bash
npx prisma generate
npx prisma db push
```

## 📚 Documentation

- **API Docs**: Use Postman collection
- **Prisma Studio**: `npm run prisma:studio`
- **Railway Dashboard**: `railway open`

## 🤝 Support

- GitHub Issues: [Report bugs](https://github.com/mpython77/telegram-mini-app-/issues)
- Telegram: Contact @BotFather for bot help

## 📄 License

MIT License - Use freely!

## 🎉 Credits

Built with:
- Express.js
- Prisma ORM
- PostgreSQL
- Winston Logger
- Railway.app

---

**Made with ❤️ for Telegram Mini App Developers**

🚀 **Ready to deploy?** Run `npm run setup` and get started in minutes!
