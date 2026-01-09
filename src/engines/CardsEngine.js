/**
 * CARDS Game Engine
 * Higher/Lower card guessing game
 */

const crypto = require('crypto');

class CardsEngine {
  constructor() {
    this.name = 'CARDS';

    this.suits = ['♠️', '♥️', '♦️', '♣️'];
    this.ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    this.values = {
      '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8,
      '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
    };

    this.deck = this.generateDeck();
  }

  /**
   * Generate full deck of cards
   */
  generateDeck() {
    const deck = [];
    for (const suit of this.suits) {
      for (const rank of this.ranks) {
        deck.push({
          rank,
          suit,
          value: this.values[rank],
          display: `${rank}${suit}`,
        });
      }
    }
    return deck;
  }

  /**
   * Draw a random card
   */
  drawCard(seed = null) {
    const randomSeed = seed || crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(randomSeed).digest('hex');
    const number = parseInt(hash.substring(0, 8), 16);
    const cardIndex = number % this.deck.length;
    const card = this.deck[cardIndex];

    return {
      card,
      seed: randomSeed,
      hash,
    };
  }

  /**
   * Calculate multiplier based on current card and prediction
   */
  calculateMultiplier(currentCardValue, prediction) {
    const houseEdge = 0.01; // 1%

    if (prediction === 'HIGHER') {
      // Probability of drawing higher card
      const higherCards = this.deck.filter(c => c.value > currentCardValue).length;
      const winChance = higherCards / this.deck.length;
      return winChance > 0 ? (1 - houseEdge) / winChance : 0;
    } else if (prediction === 'LOWER') {
      // Probability of drawing lower card
      const lowerCards = this.deck.filter(c => c.value < currentCardValue).length;
      const winChance = lowerCards / this.deck.length;
      return winChance > 0 ? (1 - houseEdge) / winChance : 0;
    } else if (prediction === 'EQUAL') {
      // Probability of drawing equal card
      const equalCards = this.deck.filter(c => c.value === currentCardValue).length;
      const winChance = equalCards / this.deck.length;
      return winChance > 0 ? (1 - houseEdge) / winChance : 0;
    }

    return 0;
  }

  /**
   * Check if prediction is correct
   */
  checkWin(currentCard, nextCard, prediction) {
    if (prediction === 'HIGHER') {
      return nextCard.value > currentCard.value;
    } else if (prediction === 'LOWER') {
      return nextCard.value < currentCard.value;
    } else if (prediction === 'EQUAL') {
      return nextCard.value === currentCard.value;
    }
    return false;
  }

  /**
   * Play cards game
   */
  play(betAmount, userCoins, currentCard, prediction, minBet = 10, maxBet = 10000) {
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
    if (!['HIGHER', 'LOWER', 'EQUAL'].includes(prediction)) {
      throw new Error('Prediction must be HIGHER, LOWER, or EQUAL');
    }

    // Draw next card
    const { card: nextCard, seed, hash } = this.drawCard();

    // Check result
    const won = this.checkWin(currentCard, nextCard, prediction);
    const multiplier = this.calculateMultiplier(currentCard.value, prediction);
    const winAmount = won ? Math.floor(betAmount * multiplier) : 0;
    const profit = winAmount - betAmount;

    return {
      currentCard,
      nextCard,
      prediction,
      won,
      multiplier: won ? multiplier : 0,
      betAmount,
      winAmount,
      profit,
      seed,
      hash,
      newBalance: userCoins - betAmount + winAmount,
      message: this.getMessage(won, currentCard, nextCard, prediction),
    };
  }

  /**
   * Start a new game (draw first card)
   */
  startGame() {
    const { card, seed, hash } = this.drawCard();
    return {
      currentCard: card,
      seed,
      hash,
      message: `Your card is ${card.display}. Will the next card be HIGHER, LOWER, or EQUAL?`,
    };
  }

  /**
   * Get message based on result
   */
  getMessage(won, currentCard, nextCard, prediction) {
    if (won) {
      if (prediction === 'EQUAL') {
        return `PERFECT! ${currentCard.display} = ${nextCard.display}! Rare win! 🃏✨`;
      }
      return `You Win! ${currentCard.display} → ${nextCard.display}! Guessed ${prediction}! 🃏🎉`;
    } else {
      return `You Lose! ${currentCard.display} → ${nextCard.display}. Wrong guess! 😔`;
    }
  }

  /**
   * Get card color (for UI)
   */
  getCardColor(suit) {
    return ['♥️', '♦️'].includes(suit) ? 'red' : 'black';
  }
}

module.exports = new CardsEngine();
