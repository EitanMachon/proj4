import { layouts } from "../data/keyboardLayouts";
import React, { useState } from 'react';
import './Keyboard.css';

const Keyboard = ({ onKeyClick, onDeleteChar, onDeleteWord }) => {
  const [layoutIndex, setLayoutIndex] = useState(0); // 0=עברית, 1=אנגלית, 2=אימוג'י

  // הגנה: אם layouts לא נטען, נציג הודעה
  if (!layouts || !layouts[layoutIndex]) {
    return <div className="keyboard-error">טוען פריסת מקשים...</div>;
  }

  const currentLayout = layouts[layoutIndex];

  return (
    <div className="keyboard-wrapper">
      {/* סרגל החלפת שפות - דרישה מחלק א' */}
      <div className="language-bar">
        {layouts.map((l, index) => (
          <button 
            key={l.name} 
            className={`lang-switch-btn ${index === layoutIndex ? 'active-lang' : ''}`}
            onClick={() => setLayoutIndex(index)}
          >
            {l.name === 'Hebrew' ? 'עברית' : l.name === 'English' ? 'English' : 'Emojis 😃'}
          </button>
        ))}
      </div>

      {/* רשת המקשים */}
      <div className="keys-grid">
        {currentLayout.keys.map((key, idx) => (
          <button 
            key={`${key}-${idx}`} 
            className="key-tile" 
            onClick={() => onKeyClick(key)}
          >
            {key}
          </button>
        ))}
        
        {/* מקשים מיוחדים - דרישה מחלק א' */}
        <button className="key-tile special-key backspace" onClick={onDeleteChar} title="מחיקת תו">
          ⌫ Back
        </button>
        
        <button className="key-tile special-key delete-word" onClick={onDeleteWord} title="מחיקת מילה">
          Delete Word 🗑
        </button>

        <button className="key-tile special-key space-bar" onClick={() => onKeyClick(' ')}>
          Space
        </button>
      </div>
    </div>
  );
};

export default Keyboard;