/**
 * LUCK Game Engine
 * Simple random luck number generator (1-100)
 */

const crypto = require('crypto');

class LuckEngine {
  constructor() {
    this.name = 'LUCK';
    this.minValue = 1;
    this.maxValue = 100;
  }

  /**
   * Generate provably fair luck number
   */
  generate(seed = null) {
    const randomSeed = seed || crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(randomSeed).digest('hex');
    const number = parseInt(hash.substring(0, 8), 16);
    const luck = (number % this.maxValue) + 1;

    return {
      value: luck,
      seed: randomSeed,
      hash,
      multiplier: this.calculateMultiplier(luck),
      tier: this.getTier(luck),
      message: this.getMessage(luck),
    };
  }

  /**
   * Calculate win multiplier based on luck value
   */
  calculateMultiplier(luck) {
    if (luck === 100) return 100.0; // Jackpot!
    if (luck >= 95) return 10.0;
    if (luck >= 90) return 5.0;
    if (luck >= 80) return 3.0;
    if (luck >= 70) return 2.0;
    if (luck >= 60) return 1.5;
    if (luck >= 50) return 1.0;
    return 0.0; // Loss
  }

  /**
   * Get tier name based on luck value
   */
  getTier(luck) {
    if (luck === 100) return 'LEGENDARY';
    if (luck >= 95) return 'EPIC';
    if (luck >= 85) return 'RARE';
    if (luck >= 70) return 'UNCOMMON';
    if (luck >= 50) return 'COMMON';
    return 'POOR';
  }

  /**
   * Get message based on luck value
   */
  getMessage(luck) {
    if (luck === 100) return 'JACKPOT! Perfect Luck! 💯';
    if (luck >= 95) return 'Incredible! Epic Luck! 🔥';
    if (luck >= 90) return 'Amazing! Very Lucky! ⭐';
    if (luck >= 80) return 'Great! Good Luck! 🍀';
    if (luck >= 70) return 'Nice! Above Average! 👍';
    if (luck >= 60) return 'Decent! Not Bad! 😊';
    if (luck >= 50) return 'Okay! Average Luck! 😐';
    if (luck >= 30) return 'Unlucky! Below Average! 😔';
    if (luck >= 10) return 'Very Unlucky! Poor Luck! 😢';
    return 'Terrible Luck! Try Again! 😭';
  }

  /**
   * Validate bet amount
   */
  validateBet(betAmount, userCoins, minBet = 10, maxBet = 10000) {
    if (betAmount < minBet) {
      return { valid: false, error: `Minimum bet is ${minBet} coins` };
    }
    if (betAmount > maxBet) {
      return { valid: false, error: `Maximum bet is ${maxBet} coins` };
    }
    if (betAmount > userCoins) {
      return { valid: false, error: 'Insufficient coins' };
    }
    return { valid: true };
  }

  /**
   * Calculate final result with bet
   */
  play(betAmount, userCoins, minBet = 10, maxBet = 10000) {
    // Validate bet
    const validation = this.validateBet(betAmount, userCoins, minBet, maxBet);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Generate luck
    const result = this.generate();

    // Calculate win amount
    const winAmount = Math.floor(betAmount * result.multiplier);
    const profit = winAmount - betAmount;
    const won = winAmount > 0;

    return {
      ...result,
      betAmount,
      winAmount,
      profit,
      won,
      newBalance: userCoins - betAmount + winAmount,
    };
  }

  /**
   * Verify result integrity
   */
  verify(value, seed, hash) {
    const calculatedHash = crypto.createHash('sha256').update(seed).digest('hex');
    const calculatedValue = (parseInt(calculatedHash.substring(0, 8), 16) % this.maxValue) + 1;

    return calculatedHash === hash && calculatedValue === value;
  }
}

module.exports = new LuckEngine();
