// src/components/DisplayArea/DisplayArea.jsx
import './DisplayArea.css';

const DisplayArea = ({ docs, activeDocId, onSelectDoc }) => {
  return (
    <div className="display-area-container">
      {docs.map((doc) => (
        <div 
          key={doc.id} 
          className={`document-window ${doc.id === activeDocId ? 'active' : ''}`}
          onClick={() => onSelectDoc(doc.id)}
          style={{
            color: doc.style.color,
            fontSize: doc.style.fontSize,
            fontFamily: doc.style.fontFamily,
            textAlign: doc.style.textAlign
          }}
        >
          <div className="doc-header">
            <span>{doc.title}</span>
            {doc.id === activeDocId && <span className="focus-indicator">● בפוקוס</span>}
          </div>
          <div className="doc-content">
            {doc.content || <span className="placeholder">התחל להקליד...</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DisplayArea;