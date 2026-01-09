/**
 * Request Validation Middleware
 * Validates incoming requests using express-validator
 */

const { body, param, query, validationResult } = require('express-validator');

/**
 * Validate request and return errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

/**
 * User validation rules
 */
const userValidation = {
  create: [
    body('telegramId').isInt().withMessage('Telegram ID must be an integer'),
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('username').optional().trim(),
    body('lastName').optional().trim(),
    validate,
  ],
};

/**
 * Game validation rules
 */
const gameValidation = {
  play: [
    body('gameMode')
      .isIn(['LUCK', 'SLOTS', 'SPIN', 'DICE', 'FLIP', 'CARDS', 'SCRATCH'])
      .withMessage('Invalid game mode'),
    body('betAmount')
      .isInt({ min: 10, max: 100000 })
      .withMessage('Bet amount must be between 10 and 100000'),
    validate,
  ],

  dice: [
    body('gameMode').equals('DICE').withMessage('Game mode must be DICE'),
    body('betAmount')
      .isInt({ min: 10, max: 100000 })
      .withMessage('Bet amount must be between 10 and 100000'),
    body('target')
      .isInt({ min: 2, max: 98 })
      .withMessage('Target must be between 2 and 98'),
    body('isOver').isBoolean().withMessage('isOver must be a boolean'),
    validate,
  ],

  flip: [
    body('gameMode').equals('FLIP').withMessage('Game mode must be FLIP'),
    body('betAmount')
      .isInt({ min: 10, max: 100000 })
      .withMessage('Bet amount must be between 10 and 100000'),
    body('prediction')
      .isIn(['HEADS', 'TAILS', 'heads', 'tails'])
      .withMessage('Prediction must be HEADS or TAILS'),
    validate,
  ],

  cards: [
    body('gameMode').equals('CARDS').withMessage('Game mode must be CARDS'),
    body('betAmount')
      .isInt({ min: 10, max: 100000 })
      .withMessage('Bet amount must be between 10 and 100000'),
    body('currentCard').isObject().withMessage('Current card is required'),
    body('prediction')
      .isIn(['HIGHER', 'LOWER', 'EQUAL'])
      .withMessage('Prediction must be HIGHER, LOWER, or EQUAL'),
    validate,
  ],
};

/**
 * Leaderboard validation rules
 */
const leaderboardValidation = {
  list: [
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be non-negative'),
    validate,
  ],
};

/**
 * Transaction validation rules
 */
const transactionValidation = {
  create: [
    body('type').notEmpty().withMessage('Transaction type is required'),
    body('amountCoins').optional().isInt().withMessage('Amount coins must be an integer'),
    body('amountGems').optional().isInt().withMessage('Amount gems must be an integer'),
    validate,
  ],
};

/**
 * Clan validation rules
 */
const clanValidation = {
  create: [
    body('name')
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage('Clan name must be between 3 and 50 characters'),
    body('tag')
      .trim()
      .isLength({ min: 2, max: 6 })
      .matches(/^[A-Z0-9]+$/)
      .withMessage('Clan tag must be 2-6 uppercase letters/numbers'),
    body('description')
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description must be less than 500 characters'),
    validate,
  ],

  update: [
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description must be less than 500 characters'),
    body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean'),
    validate,
  ],
};

/**
 * Gift validation rules
 */
const giftValidation = {
  send: [
    body('receiverId').notEmpty().withMessage('Receiver ID is required'),
    body('giftType').notEmpty().withMessage('Gift type is required'),
    body('giftData').isObject().withMessage('Gift data must be an object'),
    body('message').optional().trim().isLength({ max: 200 }).withMessage('Message too long'),
    validate,
  ],
};

/**
 * Multiplayer validation rules
 */
const multiplayerValidation = {
  createRoom: [
    body('gameMode')
      .isIn(['LUCK', 'SLOTS', 'SPIN', 'DICE', 'FLIP', 'CARDS', 'SCRATCH'])
      .withMessage('Invalid game mode'),
    body('betAmount')
      .isInt({ min: 10, max: 100000 })
      .withMessage('Bet amount must be between 10 and 100000'),
    body('maxPlayers')
      .optional()
      .isInt({ min: 2, max: 10 })
      .withMessage('Max players must be between 2 and 10'),
    validate,
  ],

  joinRoom: [
    body('roomCode')
      .trim()
      .isLength({ min: 4, max: 10 })
      .withMessage('Invalid room code'),
    validate,
  ],
};

module.exports = {
  validate,
  userValidation,
  gameValidation,
  leaderboardValidation,
  transactionValidation,
  clanValidation,
  giftValidation,
  multiplayerValidation,
};
