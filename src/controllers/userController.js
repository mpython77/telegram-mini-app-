const User = require('../models/User');
const Achievement = require('../models/Achievement');
const DailyChallenge = require('../models/DailyChallenge');
const { calculateRank } = require('../utils/helpers');

/**
 * Get or create user
 */
async function getUser(req, res) {
  try {
    const { telegramId, firstName, lastName, username } = req.body;

    if (!telegramId || !firstName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const user = await User.upsert({
      telegramId,
      firstName,
      lastName: lastName || '',
      username: username || '',
    });

    const stats = await User.getStats(telegramId);
    const rank = calculateRank(stats.bestScore);

    res.json({
      success: true,
      data: {
        user,
        stats,
        rank,
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
 * Get user statistics
 */
async function getUserStats(req, res) {
  try {
    const { telegramId } = req.params;

    const user = await User.findByTelegramId(telegramId);
    if (!user) {
      return res.json({
        success: true,
        data: {
          bestScore: 0,
          totalGames: 0,
          totalPoints: 0,
          currentStreak: 0,
          longestStreak: 0,
        }
      });
    }

    const stats = await User.getStats(telegramId);
    const rank = calculateRank(stats.bestScore);
    const achievements = await Achievement.getUserAchievements(user.id);
    const challengeStats = await DailyChallenge.getStats(user.id);

    res.json({
      success: true,
      data: {
        ...stats,
        rank,
        achievements: achievements.length,
        challengeStats,
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
 * Get user profile
 */
async function getUserProfile(req, res) {
  try {
    const { telegramId } = req.params;

    const user = await User.findByTelegramId(telegramId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const stats = await User.getStats(telegramId);
    const rank = calculateRank(stats.bestScore);
    const achievements = await Achievement.getUserAchievements(user.id);
    const achievementProgress = await Achievement.getProgress(user.id);
    const todayChallenge = await DailyChallenge.getTodayChallenge(user.id);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          telegramId: user.telegram_id,
          firstName: user.first_name,
          lastName: user.last_name,
          username: user.username,
        },
        stats,
        rank,
        achievements,
        achievementProgress,
        todayChallenge,
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
  getUser,
  getUserStats,
  getUserProfile,
};
