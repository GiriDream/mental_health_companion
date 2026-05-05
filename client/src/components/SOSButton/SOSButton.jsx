import React, { useState } from 'react';
import './SOSButton.css';

const INTERNATIONAL_HOTLINES = [
  { country: "United States", name: "National Suicide Prevention Lifeline", number: "988" },
  { country: "United Kingdom", name: "Samaritans", number: "116 123" },
  { country: "Canada", name: "Crisis Services Canada", number: "1-833-456-4566" },
  { country: "Australia", name: "Lifeline", number: "13 11 14" },
  { country: "India", name: "AASRA", number: "+91-9820466726" },
  { country: "International", name: "Befrienders Worldwide", link: "https://www.befrienders.org/" }
];

function SOSButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button 
        className="sos-floating-btn"
        onClick={() => setIsOpen(true)}
        title="Emergency Help"
      >
        SOS
      </button>

      {/* SOS Modal */}
      {isOpen && (
        <div className="sos-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="sos-modal-content" onClick={(e) => e.stopPropagation()}>
            
            <button className="sos-close-btn" onClick={() => setIsOpen(false)}>✕</button>
            
            <div className="sos-modal-header">
              <h2>🚨 You Are Not Alone</h2>
              <p>If you are in immediate danger or feeling overwhelmed, please reach out for help.</p>
            </div>

            <div className="sos-grounding">
              <h3>Quick Grounding (5-4-3-2-1)</h3>
              <p>Breathe deeply and look around you to find:</p>
              <ul>
                <li><strong>5</strong> things you can see</li>
                <li><strong>4</strong> things you can touch</li>
                <li><strong>3</strong> things you can hear</li>
                <li><strong>2</strong> things you can smell</li>
                <li><strong>1</strong> thing you can taste</li>
              </ul>
            </div>

            <div className="sos-hotlines">
              <h3>International Crisis Resources</h3>
              <div className="hotlines-list">
                {INTERNATIONAL_HOTLINES.map((hotline, idx) => (
                  <div key={idx} className="hotline-card">
                    <span className="hotline-country">{hotline.country}</span>
                    <span className="hotline-name">{hotline.name}</span>
                    {hotline.number ? (
                      <a href={`tel:${hotline.number}`} className="hotline-number">📞 {hotline.number}</a>
                    ) : (
                      <a href={hotline.link} target="_blank" rel="noreferrer" className="hotline-number">🌐 Visit Site</a>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default SOSButton;
