const express = require('express');
const router = express.Router();
const { getJournals, createJournal, deleteJournal } = require('../controllers/journalController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getJournals);
router.post('/create', authMiddleware, createJournal);
router.delete('/:id', authMiddleware, deleteJournal);

module.exports = router;