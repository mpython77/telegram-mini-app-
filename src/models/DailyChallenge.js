const db = require('../../config/database');
const { getTodayDate, generateDailyChallengeTarget } = require('../utils/helpers');

class DailyChallenge {
  /**
   * Get or create today's challenge for user
   */
  static async getTodayChallenge(userId) {
    const today = getTodayDate();

    let challenge = await db.get(
      'SELECT * FROM daily_challenges WHERE user_id = ? AND challenge_date = ?',
      [userId, today]
    );

    if (!challenge) {
      // Create new challenge
      const target = generateDailyChallengeTarget();
      const result = await db.run(
        'INSERT INTO daily_challenges (user_id, challenge_date, target_score) VALUES (?, ?, ?)',
        [userId, today, target]
      );
      challenge = await db.get('SELECT * FROM daily_challenges WHERE id = ?', [result.id]);
    }

    return challenge;
  }

  /**
   * Check and complete challenge if score meets target
   */
  static async checkAndComplete(userId, score) {
    const challenge = await this.getTodayChallenge(userId);

    if (challenge.completed) {
      return { completed: true, alreadyCompleted: true };
    }

    if (score >= challenge.target_score) {
      await db.run(
        'UPDATE daily_challenges SET completed = 1 WHERE id = ?',
        [challenge.id]
      );
      return { completed: true, alreadyCompleted: false, reward: 50 };
    }

    return { completed: false };
  }

  /**
   * Claim challenge reward
   */
  static async claimReward(userId) {
    const today = getTodayDate();
    const challenge = await db.get(
      'SELECT * FROM daily_challenges WHERE user_id = ? AND challenge_date = ?',
      [userId, today]
    );

    if (!challenge || !challenge.completed || challenge.reward_claimed) {
      return { success: false, error: 'Cannot claim reward' };
    }

    await db.run(
      'UPDATE daily_challenges SET reward_claimed = 1 WHERE id = ?',
      [challenge.id]
    );

    // Add points to user
    await db.run(
      'UPDATE users SET total_points = total_points + 50 WHERE id = ?',
      [userId]
    );

    return { success: true, reward: 50 };
  }

  /**
   * Get user's challenge history
   */
  static async getUserHistory(userId, limit = 30) {
    return await db.query(
      `SELECT * FROM daily_challenges
       WHERE user_id = ?
       ORDER BY challenge_date DESC
       LIMIT ?`,
      [userId, limit]
    );
  }

  /**
   * Get challenge completion stats
   */
  static async getStats(userId) {
    const completed = await db.get(
      'SELECT COUNT(*) as count FROM daily_challenges WHERE user_id = ? AND completed = 1',
      [userId]
    );

    const total = await db.get(
      'SELECT COUNT(*) as count FROM daily_challenges WHERE user_id = ?',
      [userId]
    );

    return {
      completed: completed.count,
      total: total.count,
      completionRate: total.count > 0 ? Math.round((completed.count / total.count) * 100) : 0,
    };
  }
}

module.exports = DailyChallenge;
