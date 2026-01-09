# 🚂 Railway Setup - Step by Step

## 🎯 Complete Setup Guide

### Prerequisites
- GitHub account
- Telegram bot token (from @BotFather)

---

## Step 1: Prepare Repository

### 1.1 Fork Repository
```
1. Go to: https://github.com/mpython77/telegram-mini-app-
2. Click "Fork" button
3. Wait for fork to complete
```

### 1.2 Clone Your Fork (Optional - for local development)
```bash
git clone https://github.com/YOUR_USERNAME/telegram-mini-app-.git
cd telegram-mini-app-
```

---

## Step 2: Railway Account Setup

### 2.1 Sign Up
```
1. Go to: https://railway.app
2. Click "Sign Up with GitHub"
3. Authorize Railway access
4. Verify email
```

### 2.2 Dashboard Overview
```
After login, you'll see:
- Projects (your deployments)
- Templates (quick start options)
- Settings (account settings)
```

---

## Step 3: Create New Project

### 3.1 Deploy from GitHub
```
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your forked repository
4. Click "Deploy Now"
```

Railway will start building immediately!

---

## Step 4: Add PostgreSQL Database

### 4.1 Add Database Plugin
```
1. In your project, click "New"
2. Select "Database"
3. Choose "Add PostgreSQL"
4. Wait 30 seconds for provisioning
```

### 4.2 Verify Database Connection
```
1. Click on PostgreSQL plugin
2. Go to "Variables" tab
3. You should see DATABASE_URL
4. This is automatically linked to your app!
```

---

## Step 5: Configure Environment Variables

### 5.1 Open Variables Panel
```
1. Click on your main service (not database)
2. Go to "Variables" tab
3. Click "New Variable"
```

### 5.2 Required Variables

**TELEGRAM_BOT_TOKEN**
```
Value: Get from @BotFather on Telegram
Example: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz
```

**TELEGRAM_BOT_USERNAME**
```
Value: Your bot username (without @)
Example: my_awesome_bot
```

### 5.3 Optional Variables (Auto-generated if not set)

**JWT_SECRET**
```
Value: Strong random string
Example: your-super-secret-jwt-key-change-this
Or leave empty for auto-generation
```

**ADMIN_PASSWORD**
```
Value: Strong password for admin panel
Example: YourSecurePassword123!
Or leave empty for auto-generation
```

---

## Step 6: Deploy & Verify

### 6.1 Initial Deployment
```
Railway automatically:
1. Installs dependencies
2. Generates Prisma client
3. Runs database migrations
4. Starts the server
```

Watch the logs in real-time!

### 6.2 Get Your URL
```
1. Go to "Settings" tab
2. Click "Domains"
3. Click "Generate Domain"
4. Copy your URL: https://your-app.railway.app
```

### 6.3 Test Health Check
```bash
curl https://your-app.railway.app/api/health
```

Expected response:
```json
{
  "success": true,
  "status": "OK",
  "timestamp": "2024-01-09T10:00:00.000Z",
  "uptime": 123.45,
  "environment": "production"
}
```

---

## Step 7: Configure Telegram Bot

### 7.1 Set Mini App URL
```
1. Open Telegram
2. Search for @BotFather
3. Send: /mybots
4. Select your bot
5. Click "Bot Settings" → "Menu Button"
6. Enter your Railway URL: https://your-app.railway.app
```

### 7.2 Test Your Bot
```
1. Open your bot in Telegram
2. Click "Start" or menu button
3. Your mini app should open!
```

---

## Step 8: Database Management

### 8.1 View Database
```
Railway Dashboard → PostgreSQL → "Data" tab
```

### 8.2 Connect via Prisma Studio (Local)
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

### 8.3 Database Backup
```
Railway Dashboard → PostgreSQL → "Settings" → "Backups"
Enable automatic backups (recommended)
```

---

## Step 9: Monitoring & Logs

### 9.1 View Logs
```
Railway Dashboard → Your Service → "Deployments" → Latest → "View Logs"
```

Log types:
- Build logs (dependency installation)
- Deploy logs (startup process)
- Application logs (your app output)

### 9.2 Metrics
```
Railway Dashboard → Your Service → "Metrics"
```

Monitor:
- CPU usage
- Memory usage
- Network I/O
- Response times

### 9.3 Set Up Alerts
```
Railway Dashboard → Project Settings → "Webhooks"
Add webhook for deployment notifications
```

---

## Step 10: Continuous Deployment

### 10.1 Auto-Deploy on Push
```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Railway auto-detects and deploys!
```

### 10.2 Deployment Flow
```
Push to GitHub
    ↓
Railway detects change
    ↓
Starts new deployment
    ↓
Builds application
    ↓
Runs migrations
    ↓
Deploys new version
    ↓
Zero-downtime switch
    ↓
Your app is updated! ✨
```

---

## 🔧 Advanced Configuration

### Custom Domain
```
1. Railway Dashboard → Settings → Domains
2. Click "Custom Domain"
3. Enter your domain: yourdomain.com
4. Add CNAME record in your DNS:
   - Name: @
   - Value: your-app.railway.app
```

### Environment-Specific Variables
```
Railway Dashboard → Variables → "Environment-Specific"
Set different values for production/staging
```

### Health Checks
```
Railway automatically uses: /api/health
Configure in railway.json if needed
```

---

## 💡 Best Practices

### 1. Security
```
✅ Never commit .env file
✅ Use strong passwords
✅ Rotate secrets regularly
✅ Enable 2FA on GitHub
✅ Use Railway environment variables
```

### 2. Database
```
✅ Enable automatic backups
✅ Monitor query performance
✅ Use indexes appropriately
✅ Regular cleanup of old data
```

### 3. Monitoring
```
✅ Check logs daily
✅ Monitor error rates
✅ Track performance metrics
✅ Set up alerts for critical issues
```

### 4. Deployment
```
✅ Test locally before pushing
✅ Use feature branches
✅ Review deployment logs
✅ Keep Railway CLI updated
```

---

## 🐛 Common Issues & Solutions

### Issue: Build Failed
**Solution:**
```
1. Check Railway logs for error
2. Verify package.json scripts
3. Ensure Node.js 18+ specified
4. Check for syntax errors
```

### Issue: Database Connection Error
**Solution:**
```
1. Verify PostgreSQL plugin is added
2. Check DATABASE_URL in variables
3. Ensure Prisma schema is valid
4. Try redeploying
```

### Issue: App Won't Start
**Solution:**
```
1. Check Procfile exists
2. Verify railway.json configuration
3. Review startup logs
4. Ensure PORT is not hardcoded
```

### Issue: Environment Variables Not Working
**Solution:**
```
1. Verify variables are set
2. Check variable names (case-sensitive)
3. Redeploy after adding variables
4. Use Railway dashboard, not .env file
```

---

## 📊 Monitoring Checklist

- [ ] Health check responding
- [ ] Database connected
- [ ] No error logs
- [ ] CPU < 80%
- [ ] Memory < 400MB
- [ ] Response time < 500ms
- [ ] Telegram bot responding

---

## 🔗 Useful Links

- [Railway Dashboard](https://railway.app/dashboard)
- [Railway Docs](https://docs.railway.app)
- [Prisma Docs](https://www.prisma.io/docs)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Project Repository](https://github.com/mpython77/telegram-mini-app-)

---

## 🎉 Congratulations!

Your Telegram Mini App is now:
- ✅ Deployed on Railway
- ✅ Connected to PostgreSQL
- ✅ Auto-deploying from GitHub
- ✅ Accessible via HTTPS
- ✅ Production-ready!

**Start building amazing features!** 🚀

---

**Need Help?**
- Check [RAILWAY_DEPLOY.md](./RAILWAY_DEPLOY.md) for troubleshooting
- Open GitHub issue for bugs
- Review Railway documentation
