const db = require('../../config/database');
const { sanitizeInput, calculateStreak, getTodayDate } = require('../utils/helpers');

class User {
  /**
   * Create or update user
   */
  static async upsert(userData) {
    const { telegramId, firstName, lastName, username } = userData;

    // Check if user exists
    const existing = await db.get(
      'SELECT * FROM users WHERE telegram_id = ?',
      [telegramId]
    );

    if (existing) {
      // Update existing user
      await db.run(
        `UPDATE users SET
          first_name = ?,
          last_name = ?,
          username = ?,
          updated_at = CURRENT_TIMESTAMP
         WHERE telegram_id = ?`,
        [sanitizeInput(firstName), sanitizeInput(lastName), sanitizeInput(username), telegramId]
      );
      return await this.findByTelegramId(telegramId);
    } else {
      // Create new user
      const result = await db.run(
        `INSERT INTO users (telegram_id, first_name, last_name, username)
         VALUES (?, ?, ?, ?)`,
        [telegramId, sanitizeInput(firstName), sanitizeInput(lastName), sanitizeInput(username)]
      );
      return await this.findById(result.id);
    }
  }

  /**
   * Find user by ID
   */
  static async findById(id) {
    return await db.get('SELECT * FROM users WHERE id = ?', [id]);
  }

  /**
   * Find user by Telegram ID
   */
  static async findByTelegramId(telegramId) {
    return await db.get('SELECT * FROM users WHERE telegram_id = ?', [telegramId]);
  }

  /**
   * Update user stats after game
   */
  static async updateStats(userId, score) {
    const user = await this.findById(userId);
    if (!user) return null;

    const newTotalGames = user.total_games + 1;
    const newBestScore = Math.max(user.best_score, score);
    const newTotalPoints = user.total_points + score;

    // Calculate streak
    const streakResult = calculateStreak(user.last_play_date);
    let newCurrentStreak = user.current_streak;
    let newLongestStreak = user.longest_streak;

    if (streakResult === 'continue') {
      newCurrentStreak += 1;
      newLongestStreak = Math.max(newLongestStreak, newCurrentStreak);
    } else if (streakResult === 'same') {
      // Same day, no change
    } else {
      newCurrentStreak = 1; // Reset streak
    }

    await db.run(
      `UPDATE users SET
        best_score = ?,
        total_games = ?,
        total_points = ?,
        current_streak = ?,
        longest_streak = ?,
        last_play_date = ?,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [newBestScore, newTotalGames, newTotalPoints, newCurrentStreak, newLongestStreak, getTodayDate(), userId]
    );

    return await this.findById(userId);
  }

  /**
   * Get user stats
   */
  static async getStats(telegramId) {
    const user = await this.findByTelegramId(telegramId);
    if (!user) return null;

    return {
      bestScore: user.best_score,
      totalGames: user.total_games,
      totalPoints: user.total_points,
      currentStreak: user.current_streak,
      longestStreak: user.longest_streak,
      lastPlayDate: user.last_play_date,
    };
  }

  /**
   * Get all users (for admin)
   */
  static async getAll(limit = 100, offset = 0) {
    return await db.query(
      `SELECT * FROM users
       ORDER BY best_score DESC, total_games DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
  }

  /**
   * Get total users count
   */
  static async count() {
    const result = await db.get('SELECT COUNT(*) as count FROM users');
    return result.count;
  }

  /**
   * Delete user
   */
  static async delete(userId) {
    await db.run('DELETE FROM users WHERE id = ?', [userId]);
  }
}

module.exports = User;
