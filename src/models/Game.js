const db = require('../../config/database');

class Game {
  /**
   * Create new game record
   */
  static async create(userId, score, gameType = 'normal') {
    const result = await db.run(
      'INSERT INTO games (user_id, score, game_type) VALUES (?, ?, ?)',
      [userId, score, gameType]
    );
    return await this.findById(result.id);
  }

  /**
   * Find game by ID
   */
  static async findById(id) {
    return await db.get('SELECT * FROM games WHERE id = ?', [id]);
  }

  /**
   * Get user's game history
   */
  static async getUserGames(userId, limit = 50) {
    return await db.query(
      `SELECT * FROM games
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ?`,
      [userId, limit]
    );
  }

  /**
   * Get recent games (for admin)
   */
  static async getRecent(limit = 100) {
    return await db.query(
      `SELECT g.*, u.first_name, u.last_name, u.username
       FROM games g
       JOIN users u ON g.user_id = u.id
       ORDER BY g.created_at DESC
       LIMIT ?`,
      [limit]
    );
  }

  /**
   * Get games count
   */
  static async count() {
    const result = await db.get('SELECT COUNT(*) as count FROM games');
    return result.count;
  }

  /**
   * Get games count by user
   */
  static async countByUser(userId) {
    const result = await db.get(
      'SELECT COUNT(*) as count FROM games WHERE user_id = ?',
      [userId]
    );
    return result.count;
  }

  /**
   * Get average score
   */
  static async getAverageScore() {
    const result = await db.get('SELECT AVG(score) as avg FROM games');
    return Math.round(result.avg || 0);
  }

  /**
   * Get user's average score
   */
  static async getUserAverageScore(userId) {
    const result = await db.get(
      'SELECT AVG(score) as avg FROM games WHERE user_id = ?',
      [userId]
    );
    return Math.round(result.avg || 0);
  }

  /**
   * Delete old games (cleanup)
   */
  static async deleteOlderThan(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    const dateStr = date.toISOString();

    const result = await db.run(
      'DELETE FROM games WHERE created_at < ?',
      [dateStr]
    );
    return result.changes;
  }
}

module.exports = Game;
