import axios from 'axios';

const API = 'http://localhost:5000/api/insights';

export const getWeeklyInsights = async (token, days = 7) => {
  const response = await axios.get(`${API}/weekly?days=${days}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
