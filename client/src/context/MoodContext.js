import React, { createContext, useState, useContext } from 'react';

const MoodContext = createContext();

export const MoodProvider = ({ children }) => {
  const [currentMood, setCurrentMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);

  const updateMood = (mood) => {
    setCurrentMood(mood);
  };

  const addMoodHistory = (mood) => {
    setMoodHistory(prev => [mood, ...prev]);
  };

  return (
    <MoodContext.Provider value={{
      currentMood,
      moodHistory,
      updateMood,
      addMoodHistory
    }}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = () => useContext(MoodContext);