import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './Journal.css';

const API = 'https://mitra-backend.onrender.com/api/journal';

function Journal() {
  const [journals, setJournals] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('neutral');
  const [tagsInput, setTagsInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJournals(res.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    try {
      const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t);
      await axios.post(`${API}/create`, { title, content, mood, tags }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTitle('');
      setContent('');
      setMood('neutral');
      setTagsInput('');
      setShowForm(false);
      fetchJournals();
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchJournals();
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const MOOD_EMOJIS = {
    happy: '😊', sad: '😢', anxious: '😰',
    angry: '😠', stressed: '😩', neutral: '😐'
  };

  const filteredJournals = journals.filter(j => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchTitle = j.title.toLowerCase().includes(q);
    const matchTag = j.tags && j.tags.some(t => t.toLowerCase().includes(q));
    return matchTitle || matchTag;
  });

  return (
    <div className="journal-container">

      {/* Header */}
      <div className="journal-header">
        <button className="back-btn" onClick={() => navigate('/home')}>
          ← Back
        </button>
        <h2>📔 My Journal</h2>
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕' : '+ New'}
        </button>
      </div>

      {/* New Journal Form */}
      {showForm && (
        <div className="journal-form">
          <input
            type="text"
            placeholder="Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Write your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
          />
          <input
            type="text"
            placeholder="Tags (comma separated, e.g., anxiety, work)"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />
          <select value={mood} onChange={(e) => setMood(e.target.value)}>
            {Object.entries(MOOD_EMOJIS).map(([key, emoji]) => (
              <option key={key} value={key}>{emoji} {key}</option>
            ))}
          </select>
          <button
            className="save-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? '⏳ Saving...' : '💾 Save Journal'}
          </button>
        </div>
      )}

      {/* Journal List */}
      <div className="journal-list">
        <div className="journal-list-header">
          <input 
            type="text" 
            className="search-bar" 
            placeholder="🔍 Search by title or tag..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredJournals.length === 0 ? (
          <div className="empty-state">
            <p>📝</p>
            <p>{searchQuery ? 'No journals match your search' : 'No journals yet!'}</p>
            <p>{searchQuery ? 'Try a different keyword' : 'Click + New to write your first journal'}</p>
          </div>
        ) : (
          filteredJournals.map((journal) => (
            <div key={journal._id} className="journal-card">
              <div className="journal-card-header">
                <span className="journal-mood">
                  {MOOD_EMOJIS[journal.mood] || '😐'}
                </span>
                <div>
                  <h3>{journal.title}</h3>
                  <p className="journal-date">
                    {new Date(journal.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(journal._id)}
                >
                  🗑️
                </button>
              </div>
              <p className="journal-content">{journal.content}</p>
              {journal.tags && journal.tags.length > 0 && (
                <div className="journal-tags">
                  {journal.tags.map((tag, idx) => (
                    <span key={idx} className="tag-pill">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default Journal;