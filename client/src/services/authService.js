import axios from 'axios';

const API = 'https://mitra-backend.onrender.com/api/auth';

export const registerUser = async (name, email, password) => {
  const res = await axios.post(`${API}/register`, { name, email, password });
  return res.data;
};

export const loginUser = async (email, password) => {
  const res = await axios.post(`${API}/login`, { email, password });
  return res.data;
};