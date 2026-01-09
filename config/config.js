require('dotenv').config();

module.exports = {
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
  },
  database: {
    path: process.env.DATABASE_PATH || './database/app.db',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    expiresIn: '7d',
  },
  admin: {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin123',
  },
  game: {
    maxLuck: parseInt(process.env.MAX_LUCK_VALUE) || 100,
    minLuck: parseInt(process.env.MIN_LUCK_VALUE) || 1,
    dailyChallengesCount: parseInt(process.env.DAILY_CHALLENGES_COUNT) || 3,
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },
  achievements: [
    { id: 1, name: 'First Steps', description: 'Play your first game', requirement: { type: 'games', value: 1 }, icon: '🎮' },
    { id: 2, name: 'Lucky Beginner', description: 'Score above 90', requirement: { type: 'score', value: 90 }, icon: '🍀' },
    { id: 3, name: 'Game Enthusiast', description: 'Play 10 games', requirement: { type: 'games', value: 10 }, icon: '🎯' },
    { id: 4, name: 'Lucky Champion', description: 'Score 95 or higher', requirement: { type: 'score', value: 95 }, icon: '🏆' },
    { id: 5, name: 'Dedicated Player', description: 'Play 50 games', requirement: { type: 'games', value: 50 }, icon: '⭐' },
    { id: 6, name: 'Perfect Luck', description: 'Score exactly 100', requirement: { type: 'score', value: 100 }, icon: '💯' },
    { id: 7, name: 'Century Player', description: 'Play 100 games', requirement: { type: 'games', value: 100 }, icon: '💪' },
    { id: 8, name: 'Streak Master', description: 'Play 7 days in a row', requirement: { type: 'streak', value: 7 }, icon: '🔥' },
    { id: 9, name: 'Top 10 Player', description: 'Reach top 10 on leaderboard', requirement: { type: 'rank', value: 10 }, icon: '🥇' },
    { id: 10, name: 'Legendary', description: 'Play 500 games', requirement: { type: 'games', value: 500 }, icon: '👑' },
  ],
};
