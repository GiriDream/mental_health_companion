import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Learn.css';

const ARTICLES = [
  {
    id: 1,
    title: "The Basics of Cognitive Behavioral Therapy (CBT)",
    category: "Therapy Techniques",
    readTime: "4 min",
    icon: "🧠",
    summary: "Understand how your thoughts, feelings, and behaviors are connected, and learn to break negative cycles.",
    content: `
      <h3>What is CBT?</h3>
      <p>Cognitive Behavioral Therapy (CBT) is a highly effective, evidence-based psychological treatment. Its core premise is that our thoughts, feelings, and behaviors are interconnected. When we change how we think, we can change how we feel and act.</p>
      
      <h3>The Core Cycle</h3>
      <ul>
        <li><strong>Thoughts:</strong> "I'm going to fail this presentation."</li>
        <li><strong>Feelings:</strong> Anxiety, dread, physical tension.</li>
        <li><strong>Behaviors:</strong> Procrastinating, avoiding eye contact, stumbling over words.</li>
      </ul>
      <p>This creates a self-fulfilling prophecy. CBT helps you intervene at the "Thoughts" level.</p>

      <h3>How to Practice Basic CBT</h3>
      <p>1. <strong>Catch it:</strong> Identify the negative thought when it happens.<br>
      2. <strong>Check it:</strong> Look for evidence. Is this thought 100% true? Are you catastrophizing?<br>
      3. <strong>Change it:</strong> Replace the thought with a more balanced one. "I might be nervous, but I have prepared well and can handle it."</p>
    `
  },
  {
    id: 2,
    title: "The Science of Deep Breathing",
    category: "Physiology",
    readTime: "3 min",
    icon: "🌬️",
    summary: "Discover exactly what happens in your nervous system when you take a deep, slow breath.",
    content: `
      <h3>The Vagus Nerve</h3>
      <p>When you feel stressed, your sympathetic nervous system (fight-or-flight) kicks in. Your heart rate increases and your breathing becomes shallow. Deep, slow breathing stimulates the <strong>Vagus Nerve</strong>.</p>
      
      <h3>Flipping the Switch</h3>
      <p>The Vagus Nerve acts as a brake on stress. When stimulated by deep exhalations, it activates the parasympathetic nervous system (rest-and-digest). This literally forces your heart rate to slow down and your blood pressure to drop.</p>

      <h3>Why Exhales Matter</h3>
      <p>When you inhale, your heart rate slightly speeds up. When you exhale, it slows down. This is why exercises like the 4-7-8 technique (where the exhale is longer than the inhale) are so incredibly effective at causing rapid physical relaxation.</p>
    `
  },
  {
    id: 3,
    title: "Grounding: The 5-4-3-2-1 Technique",
    category: "Anxiety Relief",
    readTime: "2 min",
    icon: "🦶",
    summary: "A simple sensory technique to pull your mind away from panic and back into the present moment.",
    content: `
      <h3>What is Grounding?</h3>
      <p>During an anxiety or panic attack, your mind is often racing into the future (worrying about what might happen) or stuck in the past. Grounding techniques force your brain to process sensory information from the immediate, safe present.</p>
      
      <h3>The 5-4-3-2-1 Method</h3>
      <p>Look around you and out loud (or in your head), identify:</p>
      <ul>
        <li><strong>5 things you can SEE:</strong> A pen, a tree outside, a crack in the wall.</li>
        <li><strong>4 things you can FEEL:</strong> The fabric of your shirt, the chair against your back, the floor under your feet.</li>
        <li><strong>3 things you can HEAR:</strong> The hum of the fridge, traffic outside, a clock ticking.</li>
        <li><strong>2 things you can SMELL:</strong> Coffee, laundry detergent, or just fresh air.</li>
        <li><strong>1 thing you can TASTE:</strong> A mint, toothpaste, or take a sip of water.</li>
      </ul>
      <p>By forcing your brain to process these diverse sensory inputs, you interrupt the panic loop.</p>
    `
  }
];

function Learn() {
  const navigate = useNavigate();
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <div className="learn-container">
      {/* Header */}
      <div className="learn-header">
        <button className="back-btn" onClick={() => navigate('/home')}>
          ← Back
        </button>
        <h2>📚 Psychoeducation Library</h2>
        <div></div>
      </div>

      <div className="learn-subtitle">
        <p>Understand your mind. Build better habits. Learn the science of well-being.</p>
      </div>

      {/* Grid of Articles */}
      <div className="articles-grid">
        {ARTICLES.map((article) => (
          <div key={article.id} className="article-card" onClick={() => setSelectedArticle(article)}>
            <div className="article-card-header">
              <span className="article-icon">{article.icon}</span>
              <span className="article-category">{article.category}</span>
            </div>
            <h3 className="article-title">{article.title}</h3>
            <p className="article-summary">{article.summary}</p>
            <div className="article-footer">
              <span className="read-time">⏱ {article.readTime}</span>
              <span className="read-more">Read Article →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Reading Modal */}
      {selectedArticle && (
        <div className="article-modal-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="article-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setSelectedArticle(null)}>
              ✕ Close
            </button>
            
            <div className="modal-header-meta">
              <span className="modal-category">{selectedArticle.category}</span>
              <span className="modal-time">⏱ {selectedArticle.readTime}</span>
            </div>
            
            <h2 className="modal-title">{selectedArticle.icon} {selectedArticle.title}</h2>
            <hr className="modal-divider" />
            
            <div 
              className="modal-body"
              dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Learn;
