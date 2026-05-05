const Journal = require('../models/Journal');

// Get all journals
const getJournals = async (req, res) => {
  try {
    const journals = await Journal.find({ userId: req.userId })
      .sort({ createdAt: -1 });
    res.json(journals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create journal
const createJournal = async (req, res) => {
  try {
    const { title, content, mood, tags } = req.body;
    const journal = await Journal.create({
      userId: req.userId,
      title,
      content,
      mood,
      tags: tags || []
    });
    res.status(201).json(journal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete journal
const deleteJournal = async (req, res) => {
  try {
    await Journal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Journal deleted!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getJournals, createJournal, deleteJournal };