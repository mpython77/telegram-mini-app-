const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// In-memory storage (you can replace with real database later)
const users = new Map();
const leaderboard = new Map();

// Save user stats
app.post('/api/save-stats', (req, res) => {
  try {
    const { userId, firstName, lastName, username, score, totalGames, bestScore } = req.body;
    
    const userData = {
      id: userId,
      firstName,
      lastName,
      username,
      bestScore,
      totalGames,
      timestamp: Date.now()
    };
    
    users.set(userId.toString(), userData);
    leaderboard.set(userId.toString(), userData);
    
    res.json({ success: true, data: userData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user stats
app.get('/api/user-stats/:userId', (req, res) => {
  try {
    const userId = req.params.userId;
    const userData = users.get(userId);
    
    if (userData) {
      res.json({ success: true, data: userData });
    } else {
      res.json({ success: true, data: { bestScore: 0, totalGames: 0 } });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get leaderboard
app.get('/api/leaderboard', (req, res) => {
  try {
    const leaderboardArray = Array.from(leaderboard.values())
      .sort((a, b) => b.bestScore - a.bestScore)
      .slice(0, 100); // Top 100
    
    res.json({ success: true, data: leaderboardArray });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    users: users.size,
    leaderboard: leaderboard.size
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
