import React from 'react';
import './DisplayArea.css';

// קומפוננטת אזור התצוגה - מקבלת את רשימת המסמכים, איזה מהם פעיל, ופונקציות לניהול שלהם
const DisplayArea = ({ documents = [], activeDocId, onSelect, onCloseDoc }) => {
  return (
    <div className="display-area-container">
      {/* עוברים על כל המסמכים הפתוחים ומרנדרים כל אחד ככרטיסייה */}
      {documents.map((doc) => (
        <div 
          key={doc.id} 
          // הוספת מחלקה דינמית: אם זה המסמך הפעיל, הוסף 'active-focus' להדגשה חזותית
          className={`document-card ${doc.id === activeDocId ? 'active-focus' : ''}`}
          // לחיצה על המסמך הופכת אותו לפעיל
          onClick={() => onSelect(doc.id)}
        >
          {/* אזור הכותרת של המסמך */}
          <div className="doc-header">
            {/* מציג את מספר המסמך על ידי לקיחת 4 התווים האחרונים של ה-ID */}
            <span className="doc-id">📄 מסמך {doc.id.toString().slice(-4)}</span>
            
            {/* כפתור סגירה. עצירת הבועה (stopPropagation) מונעת מצב שבו לחיצה על X 
                תפעיל גם את בחירת המסמך (onClick של העוטף) */}
            <button className="close-btn" onClick={(e) => { e.stopPropagation(); onCloseDoc(doc.id); }}>&times;</button>
          </div>

          {/* גוף המסמך - כאן מוצג הטקסט */}
          <div className="doc-body">
            {/* כאן קורה הקסם: הלולאה עוברת על כל אות ותו בנפרד (מערך אובייקטים) */}
            {doc.content.map((item, index) => (
              <span 
                key={index} 
                // כל אות מקבלת את העיצוב האישי שלה (צבע, גודל, פונט) שהוגדר לה
                style={{
                  color: item.style.color,
                  fontSize: item.style.fontSize,
                  fontFamily: item.style.fontFamily,
                  position: 'relative' // חשוב למיקום נכון של הסמן ליד האות
                }}
              >
                {/* הסמן הויזואלי (המהבהב) 
                    מצייר את הסמן לפני האות הנוכחית, רק אם זה המסמך הפעיל ורק במיקום המדויק */}
                {doc.id === activeDocId && doc.cursorIndex === index && <span className="text-cursor">|</span>}
                
                {/* הדפסת התו/האות עצמה */}
                {item.char}
              </span>
            ))}
            
            {/* סמן בסוף הטקסט: מיועד למקרה שהמשתמש נמצא ממש בקצה המסמך, 
                מחוץ לגבולות האותיות הקיימות (אחרי האות האחרונה) */}
            {doc.id === activeDocId && doc.cursorIndex === doc.content.length && <span className="text-cursor">|</span>}
          </div>
          
          {/* אינדיקטור חזותי נוסף למסמך הפעיל (למשל תווית "עריכה פעילה" בפינה) */}
          {doc.id === activeDocId && <div className="focus-indicator">עריכה פעילה</div>}
        </div>
      ))}
    </div>
  );
};

export default DisplayArea;