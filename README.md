# 🍀 Telegram Mini App - Luck Game

Professional Telegram Mini App with complete features: game mechanics, leaderboard, achievements, daily challenges, and admin panel.

## ✨ Features

### 🎮 Game Features
- **Luck Testing**: Test your luck and get scores from 1-100
- **Daily Challenges**: Complete daily challenges for bonus rewards
- **Real-time Stats**: Track your best score, total games, and current streak
- **Haptic Feedback**: Interactive feedback for Telegram app users

### 🏆 Leaderboard System
- **Multiple Rankings**: Sort by best score, most games, or current streak
- **Global Ranking**: See where you stand among all players
- **Real-time Updates**: Instant leaderboard updates after each game

### ⭐ Achievement System
- **10+ Achievements**: Unlock achievements by reaching milestones
- **Progress Tracking**: Visual progress bar showing completion percentage
- **Instant Notifications**: Get notified when you unlock new achievements

### 👤 User Profiles
- **Detailed Stats**: View comprehensive player statistics
- **Rank Badges**: Earn rank badges based on performance
- **Streak Tracking**: Monitor daily play streaks

### 🔧 Admin Panel
- **Dashboard**: View system statistics and analytics
- **User Management**: Browse and manage all users
- **Game Monitoring**: Track all games played
- **Top Players**: View leaderboard of best players

## 🚀 Installation

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd telegram-mini-app-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env and set your configuration
   ```

4. **Start the server**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

## 📁 Project Structure

```
telegram-mini-app-/
├── config/
│   ├── config.js           # Application configuration
│   └── database.js         # Database connection and setup
├── src/
│   ├── controllers/        # Request handlers
│   │   ├── userController.js
│   │   ├── gameController.js
│   │   ├── leaderboardController.js
│   │   └── adminController.js
│   ├── models/             # Data models
│   │   ├── User.js
│   │   ├── Game.js
│   │   ├── Achievement.js
│   │   └── DailyChallenge.js
│   ├── routes/             # API routes
│   │   ├── api.js
│   │   └── admin.js
│   ├── middleware/         # Express middleware
│   │   ├── auth.js
│   │   └── errorHandler.js
│   └── utils/              # Utility functions
│       ├── logger.js
│       └── helpers.js
├── public/                 # Frontend files
│   ├── index.html          # Main app
│   ├── admin.html          # Admin panel
│   ├── css/
│   │   ├── main.css
│   │   └── admin.css
│   └── js/
│       ├── app.js
│       ├── game.js
│       ├── leaderboard.js
│       └── admin.js
├── database/               # SQLite database
├── server.js               # Main server file
├── package.json
└── README.md
```

## 🔧 Configuration

Edit the `.env` file to configure your application:

```env
# Server
PORT=3000
NODE_ENV=production

# Database
DATABASE_PATH=./database/app.db

# JWT Secret (change this!)
JWT_SECRET=your-super-secret-jwt-key

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=changeme123

# Game Settings
MAX_LUCK_VALUE=100
MIN_LUCK_VALUE=1
DAILY_CHALLENGES_COUNT=3
```

## 📊 Database Schema

The application uses SQLite with the following tables:

- **users**: User profiles and statistics
- **games**: Game history
- **user_achievements**: Unlocked achievements
- **daily_challenges**: Daily challenge tracking
- **referrals**: Referral system (future feature)

## 🔌 API Endpoints

### User Endpoints
- `POST /api/user` - Create or get user
- `GET /api/user/:telegramId/stats` - Get user statistics
- `GET /api/user/:telegramId/profile` - Get user profile

### Game Endpoints
- `POST /api/game/play` - Play game
- `GET /api/game/:telegramId/history` - Get game history
- `GET /api/game/:telegramId/achievements` - Get achievements
- `GET /api/game/:telegramId/daily-challenge` - Get daily challenge
- `POST /api/game/claim-challenge-reward` - Claim challenge reward

### Leaderboard Endpoints
- `GET /api/leaderboard` - Get leaderboard by score
- `GET /api/leaderboard/games` - Get leaderboard by games
- `GET /api/leaderboard/streak` - Get leaderboard by streak
- `GET /api/leaderboard/user/:telegramId/rank` - Get user rank

### Admin Endpoints
- `POST /admin/login` - Admin login
- `GET /admin/stats` - Dashboard statistics
- `GET /admin/users` - Get all users
- `GET /admin/games` - Get all games
- `GET /admin/health` - System health check

## 🎯 Achievements

The game includes 10 achievements:

1. **First Steps** 🎮 - Play your first game
2. **Lucky Beginner** 🍀 - Score above 90
3. **Game Enthusiast** 🎯 - Play 10 games
4. **Lucky Champion** 🏆 - Score 95 or higher
5. **Dedicated Player** ⭐ - Play 50 games
6. **Perfect Luck** 💯 - Score exactly 100
7. **Century Player** 💪 - Play 100 games
8. **Streak Master** 🔥 - Play 7 days in a row
9. **Top 10 Player** 🥇 - Reach top 10 on leaderboard
10. **Legendary** 👑 - Play 500 games

## 🔐 Security Features

- JWT authentication for admin panel
- Rate limiting on API endpoints
- Helmet.js for security headers
- Input sanitization
- CORS protection
- Environment variable protection

## 🚀 Deployment

### Deploy to Production

1. **Set environment variables**
   - Set `NODE_ENV=production`
   - Use strong JWT secret
   - Change admin credentials

2. **Build and start**
   ```bash
   npm start
   ```

3. **Use process manager (PM2)**
   ```bash
   npm install -g pm2
   pm2 start server.js --name luck-game
   pm2 save
   pm2 startup
   ```

### Deploy to Cloud Platforms

- **Heroku**: Use Procfile with `web: node server.js`
- **Railway**: Auto-detected Node.js project
- **Vercel**: Configure as Express.js serverless function
- **DigitalOcean**: Deploy as Node.js app

## 🧪 Testing

```bash
# Test health endpoint
curl http://localhost:3000/health

# Test admin login
curl -X POST http://localhost:3000/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## 📱 Telegram Mini App Setup

1. Create a bot with [@BotFather](https://t.me/BotFather)
2. Get your bot token
3. Set up Mini App URL in bot settings
4. Point the URL to your deployed application

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

MIT License - feel free to use this project for any purpose.

## 🙏 Acknowledgments

- Built with Express.js and SQLite
- Telegram WebApp API integration
- Modern responsive design

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Made with ❤️ for the Telegram community**
