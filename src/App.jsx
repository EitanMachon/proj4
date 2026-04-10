import React, { useState } from 'react';
import { useDocuments } from './hooks/useDocuments';
import { userService } from './services/userService';
import DisplayArea from './DisplayArea/DisplayArea';
import Toolbar from './Toolbar/Toolbar';
import Keyboard from './Keyboard/Keyboard';
import './App.css';

/**
 * הקומפוננטה הראשית של האפליקציה - App.
 * אחראית על ניהול המצב הגלובלי (משתמש מחובר) וחיבור בין חלקי המערכת.
 */
function App() {
  // --- ניהול מצב (States) ---
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('activeUser');
    return savedUser ? JSON.parse(savedUser) : null;
}); // המשתמש המחובר כרגע (null אם איש לא מחובר)
  const [isRegistering, setIsRegistering] = useState(false); // האם המשתמש נמצא במצב "הרשמה" או "התחברות"
  const [error, setError] = useState(''); // הודעות שגיאה עבור תהליך האימות

  /**
   * שימוש ב-Custom Hook לניהול כל הלוגיקה של המסמכים.
   * ה-Hook מקבל את ה-user הנוכחי כדי לדעת איזה מידע לטעון מה-Storage.
   */
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

  /**
   * handleAuth: פונקציה לטיפול באירוע שליחת טופס (התחברות או הרשמה).
   * @param {Event} e - אירוע ה-Submit של הטופס.
   */
  const handleAuth = (e) => {
    e.preventDefault(); // מניעת רענון הדף האוטומטי של הטופס
    const username = e.target.username.value;
    const password = e.target.password.value;

    if (isRegistering) {
      // תהליך הרשמה: פנייה לשירות המשתמשים
      const res = userService.register(username, password);
      if (res.success) {
        setIsRegistering(false); // העברה למסך התחברות לאחר הרשמה מוצלחת
        setError('נרשמת בהצלחה! כעת התחבר');
      } else {
        setError(res.msg);
      }
    } else {
      // תהליך התחברות: אימות פרטים
      const res = userService.login(username, password);
      if (res.success) {
        setUser(res.user); // עדכון ה-State של המשתמש והכניסה לאפליקציה
       localStorage.setItem('activeUser', JSON.stringify(res.user));
        setError('');
      } else {
        setError(res.msg);
      }
    }
  };

  /**
   * רינדור מותנה (Conditional Rendering):
   * אם אין משתמש מחובר (user === null), יוצג מסך הלוגין/הרשמה בלבד.
   */
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
   * המבנה הראשי של העורך (לאחר התחברות מוצלחת).
   * האפליקציה מחולקת ל-Header, אזור תצוגה מרכזי (DisplayArea),
   * וסרגל צד המכיל את ה-Toolbar וה-Keyboard.
   */
  return (
    <div className="app-container" key={user.username}>
      {/* כותרת האפליקציה ופרטי משתמש */}
      <header className="app-header">
        <div className="logo-section"><h1>Visual Editor</h1><span className="version-badge">v2.0</span></div>
        <div className="user-section">
          <span>שלום, <strong>{user.username}</strong></span>
          <button className="logout-btn" onClick={() => setUser(null)}>התנתק</button>
        </div>
      </header>

      {/* פריסה מרכזית (Layout) */}
      <div className="main-layout-split">
        <main className="app-main">
          {/* אזור הצגת המסמכים והכרטיסיות */}
          <DisplayArea 
            documents={documents} 
            activeDocId={activeDocId} 
            onSelect={setActiveDocId}
            onCloseDoc={closeDocument}
          />
        </main>
        
        <aside className="app-sidebar">
            {/* סרגל כלים: מקבל פונקציות לעדכון סטייל ופעולות מתקדמות */}
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
          {/* מקלדת וירטואלית: מפעילה את פונקציות הוספת/מחיקת תו */}
          <Keyboard 
                onKeyClick={addChar} 
                onDeleteChar={deleteChar} 
                onDeleteWord={deleteWord} // <--- תוסיף את זה!
              />
        </aside>
      </div>
    </div>
  );
}

export default App;