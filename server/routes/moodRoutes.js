const express = require('express');
const router = express.Router();
const { getMoodHistory, saveMood } = require('../controllers/moodController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/history', authMiddleware, getMoodHistory);
router.post('/save', authMiddleware, saveMood);

module.exports = router;