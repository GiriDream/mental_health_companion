const express = require('express');
const router = express.Router();
const { getHabits, createHabit, toggleHabit, deleteHabit } = require('../controllers/habitController');
const auth = require('../middleware/authMiddleware');

router.use(auth);

router.get('/', getHabits);
router.post('/', createHabit);
router.put('/:id/toggle', toggleHabit);
router.delete('/:id', deleteHabit);

module.exports = router;
