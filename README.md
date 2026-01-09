# 🎮 Ultimate Telegram Mini App

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

**10000x Better Gaming Experience** - Professional Telegram Mini App with 7 Game Modes, deployed on Railway.app with PostgreSQL + Prisma.

## 🚀 DEPLOY TO RAILWAY (3 MINUTES!)

### Quick Deploy:

1. **Fork this repo** to your GitHub
2. Go to [Railway.app](https://railway.app)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your forked repo
5. Click "Add PostgreSQL" database
6. Add environment variables:
   - `TELEGRAM_BOT_TOKEN` - From @BotFather
   - `TELEGRAM_BOT_USERNAME` - Your bot username
7. **Deploy!** Railway auto-deploys everything

**Done!** ✨ Your app is LIVE!

[📖 Detailed Guide →](./RAILWAY_DEPLOY.md)

---

## 🤖 Get Telegram Bot Token

1. Telegram → Search `@BotFather`
2. Send `/newbot`
3. Follow instructions
4. Copy token → Paste in Railway

---

## 🎮 7 Game Modes

| Game | Description | Max Win |
|------|-------------|---------|
| 🍀 **LUCK** | Random 1-100 | 100x |
| 🎰 **SLOTS** | 3x3 Slots | 100x |
| 🎡 **SPIN** | Wheel | 100x |
| 🎲 **DICE** | Predictions | 98x |
| 🪙 **FLIP** | Coin Flip | 1.98x |
| 🃏 **CARDS** | Higher/Lower | Dynamic |
| 🎫 **SCRATCH** | Scratch Cards | 100x |

---

## 📡 API Endpoints

```
POST   /api/user/init              - Initialize user
GET    /api/user/:userId/profile   - User profile
POST   /api/game/play              - Play game
GET    /api/game/:userId/history   - Game history
GET    /api/leaderboard/coins      - Top players
GET    /api/achievements           - All achievements
```

[📚 Postman Collection](./Telegram-Mini-App.postman_collection.json)

---

## 🏗️ Tech Stack

- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL + Prisma ORM
- **Deployment**: Railway.app
- **Security**: Helmet, Rate Limiting, JWT
- **Logging**: Winston with file rotation

---

## 🗄️ Database

**25 Tables** with full relations:
- Users, Games, Achievements
- Leaderboards, Tournaments
- Multiplayer, Clans, Friends
- Economy, Shop, Inventory
- Notifications, Analytics

---

## 📊 Features

- ✅ 7 provably fair game modes
- ✅ User profiles & statistics
- ✅ Multiple leaderboards
- ✅ Achievement system
- ✅ Coin & gem economy
- ✅ Referral rewards
- ✅ Level & XP system
- ✅ Daily streaks

---

## 🚀 Railway Auto-Deploy

```
GitHub Push → Railway Build → Database Migration → Deploy → Live!
```

**Zero config needed!** Railway handles:
- Dependency install
- Prisma generation
- Database migration
- Server startup
- Health checks

---

## 🔧 Environment Variables

**Railway auto-sets:**
- `DATABASE_URL` - PostgreSQL
- `PORT` - Server port

**You set:**
- `TELEGRAM_BOT_TOKEN` - Required
- `TELEGRAM_BOT_USERNAME` - Required

**Optional:**
- `JWT_SECRET` - Auto-generated
- `ADMIN_PASSWORD` - Auto-generated

---

## 🧪 Testing

```bash
# Health check
curl https://your-app.railway.app/api/health

# Play game
curl -X POST https://your-app.railway.app/api/game/play \
  -H "Content-Type: application/json" \
  -d '{"userId":"uuid","gameMode":"LUCK","betAmount":100}'
```

---

## 📈 Monitoring

**Railway Dashboard shows:**
- CPU & Memory usage
- Response times
- Database metrics
- Application logs
- Deploy history

---

## 🔐 Security

- Helmet.js security headers
- CORS protection
- Rate limiting
- JWT authentication
- Input validation
- SQL injection prevention

---

## 💰 Railway Pricing

**Hobby Plan (Free $5/month):**
- Perfect for development
- PostgreSQL included
- Auto-scaling
- 500MB RAM

**Pro Plan:**
- Pay-as-you-go
- Unlimited scaling

---

## 🐛 Troubleshooting

**Build failed?**
- Check Railway logs
- Verify Node.js 18+
- Check package.json

**Database error?**
- Add PostgreSQL plugin
- Check DATABASE_URL

**App not starting?**
- Verify Procfile exists
- Check railway.json

[Full guide →](./RAILWAY_DEPLOY.md)

---

## 📚 Documentation

- [Railway Deploy Guide](./RAILWAY_DEPLOY.md)
- [API Collection](./Telegram-Mini-App.postman_collection.json)
- [Database Schema](./prisma/schema.prisma)

---

## 🎯 Quick Links

- 🚀 [Deploy Now](https://railway.app/new)
- 📊 [Railway Dashboard](https://railway.app/dashboard)
- 🤖 [BotFather](https://t.me/BotFather)

---

## 📄 License

MIT License

---

**Made with ❤️ for Telegram**

🚀 **Deploy in 3 minutes!** [![Deploy](https://railway.app/button.svg)](https://railway.app/new)
