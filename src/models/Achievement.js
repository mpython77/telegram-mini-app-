const db = require('../../config/database');
const config = require('../../config/config');

class Achievement {
  /**
   * Get all achievements
   */
  static async getAll() {
    return config.achievements;
  }

  /**
   * Get user's unlocked achievements
   */
  static async getUserAchievements(userId) {
    const unlocked = await db.query(
      `SELECT achievement_id, unlocked_at
       FROM user_achievements
       WHERE user_id = ?
       ORDER BY unlocked_at DESC`,
      [userId]
    );

    return unlocked.map(a => {
      const achievement = config.achievements.find(ach => ach.id === a.achievement_id);
      return {
        ...achievement,
        unlockedAt: a.unlocked_at,
      };
    });
  }

  /**
   * Check if user has achievement
   */
  static async hasAchievement(userId, achievementId) {
    const result = await db.get(
      'SELECT * FROM user_achievements WHERE user_id = ? AND achievement_id = ?',
      [userId, achievementId]
    );
    return !!result;
  }

  /**
   * Unlock achievement for user
   */
  static async unlock(userId, achievementId) {
    const hasIt = await this.hasAchievement(userId, achievementId);
    if (hasIt) return false;

    try {
      await db.run(
        'INSERT INTO user_achievements (user_id, achievement_id) VALUES (?, ?)',
        [userId, achievementId]
      );
      return true;
    } catch (error) {
      // Ignore duplicate errors
      return false;
    }
  }

  /**
   * Get achievement progress
   */
  static async getProgress(userId) {
    const unlocked = await this.getUserAchievements(userId);
    const total = config.achievements.length;

    return {
      unlocked: unlocked.length,
      total: total,
      percentage: Math.round((unlocked.length / total) * 100),
      achievements: unlocked,
    };
  }

  /**
   * Get achievement by ID
   */
  static getById(achievementId) {
    return config.achievements.find(a => a.id === achievementId);
  }

  /**
   * Get leaderboard by achievements count
   */
  static async getLeaderboard(limit = 10) {
    return await db.query(
      `SELECT
        u.id,
        u.telegram_id,
        u.first_name,
        u.last_name,
        u.username,
        COUNT(ua.id) as achievements_count
       FROM users u
       LEFT JOIN user_achievements ua ON u.id = ua.user_id
       GROUP BY u.id
       ORDER BY achievements_count DESC
       LIMIT ?`,
      [limit]
    );
  }
}

module.exports = Achievement;
