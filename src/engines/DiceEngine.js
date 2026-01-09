/**
 * DICE Game Engine
 * Classic dice game with predictions
 */

const crypto = require('crypto');

class DiceEngine {
  constructor() {
    this.name = 'DICE';
    this.minValue = 1;
    this.maxValue = 100;
  }

  /**
   * Roll dice (1-100)
   */
  roll(seed = null) {
    const randomSeed = seed || crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(randomSeed).digest('hex');
    const number = parseInt(hash.substring(0, 8), 16);
    const roll = (number % this.maxValue) + 1;

    return {
      value: roll,
      seed: randomSeed,
      hash,
    };
  }

  /**
   * Calculate multiplier based on prediction
   */
  calculateMultiplier(prediction, target, isOver) {
    // Base house edge
    const houseEdge = 0.01; // 1%

    if (isOver) {
      // Betting on OVER target
      const winChance = (100 - target) / 100;
      return (1 - houseEdge) / winChance;
    } else {
      // Betting on UNDER target
      const winChance = target / 100;
      return (1 - houseEdge) / winChance;
    }
  }

  /**
   * Check if prediction won
   */
  checkWin(roll, target, isOver) {
    if (isOver) {
      return roll > target;
    } else {
      return roll < target;
    }
  }

  /**
   * Play dice with prediction
   */
  play(betAmount, userCoins, target, isOver = true, minBet = 10, maxBet = 10000) {
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

    // Validate target
    if (target < 2 || target > 98) {
      throw new Error('Target must be between 2 and 98');
    }

    // Roll dice
    const { value, seed, hash } = this.roll();

    // Check result
    const won = this.checkWin(value, target, isOver);
    const multiplier = this.calculateMultiplier(value, target, isOver);
    const winAmount = won ? Math.floor(betAmount * multiplier) : 0;
    const profit = winAmount - betAmount;

    // Calculate win chance
    const winChance = isOver ? (100 - target) / 100 : target / 100;

    return {
      roll: value,
      target,
      isOver,
      won,
      multiplier: won ? multiplier : 0,
      winChance: (winChance * 100).toFixed(2) + '%',
      betAmount,
      winAmount,
      profit,
      seed,
      hash,
      newBalance: userCoins - betAmount + winAmount,
      message: this.getMessage(won, value, target, isOver),
    };
  }

  /**
   * Get message based on result
   */
  getMessage(won, roll, target, isOver) {
    if (won) {
      if (isOver) {
        const margin = roll - target;
        if (margin >= 40) return `HUGE WIN! Rolled ${roll}! Way over ${target}! 🎲🔥`;
        if (margin >= 20) return `BIG WIN! Rolled ${roll}! Over ${target}! 🎲⭐`;
        if (margin >= 10) return `NICE WIN! Rolled ${roll}! Over ${target}! 🎲👍`;
        return `You Win! Rolled ${roll}! Over ${target}! 🎲😊`;
      } else {
        const margin = target - roll;
        if (margin >= 40) return `HUGE WIN! Rolled ${roll}! Way under ${target}! 🎲🔥`;
        if (margin >= 20) return `BIG WIN! Rolled ${roll}! Under ${target}! 🎲⭐`;
        if (margin >= 10) return `NICE WIN! Rolled ${roll}! Under ${target}! 🎲👍`;
        return `You Win! Rolled ${roll}! Under ${target}! 🎲😊`;
      }
    } else {
      return `You Lose! Rolled ${roll}. ${isOver ? 'Not over' : 'Not under'} ${target}! 😔`;
    }
  }

  /**
   * Verify roll integrity
   */
  verify(value, seed, hash) {
    const calculatedHash = crypto.createHash('sha256').update(seed).digest('hex');
    const calculatedValue = (parseInt(calculatedHash.substring(0, 8), 16) % this.maxValue) + 1;

    return calculatedHash === hash && calculatedValue === value;
  }
}

module.exports = new DiceEngine();
