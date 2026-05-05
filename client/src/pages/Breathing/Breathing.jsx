import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Breathing.css';

const EXERCISES = [
  { name: 'Box Breathing', inhale: 4, hold1: 4, exhale: 4, hold2: 4, color: '#7c3aed' },
  { name: '4-7-8 Breathing', inhale: 4, hold1: 7, exhale: 8, hold2: 0, color: '#3b82f6' },
  { name: 'Deep Breathing', inhale: 5, hold1: 2, exhale: 5, hold2: 0, color: '#4ade80' },
];

const AUDIO_TRACKS = [
  {
    id: 1,
    title: "Ambient Alpha Waves",
    duration: "5 Min",
    type: "Focus & Sleep",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "Deep Relaxation Tones",
    duration: "5 Min",
    type: "Deep Relaxation",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "Grounding Frequencies",
    duration: "5 Min",
    type: "Grounding",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    id: 4,
    title: "Delta Sleep Harmony",
    duration: "5 Min",
    type: "Deep Sleep",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    id: 5,
    title: "Focus & Study Rhythm",
    duration: "5 Min",
    type: "Focus & Study",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  },
  {
    id: 6,
    title: "Calm Mind Melody",
    duration: "5 Min",
    type: "Nature & Calming",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
  }
];

function Breathing() {
  const [activeTab, setActiveTab] = useState('breathing'); // 'breathing' or 'audio'
  
  // Breathing State
  const [selectedEx, setSelectedEx] = useState(EXERCISES[0]);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('inhale');
  const [count, setCount] = useState(0);
  const [cycles, setCycles] = useState(0);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  // Audio State
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  const PHASES = ['inhale', 'hold1', 'exhale', 'hold2'];
  const PHASE_LABELS = {
    inhale: 'Breathe In 🫁',
    hold1: 'Hold 🤐',
    exhale: 'Breathe Out 💨',
    hold2: 'Hold 🤐'
  };

  // Breathing Logic
  useEffect(() => {
    if (!isActive) return;

    const duration = selectedEx[phase];
    if (duration === 0) {
      nextPhase();
      return;
    }

    setCount(duration);
    timerRef.current = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          nextPhase();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isActive, phase]);

  const nextPhase = () => {
    const currentIndex = PHASES.indexOf(phase);
    const nextIndex = (currentIndex + 1) % PHASES.length;
    if (nextIndex === 0) setCycles(prev => prev + 1);
    setPhase(PHASES[nextIndex]);
  };

  const toggleExercise = () => {
    if (isActive) {
      clearInterval(timerRef.current);
      setIsActive(false);
      setPhase('inhale');
      setCount(0);
    } else {
      setIsActive(true);
      setPhase('inhale');
    }
  };

  const circleScale = phase === 'inhale' ? 1.4 :
    phase === 'exhale' ? 0.8 : 1.1;

  // Audio Logic
  const playTrack = (index) => {
    if (currentTrackIndex === index && isPlaying) {
      // Pause
      audioRef.current.pause();
      setIsPlaying(false);
    } else if (currentTrackIndex === index && !isPlaying) {
      // Resume
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      // Play new track
      setCurrentTrackIndex(index);
      setIsPlaying(true);
      setIsLoading(true);
      // Wait for React to update the ref, then play
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(e => {
            console.log("Audio play failed", e);
            setIsPlaying(false);
            setIsLoading(false);
          });
        }
      }, 0);
    }
  };

  const handleNext = () => {
    if (currentTrackIndex === null) return;
    const nextIndex = (currentTrackIndex + 1) % AUDIO_TRACKS.length;
    playTrack(nextIndex);
  };

  const handlePrevious = () => {
    if (currentTrackIndex === null) return;
    const prevIndex = (currentTrackIndex - 1 + AUDIO_TRACKS.length) % AUDIO_TRACKS.length;
    playTrack(prevIndex);
  };

  useEffect(() => {
    // Cleanup audio on unmount or tab switch
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [activeTab]);

  const currentTrack = currentTrackIndex !== null ? AUDIO_TRACKS[currentTrackIndex] : null;

  return (
    <div className="breathing-container">
      {/* Hidden Audio Player */}
      <audio 
        ref={audioRef} 
        src={currentTrack ? currentTrack.url : ""}
        onLoadStart={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onPlaying={() => { setIsPlaying(true); setIsLoading(false); }}
        onPause={() => setIsPlaying(false)}
        onEnded={handleNext}
      />

      <div className="breathing-header">
        <button className="back-btn" onClick={() => navigate('/home')}>
          ← Back
        </button>
        <h2>🧠 Mindfulness Library</h2>
        <div></div>
      </div>

      {/* Tabs */}
      <div className="mindfulness-tabs">
        <button 
          className={`tab-btn ${activeTab === 'breathing' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('breathing');
          }}
        >
          🌬️ Breathing
        </button>
        <button 
          className={`tab-btn ${activeTab === 'audio' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('audio');
            if (isActive) toggleExercise(); // Stop breathing exercise
          }}
        >
          🎧 Guided Audio
        </button>
      </div>

      {/* Breathing Content */}
      {activeTab === 'breathing' && (
        <div className="tab-content fade-in">
          {/* Exercise Selector */}
          <div className="exercise-selector">
            {EXERCISES.map((ex) => (
              <button
                key={ex.name}
                className={`ex-btn ${selectedEx.name === ex.name ? 'active' : ''}`}
                style={{ '--ex-color': ex.color }}
                onClick={() => {
                  setSelectedEx(ex);
                  setIsActive(false);
                  setPhase('inhale');
                  setCount(0);
                }}
              >
                {ex.name}
              </button>
            ))}
          </div>

          {/* Breathing Circle */}
          <div className="breathing-circle-wrapper">
            <div
              className="breathing-circle"
              style={{
                transform: `scale(${isActive ? circleScale : 1})`,
                background: `radial-gradient(circle, ${selectedEx.color}40, ${selectedEx.color}10)`,
                borderColor: selectedEx.color,
                boxShadow: isActive ? `0 0 60px ${selectedEx.color}40` : 'none'
              }}
            >
              <div className="circle-content">
                {isActive ? (
                  <>
                    <p className="phase-label">{PHASE_LABELS[phase]}</p>
                    <p className="phase-count">{count}</p>
                  </>
                ) : (
                  <p className="start-text">Tap to Start</p>
                )}
              </div>
            </div>
          </div>

          {/* Cycles */}
          {cycles > 0 && (
            <p className="cycles-count">✅ Cycles completed: {cycles}</p>
          )}

          {/* Start/Stop Button */}
          <button
            className="breathing-btn"
            style={{ background: `linear-gradient(135deg, ${selectedEx.color}, #3b82f6)` }}
            onClick={toggleExercise}
          >
            {isActive ? '⏹ Stop' : '▶ Start Exercise'}
          </button>

          {/* Tips */}
          <div className="breathing-tips">
            <h3>💡 Tips</h3>
            <p>• Sit comfortably with your back straight</p>
            <p>• Close your eyes if comfortable</p>
            <p>• Focus only on your breathing</p>
            <p>• Do at least 3-5 cycles for best results</p>
          </div>
        </div>
      )}

      {/* Audio Content */}
      {activeTab === 'audio' && (
        <div className="tab-content fade-in audio-tab-wrapper">
          <div className="audio-header">
            <h3>Soothing Sounds</h3>
            <p>Listen to these calming sounds to relax, focus, or fall asleep.</p>
          </div>

          <div className="audio-list">
            {AUDIO_TRACKS.map((track, index) => {
              const isThisPlaying = currentTrackIndex === index && isPlaying;
              const isThisLoading = currentTrackIndex === index && isLoading;

              return (
                <div key={track.id} className={`audio-card ${currentTrackIndex === index ? 'playing' : ''}`}>
                  <button 
                    className="audio-play-btn"
                    onClick={() => playTrack(index)}
                  >
                    {isThisLoading ? (
                      <span className="spinner-small"></span>
                    ) : isThisPlaying ? '⏸' : '▶'}
                  </button>
                  
                  <div className="audio-info">
                    <h4 className="audio-title">{track.title}</h4>
                    <span className="audio-type">{track.type}</span>
                  </div>

                  {isThisPlaying && !isThisLoading && (
                    <div className="audio-equalizer">
                      <span></span><span></span><span></span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Now Playing Mini-bar */}
          {currentTrack && (
            <div className="now-playing-bar fade-in-up">
              <div className="np-info">
                <span className="np-title">{currentTrack.title}</span>
                {isLoading && <span className="np-loading-text">Loading...</span>}
              </div>
              <div className="np-controls">
                <button className="np-btn" onClick={handlePrevious}>⏮</button>
                <button className="np-btn play-pause" onClick={() => playTrack(currentTrackIndex)}>
                  {isLoading ? <span className="spinner-small"></span> : isPlaying ? '⏸' : '▶'}
                </button>
                <button className="np-btn" onClick={handleNext}>⏭</button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default Breathing;