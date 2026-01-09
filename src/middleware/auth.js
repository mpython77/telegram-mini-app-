const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const logger = require('../utils/logger');

/**
 * Verify Telegram user data
 */
function verifyTelegramAuth(req, res, next) {
  try {
    const telegramId = req.body.telegramId || req.query.telegramId;

    if (!telegramId) {
      return res.status(401).json({
        success: false,
        error: 'Telegram authentication required'
      });
    }

    // In production, you should verify the Telegram WebApp init data
    // For now, we'll just pass the telegramId through
    req.telegramId = telegramId;
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
  }
}

/**
 * Verify admin JWT token
 */
function verifyAdminToken(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Admin token required'
      });
    }

    const decoded = jwt.verify(token, config.jwt.secret);

    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    logger.error('Admin auth error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid admin token'
    });
  }
}

/**
 * Optional auth - doesn't fail if no auth provided
 */
function optionalAuth(req, res, next) {
  try {
    const telegramId = req.body.telegramId || req.query.telegramId;
    if (telegramId) {
      req.telegramId = telegramId;
    }
    next();
  } catch (error) {
    logger.error('Optional auth error:', error);
    next();
  }
}

module.exports = {
  verifyTelegramAuth,
  verifyAdminToken,
  optionalAuth,
};
