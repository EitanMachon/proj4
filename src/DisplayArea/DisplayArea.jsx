import React from 'react';
import './DisplayArea.css';

const DisplayArea = ({ documents = [], activeDocId, onSelect, onCloseDoc }) => {
  return (
    <div className="display-area-container">
      {documents.map((doc) => (
        <div 
          key={doc.id} 
          className={`document-card ${doc.id === activeDocId ? 'active-focus' : ''}`}
          onClick={() => onSelect(doc.id)}
        >
          <div className="doc-header">
            <span className="doc-id">📄 מסמך {doc.id.toString().slice(-4)}</span>
            <button className="close-btn" onClick={(e) => { e.stopPropagation(); onCloseDoc(doc.id); }}>&times;</button>
          </div>

          <div className="doc-body">
            {/* כאן קורה הקסם: כל אות מקבלת את הסטייל שלה */}
            {doc.content.map((item, index) => (
              <span 
                key={index} 
                style={{
                  color: item.style.color,
                  fontSize: item.style.fontSize,
                  fontFamily: item.style.fontFamily,
                  position: 'relative'
                }}
              >
                {/* הסמן הויזואלי */}
                {doc.id === activeDocId && doc.cursorIndex === index && <span className="text-cursor">|</span>}
                {item.char}
              </span>
            ))}
            {/* סמן בסוף הטקסט */}
            {doc.id === activeDocId && doc.cursorIndex === doc.content.length && <span className="text-cursor">|</span>}
          </div>
          
          {doc.id === activeDocId && <div className="focus-indicator">עריכה פעילה</div>}
        </div>
      ))}
    </div>
  );
};

export default DisplayArea;