/**
 * Application Configuration
 * Centralized configuration management
 */

require('dotenv').config();

const config = {
  // Server
  server: {
    port: parseInt(process.env.PORT) || 3000,
    host: process.env.HOST || '0.0.0.0',
    env: process.env.NODE_ENV || 'development',
    apiVersion: process.env.API_VERSION || 'v1',
  },

  // Database
  database: {
    url: process.env.DATABASE_URL,
    poolMin: parseInt(process.env.DATABASE_POOL_MIN) || 2,
    poolMax: parseInt(process.env.DATABASE_POOL_MAX) || 10,
  },

  // Redis
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD || '',
    db: parseInt(process.env.REDIS_DB) || 0,
    ttl: {
      short: parseInt(process.env.CACHE_TTL_SHORT) || 300,
      medium: parseInt(process.env.CACHE_TTL_MEDIUM) || 3600,
      long: parseInt(process.env.CACHE_TTL_LONG) || 86400,
    },
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'change-this-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'change-this-refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  // Telegram
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    botUsername: process.env.TELEGRAM_BOT_USERNAME,
    webAppUrl: process.env.TELEGRAM_WEBAPP_URL,
  },

  // Admin
  admin: {
    secretKey: process.env.ADMIN_SECRET_KEY || 'admin-secret',
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin123',
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
  },

  // Game Settings
  game: {
    luck: {
      minValue: parseInt(process.env.LUCK_MIN_VALUE) || 1,
      maxValue: parseInt(process.env.LUCK_MAX_VALUE) || 100,
      minBet: parseInt(process.env.LUCK_MIN_BET) || 10,
      maxBet: parseInt(process.env.LUCK_MAX_BET) || 10000,
    },
    multiplier: {
      min: parseFloat(process.env.MULTIPLIER_MIN) || 0.1,
      max: parseFloat(process.env.MULTIPLIER_MAX) || 100.0,
      jackpot: parseFloat(process.env.MULTIPLIER_JACKPOT) || 1000.0,
    },
    houseEdge: parseFloat(process.env.HOUSE_EDGE) || 2.5,
    dailyLimits: {
      freeSpins: parseInt(process.env.DAILY_FREE_SPINS) || 5,
      challenges: parseInt(process.env.DAILY_CHALLENGE_COUNT) || 3,
      quests: parseInt(process.env.DAILY_QUEST_COUNT) || 5,
    },
  },

  // Economy
  economy: {
    starting: {
      coins: parseInt(process.env.STARTING_COINS) || 1000,
      gems: parseInt(process.env.STARTING_GEMS) || 100,
    },
    conversion: {
      coinsToGems: parseInt(process.env.COINS_TO_GEMS_RATE) || 100,
      gemsToCoins: parseInt(process.env.GEMS_TO_COINS_RATE) || 100,
    },
    referral: {
      referrerCoins: parseInt(process.env.REFERRAL_REWARD_COINS) || 500,
      referrerGems: parseInt(process.env.REFERRAL_REWARD_GEMS) || 50,
      referredCoins: parseInt(process.env.REFERRED_USER_REWARD_COINS) || 200,
    },
    level: {
      xpPerGame: parseInt(process.env.XP_PER_GAME) || 10,
      xpMultiplierWin: parseFloat(process.env.XP_MULTIPLIER_WIN) || 2.0,
      xpMultiplierStreak: parseFloat(process.env.XP_MULTIPLIER_STREAK) || 1.5,
    },
  },

  // Social
  social: {
    maxFriends: parseInt(process.env.MAX_FRIENDS) || 200,
    maxClanMembers: parseInt(process.env.MAX_CLAN_MEMBERS) || 50,
    maxGiftValueCoins: parseInt(process.env.MAX_GIFT_VALUE_COINS) || 5000,
    maxGiftValueGems: parseInt(process.env.MAX_GIFT_VALUE_GEMS) || 100,
    chat: {
      maxMessageLength: parseInt(process.env.MAX_MESSAGE_LENGTH) || 500,
      rateLimit: parseInt(process.env.CHAT_RATE_LIMIT) || 10,
      rateWindow: parseInt(process.env.CHAT_RATE_WINDOW) || 60,
    },
  },

  // Multiplayer
  multiplayer: {
    enabled: process.env.MULTIPLAYER_ENABLED === 'true',
    maxRoomPlayers: parseInt(process.env.MAX_ROOM_PLAYERS) || 10,
    roomTimeout: parseInt(process.env.ROOM_TIMEOUT_SECONDS) || 300,
    matchmakingTimeout: parseInt(process.env.MATCHMAKING_TIMEOUT) || 60,
  },

  // Tournament
  tournament: {
    entryFeeMin: parseInt(process.env.TOURNAMENT_ENTRY_FEE_MIN) || 100,
    entryFeeMax: parseInt(process.env.TOURNAMENT_ENTRY_FEE_MAX) || 10000,
    prizePoolPercentage: parseInt(process.env.TOURNAMENT_PRIZE_POOL_PERCENTAGE) || 90,
    maxParticipants: parseInt(process.env.TOURNAMENT_MAX_PARTICIPANTS) || 1000,
  },

  // Season
  season: {
    durationDays: parseInt(process.env.SEASON_DURATION_DAYS) || 90,
    battlePassPrice: parseInt(process.env.BATTLE_PASS_PRICE_GEMS) || 1000,
    battlePassLevels: parseInt(process.env.BATTLE_PASS_LEVELS) || 100,
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    game: {
      windowMs: parseInt(process.env.RATE_LIMIT_GAME_WINDOW_MS) || 60000,
      max: parseInt(process.env.RATE_LIMIT_GAME_MAX) || 20,
    },
  },

  // Security
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 10,
    sessionSecret: process.env.SESSION_SECRET || 'session-secret',
    corsOrigin: process.env.CORS_ORIGIN || '*',
    allowedOrigins: (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean),
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    maxFiles: process.env.LOG_MAX_FILES || '14d',
    maxSize: process.env.LOG_MAX_SIZE || '20m',
  },

  // External Services
  external: {
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1',
      s3Bucket: process.env.AWS_S3_BUCKET,
    },
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY,
      fromEmail: process.env.SENDGRID_FROM_EMAIL,
    },
    analytics: {
      googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
      mixpanelToken: process.env.MIXPANEL_TOKEN,
    },
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    },
  },

  // Feature Flags
  features: {
    multiplayer: process.env.FEATURE_MULTIPLAYER === 'true',
    tournaments: process.env.FEATURE_TOURNAMENTS === 'true',
    clans: process.env.FEATURE_CLANS === 'true',
    shop: process.env.FEATURE_SHOP === 'true',
    battlePass: process.env.FEATURE_BATTLE_PASS === 'true',
    referrals: process.env.FEATURE_REFERRALS === 'true',
    chat: process.env.FEATURE_CHAT === 'true',
    gifts: process.env.FEATURE_GIFTS === 'true',
    analytics: process.env.FEATURE_ANALYTICS === 'true',
  },

  // Maintenance
  maintenance: {
    enabled: process.env.MAINTENANCE_MODE === 'true',
    message: process.env.MAINTENANCE_MESSAGE || 'System maintenance in progress.',
  },

  // Webhook
  webhook: {
    secret: process.env.WEBHOOK_SECRET,
    enabled: process.env.WEBHOOK_ENABLED === 'true',
  },

  // Monitoring
  monitoring: {
    sentryDsn: process.env.SENTRY_DSN,
    slackWebhook: process.env.SLACK_WEBHOOK_URL,
    alertEmail: process.env.ALERT_EMAIL,
  },

  // Performance
  performance: {
    compressionEnabled: process.env.COMPRESSION_ENABLED !== 'false',
    compressionLevel: parseInt(process.env.COMPRESSION_LEVEL) || 6,
    responseCacheEnabled: process.env.RESPONSE_CACHE_ENABLED !== 'false',
  },
};

// Validate required configuration
function validateConfig() {
  const required = [
    'database.url',
    'jwt.secret',
  ];

  const missing = [];

  for (const key of required) {
    const keys = key.split('.');
    let value = config;

    for (const k of keys) {
      value = value[k];
      if (value === undefined) {
        missing.push(key);
        break;
      }
    }
  }

  if (missing.length > 0) {
    console.warn(`⚠️  Missing recommended configuration: ${missing.join(', ')}`);
    console.warn('⚠️  Application may not function correctly without these variables.');
  }
}

// Validate on load (except in test environment)
if (process.env.NODE_ENV !== 'test') {
  validateConfig();
}

module.exports = config;
