const Mood = require('../models/Mood');

// Get mood history
const getMoodHistory = async (req, res) => {
  try {
    const moods = await Mood.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(30);
    res.json(moods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Save mood manually
const saveMood = async (req, res) => {
  try {
    const { mood, score, note } = req.body;
    const newMood = await Mood.create({
      userId: req.userId,
      mood,
      score,
      note
    });
    res.status(201).json(newMood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMoodHistory, saveMood };