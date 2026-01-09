/**
 * SCRATCH Game Engine
 * Scratch card lottery game with hidden prizes
 */

const crypto = require('crypto');

class ScratchEngine {
  constructor() {
    this.name = 'SCRATCH';
    this.gridSize = 3; // 3x3 grid

    // Prize types with multipliers and probabilities
    this.prizes = [
      { symbol: '💰', name: 'COINS', multiplier: 1, weight: 25 },
      { symbol: '💎', name: 'GEMS', multiplier: 2, weight: 20 },
      { symbol: '⭐', name: 'STAR', multiplier: 3, weight: 15 },
      { symbol: '👑', name: 'CROWN', multiplier: 5, weight: 10 },
      { symbol: '🔥', name: 'FIRE', multiplier: 10, weight: 7 },
      { symbol: '💯', name: 'HUNDRED', multiplier: 25, weight: 3 },
      { symbol: '🚀', name: 'ROCKET', multiplier: 50, weight: 1.5 },
      { symbol: '🎰', name: 'JACKPOT', multiplier: 100, weight: 0.5 },
    ];

    this.totalWeight = this.prizes.reduce((sum, p) => sum + p.weight, 0);
  }

  /**
   * Get random prize based on weights
   */
  getRandomPrize(seed) {
    const hash = crypto.createHash('sha256').update(seed).digest('hex');
    const number = parseInt(hash.substring(0, 16), 16);
    const random = (number % 10000) / 10000; // 0-1
    const targetWeight = random * this.totalWeight;

    let cumulativeWeight = 0;
    for (const prize of this.prizes) {
      cumulativeWeight += prize.weight;
      if (targetWeight <= cumulativeWeight) {
        return prize;
      }
    }

    return this.prizes[0];
  }

  /**
   * Generate scratch card grid
   */
  generateCard(seed = null) {
    const baseSeed = seed || crypto.randomBytes(32).toString('hex');
    const grid = [];

    for (let i = 0; i < this.gridSize * this.gridSize; i++) {
      const cellSeed = `${baseSeed}-${i}`;
      const prize = this.getRandomPrize(cellSeed);
      grid.push({
        position: i,
        ...prize,
        revealed: false,
      });
    }

    return {
      grid,
      seed: baseSeed,
    };
  }

  /**
   * Check for winning combinations
   */
  checkWins(grid) {
    const symbols = {};

    // Count occurrences of each symbol
    for (const cell of grid) {
      symbols[cell.symbol] = (symbols[cell.symbol] || 0) + 1;
    }

    // Find winning combinations (3+ matching symbols)
    const wins = [];
    for (const [symbol, count] of Object.entries(symbols)) {
      if (count >= 3) {
        const prize = this.prizes.find(p => p.symbol === symbol);
        wins.push({
          symbol,
          count,
          prize,
          multiplier: prize.multiplier * (count === 9 ? 10 : count === 6 ? 3 : count === 5 ? 2 : 1),
        });
      }
    }

    return wins;
  }

  /**
   * Calculate total multiplier
   */
  calculateTotalMultiplier(wins) {
    if (wins.length === 0) return 0;

    // Sum all multipliers
    const totalMultiplier = wins.reduce((sum, win) => sum + win.multiplier, 0);

    // Bonus for multiple different wins
    if (wins.length > 1) {
      return totalMultiplier * 1.5;
    }

    return totalMultiplier;
  }

  /**
   * Play scratch card
   */
  play(betAmount, userCoins, minBet = 10, maxBet = 10000) {
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

    // Generate card
    const { grid, seed } = this.generateCard();

    // Reveal all cells
    const revealedGrid = grid.map(cell => ({ ...cell, revealed: true }));

    // Check for wins
    const wins = this.checkWins(revealedGrid);
    const totalMultiplier = this.calculateTotalMultiplier(wins);

    // Calculate payout
    const winAmount = Math.floor(betAmount * totalMultiplier);
    const profit = winAmount - betAmount;
    const won = winAmount > 0;

    return {
      grid: revealedGrid,
      wins,
      multiplier: totalMultiplier,
      betAmount,
      winAmount,
      profit,
      won,
      seed,
      newBalance: userCoins - betAmount + winAmount,
      message: this.getMessage(wins),
    };
  }

  /**
   * Get message based on result
   */
  getMessage(wins) {
    if (wins.length === 0) {
      return 'No matching symbols. Try again! 😔';
    }

    if (wins.length === 1) {
      const win = wins[0];
      if (win.symbol === '🎰') return 'JACKPOT! 100x WIN! 🎰💰';
      if (win.symbol === '🚀') return 'ROCKET TO THE MOON! 50x! 🚀✨';
      if (win.symbol === '💯') return 'PERFECT! 25x WIN! 💯🔥';
      if (win.count === 9) return `ALL ${win.symbol}! MEGA WIN! 🎉`;
      if (win.count >= 5) return `${win.count}x ${win.symbol}! BIG WIN! ⭐`;
      return `3x ${win.symbol}! You Win! 🎊`;
    }

    return `MULTIPLE WINS! ${wins.length} combinations! 🚀🔥`;
  }

  /**
   * Get grid as string (for display)
   */
  gridToString(grid) {
    const rows = [];
    for (let i = 0; i < this.gridSize; i++) {
      const row = grid
        .slice(i * this.gridSize, (i + 1) * this.gridSize)
        .map(cell => (cell.revealed ? cell.symbol : '❓'))
        .join(' ');
      rows.push(row);
    }
    return rows.join('\n');
  }
}

module.exports = new ScratchEngine();
