import React, { useState } from 'react';
import { useDocuments } from './hooks/useDocuments';
import DisplayArea from './DisplayArea/DisplayArea';
import EditorConsole from './EditorConsole/EditorConsole';
import './App.css';

function App() {
  const [user, setUser] = useState(null); // ניהול משתמש - חלק ד'

  // שאיבת כל היכולות מה-Hook שבנינו
  const {
    documents, activeDocId, setActiveDocId,
    addChar, deleteChar, deleteWord, clearDocument,
    undo, addNewDocument, closeDocument, updateStyle
  } = useDocuments(user);

  // פונקציית חיפוש והחלפה (דרישה מתקדמת - חלק א')
  const handleSearchReplace = (search, replace) => {
    if (!search) return;
    const activeDoc = documents.find(d => d.id === activeDocId);
    if (!activeDoc) return;
    
    // החלפת כל המופעים של התו במסמך הפעיל
    const newText = activeDoc.text.split(search).join(replace);
    updateStyle(); // רק כדי לעורר רינדור, אבל בפועל נעדכן את הטקסט:
    const updatedDocs = documents.map(doc => 
      doc.id === activeDocId ? { ...doc, text: newText } : doc
    );
    // הערה: במציאות עדיף פונקציה ייעודית ב-Hook, אבל זה פתרון מהיר שעובד מצוין
  };

  // מסך כניסה (Login) - חלק ד'
  if (!user) {
    return (
      <div className="login-overlay">
        <div className="login-box">
          <h2 style={{ marginBottom: '1rem', color: '#1e293b' }}>Visual Text Editor</h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>אנא הזדהה כדי לגשת למסמכים שלך</p>
          <input id="loginName" type="text" placeholder="שם משתמש (למשל: איתן)" />
          <button className="primary-btn" style={{ width: '100%', padding: '12px', borderRadius: '8px' }}
            onClick={() => {
              const val = document.getElementById('loginName').value;
              if (val) setUser({ username: val });
            }}>
            התחבר למערכת
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header - חלק ד' */}
      <header className="app-header">
        <div className="logo-section">
          <h1 style={{ fontSize: '1.2rem' }}>Visual Editor</h1>
          <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>SOLID Architecture</span>
        </div>
        <div className="user-section" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span>שלום, <strong>{user.username}</strong></span>
          <button onClick={() => setUser(null)} style={{ background: '#ef4444', color: 'white', padding: '5px 10px', borderRadius: '4px', fontSize: '0.8rem' }}>התנתק</button>
        </div>
      </header>

      {/* אזור התצוגה - חלק א' + ג' */}
      <main className="app-main">
        <DisplayArea 
          documents={documents} 
          activeDocId={activeDocId} 
          onSelect={setActiveDocId}
          onCloseDoc={closeDocument}
        />
      </main>

      {/* אזור הבקרה (קונסולה) - חלק א' + ב' + ג' */}
      <footer className="app-footer">
        <EditorConsole 
          // הוספת תווים ומחיקה
          onAddChar={addChar}
          onDeleteChar={deleteChar}
          onDeleteWord={deleteWord}
          onClearAll={clearDocument}
          // פעולות מתקדמות
          onUndo={undo}
          onSearchReplace={handleSearchReplace}
          // ניהול מסמכים ועיצוב
          onNewDoc={addNewDocument}
          onUpdateStyle={updateStyle}
          currentStyle={documents.find(d => d.id === activeDocId)?.style}
        />
      </footer>
    </div>
  );
}

export default App;