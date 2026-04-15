import React, { useState } from 'react';
import './Toolbar.css';

/**
 * קומפוננטת ה-Toolbar (סרגל הכלים).
 * משמשת כמרכז הבקרה הוויזואלי של האפליקציה.
 * הקומפוננטה מקבלת פונקציות (Callbacks) מה-App ומפעילה אותן לפי דרישת המשתמש.
 */
const Toolbar = ({ 
  onUndo,              // פונקציה לביטול פעולה אחרונה
  onClearAll,          // פונקציה לניקוי כל הטקסט במסמך
  onNewDoc,            // פונקציה ליצירת מסמך חדש
  onUpdateStyle,       // פונקציה לעדכון הסטייל הנוכחי (לכתיבה מכאן והלאה)
  onSearchReplace,     // פונקציה לחיפוש והחלפה גלובלית של תווים
  onApplyStyleToAll,   // פונקציה להחלת הסטייל הנוכחי על כל הטקסט הקיים
  onDeleteWord,        // פונקציה למחיקת המילה האחרונה
  currentStyle         // אובייקט הסטייל הפעיל כרגע (צבע, גופן, גודל)
}) => {
  // State מקומי לניהול שדות הקלט של החיפוש וההחלפה
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');

  // רשימות קבועות של אפשרויות עיצוב
  const fonts = ['Arial', 'Courier New', 'Georgia', 'Times New Roman', 'Verdana', 'Tahoma'];
  const sizes = ['12px', '14px', '16px', '18px', '24px', '32px', '48px'];
  const colors = ['#0f172a', '#ef4444', '#22c55e', '#2563eb', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="toolbar-container">
      
      {/* קבוצה 1: ניהול מסמכים ופעולות עריכה בסיסיות */}
      <section className="tool-section">
        <h3 className="section-label">ניהול קבצים ופעולות</h3>
        <div className="tool-grid-2">
          <button className="tool-btn primary-btn action-main" onClick={onNewDoc}>
            <span>➕</span> מסמך חדש
          </button>
          <button className="tool-btn secondary-btn" onClick={onUndo} title="בטל פעולה אחרונה">
            <span>↩️</span> Undo
          </button>
          <button className="tool-btn" onClick={() => alert('המסמך נשמר בהצלחה!')}> 
            שמור 
          </button>
          <button className="tool-btn danger-btn" onClick={onClearAll}>
            <span>🗑️</span> נקה דף
          </button>
        </div>
      </section>

      {/* קבוצה 2: עיצוב טקסט (Typography) - שינוי גופן, גודל וצבע */}
      <section className="tool-section">
        <h3 className="section-label">עיצוב וטיפוגרפיה</h3>
        <div className="styling-controls">
          {/* בחירת גופן */}
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

          {/* בחירת גודל גופן */}
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

        {/* פלטת צבעים וכפתור עדכון גלובלי */}
        <div className="color-palette">
          <label className="color-label">צבע טקסט:</label>
          <div className="swatch-list">
            {/* כפתור קסם: מעדכן את כל הטקסט שכבר נכתב לסטייל הנבחר */}
            <button className="tool-btn secondary-btn" style={{marginTop: '10px', width: '100%'}} onClick={onApplyStyleToAll}>
              🪄 החל עיצוב על כל הטקסט
            </button>
            {/* יצירת כפתורי הצבעים בצורה דינמית מהמערך */}
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
            maxLength="1" // הגבלה לתו בודד כפי שנדרש
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
            // איפוס שדות הקלט לאחר הביצוע
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