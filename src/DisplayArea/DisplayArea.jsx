import React from 'react';
import './DisplayArea.css';

const DisplayArea = ({ documents = [], activeDocId, onSelect, onCloseDoc }) => {
  // הגנה: אם documents הוא לא מערך, נציג הודעת טעינה
  if (!Array.isArray(documents)) {
    return <div className="loading-state">טוען מסמכים...</div>;
  }

  return (
    <div className="display-area-container">
      {documents.length === 0 ? (
        <div className="empty-state">אין מסמכים פתוחים. לחץ על "מסמך חדש" כדי להתחיל.</div>
      ) : (
        documents.map((doc) => (
          <div 
            key={doc.id} 
            className={`document-card ${doc.id === activeDocId ? 'active-focus' : ''}`}
            onClick={() => onSelect(doc.id)}
            style={{
              color: doc.style?.color || '#000',
              fontSize: doc.style?.fontSize || '16px',
              fontFamily: doc.style?.fontFamily || 'Arial',
            }}
          >
            {/* כותרת המסמך עם כפתור סגירה - דרישת חלק ג' */}
            <div className="doc-header">
              <span className="doc-id">📄 מסמך {doc.id.toString().slice(-4)}</span>
              <button 
                className="close-btn" 
                onClick={(e) => {
                  e.stopPropagation(); // מונע מהמסמך להיבחר כשסוגרים אותו
                  onCloseDoc(doc.id);
                }}
                title="סגור מסמך"
              >
                &times;
              </button>
            </div>

            {/* תוכן הטקסט */}
            <div className="doc-body">
              {doc.text}
              {doc.id === activeDocId && <span className="text-cursor">|</span>}
            </div>

            {/* חיווי פוקוס - דרישת חלק ג' */}
            {doc.id === activeDocId && (
              <div className="focus-indicator">עריכה פעילה</div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default DisplayArea;