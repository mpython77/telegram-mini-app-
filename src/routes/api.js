const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { verifyTelegramAuth, optionalAuth } = require('../middleware/auth');

// Controllers
const userController = require('../controllers/userController');
const gameController = require('../controllers/gameController');
const leaderboardController = require('../controllers/leaderboardController');

// User routes
router.post('/user', asyncHandler(userController.getUser));
router.get('/user/:telegramId/stats', asyncHandler(userController.getUserStats));
router.get('/user/:telegramId/profile', asyncHandler(userController.getUserProfile));

// Game routes
router.post('/game/play', asyncHandler(gameController.playGame));
router.get('/game/:telegramId/history', asyncHandler(gameController.getGameHistory));
router.get('/game/:telegramId/achievements', asyncHandler(gameController.getAchievements));
router.get('/game/:telegramId/daily-challenge', asyncHandler(gameController.getDailyChallenge));
router.post('/game/claim-challenge-reward', asyncHandler(gameController.claimChallengeReward));

// Leaderboard routes
router.get('/leaderboard', asyncHandler(leaderboardController.getLeaderboard));
router.get('/leaderboard/games', asyncHandler(leaderboardController.getLeaderboardByGames));
router.get('/leaderboard/streak', asyncHandler(leaderboardController.getLeaderboardByStreak));
router.get('/leaderboard/user/:telegramId/rank', asyncHandler(leaderboardController.getUserRank));

module.exports = router;
