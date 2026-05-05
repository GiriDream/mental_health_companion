const Habit = require('../models/Habit');

// Helper to get today's date in YYYY-MM-DD local time
const getTodayStr = () => {
  const date = new Date();
  // Adjust for local timezone offset so 'today' matches the user's actual day
  const offset = date.getTimezoneOffset();
  date.setMinutes(date.getMinutes() - offset);
  return date.toISOString().split('T')[0];
};

const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createHabit = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const habit = await Habit.create({
      userId: req.userId,
      title
    });
    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const { dateStr } = req.body; // e.g., '2023-10-27'
    
    if (!dateStr) return res.status(400).json({ message: 'Date string is required' });

    const habit = await Habit.findOne({ _id: id, userId: req.userId });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    const dateIndex = habit.completedDates.indexOf(dateStr);
    let isCompleted = false;

    if (dateIndex === -1) {
      // Complete the habit
      habit.completedDates.push(dateStr);
      // Simple streak logic: if today was completed, or yesterday was completed
      // We will just increment streak for now if it's today's date
      const todayStr = getTodayStr();
      if (dateStr === todayStr) {
        habit.streak += 1;
      }
      isCompleted = true;
    } else {
      // Undo completion
      habit.completedDates.splice(dateIndex, 1);
      const todayStr = getTodayStr();
      if (dateStr === todayStr && habit.streak > 0) {
        habit.streak -= 1;
      }
      isCompleted = false;
    }

    await habit.save();
    res.json({ habit, isCompleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteHabit = async (req, res) => {
  try {
    const { id } = req.params;
    await Habit.findOneAndDelete({ _id: id, userId: req.userId });
    res.json({ message: 'Habit deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getHabits, createHabit, toggleHabit, deleteHabit };
