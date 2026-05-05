import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMoodHistory } from '../../services/moodService';
import { getWeeklyInsights } from '../../services/insightService';
import {
  LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import './Progress.css';

const MOOD_EMOJIS = {
  happy: '😊', sad: '😢', anxious: '😰',
  angry: '😠', stressed: '😩', neutral: '😐'
};

const MOOD_COLORS = {
  happy: '#4ade80', sad: '#60a5fa', anxious: '#fbbf24',
  angry: '#f87171', stressed: '#c084fc', neutral: '#94a3b8'
};

const BADGES = [
  { id: 'first_log', title: 'First Check-in', desc: 'Logged your very first mood.', icon: '🌟', requiredLogs: 1 },
  { id: 'week_streak', title: 'Consistency Key', desc: 'Logged 7 moods total.', icon: '🔥', requiredLogs: 7 },
  { id: 'month_master', title: 'Self-Aware', desc: 'Reached 30 mood logs.', icon: '👑', requiredLogs: 30 },
  { id: 'positivity', title: 'High Vibes', desc: 'Logged a perfect 10 mood score.', icon: '✨', requiredScore: 10 },
];

function Progress() {
  const [moodHistory, setMoodHistory] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMoodHistory();
  }, []);

  const fetchMoodHistory = async () => {
    try {
      const data = await getMoodHistory(token);
      setMoodHistory(data.reverse());
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const fetchInsights = async () => {
    setLoadingInsights(true);
    try {
      const data = await getWeeklyInsights(token);
      setInsights(data);
    } catch (error) {
      console.log('Error fetching insights:', error);
    } finally {
      setLoadingInsights(false);
    }
  };

  const chartData = moodHistory.map((item, index) => ({
    day: index + 1,
    score: item.score,
    mood: item.mood
  }));

  const averageScore = moodHistory.length > 0
    ? (moodHistory.reduce((sum, item) => sum + item.score, 0) / moodHistory.length).toFixed(1)
    : 0;

  const mostFrequentMood = () => {
    if (moodHistory.length === 0) return 'neutral';
    const counts = {};
    moodHistory.forEach(item => {
      counts[item.mood] = (counts[item.mood] || 0) + 1;
    });
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  };

  // Generate 30 days of heatmap data
  const generateHeatmapData = () => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString();
      
      const entry = moodHistory.find(item => new Date(item.createdAt).toLocaleDateString() === dateStr);
      
      let level = 0;
      if (entry) {
        if (entry.score >= 8) level = 4;
        else if (entry.score >= 6) level = 3;
        else if (entry.score >= 4) level = 2;
        else level = 1;
      }
      
      data.push({
        date: dateStr,
        level,
        score: entry ? entry.score : null
      });
    }
    return data;
  };

  const checkBadges = () => {
    return BADGES.map(badge => {
      let earned = false;
      if (badge.requiredLogs) earned = moodHistory.length >= badge.requiredLogs;
      if (badge.requiredScore) earned = moodHistory.some(m => m.score >= badge.requiredScore);
      return { ...badge, earned };
    });
  };

  const heatmapData = generateHeatmapData();
  const badgesWithStatus = checkBadges();

  return (
    <div className="progress-container">

      {/* Header */}
      <div className="progress-header">
        <button className="back-btn" onClick={() => navigate('/home')}>
          ← Back
        </button>
        <h2>📊 My Progress</h2>
        <button className="export-btn" onClick={() => window.print()}>
          📄 Export PDF
        </button>
      </div>

      {/* Print-Only Header */}
      <div className="print-header">
        <h1>Mental Health Progress Report</h1>
        <p>Generated on: {new Date().toLocaleDateString()}</p>
        <hr />
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{moodHistory.length}</span>
          <span className="stat-label">Total Entries</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{averageScore}</span>
          <span className="stat-label">Avg Score</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {MOOD_EMOJIS[mostFrequentMood()]}
          </span>
          <span className="stat-label">Common Mood</span>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="insights-section">
        <div className="insights-header">
          <h3>🧠 Weekly AI Insights</h3>
          {!insights && !loadingInsights && (
            <button className="generate-btn" onClick={fetchInsights}>
              Generate Report
            </button>
          )}
        </div>
        
        {loadingInsights && <p className="loading-text">Analyzing your week... ⏳</p>}
        
        {insights && (
          <div className="insights-content">
            <p className="insight-summary">"{insights.summary}"</p>
            
            <div className="insight-themes">
              <strong>Key Themes:</strong>
              <div className="theme-tags">
                {insights.themes.map((theme, i) => (
                  <span key={i} className="theme-tag">{theme}</span>
                ))}
              </div>
            </div>
            
            <div className="insight-suggestion">
              💡 <strong>Try this:</strong> {insights.suggestion}
            </div>

            {insights.needsProactiveCheckin && (
              <div className="proactive-alert">
                <p>⚠️ It looks like things have been heavy lately. Would you like to do a quick check-in?</p>
                <div className="alert-buttons">
                  <button onClick={() => navigate('/chat')}>Talk to Mitra</button>
                  <button onClick={() => navigate('/breathing')}>Breathing Exercise</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="chart-section">
        <h3>Mood Score Over Time</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={12} />
              <YAxis domain={[0, 10]} stroke="rgba(255,255,255,0.2)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: '#1a1035',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: 'white'
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#7c3aed"
                strokeWidth={2}
                dot={{ fill: '#a78bfa', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="no-data">
            <p>No data yet! Start chatting to track your mood 🧠</p>
          </div>
        )}
      </div>

      {/* Heatmap Section */}
      <div className="heatmap-section">
        <h3>Mood Consistency (Last 30 Days)</h3>
        <div className="heatmap-container">
          <div className="heatmap-grid">
            {heatmapData.map((day, index) => (
              <div 
                key={index} 
                className={`heatmap-cell level-${day.level}`}
                title={`${day.date}${day.score !== null ? ` - Score: ${day.score}` : ' - No entry'}`}
              />
            ))}
          </div>
          <div className="heatmap-legend">
            <span>Low Mood</span>
            <div className="heatmap-cell level-1"></div>
            <div className="heatmap-cell level-2"></div>
            <div className="heatmap-cell level-3"></div>
            <div className="heatmap-cell level-4"></div>
            <span>High Mood</span>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="achievements-section">
        <h3>Milestones & Achievements</h3>
        <div className="badges-grid">
          {badgesWithStatus.map(badge => (
            <div key={badge.id} className={`badge-card ${badge.earned ? 'earned' : 'locked'}`}>
              <div className="badge-icon-wrapper">
                <span className="badge-icon">{badge.icon}</span>
              </div>
              <h4>{badge.title}</h4>
              <p>{badge.desc}</p>
              {!badge.earned && <div className="lock-overlay">🔒</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Moods */}
      <div className="recent-moods">
        <h3>Recent Moods</h3>
        {moodHistory.slice(-5).reverse().map((item, index) => (
          <div key={index} className="mood-row">
            <span className="mood-emoji-small">
              {MOOD_EMOJIS[item.mood]}
            </span>
            <div className="mood-info">
              <span
                className="mood-name"
                style={{ color: MOOD_COLORS[item.mood] }}
              >
                {item.mood}
              </span>
              <span className="mood-date">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="mood-score-bar">
              <div
                className="mood-score-fill"
                style={{
                  width: `${item.score * 10}%`,
                  background: MOOD_COLORS[item.mood]
                }}
              />
            </div>
            <span className="mood-score-num">{item.score}/10</span>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Progress;