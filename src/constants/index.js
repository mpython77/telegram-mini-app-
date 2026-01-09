/**
 * Application Constants
 * Centralized constants and enums
 */

// Game Types
const GAME_TYPES = {
  SINGLE: 'SINGLE',
  MULTIPLAYER: 'MULTIPLAYER',
  TOURNAMENT: 'TOURNAMENT',
  CHALLENGE: 'CHALLENGE',
};

// Game Modes
const GAME_MODES = {
  LUCK: 'LUCK',
  SLOTS: 'SLOTS',
  SPIN: 'SPIN',
  DICE: 'DICE',
  CARDS: 'CARDS',
  FLIP: 'FLIP',
  SCRATCH: 'SCRATCH',
};

// Achievement Tiers
const ACHIEVEMENT_TIERS = {
  BRONZE: 'BRONZE',
  SILVER: 'SILVER',
  GOLD: 'GOLD',
  PLATINUM: 'PLATINUM',
  DIAMOND: 'DIAMOND',
};

// Item Types
const ITEM_TYPES = {
  THEME: 'THEME',
  AVATAR: 'AVATAR',
  EFFECT: 'EFFECT',
  BOOST: 'BOOST',
};

// Item Rarities
const ITEM_RARITIES = {
  COMMON: 'COMMON',
  RARE: 'RARE',
  EPIC: 'EPIC',
  LEGENDARY: 'LEGENDARY',
};

// Friend Status
const FRIEND_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  BLOCKED: 'BLOCKED',
};

// Gift Status
const GIFT_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
};

// Multiplayer Status
const MULTIPLAYER_STATUS = {
  WAITING: 'WAITING',
  ACTIVE: 'ACTIVE',
  FINISHED: 'FINISHED',
  CANCELLED: 'CANCELLED',
};

// Tournament Status
const TOURNAMENT_STATUS = {
  UPCOMING: 'UPCOMING',
  ACTIVE: 'ACTIVE',
  FINISHED: 'FINISHED',
};

// Quest Types
const QUEST_TYPES = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  SPECIAL: 'SPECIAL',
};

// Clan Roles
const CLAN_ROLES = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
};

// Transaction Types
const TRANSACTION_TYPES = {
  GAME_WIN: 'GAME_WIN',
  GAME_LOSS: 'GAME_LOSS',
  PURCHASE: 'PURCHASE',
  REWARD: 'REWARD',
  GIFT_SENT: 'GIFT_SENT',
  GIFT_RECEIVED: 'GIFT_RECEIVED',
  REFERRAL: 'REFERRAL',
  ACHIEVEMENT: 'ACHIEVEMENT',
  QUEST: 'QUEST',
  TOURNAMENT: 'TOURNAMENT',
  ADMIN_GRANT: 'ADMIN_GRANT',
  ADMIN_DEDUCT: 'ADMIN_DEDUCT',
};

// Notification Types
const NOTIFICATION_TYPES = {
  GAME: 'GAME',
  ACHIEVEMENT: 'ACHIEVEMENT',
  FRIEND: 'FRIEND',
  GIFT: 'GIFT',
  CLAN: 'CLAN',
  TOURNAMENT: 'TOURNAMENT',
  SYSTEM: 'SYSTEM',
  PROMOTION: 'PROMOTION',
};

// Analytics Event Types
const ANALYTICS_EVENTS = {
  USER_REGISTERED: 'USER_REGISTERED',
  USER_LOGIN: 'USER_LOGIN',
  GAME_STARTED: 'GAME_STARTED',
  GAME_FINISHED: 'GAME_FINISHED',
  PURCHASE_MADE: 'PURCHASE_MADE',
  ACHIEVEMENT_UNLOCKED: 'ACHIEVEMENT_UNLOCKED',
  FRIEND_ADDED: 'FRIEND_ADDED',
  CLAN_JOINED: 'CLAN_JOINED',
  TOURNAMENT_JOINED: 'TOURNAMENT_JOINED',
  QUEST_COMPLETED: 'QUEST_COMPLETED',
};

// Error Codes
const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  MAINTENANCE_MODE: 'MAINTENANCE_MODE',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
};

// Success Messages
const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  GAME_COMPLETED: 'Game completed successfully',
  PURCHASE_COMPLETED: 'Purchase completed successfully',
  GIFT_SENT: 'Gift sent successfully',
  FRIEND_ADDED: 'Friend added successfully',
  CLAN_CREATED: 'Clan created successfully',
  ACHIEVEMENT_UNLOCKED: 'Achievement unlocked!',
};

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Cache Keys
const CACHE_KEYS = {
  USER: (id) => `user:${id}`,
  LEADERBOARD: (type) => `leaderboard:${type}`,
  TOURNAMENT: (id) => `tournament:${id}`,
  SEASON: (id) => `season:${id}`,
  CLAN: (id) => `clan:${id}`,
  DAILY_CHALLENGE: (date) => `challenge:${date}`,
  SHOP_ITEMS: 'shop:items',
  ACTIVE_QUESTS: 'quests:active',
};

// Rate Limit Keys
const RATE_LIMIT_KEYS = {
  GAME: (userId) => `rate:game:${userId}`,
  API: (ip) => `rate:api:${ip}`,
  CHAT: (userId) => `rate:chat:${userId}`,
  GIFT: (userId) => `rate:gift:${userId}`,
};

// WebSocket Events
const SOCKET_EVENTS = {
  // Client to Server
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  SEND_MESSAGE: 'send_message',
  GAME_ACTION: 'game_action',

  // Server to Client
  ROOM_JOINED: 'room_joined',
  ROOM_LEFT: 'room_left',
  MESSAGE_RECEIVED: 'message_received',
  GAME_UPDATE: 'game_update',
  PLAYER_JOINED: 'player_joined',
  PLAYER_LEFT: 'player_left',
  LEADERBOARD_UPDATE: 'leaderboard_update',
  NOTIFICATION: 'notification',
  ERROR: 'error',
};

// Pagination
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// Regex Patterns
const REGEX_PATTERNS = {
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  CLAN_TAG: /^[A-Z0-9]{2,6}$/,
  REFERRAL_CODE: /^[A-Z0-9]{8}$/,
};

module.exports = {
  GAME_TYPES,
  GAME_MODES,
  ACHIEVEMENT_TIERS,
  ITEM_TYPES,
  ITEM_RARITIES,
  FRIEND_STATUS,
  GIFT_STATUS,
  MULTIPLAYER_STATUS,
  TOURNAMENT_STATUS,
  QUEST_TYPES,
  CLAN_ROLES,
  TRANSACTION_TYPES,
  NOTIFICATION_TYPES,
  ANALYTICS_EVENTS,
  ERROR_CODES,
  SUCCESS_MESSAGES,
  HTTP_STATUS,
  CACHE_KEYS,
  RATE_LIMIT_KEYS,
  SOCKET_EVENTS,
  PAGINATION,
  REGEX_PATTERNS,
};
