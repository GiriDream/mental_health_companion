import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMoodHistory } from '../../services/moodService';
import './Home.css';

const MOODS = [
  { emoji: '😊', label: 'Happy', value: 'happy', color: '#4eca8b' },
  { emoji: '😢', label: 'Sad', value: 'sad', color: '#60a5fa' },
  { emoji: '😰', label: 'Anxious', value: 'anxious', color: '#f4c97a' },
  { emoji: '😠', label: 'Angry', value: 'angry', color: '#f87c6d' },
  { emoji: '😩', label: 'Stressed', value: 'stressed', color: '#c084fc' },
  { emoji: '😐', label: 'Neutral', value: 'neutral', color: '#94a3b8' },
];

const QUOTES = [
  "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, or anxious.",
  "Mental health is not a destination, but a process.",
  "You are not alone in this. Every storm runs out of rain.",
  "Healing is not linear. Be patient with yourself.",
  "Your feelings are valid. Your struggles are real. You matter."
];

const QUICK_ACTIONS = [
  { icon: '🤖', label: 'AI Chat', path: '/chat', color: '#4eca8b' },
  { icon: '📔', label: 'Journal', path: '/journal', color: '#60a5fa' },
  { icon: '📊', label: 'Progress', path: '/progress', color: '#c084fc' },
  { icon: '🧠', label: 'CBT Reframer', path: '/reframe', color: '#fca5a5' },
  { icon: '🌱', label: 'Habits', path: '/habits', color: '#34d399' },
  { icon: '🌬️', label: 'Mindfulness', path: '/breathing', color: '#f4c97a' },
  { icon: '📚', label: 'Learn', path: '/learn', color: '#9ca3af' },
  { icon: '⚙️', label: 'Settings', path: '/profile', color: '#94a3b8' },
];

function Home() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [quote, setQuote] = useState('');
  const [greeting, setGreeting] = useState('');
  const [time, setTime] = useState('');
  const [needsProactiveCheckin, setNeedsProactiveCheckin] = useState(false);

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
      }));
    }, 1000);

    checkRecentMoods();

    return () => clearInterval(timer);
  }, []);

  const checkRecentMoods = async () => {
    try {
      const data = await getMoodHistory(token);
      if (data && data.length >= 3) {
        // Check last 3 moods (data is returned newest first usually, let's just take top 3)
        const recent = data.slice(0, 3);
        const avgScore = recent.reduce((sum, item) => sum + item.score, 0) / 3;
        // If average is very low, trigger proactive alert
        if (avgScore <= 4) {
          setNeedsProactiveCheckin(true);
        }
      }
    } catch (error) {
      console.log('Error checking moods for proactive alert:', error);
    }
  };

  return (
    <div className="home-container">

      {/* Background */}
      <div className="bg-image" />
      <div className="bg-overlay" />
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="brand-icon">🧠</span>
          <span className="brand-name">Mitra</span>
        </div>
        <div className="navbar-right">
          <span className="nav-time">{time}</span>
          <button className="nav-icon-btn" onClick={() => navigate('/profile')} title="Settings">
            ⚙️
          </button>
          <button className="nav-logout" onClick={logout}>
            Sign out
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <p className="hero-greeting">{greeting}</p>
        <h1 className="hero-name">{user?.name}</h1>
        <p className="hero-sub">
          How is your mind today? Let's check in.
        </p>
      </section>

      {/* Daily Affirmation Widget */}
      <section className="affirmation-widget">
        <div className="affirmation-card">
          <span className="affirmation-icon">✨</span>
          <div className="affirmation-content">
            <p className="affirmation-text">"{quote}"</p>
            <span className="affirmation-label">Daily Affirmation</span>
          </div>
        </div>
      </section>

      {/* Proactive Check-in Alert */}
      {needsProactiveCheckin && (
        <section className="proactive-section">
          <div className="proactive-banner">
            <div className="proactive-content">
              <span className="proactive-icon">💙</span>
              <div>
                <h3>We noticed things have been tough lately.</h3>
                <p>You've had a few difficult days. Want to talk about it or take a moment to breathe?</p>
              </div>
            </div>
            <div className="proactive-actions">
              <button onClick={() => navigate('/chat')}>Talk to Mitra</button>
              <button className="outline" onClick={() => navigate('/breathing')}>Breathe</button>
            </div>
          </div>
        </section>
      )}

      {/* Mood Section */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Daily Mood Check</h2>
          <span className="section-badge">Today</span>
        </div>
        <div className="mood-grid">
          {MOODS.map((mood, index) => (
            <button
              key={mood.value}
              className="mood-card"
              style={{
                '--mood-color': mood.color,
                animationDelay: `${index * 0.07}s`
              }}
              onClick={() => navigate('/chat', { state: { mood } })}
            >
              <span className="mood-emoji">{mood.emoji}</span>
              <span className="mood-label">{mood.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Quick Actions</h2>
        </div>
        <div className="actions-grid">
          {QUICK_ACTIONS.map((action, index) => (
            <button
              key={action.path}
              className="action-card"
              style={{
                '--action-color': action.color,
                animationDelay: `${index * 0.08}s`
              }}
              onClick={() => navigate(action.path)}
            >
              <div
                className="action-icon"
                style={{
                  background: `${action.color}15`,
                  border: `1px solid ${action.color}25`
                }}
              >
                {action.icon}
              </div>
              <span className="action-label">{action.label}</span>
            </button>
          ))}
        </div>
      </section>



      {/* CTA */}
      <section className="cta-section">
        <button className="cta-btn" onClick={() => navigate('/chat')}>
          <span className="cta-icon">🤖</span>
          <div className="cta-text">
            <span className="cta-title">Talk to AI Companion</span>
            <span className="cta-sub">Available 24/7 for you</span>
          </div>
          <span className="cta-arrow">→</span>
        </button>
      </section>

    </div>
  );
}

export default Home;