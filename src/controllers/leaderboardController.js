/**
 * Leaderboard Controller
 * Handles leaderboard-related HTTP requests
 */

const LeaderboardService = require('../services/LeaderboardService');
const logger = require('../utils/logger');

/**
 * Get leaderboard by coins
 */
async function getByCoins(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const leaderboard = await LeaderboardService.getByCoins(limit, offset);

    res.json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    logger.error('Error getting coins leaderboard:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Get leaderboard by total games
 */
async function getByGames(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const leaderboard = await LeaderboardService.getByGames(limit, offset);

    res.json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    logger.error('Error getting games leaderboard:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Get leaderboard by level
 */
async function getByLevel(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const leaderboard = await LeaderboardService.getByLevel(limit, offset);

    res.json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    logger.error('Error getting level leaderboard:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Get leaderboard by streak
 */
async function getByStreak(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const leaderboard = await LeaderboardService.getByStreak(limit, offset);

    res.json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    logger.error('Error getting streak leaderboard:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Get user rank
 */
async function getUserRank(req, res) {
  try {
    const { userId } = req.params;
    const type = req.query.type || 'coins';

    const rank = await LeaderboardService.getUserRank(userId, type);

    res.json({
      success: true,
      data: rank,
    });
  } catch (error) {
    logger.error('Error getting user rank:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Get season leaderboard
 */
async function getSeasonLeaderboard(req, res) {
  try {
    const { seasonId } = req.params;
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const leaderboard = await LeaderboardService.getSeasonLeaderboard(seasonId, limit, offset);

    res.json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    logger.error('Error getting season leaderboard:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Get clan leaderboard
 */
async function getClanLeaderboard(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const leaderboard = await LeaderboardService.getClanLeaderboard(limit, offset);

    res.json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    logger.error('Error getting clan leaderboard:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Get friends leaderboard
 */
async function getFriendsLeaderboard(req, res) {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    const leaderboard = await LeaderboardService.getFriendsLeaderboard(userId, limit);

    res.json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    logger.error('Error getting friends leaderboard:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

module.exports = {
  getByCoins,
  getByGames,
  getByLevel,
  getByStreak,
  getUserRank,
  getSeasonLeaderboard,
  getClanLeaderboard,
  getFriendsLeaderboard,
};
