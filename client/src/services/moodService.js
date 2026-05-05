import axios from 'axios';

const API = 'http://localhost:5000/api/mood';

export const getMoodHistory = async (token) => {
  const res = await axios.get(
    `${API}/history`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const saveMood = async (mood, score, note, token) => {
  const res = await axios.post(
    `${API}/save`,
    { mood, score, note },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};