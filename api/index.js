// This will be our serverless function
const express = require('express');
const cors = require('cors');
const app = express();

// Using a simple JSON file for persistence
const fs = require('fs');
const path = require('path');
const dbPath = path.join('/tmp', 'scores.json');

// Initialize scores
let scores = [];

// Load scores from file if it exists
try {
  if (fs.existsSync(dbPath)) {
    scores = JSON.parse(fs.readFileSync(dbPath));
  }
} catch (error) {
  console.error('Error loading scores:', error);
}

// Save scores to file
const saveScores = () => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(scores));
  } catch (error) {
    console.error('Error saving scores:', error);
  }
};

app.use(cors());
app.use(express.json());

app.get('/api/scores', (req, res) => {
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);
  res.json(sortedScores);
});

app.post('/api/scores', (req, res) => {
  const { address, score } = req.body;
  
  if (!address || typeof score !== 'number') {
    return res.status(400).json({ error: 'Invalid data' });
  }

  const existingScoreIndex = scores.findIndex(entry => entry.address === address);
  
  if (existingScoreIndex >= 0) {
    if (score > scores[existingScoreIndex].score) {
      scores[existingScoreIndex].score = score;
      saveScores();
    }
  } else {
    scores.push({ address, score });
    saveScores();
  }

  res.json({ success: true });
});

module.exports = app; 