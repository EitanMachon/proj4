import React from 'react';
import { layouts } from "../data/keyboardLayouts";
import './Keyboard.css';

const Keyboard = ({ onKeyClick, onDeleteChar, onDeleteWord }) => {
  // כרגע נשתמש בפריסה הראשונה (עברית/אנגלית - נטפל בהחלפה בהמשך)
  const currentLayout = layouts[0].keys;

  return (
    <div className="keyboard-container">
      <div className="keyboard-row">
        {currentLayout.map((key) => (
          <button 
            key={key} 
            className="key-btn" 
            onClick={() => onKeyClick(key)}
          >
            {key}
          </button>
        ))}
        
        {/* כפתורי מחיקה מיוחדים - דרישה מחלק א' */}
        <button className="key-btn delete-btn" onClick={onDeleteChar}>
          ⌫ Back
        </button>
        <button className="key-btn delete-word-btn" onClick={onDeleteWord}>
          Del Word
        </button>
      </div>
    </div>
  );
};

export default Keyboard;