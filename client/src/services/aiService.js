import axios from 'axios';

const API = 'http://localhost:5000/api/chat';

export const sendMessage = async (message, token) => {
  const res = await axios.post(
    `${API}/send`,
    { message },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const getChatHistory = async (token) => {
  const res = await axios.get(
    `${API}/history`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};