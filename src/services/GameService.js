/**
 * Game Service
 * Unified service for all game modes
 */

const { getPrismaClient } = require('../database/client');
const logger = require('../utils/logger');
const config = require('../config');

// Game Engines
const LuckEngine = require('../engines/LuckEngine');
const SlotsEngine = require('../engines/SlotsEngine');
const SpinEngine = require('../engines/SpinEngine');
const DiceEngine = require('../engines/DiceEngine');
const FlipEngine = require('../engines/FlipEngine');
const CardsEngine = require('../engines/CardsEngine');
const ScratchEngine = require('../engines/ScratchEngine');

const UserService = require('./UserService');

class GameService {
  constructor() {
    this.prisma = getPrismaClient();

    // Map game modes to engines
    this.engines = {
      LUCK: LuckEngine,
      SLOTS: SlotsEngine,
      SPIN: SpinEngine,
      DICE: DiceEngine,
      FLIP: FlipEngine,
      CARDS: CardsEngine,
      SCRATCH: ScratchEngine,
    };
  }

  /**
   * Get engine for game mode
   */
  getEngine(gameMode) {
    const engine = this.engines[gameMode];
    if (!engine) {
      throw new Error(`Invalid game mode: ${gameMode}`);
    }
    return engine;
  }

  /**
   * Play a game
   */
  async play(userId, gameMode, betAmount, gameOptions = {}) {
    try {
      // Get user
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, coins: true, banned: true, bannedUntil: true },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Check if user is banned
      if (user.banned) {
        if (user.bannedUntil && new Date(user.bannedUntil) > new Date()) {
          throw new Error(`You are banned until ${user.bannedUntil.toISOString()}`);
        } else if (user.banned && !user.bannedUntil) {
          throw new Error('You are permanently banned');
        }
      }

      // Check balance
      if (user.coins < betAmount) {
        throw new Error('Insufficient coins');
      }

      // Get engine
      const engine = this.getEngine(gameMode);

      // Play game based on mode
      let gameResult;
      const startTime = Date.now();

      switch (gameMode) {
        case 'LUCK':
          gameResult = engine.play(betAmount, user.coins);
          break;

        case 'SLOTS':
          gameResult = engine.play(betAmount, user.coins);
          break;

        case 'SPIN':
          gameResult = engine.play(betAmount, user.coins);
          break;

        case 'DICE':
          const { target, isOver } = gameOptions;
          if (!target) throw new Error('Target is required for DICE game');
          gameResult = engine.play(betAmount, user.coins, target, isOver);
          break;

        case 'FLIP':
          const { prediction } = gameOptions;
          if (!prediction) throw new Error('Prediction is required for FLIP game');
          gameResult = engine.play(betAmount, user.coins, prediction);
          break;

        case 'CARDS':
          const { currentCard, cardPrediction } = gameOptions;
          if (!currentCard || !cardPrediction) {
            throw new Error('Current card and prediction are required for CARDS game');
          }
          gameResult = engine.play(betAmount, user.coins, currentCard, cardPrediction);
          break;

        case 'SCRATCH':
          gameResult = engine.play(betAmount, user.coins);
          break;

        default:
          throw new Error(`Unsupported game mode: ${gameMode}`);
      }

      const duration = Date.now() - startTime;

      // Save game to database
      const game = await this.prisma.game.create({
        data: {
          userId,
          gameType: 'SINGLE',
          mode: gameMode,
          score: this.calculateScore(gameResult),
          betAmount,
          winAmount: gameResult.winAmount,
          multiplier: gameResult.multiplier || 0,
          resultData: gameResult,
          duration,
          ipAddress: gameOptions.ipAddress || null,
        },
      });

      // Update user stats
      const statsUpdate = await UserService.updateStatsAfterGame(userId, {
        score: this.calculateScore(gameResult),
        won: gameResult.won,
        betAmount,
        winAmount: gameResult.winAmount,
      });

      logger.logGameEvent(userId, gameMode, game.score, betAmount, gameResult.winAmount);

      return {
        game,
        result: gameResult,
        userUpdate: statsUpdate,
      };
    } catch (error) {
      logger.error('Error playing game:', error);
      throw error;
    }
  }

  /**
   * Calculate score from game result
   */
  calculateScore(gameResult) {
    if (gameResult.value) return gameResult.value; // LUCK, DICE
    if (gameResult.roll) return gameResult.roll; // DICE
    if (gameResult.multiplier) return Math.floor(gameResult.multiplier * 10); // Others
    return 0;
  }

  /**
   * Get game history for user
   */
  async getHistory(userId, limit = 50, offset = 0, gameMode = null) {
    try {
      const where = { userId };
      if (gameMode) {
        where.mode = gameMode;
      }

      const games = await this.prisma.game.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          mode: true,
          score: true,
          betAmount: true,
          winAmount: true,
          multiplier: true,
          resultData: true,
          duration: true,
          createdAt: true,
        },
      });

      const total = await this.prisma.game.count({ where });

      return {
        games,
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      };
    } catch (error) {
      logger.error('Error getting game history:', error);
      throw error;
    }
  }

  /**
   * Get game statistics for user
   */
  async getStats(userId, gameMode = null) {
    try {
      const where = { userId };
      if (gameMode) {
        where.mode = gameMode;
      }

      const [totalGames, totalBet, totalWon, avgMultiplier, bestGame] = await Promise.all([
        this.prisma.game.count({ where }),
        this.prisma.game.aggregate({
          where,
          _sum: { betAmount: true },
        }),
        this.prisma.game.aggregate({
          where,
          _sum: { winAmount: true },
        }),
        this.prisma.game.aggregate({
          where,
          _avg: { multiplier: true },
        }),
        this.prisma.game.findFirst({
          where,
          orderBy: { winAmount: 'desc' },
          select: {
            mode: true,
            betAmount: true,
            winAmount: true,
            multiplier: true,
            createdAt: true,
          },
        }),
      ]);

      const totalBetAmount = totalBet._sum.betAmount || 0;
      const totalWinAmount = totalWon._sum.winAmount || 0;
      const profit = totalWinAmount - totalBetAmount;
      const winRate = totalGames > 0 ? ((totalWinAmount / totalBetAmount) * 100).toFixed(2) : 0;

      return {
        totalGames,
        totalBet: totalBetAmount,
        totalWon: totalWinAmount,
        profit,
        winRate: parseFloat(winRate),
        avgMultiplier: avgMultiplier._avg.multiplier || 0,
        bestGame,
      };
    } catch (error) {
      logger.error('Error getting game stats:', error);
      throw error;
    }
  }

  /**
   * Get global game statistics
   */
  async getGlobalStats(gameMode = null) {
    try {
      const where = gameMode ? { mode: gameMode } : {};

      const [totalGames, totalBet, totalWon, totalPlayers] = await Promise.all([
        this.prisma.game.count({ where }),
        this.prisma.game.aggregate({
          where,
          _sum: { betAmount: true },
        }),
        this.prisma.game.aggregate({
          where,
          _sum: { winAmount: true },
        }),
        this.prisma.game.findMany({
          where,
          select: { userId: true },
          distinct: ['userId'],
        }),
      ]);

      return {
        totalGames,
        totalBet: totalBet._sum.betAmount || 0,
        totalWon: totalWon._sum.betAmount || 0,
        totalPlayers: totalPlayers.length,
      };
    } catch (error) {
      logger.error('Error getting global stats:', error);
      throw error;
    }
  }

  /**
   * Get popular games
   */
  async getPopularGames() {
    try {
      const games = await this.prisma.game.groupBy({
        by: ['mode'],
        _count: { mode: true },
        _sum: { betAmount: true },
        orderBy: {
          _count: { mode: 'desc' },
        },
      });

      return games.map(game => ({
        mode: game.mode,
        plays: game._count.mode,
        totalBet: game._sum.betAmount || 0,
      }));
    } catch (error) {
      logger.error('Error getting popular games:', error);
      throw error;
    }
  }

  /**
   * Get recent big wins
   */
  async getRecentBigWins(limit = 10) {
    try {
      const wins = await this.prisma.game.findMany({
        where: {
          winAmount: { gt: 0 },
        },
        orderBy: { multiplier: 'desc' },
        take: limit,
        include: {
          user: {
            select: {
              username: true,
              firstName: true,
              avatarUrl: true,
            },
          },
        },
      });

      return wins;
    } catch (error) {
      logger.error('Error getting recent big wins:', error);
      throw error;
    }
  }

  /**
   * Start a new CARDS game (get first card)
   */
  startCardsGame() {
    return CardsEngine.startGame();
  }

  /**
   * Get wheel segments for SPIN game
   */
  getSpinSegments() {
    return SpinEngine.getSegments();
  }
}

module.exports = new GameService();
