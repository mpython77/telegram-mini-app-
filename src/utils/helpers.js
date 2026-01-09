/**
 * Helper Functions
 * Utility functions for common operations
 */

const config = require('../config');
const dayjs = require('dayjs');
const { nanoid } = require('nanoid');
const crypto = require('crypto');

/**
 * Generate unique ID
 */
function generateId(length = 10) {
  return nanoid(length);
}

/**
 * Generate referral code
 */
function generateReferralCode() {
  return nanoid(8).toUpperCase();
}

/**
 * Hash password
 */
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Generate random number in range
 */
function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Calculate percentage
 */
function calculatePercentage(part, total) {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}

/**
 * Format number with separators
 */
function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format currency
 */
function formatCurrency(amount, currency = 'coins') {
  const icon = currency === 'coins' ? '🪙' : '💎';
  return `${icon} ${formatNumber(amount)}`;
}

/**
 * Calculate level from experience
 */
function calculateLevel(experience) {
  // Formula: level = sqrt(experience / 100)
  return Math.floor(Math.sqrt(experience / 100)) + 1;
}

/**
 * Calculate experience needed for next level
 */
function experienceForNextLevel(level) {
  // Formula: exp = (level^2) * 100
  return Math.pow(level, 2) * 100;
}

/**
 * Calculate multiplier based on score
 */
function calculateMultiplier(score, gameMode = 'LUCK') {
  const { min, max } = config.game.multiplier;

  // Base multiplier based on score
  let multiplier = min + ((score / 100) * (max - min));

  // Special bonuses
  if (score === 100) {
    multiplier = config.game.multiplier.jackpot; // Jackpot!
  } else if (score >= 95) {
    multiplier *= 10;
  } else if (score >= 90) {
    multiplier *= 5;
  } else if (score >= 80) {
    multiplier *= 2;
  }

  // Game mode modifiers
  switch (gameMode) {
    case 'SLOTS':
      multiplier *= 1.5;
      break;
    case 'SPIN':
      multiplier *= 1.3;
      break;
    case 'SCRATCH':
      multiplier *= 1.2;
      break;
  }

  // Apply house edge
  multiplier *= (1 - (config.game.houseEdge / 100));

  return parseFloat(multiplier.toFixed(2));
}

/**
 * Calculate win amount
 */
function calculateWinAmount(betAmount, multiplier) {
  return Math.floor(betAmount * multiplier);
}

/**
 * Get luck message and color
 */
function getLuckMessage(score) {
  if (score === 100) {
    return { message: "💯 PERFECT! Jackpot!", emoji: "🎰", color: "#FFD700" };
  } else if (score >= 95) {
    return { message: "🌟 AMAZING! Legendary luck!", emoji: "⭐", color: "#FF6B6B" };
  } else if (score >= 90) {
    return { message: "🔥 EXCELLENT! On fire!", emoji: "🔥", color: "#FF8C00" };
  } else if (score >= 80) {
    return { message: "✨ GREAT! Very lucky!", emoji: "✨", color: "#4ECDC4" };
  } else if (score >= 70) {
    return { message: "👍 GOOD! Above average!", emoji: "😊", color: "#95E1D3" };
  } else if (score >= 50) {
    return { message: "😐 AVERAGE! Try again!", emoji: "🎯", color: "#AA96DA" };
  } else if (score >= 30) {
    return { message: "😕 LOW! Better luck next time!", emoji: "😕", color: "#FCBAD3" };
  } else {
    return { message: "😢 UNLUCKY! Don't give up!", emoji: "💔", color: "#A8D8EA" };
  }
}

/**
 * Calculate user rank based on level and score
 */
function calculateUserRank(level, bestScore) {
  if (level >= 100 || bestScore >= 95) return { title: "Legendary", icon: "👑", color: "#FFD700" };
  if (level >= 75 || bestScore >= 85) return { title: "Master", icon: "🏆", color: "#C0C0C0" };
  if (level >= 50 || bestScore >= 75) return { title: "Expert", icon: "⭐", color: "#CD7F32" };
  if (level >= 30 || bestScore >= 60) return { title: "Advanced", icon: "🎯", color: "#4ECDC4" };
  if (level >= 15 || bestScore >= 40) return { title: "Intermediate", icon: "📈", color: "#95E1D3" };
  if (level >= 5 || bestScore >= 20) return { title: "Beginner", icon: "🌱", color: "#F38181" };
  return { title: "Novice", icon: "🎮", color: "#AA96DA" };
}

/**
 * Format date
 */
function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(date).format(format);
}

/**
 * Get today's date
 */
function getTodayDate() {
  return dayjs().format('YYYY-MM-DD');
}

/**
 * Calculate streak
 */
function calculateStreak(lastPlayDate) {
  if (!lastPlayDate) return { type: 'new', streak: 1 };

  const today = dayjs();
  const lastDate = dayjs(lastPlayDate);
  const diffDays = today.diff(lastDate, 'day');

  if (diffDays === 0) return { type: 'same', streak: 0 }; // Same day
  if (diffDays === 1) return { type: 'continue', streak: 1 }; // Continue streak
  return { type: 'break', streak: 0 }; // Streak broken
}

/**
 * Validate bet amount
 */
function validateBetAmount(betAmount, userCoins, gameMode = 'LUCK') {
  const { minBet, maxBet } = config.game.luck;

  if (betAmount < minBet) {
    return { valid: false, error: `Minimum bet is ${minBet} coins` };
  }

  if (betAmount > maxBet) {
    return { valid: false, error: `Maximum bet is ${maxBet} coins` };
  }

  if (betAmount > userCoins) {
    return { valid: false, error: 'Insufficient coins' };
  }

  return { valid: true };
}

/**
 * Sanitize user input
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input
    .trim()
    .replace(/[<>]/g, '')
    .slice(0, 1000); // Max length
}

/**
 * Generate room code
 */
function generateRoomCode() {
  return nanoid(6).toUpperCase();
}

/**
 * Calculate tournament prize distribution
 */
function calculateTournamentPrizes(prizePool, participantCount) {
  const prizes = [];
  const percentages = [50, 30, 20]; // Top 3 distribution

  percentages.forEach((percent, index) => {
    prizes.push({
      position: index + 1,
      amount: Math.floor(prizePool * (percent / 100)),
    });
  });

  return prizes;
}

/**
 * Check if feature is enabled
 */
function isFeatureEnabled(feature) {
  return config.features[feature] === true;
}

/**
 * Generate session token
 */
function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Calculate achievement progress
 */
function calculateAchievementProgress(achievement, userStats) {
  const { requirementType, requirementValue } = achievement;

  let current = 0;

  switch (requirementType) {
    case 'GAMES_PLAYED':
      current = userStats.totalGames;
      break;
    case 'BEST_SCORE':
      current = userStats.bestScore;
      break;
    case 'TOTAL_WINS':
      current = userStats.totalWins;
      break;
    case 'STREAK':
      current = userStats.longestStreak;
      break;
    case 'LEVEL':
      current = userStats.level;
      break;
    default:
      current = 0;
  }

  const progress = Math.min(100, calculatePercentage(current, requirementValue));
  const unlocked = current >= requirementValue;

  return { current, required: requirementValue, progress, unlocked };
}

/**
 * Validate Telegram WebApp data
 */
function validateTelegramWebAppData(initData) {
  // TODO: Implement proper Telegram WebApp data validation
  // For now, basic validation
  if (!initData || !initData.user) {
    return { valid: false, error: 'Invalid Telegram data' };
  }

  return { valid: true, user: initData.user };
}

/**
 * Generate daily challenge
 */
function generateDailyChallenge() {
  const challenges = [
    { type: 'SCORE_TARGET', requirement: randomInRange(80, 95), reward: { coins: 500, gems: 10, experience: 100 } },
    { type: 'PLAY_GAMES', requirement: randomInRange(5, 10), reward: { coins: 300, gems: 5, experience: 50 } },
    { type: 'WIN_STREAK', requirement: randomInRange(3, 5), reward: { coins: 400, gems: 8, experience: 75 } },
  ];

  return challenges[randomInRange(0, challenges.length - 1)];
}

/**
 * Sleep/delay function
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry function with exponential backoff
 */
async function retryWithBackoff(fn, maxRetries = 3, initialDelay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = initialDelay * Math.pow(2, i);
      await sleep(delay);
    }
  }
}

/**
 * Paginate array
 */
function paginate(array, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  return {
    data: array.slice(offset, offset + limit),
    pagination: {
      page,
      limit,
      total: array.length,
      totalPages: Math.ceil(array.length / limit),
    },
  };
}

module.exports = {
  generateId,
  generateReferralCode,
  hashPassword,
  randomInRange,
  calculatePercentage,
  formatNumber,
  formatCurrency,
  calculateLevel,
  experienceForNextLevel,
  calculateMultiplier,
  calculateWinAmount,
  getLuckMessage,
  calculateUserRank,
  formatDate,
  getTodayDate,
  calculateStreak,
  validateBetAmount,
  sanitizeInput,
  generateRoomCode,
  calculateTournamentPrizes,
  isFeatureEnabled,
  generateSessionToken,
  calculateAchievementProgress,
  validateTelegramWebAppData,
  generateDailyChallenge,
  sleep,
  retryWithBackoff,
  paginate,
};
