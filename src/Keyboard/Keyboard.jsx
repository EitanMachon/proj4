// src/components/Keyboard/Keyboard.jsx
import { useState } from 'react';
import { layouts } from '../../data/keyboardLayouts';
import Button from '../common/Button';
import './Keyboard.css';
import KeyButton from './KeyButton'; // שימוש בגרסה הספציפית של הכפתור

const Keyboard = ({ onKeyClick }) => {
  // State מקומי: איזו מקלדת מוצגת עכשיו (he/en/emoji)
  const [lang, setLang] = useState('he');

  return (
    <div className="keyboard-container">
      {/* שורת החלפת שפות */}
      <div className="lang-switcher">
        <Button label="עברית" onClick={() => setLang('he')} className={lang === 'he' ? 'active' : ''} />
        <Button label="English" onClick={() => setLang('en')} className={lang === 'en' ? 'active' : ''} />
        <Button label="😊" onClick={() => setLang('emoji')} className={lang === 'emoji' ? 'active' : ''} />
      </div>

      {/* רינדור שורות המקלדת */}
      <div className="keys-grid">
        {layouts[lang].map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((key) => (
              <Button 
                key={key} 
                label={key} 
                onClick={() => onKeyClick(key)} 
                className="key" 
              />
            ))}
          </div>
        ))}
      </div>
      
      {/* שורת מקשים מיוחדים (רווח) */}
      <div className="special-keys">
        <Button label="Space" onClick={() => onKeyClick(' ')} className="key space-bar" />
      </div>
    </div>
  );
};

export default Keyboard;