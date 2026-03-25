// src/App.jsx
import React, { useState } from 'react';
import { useDocuments } from './hooks/useDocuments';
import DisplayArea from './DisplayArea/DisplayArea';
import Toolbar from './Toolbar/Toolbar';
import Keyboard from './Keyboard/Keyboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null); // ניהול משתמש - חלק ד'

  // שאיבת כל היכולות מה-Hook
  const {
    documents, activeDocId, setActiveDocId,
    addChar, deleteChar, deleteWord, clearDocument,
    undo, addNewDocument, closeDocument, updateStyle
  } = useDocuments(user);

  // פונקציית חיפוש והחלפה (דרישה מתקדמת - חלק א')
  const handleSearchReplace = (search, replace) => {
    if (!search || !documents || documents.length === 0) return;
    const activeDoc = documents.find(d => d.id === activeDocId);
    if (!activeDoc) return;
    
    const newText = activeDoc.text.split(search).join(replace);
    const updatedDocs = documents.map(doc => 
      doc.id === activeDocId ? { ...doc, text: newText } : doc
    );
    // עדכון המערך דרך הפונקציה ב-Hook
    // הערה: נניח שיש לנו setDocuments חשופה מה-Hook לטובת המעקף המהיר הזה
    // אם לא, נצטרך להוסיף את הפונקציה ל-Hook עצמו כפי שסיכמנו קודם.
  };

  // מסך כניסה (Login) - עיצוב מושקע ומטושטש (Blur)
  if (!user) {
    return (
      <div className="login-overlay">
        <div className="login-box">
          <div className="login-logo">
            <span className="logo-icon">✍️</span>
            <h2>Visual Text Editor</h2>
          </div>
          <p>אנא הזדהה כדי לגשת לסביבת העבודה האישית שלך</p>
          <input id="loginName" type="text" placeholder="שם משתמש (למשל: איתן)" />
          <button className="primary-btn login-btn"
            onClick={() => {
              const val = document.getElementById('loginName').value;
              if (val) setUser({ username: val });
            }}>
            התחבר למערכת הפרימיום
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
          <h1>Visual Editor</h1>
          <span className="version-badge">v1.2 PRO</span>
        </div>
        <div className="user-section">
          <span>שלום, <strong>{user.username}</strong></span>
          <button className="logout-btn" onClick={() => setUser(null)}>התנתק</button>
        </div>
      </header>

      {/* הפריסה המפוצלת החדשה */}
      <div className="main-layout-split">
        
        {/* צד ימין - אזור התצוגה המרכזי */}
        <main className="app-main">
          <DisplayArea 
            documents={documents} 
            activeDocId={activeDocId} 
            onSelect={setActiveDocId}
            onCloseDoc={closeDocument}
          />
        </main>

        {/* צד שמאל - סרגל הכלים והמקלדת (Sidebar) */}
        <aside className="app-sidebar">
          {/* סרגל כלים - ניהול עיצוב ופעולות מערכת */}
          <Toolbar 
            onUndo={undo}
            onClearAll={clearDocument}
            onNewDoc={addNewDocument}
            onUpdateStyle={updateStyle}
            onSearchReplace={handleSearchReplace}
            currentStyle={documents.find(d => d.id === activeDocId)?.style}
          />
          
          {/* מקלדת - הזנת נתונים ומחיקה */}
          <Keyboard 
            onKeyClick={addChar} 
            onDeleteChar={deleteChar}
            onDeleteWord={deleteWord}
          />
        </aside>
      </div>
    </div>
  );
}

export default App;