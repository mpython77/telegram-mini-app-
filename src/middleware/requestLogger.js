/**
 * Request Logger Middleware
 * Logs all incoming HTTP requests
 */

const logger = require('../utils/logger');

/**
 * Log HTTP requests
 */
function requestLogger(req, res, next) {
  const startTime = Date.now();

  // Log request
  logger.http({
    type: 'request',
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;

    logger.http({
      type: 'response',
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    });
  });

  next();
}

module.exports = requestLogger;
