/**
 * Achievement Service
 * Handles achievement unlocking and tracking
 */

const { getPrismaClient } = require('../database/client');
const logger = require('../utils/logger');

class AchievementService {
  constructor() {
    this.prisma = getPrismaClient();
  }

  /**
   * Get all achievements
   */
  async getAll() {
    try {
      return await this.prisma.achievement.findMany({
        orderBy: [{ tier: 'asc' }, { requirementValue: 'asc' }],
      });
    } catch (error) {
      logger.error('Error getting all achievements:', error);
      throw error;
    }
  }

  /**
   * Get user achievements
   */
  async getUserAchievements(userId) {
    try {
      const achievements = await this.prisma.userAchievement.findMany({
        where: { userId },
        include: {
          achievement: true,
        },
        orderBy: { unlockedAt: 'desc' },
      });

      return achievements;
    } catch (error) {
      logger.error('Error getting user achievements:', error);
      throw error;
    }
  }

  /**
   * Get unlocked achievements
   */
  async getUnlocked(userId) {
    try {
      return await this.prisma.userAchievement.findMany({
        where: { userId, unlocked: true },
        include: {
          achievement: true,
        },
        orderBy: { unlockedAt: 'desc' },
      });
    } catch (error) {
      logger.error('Error getting unlocked achievements:', error);
      throw error;
    }
  }

  /**
   * Get achievement progress
   */
  async getProgress(userId) {
    try {
      const [total, unlocked] = await Promise.all([
        this.prisma.achievement.count(),
        this.prisma.userAchievement.count({
          where: { userId, unlocked: true },
        }),
      ]);

      return {
        total,
        unlocked,
        locked: total - unlocked,
        percentage: total > 0 ? ((unlocked / total) * 100).toFixed(2) : 0,
      };
    } catch (error) {
      logger.error('Error getting achievement progress:', error);
      throw error;
    }
  }

  /**
   * Check and unlock achievements for user
   */
  async checkAndUnlock(userId) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const achievements = await this.prisma.achievement.findMany({
        where: {
          isSecret: false,
        },
      });

      const newUnlocks = [];

      for (const achievement of achievements) {
        // Check if already unlocked
        const userAchievement = await this.prisma.userAchievement.findUnique({
          where: {
            userId_achievementId: {
              userId,
              achievementId: achievement.id,
            },
          },
        });

        if (userAchievement?.unlocked) {
          continue;
        }

        // Check if criteria met
        const progress = this.calculateProgress(user, achievement);
        const unlocked = progress >= achievement.requirementValue;

        if (unlocked) {
          // Unlock achievement
          await this.unlock(userId, achievement.id);
          newUnlocks.push(achievement);

          // Award rewards
          await this.prisma.user.update({
            where: { id: userId },
            data: {
              coins: { increment: achievement.rewardCoins },
              gems: { increment: achievement.rewardGems },
              experience: { increment: achievement.rewardExperience },
            },
          });

          // Create notification
          await this.prisma.notification.create({
            data: {
              userId,
              type: 'ACHIEVEMENT_UNLOCKED',
              title: 'Achievement Unlocked!',
              message: `You unlocked: ${achievement.name}`,
              data: {
                achievementId: achievement.id,
                rewards: {
                  coins: achievement.rewardCoins,
                  gems: achievement.rewardGems,
                  experience: achievement.rewardExperience,
                },
              },
            },
          });

          logger.logUserAction(userId, 'achievement_unlocked', {
            achievementId: achievement.id,
            achievementName: achievement.name,
          });
        } else {
          // Update progress
          await this.updateProgress(userId, achievement.id, progress);
        }
      }

      return newUnlocks;
    } catch (error) {
      logger.error('Error checking and unlocking achievements:', error);
      throw error;
    }
  }

  /**
   * Calculate achievement progress
   */
  calculateProgress(user, achievement) {
    switch (achievement.requirementType) {
      case 'TOTAL_GAMES':
        return user.totalGames;

      case 'TOTAL_WINS':
        return user.totalWins;

      case 'BEST_SCORE':
        return user.bestScore;

      case 'LEVEL':
        return user.level;

      case 'STREAK':
        return user.longestStreak;

      case 'COINS_EARNED':
        return user.coins;

      case 'GEMS_EARNED':
        return user.gems;

      default:
        return 0;
    }
  }

  /**
   * Unlock achievement
   */
  async unlock(userId, achievementId) {
    try {
      const achievement = await this.prisma.userAchievement.upsert({
        where: {
          userId_achievementId: {
            userId,
            achievementId,
          },
        },
        update: {
          unlocked: true,
          unlockedAt: new Date(),
        },
        create: {
          userId,
          achievementId,
          unlocked: true,
          unlockedAt: new Date(),
          progress: 0,
        },
        include: {
          achievement: true,
        },
      });

      logger.logUserAction(userId, 'achievement_unlocked', { achievementId });
      return achievement;
    } catch (error) {
      logger.error('Error unlocking achievement:', error);
      throw error;
    }
  }

  /**
   * Update achievement progress
   */
  async updateProgress(userId, achievementId, progress) {
    try {
      await this.prisma.userAchievement.upsert({
        where: {
          userId_achievementId: {
            userId,
            achievementId,
          },
        },
        update: {
          progress,
        },
        create: {
          userId,
          achievementId,
          progress,
          unlocked: false,
        },
      });
    } catch (error) {
      logger.error('Error updating achievement progress:', error);
      throw error;
    }
  }

  /**
   * Get achievement by code
   */
  async getByCode(code) {
    try {
      return await this.prisma.achievement.findUnique({
        where: { code },
      });
    } catch (error) {
      logger.error('Error getting achievement by code:', error);
      throw error;
    }
  }

  /**
   * Get recent achievements across all users
   */
  async getRecentUnlocks(limit = 20) {
    try {
      return await this.prisma.userAchievement.findMany({
        where: {
          unlocked: true,
        },
        orderBy: {
          unlockedAt: 'desc',
        },
        take: limit,
        include: {
          user: {
            select: {
              username: true,
              firstName: true,
              avatarUrl: true,
            },
          },
          achievement: true,
        },
      });
    } catch (error) {
      logger.error('Error getting recent unlocks:', error);
      throw error;
    }
  }
}

module.exports = new AchievementService();
