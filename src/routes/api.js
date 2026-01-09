/**
 * API Routes
 * Main application routes
 */

const express = require('express');
const router = express.Router();

const { asyncHandler } = require('../middleware/errorHandler');
const { verifyTelegramAuth } = require('../middleware/auth');
const { gameValidation, leaderboardValidation } = require('../middleware/validation');
const requestLogger = require('../middleware/requestLogger');

// Controllers
const userController = require('../controllers/userController');
const gameController = require('../controllers/gameController');
const leaderboardController = require('../controllers/leaderboardController');

// Apply request logger to all routes
router.use(requestLogger);

// ====================
// USER ROUTES
// ====================

// Initialize/authenticate user
router.post('/user/init', asyncHandler(userController.initUser));

// Get user by Telegram ID
router.get('/user/telegram/:telegramId', asyncHandler(userController.getUserByTelegramId));

// Get user profile
router.get('/user/:userId/profile', asyncHandler(userController.getProfile));

// Get user stats
router.get('/user/:userId/stats', asyncHandler(userController.getStats));

// Update user balance (admin only)
router.post('/user/:userId/balance', asyncHandler(userController.updateBalance));

// Get user referrals
router.get('/user/:userId/referrals', asyncHandler(userController.getReferrals));

// ====================
// GAME ROUTES
// ====================

// Play a game
router.post('/game/play', gameValidation.play, asyncHandler(gameController.play));

// Get game history
router.get('/game/:userId/history', asyncHandler(gameController.getHistory));

// Get game stats
router.get('/game/:userId/stats', asyncHandler(gameController.getStats));

// Get global game stats
router.get('/game/stats/global', asyncHandler(gameController.getGlobalStats));

// Get popular games
router.get('/game/popular', asyncHandler(gameController.getPopular));

// Get recent big wins
router.get('/game/bigwins', asyncHandler(gameController.getBigWins));

// Start CARDS game (get first card)
router.get('/game/cards/start', asyncHandler(gameController.startCards));

// Get SPIN wheel segments
router.get('/game/spin/segments', asyncHandler(gameController.getSpinSegments));

// ====================
// LEADERBOARD ROUTES
// ====================

// Get leaderboard by coins
router.get('/leaderboard/coins', leaderboardValidation.list, asyncHandler(leaderboardController.getByCoins));

// Get leaderboard by games
router.get('/leaderboard/games', leaderboardValidation.list, asyncHandler(leaderboardController.getByGames));

// Get leaderboard by level
router.get('/leaderboard/level', leaderboardValidation.list, asyncHandler(leaderboardController.getByLevel));

// Get leaderboard by streak
router.get('/leaderboard/streak', leaderboardValidation.list, asyncHandler(leaderboardController.getByStreak));

// Get user rank
router.get('/leaderboard/rank/:userId', asyncHandler(leaderboardController.getUserRank));

// Get season leaderboard
router.get('/leaderboard/season/:seasonId', leaderboardValidation.list, asyncHandler(leaderboardController.getSeasonLeaderboard));

// Get clan leaderboard
router.get('/leaderboard/clans', leaderboardValidation.list, asyncHandler(leaderboardController.getClanLeaderboard));

// Get friends leaderboard
router.get('/leaderboard/friends/:userId', asyncHandler(leaderboardController.getFriendsLeaderboard));

// ====================
// ACHIEVEMENT ROUTES
// ====================

// Get all achievements
router.get('/achievements', asyncHandler(async (req, res) => {
  const AchievementService = require('../services/AchievementService');
  const achievements = await AchievementService.getAll();
  res.json({ success: true, data: achievements });
}));

// Get user achievements
router.get('/achievements/user/:userId', asyncHandler(async (req, res) => {
  const AchievementService = require('../services/AchievementService');
  const achievements = await AchievementService.getUserAchievements(req.params.userId);
  res.json({ success: true, data: achievements });
}));

// Get unlocked achievements
router.get('/achievements/user/:userId/unlocked', asyncHandler(async (req, res) => {
  const AchievementService = require('../services/AchievementService');
  const achievements = await AchievementService.getUnlocked(req.params.userId);
  res.json({ success: true, data: achievements });
}));

// Get achievement progress
router.get('/achievements/user/:userId/progress', asyncHandler(async (req, res) => {
  const AchievementService = require('../services/AchievementService');
  const progress = await AchievementService.getProgress(req.params.userId);
  res.json({ success: true, data: progress });
}));

// Get recent unlocks (global)
router.get('/achievements/recent', asyncHandler(async (req, res) => {
  const AchievementService = require('../services/AchievementService');
  const limit = parseInt(req.query.limit) || 20;
  const unlocks = await AchievementService.getRecentUnlocks(limit);
  res.json({ success: true, data: unlocks });
}));

// ====================
// HEALTH CHECK
// ====================

router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

module.exports = router;
