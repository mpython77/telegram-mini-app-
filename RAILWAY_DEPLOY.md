# 🚀 Railway.app Deployment Guide

## Quick Deploy to Railway (3 Minutes!)

### Step 1: Fork & Connect Repository

1. **Fork this repository** to your GitHub account
2. Go to [Railway.app](https://railway.app)
3. Click "Start a New Project"
4. Click "Deploy from GitHub repo"
5. Select your forked repository

### Step 2: Add PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "Add PostgreSQL"
3. Wait for database to provision (30 seconds)
4. **DATABASE_URL is automatically added to your environment!**

### Step 3: Set Environment Variables

In Railway dashboard, go to your project → Variables:

**Required:**
```bash
TELEGRAM_BOT_TOKEN=your-bot-token-from-botfather
TELEGRAM_BOT_USERNAME=your_bot_username
```

**Optional (Auto-generated if not set):**
```bash
JWT_SECRET=your-secret-key
ADMIN_PASSWORD=your-admin-password
NODE_ENV=production
```

### Step 4: Deploy!

Railway will **automatically**:
- ✅ Install dependencies
- ✅ Generate Prisma Client
- ✅ Run database migrations
- ✅ Start the server
- ✅ Generate public URL

**That's it!** Your app is LIVE! 🎉

---

## 🤖 Get Telegram Bot Token

1. Open Telegram
2. Search for `@BotFather`
3. Send `/newbot`
4. Follow the instructions
5. Copy the token
6. Paste it in Railway environment variables

---

## 🔧 Railway Configuration

### Automatic Features

Railway automatically detects:
- ✅ Node.js project
- ✅ PostgreSQL database
- ✅ Environment variables
- ✅ Build & start commands
- ✅ Health checks

### Build Process

```bash
# Railway automatically runs:
npm install
npm run prisma:generate
npm run db:push  # Creates all 25 database tables
npm start        # Starts Express server
```

### Environment Variables

Railway automatically provides:
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (Railway assigns this)
- `RAILWAY_ENVIRONMENT` - Deployment environment

You only need to add:
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_BOT_USERNAME`

---

## 📊 Post-Deployment

### View Logs
```
Go to Railway Dashboard → Your Project → Deployments → View Logs
```

### Get Public URL
```
Railway Dashboard → Settings → Domains → Generate Domain
```

### Access Prisma Studio
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Open Prisma Studio
railway run npx prisma studio
```

### View Database
```
Railway Dashboard → PostgreSQL → Data → Connect
```

---

## 🧪 Test Your API

Once deployed, test your endpoints:

```bash
# Health check
curl https://your-app.railway.app/api/health

# Initialize user
curl -X POST https://your-app.railway.app/api/user/init \
  -H "Content-Type: application/json" \
  -d '{
    "telegramId": 123456789,
    "firstName": "Test",
    "username": "testuser"
  }'
```

---

## 🔄 Continuous Deployment

Railway automatically redeploys when you push to GitHub:

```bash
git add .
git commit -m "Update features"
git push origin main
```

Railway will:
1. Detect the push
2. Build your app
3. Run migrations
4. Deploy new version
5. Zero-downtime deployment!

---

## 🐛 Troubleshooting

### Build Failed
Check Railway logs for errors. Common issues:
- Missing environment variables
- Database connection error
- Prisma schema errors

### Database Connection Error
Make sure PostgreSQL plugin is added and `DATABASE_URL` is set.

### App Not Starting
Check that `Procfile` and `railway.json` are present.

---

## 📈 Monitoring

### View Metrics
Railway Dashboard → Your Project → Metrics
- CPU usage
- Memory usage
- Network traffic
- Response times

### View Logs
Railway Dashboard → Deployments → Logs
- Application logs
- Build logs
- Deploy logs

---

## 💰 Pricing

Railway offers:
- **$5 free credits/month** (Hobby plan)
- **Pay-as-you-go** after free credits
- PostgreSQL included in base price

Perfect for:
- ✅ Development & testing
- ✅ Small to medium apps
- ✅ Telegram Mini Apps

---

## 🔗 Useful Links

- [Railway Dashboard](https://railway.app/dashboard)
- [Railway Documentation](https://docs.railway.app)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Telegram Bot API](https://core.telegram.org/bots/api)

---

## 🎯 Next Steps After Deployment

1. **Set up your Telegram Bot**
   - Add your bot username to Telegram
   - Set webhook URL (if needed)
   - Test bot commands

2. **Configure Telegram Mini App**
   - Set Mini App URL in @BotFather
   - Point to: `https://your-app.railway.app`
   - Test in Telegram

3. **Monitor Your App**
   - Check Railway metrics
   - View application logs
   - Monitor database usage

4. **Scale if Needed**
   - Railway auto-scales by default
   - Upgrade plan if needed
   - Add Redis for caching

---

**Questions?** Check Railway documentation or open an issue on GitHub!

**Happy Gaming! 🎮🚀**
