const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/mood', require('./routes/moodRoutes'));
app.use('/api/journal', require('./routes/journalRoutes'));
app.use('/api/insights', require('./routes/insightRoutes'));
app.use('/api/habits', require('./routes/habitRoutes'));
app.use('/api/cbt', require('./routes/cbtRoutes'));

app.get('/', (req, res) => {
  res.send('AI Mental Health Server Running! ✅');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} ✅`);
});