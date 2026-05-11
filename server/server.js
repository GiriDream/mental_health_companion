const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// CORS Configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://mental-health-companion-nu.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/mood', require('./routes/moodRoutes'));
app.use('/api/journal', require('./routes/journalRoutes'));

app.get('/', (req, res) => {
  res.send('Mitra Backend Running! ✅');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} ✅`);
});