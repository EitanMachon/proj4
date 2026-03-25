import React, { useState } from 'react';
import './Toolbar.css';

const Toolbar = ({ 
  onUndo, 
  onClearAll, 
  onNewDoc, 
  onUpdateStyle, 
  onSearchReplace,
  currentStyle 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');

  // רשימת גופנים וגדלים (דרישת חלק א')
  const fonts = ['Arial', 'Courier New', 'Georgia', 'Times New Roman', 'Verdana', 'Tahoma'];
  const sizes = ['12px', '14px', '16px', '18px', '24px', '32px'];
  const colors = ['#000000', '#ef4444', '#22c55e', '#2563eb', '#eab308', '#a855f7'];

  return (
    <div className="toolbar-wrapper">
      {/* שורה 1: ניהול מסמכים ופעולות בסיסיות */}
      <div className="toolbar-row">
        <button className="tool-btn primary-btn" onClick={onNewDoc}>
          📄 מסמך חדש
        </button>
        <button className="tool-btn undo-btn" onClick={onUndo} title="בטל פעולה אחרונה">
          ↩ Undo
        </button>
        <button className="tool-btn clear-btn" onClick={onClearAll}>
          🗑 נקה הכל
        </button>
        
        <div className="separator" />

        {/* בחירת גופן וגודל */}
        <select 
          className="tool-select" 
          onChange={(e) => onUpdateStyle({ fontFamily: e.target.value })}
          value={currentStyle?.fontFamily}
        >
          {fonts.map(f => <option key={f} value={f}>{f}</option>)}
        </select>

        <select 
          className="tool-select" 
          onChange={(e) => onUpdateStyle({ fontSize: e.target.value })}
          value={currentStyle?.fontSize}
        >
          {sizes.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* פלטת צבעים */}
        <div className="color-picker">
          {colors.map(c => (
            <div 
              key={c} 
              className={`color-swatch ${currentStyle?.color === c ? 'active' : ''}`}
              style={{ backgroundColor: c }}
              onClick={() => onUpdateStyle({ color: c })}
            />
          ))}
        </div>
      </div>

      {/* שורה 2: חיפוש והחלפה (דרישה מתקדמת חלק א') */}
      <div className="toolbar-row search-replace-row">
        <div className="search-group">
          <input 
            type="text" 
            placeholder="חפש תו..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            maxLength="1"
          />
          <input 
            type="text" 
            placeholder="החלף ב..." 
            value={replaceTerm}
            onChange={(e) => setReplaceTerm(e.target.value)}
            maxLength="1"
          />
          <button 
            className="tool-btn action-btn"
            onClick={() => onSearchReplace(searchTerm, replaceTerm)}
          >
            החלף תו
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;