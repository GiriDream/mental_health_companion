const Chat = require('../models/Chat');
const Mood = require('../models/Mood');
const { getMoodAndResponse } = require('../services/geminiService');

// Send message to AI
const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.userId;

    // Gemini AI response
    const aiResult = await getMoodAndResponse(message);

    // Chat history save
    let chat = await Chat.findOne({ userId });
    if (!chat) {
      chat = await Chat.create({ userId, messages: [] });
    }

    chat.messages.push({
      role: 'user',
      content: message,
      mood: aiResult.mood
    });

    chat.messages.push({
      role: 'ai',
      content: aiResult.response,
      mood: aiResult.mood
    });

    await chat.save();

    // Mood save
    await Mood.create({
      userId,
      mood: aiResult.mood,
      score: aiResult.moodScore,
      note: message
    });

    res.json({
      response: aiResult.response,
      mood: aiResult.mood,
      moodScore: aiResult.moodScore,
      suggestion: aiResult.suggestion,
      needsProfessionalHelp: aiResult.needsProfessionalHelp
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get chat history
const getChatHistory = async (req, res) => {
  try {
    const chat = await Chat.findOne({ userId: req.userId });
    res.json(chat ? chat.messages : []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getChatHistory };