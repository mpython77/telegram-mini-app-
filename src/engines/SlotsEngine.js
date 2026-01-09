/**
 * SLOTS Game Engine
 * 3x3 slot machine with various symbols
 */

const crypto = require('crypto');

class SlotsEngine {
  constructor() {
    this.name = 'SLOTS';
    this.symbols = ['🍒', '🍋', '🍊', '🍇', '🍉', '⭐', '💎', '7️⃣'];
    this.reels = 3;
    this.rows = 3;

    // Symbol weights (higher = more common)
    this.weights = {
      '🍒': 30,
      '🍋': 25,
      '🍊': 20,
      '🍇': 15,
      '🍉': 10,
      '⭐': 5,
      '💎': 3,
      '7️⃣': 2,
    };

    // Payout multipliers
    this.payouts = {
      '🍒': 2,
      '🍋': 3,
      '🍊': 4,
      '🍇': 5,
      '🍉': 8,
      '⭐': 15,
      '💎': 50,
      '7️⃣': 100,
    };
  }

  /**
   * Generate weighted random symbol
   */
  getRandomSymbol(seed) {
    const hash = crypto.createHash('sha256').update(seed).digest('hex');
    const number = parseInt(hash.substring(0, 8), 16);

    const totalWeight = Object.values(this.weights).reduce((sum, w) => sum + w, 0);
    const random = number % totalWeight;

    let cumulativeWeight = 0;
    for (const [symbol, weight] of Object.entries(this.weights)) {
      cumulativeWeight += weight;
      if (random < cumulativeWeight) {
        return symbol;
      }
    }

    return this.symbols[0];
  }

  /**
   * Spin the reels
   */
  spin(seed = null) {
    const baseSeed = seed || crypto.randomBytes(32).toString('hex');
    const grid = [];

    for (let row = 0; row < this.rows; row++) {
      const rowSymbols = [];
      for (let reel = 0; reel < this.reels; reel++) {
        const symbolSeed = `${baseSeed}-${row}-${reel}`;
        rowSymbols.push(this.getRandomSymbol(symbolSeed));
      }
      grid.push(rowSymbols);
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
    const wins = [];

    // Check horizontal lines
    for (let row = 0; row < this.rows; row++) {
      const line = grid[row];
      if (line[0] === line[1] && line[1] === line[2]) {
        wins.push({
          type: 'horizontal',
          row,
          symbol: line[0],
          count: 3,
          multiplier: this.payouts[line[0]],
        });
      }
    }

    // Check vertical lines
    for (let col = 0; col < this.reels; col++) {
      const line = [grid[0][col], grid[1][col], grid[2][col]];
      if (line[0] === line[1] && line[1] === line[2]) {
        wins.push({
          type: 'vertical',
          col,
          symbol: line[0],
          count: 3,
          multiplier: this.payouts[line[0]],
        });
      }
    }

    // Check diagonals
    const diagonal1 = [grid[0][0], grid[1][1], grid[2][2]];
    if (diagonal1[0] === diagonal1[1] && diagonal1[1] === diagonal1[2]) {
      wins.push({
        type: 'diagonal-down',
        symbol: diagonal1[0],
        count: 3,
        multiplier: this.payouts[diagonal1[0]],
      });
    }

    const diagonal2 = [grid[0][2], grid[1][1], grid[2][0]];
    if (diagonal2[0] === diagonal2[1] && diagonal2[1] === diagonal2[2]) {
      wins.push({
        type: 'diagonal-up',
        symbol: diagonal2[0],
        count: 3,
        multiplier: this.payouts[diagonal2[0]],
      });
    }

    return wins;
  }

  /**
   * Calculate total multiplier from wins
   */
  calculateTotalMultiplier(wins) {
    if (wins.length === 0) return 0;

    // Base multiplier from wins
    let multiplier = wins.reduce((sum, win) => sum + win.multiplier, 0);

    // Bonus for multiple wins
    if (wins.length === 2) multiplier *= 1.5;
    if (wins.length === 3) multiplier *= 2;
    if (wins.length >= 4) multiplier *= 3;

    return multiplier;
  }

  /**
   * Play slots with bet
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

    // Spin reels
    const { grid, seed } = this.spin();

    // Check wins
    const wins = this.checkWins(grid);
    const totalMultiplier = this.calculateTotalMultiplier(wins);

    // Calculate payout
    const winAmount = Math.floor(betAmount * totalMultiplier);
    const profit = winAmount - betAmount;
    const won = winAmount > 0;

    return {
      grid,
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
    if (wins.length === 0) return 'No wins. Try again! 😔';
    if (wins.length === 1) {
      const symbol = wins[0].symbol;
      if (symbol === '7️⃣') return 'JACKPOT! Triple 7s! 🎰💰';
      if (symbol === '💎') return 'DIAMONDS! Huge Win! 💎✨';
      if (symbol === '⭐') return 'STARS! Big Win! ⭐🎉';
      return 'You Win! Nice! 🎰';
    }
    if (wins.length === 2) return 'DOUBLE WIN! Amazing! 🔥';
    if (wins.length === 3) return 'TRIPLE WIN! Incredible! 🚀';
    return 'MEGA WIN! Unbelievable! 💯';
  }
}

module.exports = new SlotsEngine();
