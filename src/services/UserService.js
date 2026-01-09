/**
 * User Service
 * Handles all user-related business logic
 */

const { getPrismaClient } = require('../database/client');
const logger = require('../utils/logger');
const { nanoid } = require('nanoid');
const config = require('../config');

class UserService {
  constructor() {
    this.prisma = getPrismaClient();
  }

  /**
   * Find user by Telegram ID
   */
  async findByTelegramId(telegramId) {
    try {
      return await this.prisma.user.findUnique({
        where: { telegramId: BigInt(telegramId) },
        include: {
          clanMemberships: {
            include: {
              clan: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error('Error finding user by telegram ID:', error);
      throw error;
    }
  }

  /**
   * Create or update user (upsert)
   */
  async upsert(userData) {
    try {
      const { telegramId, username, firstName, lastName, avatarUrl, referralCode } = userData;

      const user = await this.prisma.user.upsert({
        where: { telegramId: BigInt(telegramId) },
        update: {
          username,
          firstName,
          lastName,
          avatarUrl,
          updatedAt: new Date(),
        },
        create: {
          telegramId: BigInt(telegramId),
          username,
          firstName,
          lastName: lastName || null,
          avatarUrl: avatarUrl || null,
          coins: config.economy.starting.coins,
          gems: config.economy.starting.gems,
          referralCode: nanoid(10),
        },
      });

      // Handle referral if provided
      if (referralCode && !user.referrerId) {
        await this.handleReferral(user.id, referralCode);
      }

      logger.logUserAction(user.id, 'user_upsert', { telegramId });
      return user;
    } catch (error) {
      logger.error('Error upserting user:', error);
      throw error;
    }
  }

  /**
   * Handle user referral
   */
  async handleReferral(userId, referralCode) {
    try {
      const referrer = await this.prisma.user.findUnique({
        where: { referralCode },
      });

      if (!referrer || referrer.id === userId) {
        return null;
      }

      // Update referred user
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          referrerId: referrer.id,
          coins: { increment: config.economy.referral.referredCoins },
        },
      });

      // Reward referrer
      await this.prisma.user.update({
        where: { id: referrer.id },
        data: {
          coins: { increment: config.economy.referral.referrerCoins },
          gems: { increment: config.economy.referral.referrerGems },
        },
      });

      // Create transaction records
      await this.prisma.transaction.createMany({
        data: [
          {
            userId,
            type: 'REFERRAL_REWARD',
            amountCoins: config.economy.referral.referredCoins,
            description: 'Referral bonus',
          },
          {
            userId: referrer.id,
            type: 'REFERRAL_REWARD',
            amountCoins: config.economy.referral.referrerCoins,
            amountGems: config.economy.referral.referrerGems,
            description: `Referral reward for user ${userId}`,
          },
        ],
      });

      logger.logTransaction(userId, 'REFERRAL_REWARD', config.economy.referral.referredCoins, 'Referred user bonus');
      logger.logTransaction(referrer.id, 'REFERRAL_REWARD', config.economy.referral.referrerCoins, 'Referrer reward');

      return { referrer, bonusCoins: config.economy.referral.referredCoins };
    } catch (error) {
      logger.error('Error handling referral:', error);
      return null;
    }
  }

  /**
   * Get user stats
   */
  async getStats(userId) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          level: true,
          experience: true,
          coins: true,
          gems: true,
          premium: true,
          totalGames: true,
          totalWins: true,
          bestScore: true,
          currentStreak: true,
          longestStreak: true,
        },
      });

      return user;
    } catch (error) {
      logger.error('Error getting user stats:', error);
      throw error;
    }
  }

  /**
   * Update user stats after game
   */
  async updateStatsAfterGame(userId, gameResult) {
    try {
      const { score, won, betAmount, winAmount } = gameResult;

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      // Calculate experience gain
      let xpGain = config.economy.level.xpPerGame;
      if (won) {
        xpGain *= config.economy.level.xpMultiplierWin;
      }
      if (user.currentStreak >= 3) {
        xpGain *= config.economy.level.xpMultiplierStreak;
      }

      // Check level up
      const newExperience = user.experience + Math.floor(xpGain);
      const newLevel = Math.floor(newExperience / 1000) + 1;
      const leveledUp = newLevel > user.level;

      // Check streak
      const today = new Date().toISOString().split('T')[0];
      const lastPlayDate = user.lastPlayDate ? user.lastPlayDate.toISOString().split('T')[0] : null;

      let newStreak = user.currentStreak;
      if (lastPlayDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        newStreak = lastPlayDate === yesterday ? newStreak + 1 : 1;
      }

      // Update user
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          totalGames: { increment: 1 },
          totalWins: won ? { increment: 1 } : user.totalWins,
          bestScore: score > user.bestScore ? score : user.bestScore,
          experience: newExperience,
          level: newLevel,
          currentStreak: newStreak,
          longestStreak: newStreak > user.longestStreak ? newStreak : user.longestStreak,
          lastPlayDate: new Date(),
          coins: { increment: winAmount - betAmount },
          updatedAt: new Date(),
        },
      });

      logger.logGameEvent(userId, 'game_stats_updated', score, betAmount, winAmount);

      return {
        user: updatedUser,
        leveledUp,
        oldLevel: user.level,
        newLevel,
        xpGained: Math.floor(xpGain),
        streakUpdated: newStreak !== user.currentStreak,
      };
    } catch (error) {
      logger.error('Error updating user stats:', error);
      throw error;
    }
  }

  /**
   * Get user profile with full details
   */
  async getProfile(userId) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          achievements: {
            include: {
              achievement: true,
            },
            where: {
              unlocked: true,
            },
          },
          clanMemberships: {
            include: {
              clan: true,
            },
          },
          inventory: {
            include: {
              item: true,
            },
          },
          boosters: {
            where: {
              active: true,
              expiresAt: {
                gt: new Date(),
              },
            },
          },
        },
      });

      return user;
    } catch (error) {
      logger.error('Error getting user profile:', error);
      throw error;
    }
  }

  /**
   * Update user balance
   */
  async updateBalance(userId, { coins = 0, gems = 0 }, reason = 'Balance update') {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          coins: { increment: coins },
          gems: { increment: gems },
        },
      });

      // Create transaction record
      if (coins !== 0 || gems !== 0) {
        await this.prisma.transaction.create({
          data: {
            userId,
            type: 'BALANCE_UPDATE',
            amountCoins: coins,
            amountGems: gems,
            description: reason,
          },
        });

        logger.logTransaction(userId, 'BALANCE_UPDATE', { coins, gems }, reason);
      }

      return user;
    } catch (error) {
      logger.error('Error updating user balance:', error);
      throw error;
    }
  }

  /**
   * Check if user has sufficient balance
   */
  async hasBalance(userId, { coins = 0, gems = 0 }) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { coins: true, gems: true },
      });

      return user.coins >= coins && user.gems >= gems;
    } catch (error) {
      logger.error('Error checking user balance:', error);
      throw error;
    }
  }

  /**
   * Ban/unban user
   */
  async updateBanStatus(userId, banned, bannedUntil = null) {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          banned,
          bannedUntil: bannedUntil ? new Date(bannedUntil) : null,
        },
      });

      logger.logUserAction(userId, banned ? 'user_banned' : 'user_unbanned', { bannedUntil });
      return user;
    } catch (error) {
      logger.error('Error updating ban status:', error);
      throw error;
    }
  }

  /**
   * Get user referrals
   */
  async getReferrals(userId) {
    try {
      const referrals = await this.prisma.user.findMany({
        where: { referrerId: userId },
        select: {
          id: true,
          username: true,
          firstName: true,
          avatarUrl: true,
          level: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return referrals;
    } catch (error) {
      logger.error('Error getting referrals:', error);
      throw error;
    }
  }
}

module.exports = new UserService();
