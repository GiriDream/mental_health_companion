const express = require('express');
const router = express.Router();
const { reframe } = require('../controllers/cbtController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/reframe', authMiddleware, reframe);

module.exports = router;
