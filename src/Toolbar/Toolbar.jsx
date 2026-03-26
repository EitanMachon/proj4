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

  const fonts = ['Arial', 'Courier New', 'Georgia', 'Times New Roman', 'Verdana', 'Tahoma'];
  const sizes = ['12px', '14px', '16px', '18px', '24px', '32px', '48px'];
  const colors = ['#0f172a', '#ef4444', '#22c55e', '#2563eb', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="toolbar-container">
      {/* קבוצה 1: ניהול מסמכים ופעולות על המערכת */}
      <section className="tool-section">
        <h3 className="section-label">ניהול קבצים ופעולות</h3>
        <div className="tool-grid-2">
          <button className="tool-btn primary-btn action-main" onClick={onNewDoc}>
            <span>➕</span> מסמך חדש
          </button>
          <button className="tool-btn secondary-btn" onClick={onUndo} title="בטל פעולה אחרונה">
            <span>↩️</span> Undo
          </button>
          <button className="tool-btn danger-btn" onClick={onClearAll}>
            <span>🗑️</span> נקה דף
          </button>
        </div>
      </section>

      {/* קבוצה 2: עיצוב טקסט (Typography) */}
      <section className="tool-section">
        <h3 className="section-label">עיצוב וטיפוגרפיה</h3>
        <div className="styling-controls">
          <div className="select-group">
            <label>גופן:</label>
            <select 
              className="premium-select" 
              onChange={(e) => onUpdateStyle({ fontFamily: e.target.value })}
              value={currentStyle?.fontFamily || 'Arial'}
            >
              {fonts.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <div className="select-group">
            <label>גודל:</label>
            <select 
              className="premium-select" 
              onChange={(e) => onUpdateStyle({ fontSize: e.target.value })}
              value={currentStyle?.fontSize || '16px'}
            >
              {sizes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="color-palette">
          <label className="color-label">צבע טקסט:</label>
          <div className="swatch-list">
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
      </section>

      {/* קבוצה 3: חיפוש והחלפה (Search & Replace) */}
      <section className="tool-section search-replace-box">
        <h3 className="section-label">חיפוש והחלפת תווים</h3>
        <div className="search-inputs">
          <input 
            type="text" 
            placeholder="חפש תו..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            maxLength="1"
          />
          <span className="arrow-icon">⬅️</span>
          <input 
            type="text" 
            placeholder="החלף ב..." 
            value={replaceTerm}
            onChange={(e) => setReplaceTerm(e.target.value)}
            maxLength="1"
          />
        </div>
        <button 
          className="tool-btn apply-btn"
          onClick={() => {
            onSearchReplace(searchTerm, replaceTerm);
            setSearchTerm(''); setReplaceTerm('');
          }}
        >
          בצע החלפה גלובלית
        </button>
      </section>
    </div>
  );
};

export default Toolbar;