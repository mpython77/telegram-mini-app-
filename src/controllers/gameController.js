const User = require('../models/User');
const Game = require('../models/Game');
const Achievement = require('../models/Achievement');
const DailyChallenge = require('../models/DailyChallenge');
const { generateLuck, getLuckMessage, checkAchievement } = require('../utils/helpers');
const config = require('../../config/config');
const logger = require('../utils/logger');

/**
 * Play game and get luck score
 */
async function playGame(req, res) {
  try {
    const { telegramId } = req.body;

    if (!telegramId) {
      return res.status(400).json({
        success: false,
        error: 'Telegram ID required'
      });
    }

    // Get or create user
    const user = await User.findByTelegramId(telegramId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found. Please initialize user first.'
      });
    }

    // Generate luck score
    const score = generateLuck();
    const luckData = getLuckMessage(score);

    // Save game
    await Game.create(user.id, score);

    // Update user stats
    const updatedUser = await User.updateStats(user.id, score);

    // Check daily challenge
    const challengeResult = await DailyChallenge.checkAndComplete(user.id, score);

    // Check and unlock achievements
    const newAchievements = [];
    for (const achievement of config.achievements) {
      const hasIt = await Achievement.hasAchievement(user.id, achievement.id);
      if (!hasIt) {
        const unlocked = checkAchievement(achievement, {
          totalGames: updatedUser.total_games,
          bestScore: updatedUser.best_score,
          longestStreak: updatedUser.longest_streak,
        });

        if (unlocked) {
          await Achievement.unlock(user.id, achievement.id);
          newAchievements.push(achievement);
        }
      }
    }

    res.json({
      success: true,
      data: {
        score,
        message: luckData.message,
        emoji: luckData.emoji,
        color: luckData.color,
        stats: {
          bestScore: updatedUser.best_score,
          totalGames: updatedUser.total_games,
          currentStreak: updatedUser.current_streak,
        },
        challengeResult,
        newAchievements,
      }
    });

    logger.info(`Game played: User ${telegramId}, Score: ${score}`);
  } catch (error) {
    logger.error('Play game error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * Get game history
 */
async function getGameHistory(req, res) {
  try {
    const { telegramId } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    const user = await User.findByTelegramId(telegramId);
    if (!user) {
      return res.json({
        success: true,
        data: []
      });
    }

    const games = await Game.getUserGames(user.id, limit);

    res.json({
      success: true,
      data: games
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * Get user's achievements
 */
async function getAchievements(req, res) {
  try {
    const { telegramId } = req.params;

    const user = await User.findByTelegramId(telegramId);
    if (!user) {
      return res.json({
        success: true,
        data: {
          unlocked: [],
          locked: config.achievements,
          progress: { unlocked: 0, total: config.achievements.length, percentage: 0 }
        }
      });
    }

    const unlockedAchievements = await Achievement.getUserAchievements(user.id);
    const unlockedIds = unlockedAchievements.map(a => a.id);
    const lockedAchievements = config.achievements.filter(a => !unlockedIds.includes(a.id));
    const progress = await Achievement.getProgress(user.id);

    res.json({
      success: true,
      data: {
        unlocked: unlockedAchievements,
        locked: lockedAchievements,
        progress,
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
 * Get today's daily challenge
 */
async function getDailyChallenge(req, res) {
  try {
    const { telegramId } = req.params;

    const user = await User.findByTelegramId(telegramId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const challenge = await DailyChallenge.getTodayChallenge(user.id);
    const stats = await DailyChallenge.getStats(user.id);

    res.json({
      success: true,
      data: {
        challenge,
        stats,
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
 * Claim daily challenge reward
 */
async function claimChallengeReward(req, res) {
  try {
    const { telegramId } = req.body;

    const user = await User.findByTelegramId(telegramId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const result = await DailyChallenge.claimReward(user.id);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = {
  playGame,
  getGameHistory,
  getAchievements,
  getDailyChallenge,
  claimChallengeReward,
};
