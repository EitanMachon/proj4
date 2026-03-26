import React, { useState } from 'react';
import { useDocuments } from './hooks/useDocuments';
import { userService } from './services/userService';
import DisplayArea from './DisplayArea/DisplayArea';
import Toolbar from './Toolbar/Toolbar';
import Keyboard from './Keyboard/Keyboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false); // מצב הרשמה
  const [error, setError] = useState('');

  const {
    documents, activeDocId, setActiveDocId, currentStyle, updateCurrentStyle,
    addChar, deleteChar, addNewDocument, closeDocument
  } = useDocuments(user);

  // לוגיקת התחברות/הרשמה
  const handleAuth = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    if (isRegistering) {
      const res = userService.register(username, password);
      if (res.success) {
        setIsRegistering(false);
        setError('נרשמת בהצלחה! כעת התחבר');
      } else {
        setError(res.msg);
      }
    } else {
      const res = userService.login(username, password);
      if (res.success) {
        setUser(res.user);
        setError('');
      } else {
        setError(res.msg);
      }
    }
  };

  if (!user) {
    return (
      <div className="login-overlay">
        <form className="login-box" onSubmit={handleAuth}>
          <div className="login-logo">✍️ <h2>Visual Editor Pro</h2></div>
          <h3>{isRegistering ? 'יצירת משתמש חדש' : 'כניסת משתמש רשום'}</h3>
          {error && <p className="auth-error">{error}</p>}
          <input name="username" type="text" placeholder="שם משתמש" required />
          <input name="password" type="password" placeholder="סיסמה" required />
          <button type="submit" className="primary-btn login-btn">
            {isRegistering ? 'הירשם עכשיו' : 'התחבר למערכת'}
          </button>
          <p className="auth-toggle" onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'כבר יש לך חשבון? התחבר' : 'אין לך חשבון? הירשם כאן'}
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-section"><h1>Visual Editor</h1><span className="version-badge">v2.0</span></div>
        <div className="user-section">
          <span>שלום, <strong>{user.username}</strong></span>
          <button className="logout-btn" onClick={() => setUser(null)}>התנתק</button>
        </div>
      </header>

      <div className="main-layout-split">
        <main className="app-main">
          <DisplayArea 
            documents={documents} 
            activeDocId={activeDocId} 
            onSelect={setActiveDocId}
            onCloseDoc={closeDocument}
          />
        </main>
        <aside className="app-sidebar">
          <Toolbar 
            onUndo={() => {}} // נחבר בהמשך
            onClearAll={() => {}} 
            onNewDoc={addNewDocument}
            onUpdateStyle={updateCurrentStyle} // עדכון הסטייל מכאן והלאה
            onSearchReplace={() => {}}
            currentStyle={currentStyle}
          />
          <Keyboard onKeyClick={addChar} onDeleteChar={deleteChar} />
        </aside>
      </div>
    </div>
  );
}

export default App;