/**
 * SPIN Game Engine
 * Wheel of Fortune with multiple segments
 */

const crypto = require('crypto');

class SpinEngine {
  constructor() {
    this.name = 'SPIN';

    // Wheel segments with multipliers and probabilities
    this.segments = [
      { multiplier: 0, label: 'LOSE', color: '#e74c3c', weight: 30 },
      { multiplier: 0.5, label: '0.5x', color: '#95a5a6', weight: 20 },
      { multiplier: 1, label: '1x', color: '#3498db', weight: 15 },
      { multiplier: 2, label: '2x', color: '#2ecc71', weight: 12 },
      { multiplier: 3, label: '3x', color: '#f39c12', weight: 10 },
      { multiplier: 5, label: '5x', color: '#9b59b6', weight: 7 },
      { multiplier: 10, label: '10x', color: '#e91e63', weight: 4 },
      { multiplier: 25, label: '25x', color: '#ff5722', weight: 1.5 },
      { multiplier: 50, label: '50x', color: '#ffc107', weight: 0.4 },
      { multiplier: 100, label: 'JACKPOT', color: '#ffeb3b', weight: 0.1 },
    ];

    this.totalWeight = this.segments.reduce((sum, seg) => sum + seg.weight, 0);
  }

  /**
   * Spin the wheel
   */
  spin(seed = null) {
    const randomSeed = seed || crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(randomSeed).digest('hex');
    const number = parseInt(hash.substring(0, 16), 16);

    // Calculate which segment was landed on
    const random = (number % 1000000) / 1000000; // 0-1
    const targetWeight = random * this.totalWeight;

    let cumulativeWeight = 0;
    let selectedSegment = this.segments[0];
    let segmentIndex = 0;

    for (let i = 0; i < this.segments.length; i++) {
      cumulativeWeight += this.segments[i].weight;
      if (targetWeight <= cumulativeWeight) {
        selectedSegment = this.segments[i];
        segmentIndex = i;
        break;
      }
    }

    // Calculate final rotation angle (visual effect)
    const fullRotations = 5; // 5 full spins before stopping
    const segmentAngle = 360 / this.segments.length;
    const targetAngle = segmentIndex * segmentAngle;
    const finalAngle = fullRotations * 360 + targetAngle;

    return {
      segment: selectedSegment,
      segmentIndex,
      finalAngle,
      multiplier: selectedSegment.multiplier,
      seed: randomSeed,
      hash,
    };
  }

  /**
   * Play spin with bet
   */
  play(betAmount, userCoins, minBet = 10, maxBet = 10000) {
    if (betAmount < minBet) {
      throw new Error(`Minimum bet is ${minBet} coins`);
    }
    if (betAmount > maxBet) {
      throw new Error(`Maximum bet is ${maxBet} coins`);
    }
    if (betAmount > userCoins) {
      throw new Error('Insufficient coins');
    }

    // Spin the wheel
    const result = this.spin();

    // Calculate winnings
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
      message: this.getMessage(result.multiplier),
    };
  }

  /**
   * Get message based on multiplier
   */
  getMessage(multiplier) {
    if (multiplier === 100) return 'JACKPOT! 100x WIN! 🎰💰';
    if (multiplier >= 50) return 'MEGA WIN! 50x! 🚀';
    if (multiplier >= 25) return 'HUGE WIN! 25x! 🔥';
    if (multiplier >= 10) return 'BIG WIN! 10x! ⭐';
    if (multiplier >= 5) return 'GREAT WIN! 5x! 🎉';
    if (multiplier >= 3) return 'NICE WIN! 3x! 👍';
    if (multiplier >= 2) return 'You Doubled! 2x! 😊';
    if (multiplier >= 1) return 'Break Even! 1x! 😐';
    if (multiplier > 0) return 'Small Win! 0.5x! 😕';
    return 'No Luck! Try Again! 😔';
  }

  /**
   * Get all segments (for client-side wheel rendering)
   */
  getSegments() {
    return this.segments;
  }
}

module.exports = new SpinEngine();
