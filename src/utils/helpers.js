const config = require('../../config/config');

/**
 * Generate random luck value
 */
function generateLuck() {
  return Math.floor(Math.random() * (config.game.maxLuck - config.game.minLuck + 1)) + config.game.minLuck;
}

/**
 * Get luck message based on score
 */
function getLuckMessage(score) {
  if (score === 100) {
    return { message: "🌟 PERFECT! Absolute perfection!", emoji: "💯", color: "#FFD700" };
  } else if (score >= 95) {
    return { message: "🎉 AMAZING! You're incredibly lucky!", emoji: "🌟", color: "#FF6B6B" };
  } else if (score >= 90) {
    return { message: "⭐ EXCELLENT! Outstanding luck!", emoji: "✨", color: "#4ECDC4" };
  } else if (score >= 80) {
    return { message: "🎊 GREAT! Your luck is shining!", emoji: "😊", color: "#95E1D3" };
  } else if (score >= 70) {
    return { message: "👍 GOOD! Pretty lucky today!", emoji: "🙂", color: "#F38181" };
  } else if (score >= 50) {
    return { message: "😐 AVERAGE! Not bad, not great!", emoji: "😐", color: "#AA96DA" };
  } else if (score >= 30) {
    return { message: "😕 LOW! Try again for better luck!", emoji: "😕", color: "#FCBAD3" };
  } else {
    return { message: "😢 UNLUCKY! Don't give up!", emoji: "😢", color: "#A8D8EA" };
  }
}

/**
 * Calculate user rank based on best score
 */
function calculateRank(bestScore) {
  if (bestScore >= 95) return { title: "Legendary", icon: "👑", color: "#FFD700" };
  if (bestScore >= 85) return { title: "Master", icon: "🏆", color: "#C0C0C0" };
  if (bestScore >= 75) return { title: "Expert", icon: "⭐", color: "#CD7F32" };
  if (bestScore >= 60) return { title: "Advanced", icon: "🎯", color: "#4ECDC4" };
  if (bestScore >= 40) return { title: "Intermediate", icon: "📈", color: "#95E1D3" };
  if (bestScore >= 20) return { title: "Beginner", icon: "🌱", color: "#F38181" };
  return { title: "Novice", icon: "👶", color: "#AA96DA" };
}

/**
 * Get today's date in YYYY-MM-DD format
 */
function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Calculate streak
 */
function calculateStreak(lastPlayDate) {
  if (!lastPlayDate) return 1;

  const today = new Date();
  const lastDate = new Date(lastPlayDate);
  const diffTime = Math.abs(today - lastDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return 'continue'; // Continue streak
  if (diffDays === 0) return 'same'; // Same day
  return 'break'; // Streak broken
}

/**
 * Generate daily challenge target
 */
function generateDailyChallengeTarget() {
  return Math.floor(Math.random() * 20) + 80; // Random between 80-100
}

/**
 * Format number with comma separators
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Sanitize user input
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input.replace(/[<>]/g, '');
}

/**
 * Check if user unlocked achievement
 */
function checkAchievement(achievement, userStats) {
  const { type, value } = achievement.requirement;

  switch (type) {
    case 'games':
      return userStats.totalGames >= value;
    case 'score':
      return userStats.bestScore >= value;
    case 'streak':
      return userStats.longestStreak >= value;
    case 'rank':
      return userStats.rank <= value;
    default:
      return false;
  }
}

module.exports = {
  generateLuck,
  getLuckMessage,
  calculateRank,
  getTodayDate,
  calculateStreak,
  generateDailyChallengeTarget,
  formatNumber,
  sanitizeInput,
  checkAchievement,
};
