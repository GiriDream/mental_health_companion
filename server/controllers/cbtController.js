const { reframeThought } = require('../services/geminiService');

const reframe = async (req, res) => {
  try {
    const { thought } = req.body;
    if (!thought) return res.status(400).json({ message: 'Thought is required' });

    const result = await reframeThought(thought);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { reframe };
