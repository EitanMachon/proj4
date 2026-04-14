import React, { useState } from 'react';
// ייבוא הלוגיקה והשירותים של האפליקציה
import useDocuments from './hooks/useDocuments'; 
import userService from './services/userService';
import DisplayArea from "./DisplayArea/DisplayArea";
import Toolbar from "./Toolbar/Toolbar";
import Keyboard from "./Keyboard/Keyboard";
import './App.css'; 

/**
 * קומפוננטת MainEditor:
 * מרכזת את כל ממשק העריכה. היא נפרדת מ-App כדי לאפשר 
 * טעינה מחדש נקייה (Remount) של כל הלוגיקה ברגע שמשתמש מתחבר.
 */
const MainEditor = ({ user, setUser }) => {
  
  
  // חשיפת כל הפונקציות והנתונים מתוך ה-Custom Hook
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

  // פונקציית התנתקות: מאפסת את המשתמש ב-State ומוחקת אותו מהזיכרון המקומי
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('activeUser');
  };

  return (
    
    <div className="app-container">
      {/* סרגל עליון: לוגו ופרטי המשתמש המחובר */}
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

      {/* מבנה העמוד: מחולק לאזור תצוגה ראשי וסרגל צד לשליטה ומקלדת */}
      <div className="main-layout-split">
        <main className="app-main">
          {/* אזור הצגת המסמכים (הדפים) */}
          <DisplayArea 
            documents={documents} 
            activeDocId={activeDocId} 
            onSelect={setActiveDocId}
            onCloseDoc={closeDocument}
          />
        </main>
        
        <aside className="app-sidebar">
            {/* סרגל כלים: כפתורי פעולה (Undo, צבעים, חיפוש) */}
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
          {/* המקלדת הווירטואלית להקלדה ומחיקה */}
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
 * קומפוננטת App:
 * הקומפוננטה הראשית (Root) שמנהלת את הכניסה למערכת.
 * מחליטה האם להציג את מסך הלוגין או את העורך.
 */
function App() {
  // ניהול המשתמש, מצב הרשמה והודעות שגיאה
  const [user, setUser] = useState(null); 
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  /**
   * handleAuth: מטפלת בשליחת טופס ההתחברות או ההרשמה.
   * פונה ל-userService ומעדכנת את המצב בהתאם לתשובה.
   */
  const handleAuth = (e) => {
    e.preventDefault(); // מניעת רענון הדף ב-Submit
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
        // שמירת המשתמש בדפדפן כדי לזכור אותו ברענן (Persistence)
        localStorage.setItem('activeUser', JSON.stringify(res.user));
        setError('');
      } else {
        setError(res.msg);
      }
    }
  };

  // רינדור מותנה: אם המשתנה user ריק, מציגים את מסך הכניסה
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

  /**
   * אם המשתמש מחובר, מציגים את המערכת.
   * שימוש ב-key={user.username} מבטיח שכל המערכת תתאפס ותיבנה מחדש
   * עם הנתונים של המשתמש הספציפי שנכנס.
   */
  return <MainEditor key={user.username} user={user} setUser={setUser} />;
}

export default App;