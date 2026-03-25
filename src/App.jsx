import React, { useState } from 'react';
import { useDocuments } from './hooks/useDocuments';
import DisplayArea from './DisplayArea/DisplayArea';
import EditorConsole from './EditorConsole/EditorConsole';
import './App.css';

function App() {
  const [user, setUser] = useState(null); // מתחילים בלי משתמש (חלק ד')

  const {
    documents, activeDocId, setActiveDocId,
    addChar, deleteChar, deleteWord, clearDocument
  } = useDocuments(user);

  // אם אין משתמש מחובר - נציג מסך כניסה (דרישה מחלק ד')
  if (!user) {
    return (
      <div className="login-overlay">
        <div className="login-box">
          <h2>ברוכים הבאים ל-Visual Editor</h2>
          <p>אנא הזדהה כדי לגשת למסמכים שלך</p>
          <input id="userNameInput" type="text" placeholder="שם משתמש..." />
          <button onClick={() => {
            const name = document.getElementById('userNameInput').value;
            if (name) setUser({ username: name });
          }}>התחבר</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">
          <h1>Visual Text Editor</h1>
          <span className="version">v1.1 | SOLID Edition</span>
        </div>
        <div className="user-controls">
          <span>שלום, <strong>{user.username}</strong></span>
          <button className="logout-btn" onClick={() => setUser(null)}>התנתק</button>
        </div>
      </header>

      <main className="app-main">
        <DisplayArea 
          documents={documents} 
          activeDocId={activeDocId} 
          onSelect={setActiveDocId} 
        />
      </main>

      <footer className="app-footer">
        <EditorConsole 
          onAddChar={addChar}
          onDeleteChar={deleteChar}
          onDeleteWord={deleteWord}
          onClearAll={clearDocument}
        />
      </footer>
    </div>
  );
}

export default App;