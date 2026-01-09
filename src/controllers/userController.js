/**
 * User Controller
 * Handles user-related HTTP requests
 */

const UserService = require('../services/UserService');
const AchievementService = require('../services/AchievementService');
const logger = require('../utils/logger');

/**
 * Get or create user (init/auth)
 */
async function initUser(req, res) {
  try {
    const { telegramId, username, firstName, lastName, avatarUrl, referralCode } = req.body;

    if (!telegramId || !firstName) {
      return res.status(400).json({
        success: false,
        error: 'Telegram ID and first name are required',
      });
    }

    // Upsert user
    const user = await UserService.upsert({
      telegramId,
      username: username || null,
      firstName,
      lastName: lastName || null,
      avatarUrl: avatarUrl || null,
      referralCode: referralCode || null,
    });

    // Get user stats
    const stats = await UserService.getStats(user.id);

    res.json({
      success: true,
      data: {
        user,
        stats,
      },
    });
  } catch (error) {
    logger.error('Error initializing user:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Get user profile
 */
async function getProfile(req, res) {
  try {
    const { userId } = req.params;

    const profile = await UserService.getProfile(userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Get achievement progress
    const achievementProgress = await AchievementService.getProgress(userId);

    res.json({
      success: true,
      data: {
        ...profile,
        achievementProgress,
      },
    });
  } catch (error) {
    logger.error('Error getting user profile:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Get user by Telegram ID
 */
async function getUserByTelegramId(req, res) {
  try {
    const { telegramId } = req.params;

    const user = await UserService.findByTelegramId(telegramId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const stats = await UserService.getStats(user.id);

    res.json({
      success: true,
      data: {
        user,
        stats,
      },
    });
  } catch (error) {
    logger.error('Error getting user:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Get user stats
 */
async function getStats(req, res) {
  try {
    const { userId } = req.params;

    const stats = await UserService.getStats(userId);

    if (!stats) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error('Error getting user stats:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Update user balance
 */
async function updateBalance(req, res) {
  try {
    const { userId } = req.params;
    const { coins = 0, gems = 0, reason } = req.body;

    const user = await UserService.updateBalance(userId, { coins, gems }, reason);

    res.json({
      success: true,
      data: {
        coins: user.coins,
        gems: user.gems,
      },
    });
  } catch (error) {
    logger.error('Error updating balance:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Get user referrals
 */
async function getReferrals(req, res) {
  try {
    const { userId } = req.params;

    const referrals = await UserService.getReferrals(userId);

    res.json({
      success: true,
      data: {
        referrals,
        count: referrals.length,
      },
    });
  } catch (error) {
    logger.error('Error getting referrals:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

module.exports = {
  initUser,
  getProfile,
  getUserByTelegramId,
  getStats,
  updateBalance,
  getReferrals,
};
