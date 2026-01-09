/**
 * Prisma Database Seed
 * Populate database with initial data
 */

const { PrismaClient } = require('@prisma/client');
const { nanoid } = require('nanoid');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (optional - comment out in production)
  if (process.env.NODE_ENV !== 'production') {
    console.log('🧹 Cleaning existing data...');
    await prisma.userAchievement.deleteMany();
    await prisma.achievement.deleteMany();
    await prisma.shopItem.deleteMany();
    await prisma.quest.deleteMany();
    console.log('✅ Data cleaned');
  }

  // Seed Achievements
  console.log('📊 Seeding achievements...');
  const achievements = [
    {
      code: 'FIRST_GAME',
      name: 'First Steps',
      description: 'Play your first game',
      icon: '🎮',
      category: 'BEGINNER',
      tier: 'BRONZE',
      requirementType: 'GAMES_PLAYED',
      requirementValue: 1,
      rewardCoins: 100,
      rewardGems: 5,
      rewardExperience: 50,
      isSecret: false,
    },
    {
      code: 'LUCKY_BEGINNER',
      name: 'Lucky Beginner',
      description: 'Score 90 or higher',
      icon: '🍀',
      category: 'SCORE',
      tier: 'BRONZE',
      requirementType: 'BEST_SCORE',
      requirementValue: 90,
      rewardCoins: 200,
      rewardGems: 10,
      rewardExperience: 100,
      isSecret: false,
    },
    {
      code: 'ENTHUSIAST',
      name: 'Game Enthusiast',
      description: 'Play 10 games',
      icon: '🎯',
      category: 'PROGRESS',
      tier: 'SILVER',
      requirementType: 'GAMES_PLAYED',
      requirementValue: 10,
      rewardCoins: 500,
      rewardGems: 25,
      rewardExperience: 200,
      isSecret: false,
    },
    {
      code: 'LUCKY_CHAMPION',
      name: 'Lucky Champion',
      description: 'Score 95 or higher',
      icon: '🏆',
      category: 'SCORE',
      tier: 'GOLD',
      requirementType: 'BEST_SCORE',
      requirementValue: 95,
      rewardCoins: 1000,
      rewardGems: 50,
      rewardExperience: 500,
      isSecret: false,
    },
    {
      code: 'DEDICATED',
      name: 'Dedicated Player',
      description: 'Play 50 games',
      icon: '⭐',
      category: 'PROGRESS',
      tier: 'GOLD',
      requirementType: 'GAMES_PLAYED',
      requirementValue: 50,
      rewardCoins: 2000,
      rewardGems: 100,
      rewardExperience: 1000,
      isSecret: false,
    },
    {
      code: 'PERFECT',
      name: 'Perfect Luck',
      description: 'Score exactly 100',
      icon: '💯',
      category: 'SCORE',
      tier: 'PLATINUM',
      requirementType: 'BEST_SCORE',
      requirementValue: 100,
      rewardCoins: 5000,
      rewardGems: 250,
      rewardExperience: 2500,
      isSecret: false,
    },
    {
      code: 'CENTURY',
      name: 'Century Player',
      description: 'Play 100 games',
      icon: '💪',
      category: 'PROGRESS',
      tier: 'PLATINUM',
      requirementType: 'GAMES_PLAYED',
      requirementValue: 100,
      rewardCoins: 10000,
      rewardGems: 500,
      rewardExperience: 5000,
      isSecret: false,
    },
    {
      code: 'STREAK_MASTER',
      name: 'Streak Master',
      description: 'Play 7 days in a row',
      icon: '🔥',
      category: 'STREAK',
      tier: 'GOLD',
      requirementType: 'STREAK',
      requirementValue: 7,
      rewardCoins: 3000,
      rewardGems: 150,
      rewardExperience: 1500,
      isSecret: false,
    },
    {
      code: 'WINNER',
      name: 'Serial Winner',
      description: 'Win 25 games',
      icon: '🎊',
      category: 'WINS',
      tier: 'SILVER',
      requirementType: 'TOTAL_WINS',
      requirementValue: 25,
      rewardCoins: 1500,
      rewardGems: 75,
      rewardExperience: 750,
      isSecret: false,
    },
    {
      code: 'LEGENDARY',
      name: 'Legendary',
      description: 'Play 500 games',
      icon: '👑',
      category: 'PROGRESS',
      tier: 'DIAMOND',
      requirementType: 'GAMES_PLAYED',
      requirementValue: 500,
      rewardCoins: 50000,
      rewardGems: 2500,
      rewardExperience: 25000,
      isSecret: false,
    },
    {
      code: 'MYSTERY',
      name: 'Mystery Master',
      description: 'Unlock this secret achievement',
      icon: '🎭',
      category: 'SECRET',
      tier: 'DIAMOND',
      requirementType: 'GAMES_PLAYED',
      requirementValue: 777,
      rewardCoins: 77777,
      rewardGems: 777,
      rewardExperience: 7777,
      isSecret: true,
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { code: achievement.code },
      update: achievement,
      create: achievement,
    });
  }

  console.log(`✅ Created ${achievements.length} achievements`);

  // Seed Shop Items
  console.log('🛍️  Seeding shop items...');
  const shopItems = [
    // Themes
    {
      type: 'THEME',
      name: 'Dark Mode',
      description: 'Sleek dark theme for night owls',
      icon: '🌙',
      rarity: 'COMMON',
      priceCoins: 1000,
      priceGems: null,
      limited: false,
      active: true,
      data: { theme: 'dark', colors: { primary: '#1a1a1a', accent: '#667eea' } },
    },
    {
      type: 'THEME',
      name: 'Ocean Blue',
      description: 'Refreshing ocean-inspired theme',
      icon: '🌊',
      rarity: 'RARE',
      priceCoins: 2500,
      priceGems: null,
      limited: false,
      active: true,
      data: { theme: 'ocean', colors: { primary: '#0077be', accent: '#00bfff' } },
    },
    {
      type: 'THEME',
      name: 'Golden Luxury',
      description: 'Premium golden theme',
      icon: '✨',
      rarity: 'EPIC',
      priceCoins: null,
      priceGems: 500,
      limited: false,
      active: true,
      data: { theme: 'gold', colors: { primary: '#ffd700', accent: '#ff8c00' } },
    },
    // Avatars
    {
      type: 'AVATAR',
      name: 'Lucky Cat',
      description: 'Cute lucky cat avatar',
      icon: '🐱',
      rarity: 'COMMON',
      priceCoins: 500,
      priceGems: null,
      limited: false,
      active: true,
      data: { avatarUrl: 'avatar_cat.png' },
    },
    {
      type: 'AVATAR',
      name: 'Dragon Master',
      description: 'Powerful dragon avatar',
      icon: '🐉',
      rarity: 'LEGENDARY',
      priceCoins: null,
      priceGems: 1000,
      limited: true,
      active: true,
      data: { avatarUrl: 'avatar_dragon.png' },
    },
    // Effects
    {
      type: 'EFFECT',
      name: 'Sparkle Trail',
      description: 'Leave a trail of sparkles',
      icon: '✨',
      rarity: 'RARE',
      priceCoins: 3000,
      priceGems: null,
      limited: false,
      active: true,
      data: { effectType: 'particle', particleType: 'sparkle' },
    },
    {
      type: 'EFFECT',
      name: 'Rainbow Aura',
      description: 'Colorful rainbow effect',
      icon: '🌈',
      rarity: 'EPIC',
      priceCoins: null,
      priceGems: 750,
      limited: false,
      active: true,
      data: { effectType: 'aura', auraType: 'rainbow' },
    },
    // Boosts
    {
      type: 'BOOST',
      name: 'Lucky Charm',
      description: '2x XP for 1 hour',
      icon: '🍀',
      rarity: 'COMMON',
      priceCoins: 500,
      priceGems: null,
      limited: false,
      active: true,
      data: { boostType: 'xp', multiplier: 2, duration: 3600 },
    },
    {
      type: 'BOOST',
      name: 'Coin Magnet',
      description: '1.5x coins for 2 hours',
      icon: '🪙',
      rarity: 'RARE',
      priceCoins: 1000,
      priceGems: null,
      limited: false,
      active: true,
      data: { boostType: 'coins', multiplier: 1.5, duration: 7200 },
    },
    {
      type: 'BOOST',
      name: 'Mega Boost',
      description: '3x everything for 30 minutes',
      icon: '🚀',
      rarity: 'LEGENDARY',
      priceCoins: null,
      priceGems: 500,
      limited: false,
      active: true,
      data: { boostType: 'all', multiplier: 3, duration: 1800 },
    },
  ];

  for (const item of shopItems) {
    await prisma.shopItem.create({ data: item });
  }

  console.log(`✅ Created ${shopItems.length} shop items`);

  // Seed Quests
  console.log('📜 Seeding quests...');
  const quests = [
    {
      type: 'DAILY',
      name: 'Daily Grind',
      description: 'Play 5 games today',
      requirements: { type: 'GAMES_PLAYED', value: 5 },
      rewards: { coins: 500, gems: 10, experience: 100 },
      expiresAt: null,
      active: true,
    },
    {
      type: 'DAILY',
      name: 'High Roller',
      description: 'Score 85 or higher',
      requirements: { type: 'SCORE_TARGET', value: 85 },
      rewards: { coins: 300, gems: 5, experience: 75 },
      expiresAt: null,
      active: true,
    },
    {
      type: 'WEEKLY',
      name: 'Weekly Warrior',
      description: 'Play 25 games this week',
      requirements: { type: 'GAMES_PLAYED', value: 25 },
      rewards: { coins: 2500, gems: 100, experience: 500 },
      expiresAt: null,
      active: true,
    },
    {
      type: 'WEEKLY',
      name: 'Streak Keeper',
      description: 'Maintain a 7-day streak',
      requirements: { type: 'STREAK', value: 7 },
      rewards: { coins: 3000, gems: 150, experience: 750 },
      expiresAt: null,
      active: true,
    },
  ];

  for (const quest of quests) {
    await prisma.quest.create({ data: quest });
  }

  console.log(`✅ Created ${quests.length} quests`);

  // Create a test user (for development)
  if (process.env.NODE_ENV !== 'production') {
    console.log('👤 Creating test user...');
    const testUser = await prisma.user.upsert({
      where: { telegramId: BigInt(123456789) },
      update: {},
      create: {
        telegramId: BigInt(123456789),
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        referralCode: nanoid(8).toUpperCase(),
        coins: 10000,
        gems: 500,
        level: 5,
        experience: 2500,
      },
    });
    console.log(`✅ Test user created: ${testUser.username}`);
  }

  console.log('🎉 Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
