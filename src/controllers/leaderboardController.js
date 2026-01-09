const db = require('../../config/database');
const User = require('../models/User');
const { calculateRank } = require('../utils/helpers');

/**
 * Get global leaderboard by best score
 */
async function getLeaderboard(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const users = await db.query(
      `SELECT
        id,
        telegram_id,
        first_name,
        last_name,
        username,
        best_score,
        total_games,
        total_points,
        current_streak
       FROM users
       WHERE total_games > 0
       ORDER BY best_score DESC, total_games DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const leaderboard = users.map((user, index) => {
      const rank = calculateRank(user.best_score);
      return {
        rank: offset + index + 1,
        id: user.telegram_id,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        bestScore: user.best_score,
        totalGames: user.total_games,
        totalPoints: user.total_points,
        currentStreak: user.current_streak,
        rankInfo: rank,
      };
    });

    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * Get leaderboard by total games
 */
async function getLeaderboardByGames(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 100;

    const users = await db.query(
      `SELECT
        id,
        telegram_id,
        first_name,
        last_name,
        username,
        best_score,
        total_games,
        total_points
       FROM users
       WHERE total_games > 0
       ORDER BY total_games DESC, best_score DESC
       LIMIT ?`,
      [limit]
    );

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      id: user.telegram_id,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      bestScore: user.best_score,
      totalGames: user.total_games,
      totalPoints: user.total_points,
    }));

    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * Get leaderboard by current streak
 */
async function getLeaderboardByStreak(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 100;

    const users = await db.query(
      `SELECT
        id,
        telegram_id,
        first_name,
        last_name,
        username,
        best_score,
        total_games,
        current_streak,
        longest_streak
       FROM users
       WHERE current_streak > 0
       ORDER BY current_streak DESC, longest_streak DESC
       LIMIT ?`,
      [limit]
    );

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      id: user.telegram_id,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      bestScore: user.best_score,
      totalGames: user.total_games,
      currentStreak: user.current_streak,
      longestStreak: user.longest_streak,
    }));

    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * Get user's rank
 */
async function getUserRank(req, res) {
  try {
    const { telegramId } = req.params;

    const user = await User.findByTelegramId(telegramId);
    if (!user) {
      return res.json({
        success: true,
        data: { rank: null }
      });
    }

    const result = await db.get(
      `SELECT COUNT(*) + 1 as rank
       FROM users
       WHERE (best_score > ? OR (best_score = ? AND total_games > ?))
       AND total_games > 0`,
      [user.best_score, user.best_score, user.total_games]
    );

    res.json({
      success: true,
      data: {
        rank: result.rank,
        bestScore: user.best_score,
        totalGames: user.total_games,
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = {
  getLeaderboard,
  getLeaderboardByGames,
  getLeaderboardByStreak,
  getUserRank,
};
