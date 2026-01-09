/**
 * FLIP Game Engine
 * Simple coin flip game - Heads or Tails
 */

const crypto = require('crypto');

class FlipEngine {
  constructor() {
    this.name = 'FLIP';
    this.sides = ['HEADS', 'TAILS'];
    this.multiplier = 1.98; // 2x with house edge
  }

  /**
   * Flip the coin
   */
  flip(seed = null) {
    const randomSeed = seed || crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(randomSeed).digest('hex');
    const number = parseInt(hash.substring(0, 8), 16);
    const result = this.sides[number % 2];

    return {
      result,
      seed: randomSeed,
      hash,
      emoji: result === 'HEADS' ? '👑' : '🦅',
    };
  }

  /**
   * Play flip with prediction
   */
  play(betAmount, userCoins, prediction, minBet = 10, maxBet = 10000) {
    // Validate bet
    if (betAmount < minBet) {
      throw new Error(`Minimum bet is ${minBet} coins`);
    }
    if (betAmount > maxBet) {
      throw new Error(`Maximum bet is ${maxBet} coins`);
    }
    if (betAmount > userCoins) {
      throw new Error('Insufficient coins');
    }

    // Validate prediction
    if (!this.sides.includes(prediction.toUpperCase())) {
      throw new Error('Prediction must be HEADS or TAILS');
    }

    const normalizedPrediction = prediction.toUpperCase();

    // Flip coin
    const { result, seed, hash, emoji } = this.flip();

    // Check result
    const won = result === normalizedPrediction;
    const winAmount = won ? Math.floor(betAmount * this.multiplier) : 0;
    const profit = winAmount - betAmount;

    return {
      result,
      prediction: normalizedPrediction,
      won,
      multiplier: this.multiplier,
      emoji,
      betAmount,
      winAmount,
      profit,
      seed,
      hash,
      newBalance: userCoins - betAmount + winAmount,
      message: this.getMessage(won, result),
    };
  }

  /**
   * Get message based on result
   */
  getMessage(won, result) {
    if (won) {
      return result === 'HEADS'
        ? 'You Win! Heads! 👑✨'
        : 'You Win! Tails! 🦅✨';
    } else {
      return result === 'HEADS'
        ? 'You Lose! It was Heads! 👑😔'
        : 'You Lose! It was Tails! 🦅😔';
    }
  }

  /**
   * Verify flip integrity
   */
  verify(result, seed, hash) {
    const calculatedHash = crypto.createHash('sha256').update(seed).digest('hex');
    const number = parseInt(calculatedHash.substring(0, 8), 16);
    const calculatedResult = this.sides[number % 2];

    return calculatedHash === hash && calculatedResult === result;
  }

  /**
   * Get flip history statistics
   */
  analyzeHistory(flips) {
    const heads = flips.filter(f => f.result === 'HEADS').length;
    const tails = flips.filter(f => f.result === 'TAILS').length;
    const total = flips.length;

    return {
      heads,
      tails,
      total,
      headsPercentage: total > 0 ? ((heads / total) * 100).toFixed(2) : 0,
      tailsPercentage: total > 0 ? ((tails / total) * 100).toFixed(2) : 0,
    };
  }
}

module.exports = new FlipEngine();
