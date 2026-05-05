import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { sendMessage, getChatHistory } from '../../services/aiService';
import './ChatPage.css';

const MOOD_COLORS = {
  happy: '#4eca8b',
  sad: '#60a5fa',
  anxious: '#f4c97a',
  angry: '#f87c6d',
  stressed: '#c084fc',
  neutral: '#94a3b8'
};

const MOOD_EMOJIS = {
  happy: '😊',
  sad: '😢',
  anxious: '😰',
  angry: '😠',
  stressed: '😩',
  neutral: '😐'
};

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentMood, setCurrentMood] = useState(null);
  const [showSuggestion, setShowSuggestion] = useState(null);
  const { token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (location.state?.mood) {
      setCurrentMood(location.state.mood);
      handleInitialMessage(location.state.mood);
    } else {
      loadChatHistory();
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const loadChatHistory = async () => {
    try {
      const history = await getChatHistory(token);
      const formatted = history.map(msg => ({
        role: msg.role,
        content: msg.content,
        mood: msg.mood,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      }));
      setMessages(formatted);
    } catch (error) {
      console.log('History error:', error);
    }
  };

  const handleInitialMessage = async (mood) => {
    const initialMsg = `I'm feeling ${mood.label} today ${mood.emoji}`;
    await handleSend(initialMsg);
  };

  const handleSend = async (text) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    const userMessage = {
      role: 'user',
      content: messageText,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setShowSuggestion(null);

    try {
      const response = await sendMessage(messageText, token);

      setCurrentMood({
        value: response.mood,
        label: response.mood,
        color: MOOD_COLORS[response.mood],
        emoji: MOOD_EMOJIS[response.mood]
      });

      const aiMessage = {
        role: 'ai',
        content: response.response,
        mood: response.mood,
        suggestion: response.suggestion,
        needsProfessionalHelp: response.needsProfessionalHelp,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      setMessages(prev => [...prev, aiMessage]);

      // Show suggestion after 2 seconds
      if (response.suggestion) {
        setTimeout(() => {
          setShowSuggestion(response.suggestion);
        }, 2000);
      }

    } catch (error) {
      console.log('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: "I'm here with you. 💙 Something went wrong on my end - could you try sending that again?",
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      }]);
    } finally {
      setLoading(false);
    }
  };

  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Chrome browser use பண்ணுங்க!');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setInput(text);
      inputRef.current?.focus();
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setCurrentMood(null);
    setShowSuggestion(null);
  };

  return (
    <div className="chat-container">

      {/* Header */}
      <div className="chat-header">
        <button className="back-btn" onClick={() => navigate('/home')}>
          ← Back
        </button>

        <div className="chat-title">
          <h2>🧠 Mitra</h2>
          {currentMood && (
            <span
              className="mood-indicator"
              style={{ color: currentMood.color || MOOD_COLORS[currentMood.value] }}
            >
              {currentMood.emoji || MOOD_EMOJIS[currentMood.value]} {currentMood.label || currentMood.value}
            </span>
          )}
        </div>

        <button className="clear-btn" onClick={clearChat}>
          ✕ Clear
        </button>
      </div>

      {/* Messages */}
      <div className="chat-messages">

        {/* Welcome */}
        {messages.length === 0 && (
          <div className="welcome-msg">
            <span className="welcome-emoji">🌿</span>
            <h3>Hi, I'm Mitra</h3>
            <p>Your safe space to talk about anything.<br />
              I'm here to listen, not to judge.</p>
            <div className="quick-prompts">
              {[
                "I'm feeling really stressed lately",
                "I need someone to talk to",
                "I've been feeling anxious",
                "Something is bothering me"
              ].map((prompt, i) => (
                <button
                  key={i}
                  className="quick-prompt-btn"
                  onClick={() => handleSend(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role}`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {msg.role === 'ai' && (
              <div className="ai-avatar">🧠</div>
            )}

            <div className="message-content">
              <div className="message-bubble">
                <p>{msg.content}</p>
              </div>

              {/* Professional Help Warning */}
              {msg.needsProfessionalHelp && (
                <div className="professional-help">
                  ⚠️ If you're struggling deeply, please consider speaking with a mental health professional. You deserve proper support.
                </div>
              )}

              <span className="message-time">{msg.time}</span>
            </div>

            {msg.role === 'user' && (
              <div className="user-avatar">👤</div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="message ai">
            <div className="ai-avatar">🧠</div>
            <div className="message-content">
              <div className="message-bubble typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggestion Banner */}
      {showSuggestion && (
        <div className="suggestion-banner">
          <span className="suggestion-icon">💡</span>
          <p>{showSuggestion}</p>
          <button
            className="suggestion-close"
            onClick={() => setShowSuggestion(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* Input */}
      <div className="chat-input-section">
        <button
          className={`voice-btn ${isListening ? 'listening' : ''}`}
          onClick={isListening ? stopVoice : startVoice}
          title="Voice input"
        >
          {isListening ? '🔴' : '🎤'}
        </button>

        <input
          ref={inputRef}
          type="text"
          placeholder="Share what's on your mind..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />

        <button
          className="send-btn"
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
        >
          ➤
        </button>
      </div>

    </div>
  );
}

export default ChatPage;