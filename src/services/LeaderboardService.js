/**
 * Leaderboard Service
 * Handles all leaderboard-related functionality
 */

const { getPrismaClient } = require('../database/client');
const logger = require('../utils/logger');

class LeaderboardService {
  constructor() {
    this.prisma = getPrismaClient();
  }

  /**
   * Get global leaderboard by coins
   */
  async getByCoins(limit = 100, offset = 0) {
    try {
      const users = await this.prisma.user.findMany({
        orderBy: { coins: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          telegramId: true,
          username: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          level: true,
          coins: true,
          gems: true,
          premium: true,
        },
      });

      // Add rank to each user
      return users.map((user, index) => ({
        rank: offset + index + 1,
        ...user,
      }));
    } catch (error) {
      logger.error('Error getting coins leaderboard:', error);
      throw error;
    }
  }

  /**
   * Get leaderboard by total games
   */
  async getByGames(limit = 100, offset = 0) {
    try {
      const users = await this.prisma.user.findMany({
        orderBy: { totalGames: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          telegramId: true,
          username: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          level: true,
          totalGames: true,
          totalWins: true,
          bestScore: true,
        },
      });

      return users.map((user, index) => ({
        rank: offset + index + 1,
        winRate: user.totalGames > 0 ? ((user.totalWins / user.totalGames) * 100).toFixed(2) : 0,
        ...user,
      }));
    } catch (error) {
      logger.error('Error getting games leaderboard:', error);
      throw error;
    }
  }

  /**
   * Get leaderboard by level
   */
  async getByLevel(limit = 100, offset = 0) {
    try {
      const users = await this.prisma.user.findMany({
        orderBy: [{ level: 'desc' }, { experience: 'desc' }],
        take: limit,
        skip: offset,
        select: {
          id: true,
          telegramId: true,
          username: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          level: true,
          experience: true,
        },
      });

      return users.map((user, index) => ({
        rank: offset + index + 1,
        ...user,
      }));
    } catch (error) {
      logger.error('Error getting level leaderboard:', error);
      throw error;
    }
  }

  /**
   * Get leaderboard by streak
   */
  async getByStreak(limit = 100, offset = 0) {
    try {
      const users = await this.prisma.user.findMany({
        orderBy: { longestStreak: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          telegramId: true,
          username: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          currentStreak: true,
          longestStreak: true,
        },
      });

      return users.map((user, index) => ({
        rank: offset + index + 1,
        ...user,
      }));
    } catch (error) {
      logger.error('Error getting streak leaderboard:', error);
      throw error;
    }
  }

  /**
   * Get user rank by coins
   */
  async getUserRank(userId, type = 'coins') {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      let rank;
      switch (type) {
        case 'coins':
          rank = await this.prisma.user.count({
            where: { coins: { gt: user.coins } },
          });
          break;

        case 'games':
          rank = await this.prisma.user.count({
            where: { totalGames: { gt: user.totalGames } },
          });
          break;

        case 'level':
          rank = await this.prisma.user.count({
            where: {
              OR: [
                { level: { gt: user.level } },
                {
                  AND: [{ level: user.level }, { experience: { gt: user.experience } }],
                },
              ],
            },
          });
          break;

        case 'streak':
          rank = await this.prisma.user.count({
            where: { longestStreak: { gt: user.longestStreak } },
          });
          break;

        default:
          rank = await this.prisma.user.count({
            where: { coins: { gt: user.coins } },
          });
      }

      return {
        rank: rank + 1,
        total: await this.prisma.user.count(),
        percentile: ((1 - rank / (await this.prisma.user.count())) * 100).toFixed(2),
      };
    } catch (error) {
      logger.error('Error getting user rank:', error);
      throw error;
    }
  }

  /**
   * Get season leaderboard
   */
  async getSeasonLeaderboard(seasonId, limit = 100, offset = 0) {
    try {
      const leaderboard = await this.prisma.seasonLeaderboard.findMany({
        where: { seasonId },
        orderBy: { points: 'desc' },
        take: limit,
        skip: offset,
        include: {
          user: {
            select: {
              id: true,
              telegramId: true,
              username: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
              level: true,
            },
          },
        },
      });

      return leaderboard.map((entry, index) => ({
        rank: offset + index + 1,
        ...entry,
      }));
    } catch (error) {
      logger.error('Error getting season leaderboard:', error);
      throw error;
    }
  }

  /**
   * Get clan leaderboard
   */
  async getClanLeaderboard(limit = 50, offset = 0) {
    try {
      const clans = await this.prisma.clan.findMany({
        orderBy: [{ level: 'desc' }, { experience: 'desc' }],
        take: limit,
        skip: offset,
        include: {
          owner: {
            select: {
              username: true,
              firstName: true,
            },
          },
        },
      });

      return clans.map((clan, index) => ({
        rank: offset + index + 1,
        ...clan,
      }));
    } catch (error) {
      logger.error('Error getting clan leaderboard:', error);
      throw error;
    }
  }

  /**
   * Get friends leaderboard
   */
  async getFriendsLeaderboard(userId, limit = 50) {
    try {
      // Get user's friends
      const friends = await this.prisma.friend.findMany({
        where: {
          OR: [{ userId }, { friendId: userId }],
          status: 'ACCEPTED',
        },
      });

      const friendIds = friends.map(f => (f.userId === userId ? f.friendId : f.userId));
      friendIds.push(userId); // Include self

      // Get leaderboard for friends
      const users = await this.prisma.user.findMany({
        where: { id: { in: friendIds } },
        orderBy: { coins: 'desc' },
        take: limit,
        select: {
          id: true,
          telegramId: true,
          username: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          level: true,
          coins: true,
          totalGames: true,
        },
      });

      return users.map((user, index) => ({
        rank: index + 1,
        isCurrentUser: user.id === userId,
        ...user,
      }));
    } catch (error) {
      logger.error('Error getting friends leaderboard:', error);
      throw error;
    }
  }
}

module.exports = new LeaderboardService();
