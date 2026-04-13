import React, { useState } from 'react';
// הסרנו את ה- { } מכל השורות האלו:
import useDocuments from './hooks/useDocuments'; 
import userService from './services/userService';
import DisplayArea from "./DisplayArea/DisplayArea";
import Toolbar from "./Toolbar/Toolbar";
import Keyboard from "./Keyboard/Keyboard";
import './App.css'; // או איך שקראת לקובץ ה-CSS הראשי שלך
/**
 * קומפוננטת העורך - נטענת רק כשיש משתמש מחובר.
 * ה-key שמועבר אליה מבטיח שהיא תתרנדר מחדש (Remount) בכל החלפת משתמש.
 */
const MainEditor = ({ user, setUser }) => {
  // השורה של כל המשתנים עברה לכאן - היא תרוץ רק כשיש user אמיתי
  const {
    documents, 
    activeDocId, 
    setActiveDocId, 
    currentStyle, 
    updateCurrentStyle,
    addChar, 
    deleteChar, 
    addNewDocument, 
    closeDocument, 
    undo, 
    searchReplace,
    clearDocument,    
    deleteWord,       
    applyStyleToAll   
  } = useDocuments(user);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('activeUser');
  };

  return (
    <div className="app-container">
      {/* כותרת האפליקציה ופרטי משתמש */}
      <header className="app-header">
        <div className="logo-section">
          <h1>Visual Editor</h1>
          <span className="version-badge">v2.0</span>
        </div>
        <div className="user-section">
          <span>שלום, <strong>{user.username}</strong></span>
          <button className="logout-btn" onClick={handleLogout}>התנתק</button>
        </div>
      </header>

      {/* פריסה מרכזית (Layout) */}
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
              onUndo={undo} 
              onClearAll={clearDocument} 
              onNewDoc={addNewDocument}
              onUpdateStyle={updateCurrentStyle}
              onSearchReplace={searchReplace} 
              onDeleteWord={deleteWord}        
              onApplyStyleToAll={applyStyleToAll}
              currentStyle={currentStyle}
            />
          <Keyboard 
            onKeyClick={addChar} 
            onDeleteChar={deleteChar} 
            onDeleteWord={deleteWord} 
          />
        </aside>
      </div>
    </div>
  );
};

/**
 * הקומפוננטה הראשית - מנהלת את הכניסה למערכת
 */
function App() {
  const [user, setUser] = useState(null); 
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

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
        localStorage.setItem('activeUser', JSON.stringify(res.user));
        setError('');
      } else {
        setError(res.msg);
      }
    }
  };

  // רינדור מותנה: אם אין משתמש - הצג מסך לוגין
  if (!user) {
    return (
      <div className="login-overlay">
        <form className="login-box" onSubmit={handleAuth}>
          <div className="login-logo">
            <span className="logo-icon">✍️</span>
            <h2>Visual Editor Pro</h2>
          </div>
          
          <h3>{isRegistering ? 'יצירת משתמש חדש' : 'כניסת משתמש רשום'}</h3>
          
          {error && <div className="auth-error">{error}</div>}
          
          <input name="username" type="text" placeholder="שם משתמש" required />
          <input name="password" type="password" placeholder="סיסמה" required />
          
          <button type="submit" className="primary-btn login-btn">
            {isRegistering ? 'הירשם עכשיו' : 'התחבר למערכת'}
          </button>
          
          <p className="auth-toggle" onClick={() => {
            setIsRegistering(!isRegistering);
            setError(''); 
          }}>
            {isRegistering ? 'כבר יש לך חשבון? התחבר' : 'אין לך חשבון? הירשם כאן'}
          </p>
        </form>
      </div>
    );
  }

  // אם יש משתמש - הצג את העורך. 
  // ה-key=user.username מבטיח טעינה מחדש נקייה של ה-Hook והנתונים.
  return <MainEditor key={user.username} user={user} setUser={setUser} />;
}

export default App;
// השורה הזו אומרת לעולם: "זה הדבר המרכזי שהקובץ הזה נותן"
