import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getHabits, createHabit, toggleHabit, deleteHabit } from '../../services/habitService';
import './Habits.css';

const getTodayStr = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  date.setMinutes(date.getMinutes() - offset);
  return date.toISOString().split('T')[0];
};

function Habits() {
  const [habits, setHabits] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();
  const todayStr = getTodayStr();

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const data = await getHabits(token);
      setHabits(data);
    } catch (error) {
      console.log('Error fetching habits:', error);
    }
  };

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setLoading(true);
    try {
      await createHabit(token, newTitle);
      setNewTitle('');
      fetchHabits();
    } catch (error) {
      console.log('Error creating habit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    // Optimistic update
    setHabits(habits.map(h => {
      if (h._id === id) {
        const isCompletedNow = !h.completedDates.includes(todayStr);
        let newStreak = h.streak;
        if (isCompletedNow) newStreak++;
        else if (h.streak > 0) newStreak--;
        
        return {
          ...h,
          completedDates: isCompletedNow 
            ? [...h.completedDates, todayStr]
            : h.completedDates.filter(d => d !== todayStr),
          streak: newStreak
        };
      }
      return h;
    }));

    try {
      await toggleHabit(token, id, todayStr);
      fetchHabits(); // Fetch from server to ensure accuracy
    } catch (error) {
      console.log('Error toggling habit:', error);
      fetchHabits(); // Revert on failure
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this habit?")) return;
    try {
      await deleteHabit(token, id);
      fetchHabits();
    } catch (error) {
      console.log('Error deleting habit:', error);
    }
  };

  return (
    <div className="habits-container">
      {/* Header */}
      <div className="habits-header">
        <button className="back-btn" onClick={() => navigate('/home')}>
          ← Back
        </button>
        <h2>🌱 Daily Habits</h2>
        <div></div>
      </div>

      <div className="habits-content">
        <p className="habits-subtitle">Small steps every day lead to big changes over time.</p>

        {/* Add Habit Form */}
        <form className="add-habit-form" onSubmit={handleAddHabit}>
          <input 
            type="text" 
            placeholder="What habit do you want to build? (e.g. Drink water)" 
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading || !newTitle.trim()}>
            {loading ? '...' : '+ Add'}
          </button>
        </form>

        {/* Habits List */}
        <div className="habits-list">
          {habits.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🎯</span>
              <p>No habits yet. Start by adding one above!</p>
            </div>
          ) : (
            habits.map(habit => {
              const isDoneToday = habit.completedDates.includes(todayStr);
              return (
                <div key={habit._id} className={`habit-card ${isDoneToday ? 'done' : ''}`}>
                  <button 
                    className={`habit-checkbox ${isDoneToday ? 'checked' : ''}`}
                    onClick={() => handleToggle(habit._id)}
                  >
                    {isDoneToday && '✓'}
                  </button>
                  
                  <div className="habit-info">
                    <span className="habit-title">{habit.title}</span>
                  </div>

                  <div className="habit-streak">
                    🔥 {habit.streak}
                  </div>

                  <button className="habit-delete" onClick={() => handleDelete(habit._id)} title="Delete Habit">
                    ✕
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Habits;
