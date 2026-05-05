import axios from 'axios';

const API = 'http://localhost:5000/api/habits';

export const getHabits = async (token) => {
  const res = await axios.get(API, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const createHabit = async (token, title) => {
  const res = await axios.post(API, { title }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const toggleHabit = async (token, id, dateStr) => {
  const res = await axios.put(`${API}/${id}/toggle`, { dateStr }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data; // { habit, isCompleted }
};

export const deleteHabit = async (token, id) => {
  const res = await axios.delete(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
