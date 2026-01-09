const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Game = require('../models/Game');
const db = require('../../config/database');
const config = require('../../config/config');
const logger = require('../utils/logger');

/**
 * Admin login
 */
async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (username !== config.admin.username || password !== config.admin.password) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { username, role: 'admin' },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.json({
      success: true,
      data: { token }
    });

    logger.info('Admin logged in');
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * Get dashboard statistics
 */
async function getStats(req, res) {
  try {
    const totalUsers = await User.count();
    const totalGames = await Game.count();
    const averageScore = await Game.getAverageScore();

    const activeUsers = await db.get(
      `SELECT COUNT(DISTINCT user_id) as count
       FROM games
       WHERE created_at >= datetime('now', '-7 days')`
    );

    const recentGames = await Game.getRecent(10);

    const topPlayers = await db.query(
      `SELECT
        telegram_id,
        first_name,
        last_name,
        username,
        best_score,
        total_games,
        total_points
       FROM users
       ORDER BY best_score DESC
       LIMIT 10`
    );

    res.json({
      success: true,
      data: {
        totalUsers,
        totalGames,
        averageScore,
        activeUsers: activeUsers.count,
        recentGames,
        topPlayers,
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * Get all users
 */
async function getUsers(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const users = await User.getAll(limit, offset);
    const total = await User.count();

    res.json({
      success: true,
      data: {
        users,
        total,
        limit,
        offset,
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * Get all games
 */
async function getGames(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const games = await Game.getRecent(limit);
    const total = await Game.count();

    res.json({
      success: true,
      data: {
        games,
        total,
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * Delete user
 */
async function deleteUser(req, res) {
  try {
    const { userId } = req.params;

    await User.delete(userId);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

    logger.info(`User deleted: ${userId}`);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * Get system health
 */
async function getHealth(req, res) {
  try {
    const totalUsers = await User.count();
    const totalGames = await Game.count();

    res.json({
      success: true,
      data: {
        status: 'OK',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: {
          users: totalUsers,
          games: totalGames,
        }
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
  login,
  getStats,
  getUsers,
  getGames,
  deleteUser,
  getHealth,
};
