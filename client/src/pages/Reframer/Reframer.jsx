import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './Reframer.css';

function Reframer() {
  const [thought, setThought] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleReframe = async () => {
    if (!thought.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post('http://localhost:5000/api/cbt/reframe', 
        { thought },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
    } catch (error) {
      console.log('Error reframing thought:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reframer-container">
      <div className="reframer-header">
        <button className="back-btn" onClick={() => navigate('/home')}>← Back</button>
        <h2>🧠 CBT Reframer</h2>
        <div style={{ width: '60px' }}></div>
      </div>

      <div className="reframer-content">
        <div className="reframer-intro">
          <h3>Challenge Your Thoughts</h3>
          <p>
            Cognitive Behavioral Therapy (CBT) helps you identify negative or irrational thoughts 
            and reframe them into balanced, healthy perspectives.
          </p>
        </div>

        <div className="reframer-input-card">
          <label>What's on your mind?</label>
          <textarea 
            placeholder="E.g., I messed up that presentation, I'm a total failure and I'll probably get fired..."
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            rows={4}
          />
          <button className="reframe-btn" onClick={handleReframe} disabled={loading || !thought.trim()}>
            {loading ? '✨ Analyzing...' : '✨ Reframe Thought'}
          </button>
        </div>

        {result && (
          <div className="reframer-result-card">
            <div className="result-section distortions">
              <h4>⚠️ Cognitive Distortions Detected</h4>
              <div className="distortions-list">
                {result.distortions.map((d, i) => (
                  <span key={i} className="distortion-pill">{d}</span>
                ))}
              </div>
            </div>

            <div className="result-section analysis">
              <h4>💡 Analysis</h4>
              <p>{result.analysis}</p>
            </div>

            <div className="result-section reframe">
              <h4>🌿 Healthy Reframe</h4>
              <p className="reframe-text">"{result.reframe}"</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reframer;
