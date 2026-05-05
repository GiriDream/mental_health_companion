const express = require('express');
const router = express.Router();
const { getWeeklyInsights } = require('../controllers/insightController');
const auth = require('../middleware/authMiddleware');

// Apply auth middleware to all insight routes
router.use(auth);

// Get weekly AI insights
router.get('/weekly', getWeeklyInsights);

module.exports = router;
