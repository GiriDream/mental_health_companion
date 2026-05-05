import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './Profile.css';

function Profile() {
  const { user, token, updateProfileContext } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [theme, setTheme] = useState(user?.theme || 'dark-forest');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.put('http://localhost:5000/api/auth/update-profile', 
        { name, theme },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      updateProfileContext(res.data.user);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.log('Error updating profile:', error);
      setMessage('Error updating profile.');
    } finally {
      setLoading(false);
    }
  };

  const THEMES = [
    { id: 'dark-forest', name: 'Dark Forest', icon: '🌲', color: '#4eca8b' },
    { id: 'ocean', name: 'Deep Ocean', icon: '🌊', color: '#60a5fa' },
    { id: 'sunset', name: 'Sunset Glow', icon: '🌅', color: '#f87c6d' }
  ];

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button className="back-btn" onClick={() => navigate('/home')}>← Back</button>
        <h2>⚙️ Settings & Profile</h2>
        <div style={{ width: '60px' }}></div> {/* Spacer */}
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="avatar-section">
            <div className="avatar-circle">
              {name ? name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h3>{user?.email}</h3>
          </div>

          <div className="form-group">
            <label>Display Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="form-group">
            <label>App Theme</label>
            <div className="theme-grid">
              {THEMES.map(t => (
                <div 
                  key={t.id}
                  className={`theme-card ${theme === t.id ? 'active' : ''}`}
                  onClick={() => setTheme(t.id)}
                  style={{ '--theme-color': t.color }}
                >
                  <span className="theme-icon">{t.icon}</span>
                  <span className="theme-name">{t.name}</span>
                </div>
              ))}
            </div>
          </div>

          {message && <div className="status-message">{message}</div>}

          <button className="save-profile-btn" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
