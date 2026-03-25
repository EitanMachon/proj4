// src/App.jsx
// src/App.jsx

// 1. ה-Hooks וה-Services נמצאים במקום הנכון
import { useDocuments } from './hooks/useDocuments';
import { authService } from './services/authService';

// 2. התיקון הקריטי: מחקנו את ה- "/components"
import DisplayArea from "./DisplayArea/DisplayArea";
import EditorConsole from "./EditorConsole/EditorConsole";

// 3. ה-CSS נמצא באותה תיקייה
import "./App.css";

function App() {
  // 1. חילוץ כל הלוגיקה מה"מנוע" (Hook)
  const { 
    documents, 
    activeDoc, 
    activeDocId, 
    setActiveDocId, 
    addChar, 
    updateActiveStyle, 
    addDocument 
  } = useDocuments();

  // 2. זיהוי המשתמש (חלק ד')
  const currentUser = authService.getCurrentUser() || "אורח";

  // 3. פונקציית עזר לשמירה
  const handleSave = () => {
    // השמירה ל-LocalStorage קורית אוטומטית בתוך ה-Hook בכל שינוי,
    // כאן אנחנו רק נותנים אישור ויזואלי למשתמש.
    alert(`המסמכים של ${currentUser} נשמרו בהצלחה!`);
  };

  return (
    <div className="app-container">
      {/* כותרת עליונה - Branding & User */}
      <header className="app-header">
        <div className="logo">
          <h1>Visual Text Editor</h1>
          <span className="version">v1.0 | SOLID Edition</span>
        </div>
        <div className="user-badge">
          שלום, <strong>{currentUser}</strong>
        </div>
      </header>

      {/* אזור התצוגה המרכזי - הצגת 10 מסמכים (חלק ג') */}
      <main className="app-main">
        <DisplayArea 
          docs={documents} 
          activeDocId={activeDocId} 
          onSelectDoc={setActiveDocId} 
        />
      </main>

      {/* קונסולת העריכה התחתונה - מאחדת Toolbar ו-Keyboard */}
      <footer className="app-footer">
        <EditorConsole 
          activeDoc={activeDoc} 
          onUpdateStyle={updateActiveStyle} 
          onAddDoc={addDocument}
          onSave={handleSave}
          onKeyClick={addChar}
        />
      </footer>
    </div>
  );
}

export default App;