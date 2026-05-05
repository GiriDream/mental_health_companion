const Journal = require('../models/Journal');
const Mood = require('../models/Mood');
const { analyzeJournals } = require('../services/geminiService');

const getWeeklyInsights = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Default to 7 days, but can be overridden by query param later
    const days = parseInt(req.query.days) || 7;
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);

    // Fetch journals from the last X days
    const journals = await Journal.find({
      userId,
      createdAt: { $gte: dateLimit }
    }).sort({ createdAt: -1 });

    // Fetch moods from the last X days
    const moods = await Mood.find({
      userId,
      createdAt: { $gte: dateLimit }
    }).sort({ createdAt: -1 });

    if (journals.length === 0 && moods.length === 0) {
      return res.json({
        summary: "Not enough data from the past few days. Try logging some journals or moods!",
        themes: ["Needs more data"],
        suggestion: "Log how you're feeling today to get started.",
        needsProactiveCheckin: false
      });
    }

    // Call Gemini to analyze
    const insights = await analyzeJournals(journals, moods);

    res.json(insights);
  } catch (error) {
    console.error("Error generating insights:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getWeeklyInsights };
