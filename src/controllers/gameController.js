/**
 * Game Controller
 * Handles game-related HTTP requests
 */

const GameService = require('../services/GameService');
const UserService = require('../services/UserService');
const AchievementService = require('../services/AchievementService');
const logger = require('../utils/logger');

/**
 * Play a game
 */
async function play(req, res) {
  try {
    const { userId, gameMode, betAmount, gameOptions } = req.body;

    if (!userId || !gameMode || !betAmount) {
      return res.status(400).json({
        success: false,
        error: 'User ID, game mode, and bet amount are required',
      });
    }

    // Play game
    const result = await GameService.play(userId, gameMode, betAmount, {
      ...gameOptions,
      ipAddress: req.ip,
    });

    // Check for new achievements
    const newAchievements = await AchievementService.checkAndUnlock(userId);

    res.json({
      success: true,
      data: {
        game: result.game,
        result: result.result,
        userUpdate: result.userUpdate,
        newAchievements: newAchievements.length > 0 ? newAchievements : undefined,
      },
    });
  } catch (error) {
    logger.error('Error playing game:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Get game history
 */
async function getHistory(req, res) {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const gameMode = req.query.gameMode || null;

    const history = await GameService.getHistory(userId, limit, offset, gameMode);

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    logger.error('Error getting game history:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Get game stats
 */
async function getStats(req, res) {
  try {
    const { userId } = req.params;
    const gameMode = req.query.gameMode || null;

    const stats = await GameService.getStats(userId, gameMode);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error('Error getting game stats:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Get global game stats
 */
async function getGlobalStats(req, res) {
  try {
    const gameMode = req.query.gameMode || null;

    const stats = await GameService.getGlobalStats(gameMode);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error('Error getting global stats:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Get popular games
 */
async function getPopular(req, res) {
  try {
    const games = await GameService.getPopularGames();

    res.json({
      success: true,
      data: games,
    });
  } catch (error) {
    logger.error('Error getting popular games:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Get recent big wins
 */
async function getBigWins(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const wins = await GameService.getRecentBigWins(limit);

    res.json({
      success: true,
      data: wins,
    });
  } catch (error) {
    logger.error('Error getting big wins:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Start CARDS game (get first card)
 */
async function startCards(req, res) {
  try {
    const result = GameService.startCardsGame();

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('Error starting cards game:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Get SPIN wheel segments
 */
async function getSpinSegments(req, res) {
  try {
    const segments = GameService.getSpinSegments();

    res.json({
      success: true,
      data: segments,
    });
  } catch (error) {
    logger.error('Error getting spin segments:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

module.exports = {
  play,
  getHistory,
  getStats,
  getGlobalStats,
  getPopular,
  getBigWins,
  startCards,
  getSpinSegments,
};
