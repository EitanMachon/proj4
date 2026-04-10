import { useState} from 'react';
import { storageService } from '../services/storageService';

export const useDocuments = (user) => {
  // --- 1. הגדרת מצבים (States) עם טעינה מיידית ---

  // טעינת המסמכים: בודק אם יש משהו ב-Storage, אם לא - יוצר מסמך ראשון
  const [documents, setDocuments] = useState(() => {
    if (!user) return [];
    const saved = storageService.getDocuments(user.username);
    return saved.length > 0 ? saved : [{ id: Date.now(), content: [], cursorIndex: 0, owner: user.username }];
  });

  // טעינת המזהה הפעיל: מוציא את ה-activeDocId האחרון שהיה בשימוש
  const [activeDocId, setActiveDocId] = useState(() => {
    if (!user) return null;
    const lastState = storageService.getUserState(user.username);
    return lastState?.activeDocId || (documents.length > 0 ? documents[0].id : null);
  });

  // טעינת הסטייל: מוציא את העיצוב האחרון (צבע/פונט) שהמשתמש בחר
  const [currentStyle, setCurrentStyle] = useState(() => {
    const defaultStyle = { color: '#000000', fontSize: '16px', fontFamily: 'Arial' };
    if (!user) return defaultStyle;
    const lastState = storageService.getUserState(user.username);
    return lastState?.currentStyle || defaultStyle;
  });

  // היסטוריה תמיד מתחילה ריקה (היא נשמרת רק לסשן הנוכחי ב-RAM)
  const [history, setHistory] = useState([]);
  // --- 2. טעינה וסנכרון (Effects) ---


  // --- 3. לוגיקת עריכה (Functions) ---

  // עזר: שמירת מצב להיסטוריה לפני שינוי
  const saveToHistory = () => {
    setHistory(prev => [...prev, JSON.stringify(documents)].slice(-10));
  };


  // פונקציה ריכוזית שמעדכנת גם את המסך וגם את הזיכרון הפיזי
const updateAndSaveDocs = (nextDocs) => {
  setDocuments(nextDocs); // מעדכן את ה-State (מה שהמשתמש רואה)
  if (user) {
    storageService.saveDocuments(user.username, nextDocs); // שומר ב-LocalStorage
  }
};
 const addChar = (char) => {
  saveToHistory(); // שומר צילום מצב לפני השינוי (למקרה של Undo)

  // 1. מחשבים את המערך החדש ושומרים אותו במשתנה nextDocs
  const nextDocs = documents.map(doc => {
    if (doc.id !== activeDocId) return doc;
    const newContent = [...doc.content];
    newContent.splice(doc.cursorIndex, 0, { char, style: { ...currentStyle } });
    return { ...doc, content: newContent, cursorIndex: doc.cursorIndex + 1 };
  });

  // 2. משתמשים בפונקציית העזר כדי לעדכן ולשמור בבת אחת
  updateAndSaveDocs(nextDocs);
};

  const deleteChar = () => {
  saveToHistory(); // שומרים גיבוי למקרה שהמשתמש ירצה לעשות Undo למחיקה

  // 1. מחשבים את המערך החדש מראש
  const nextDocs = documents.map(doc => {
    // אם זה לא המסמך הפעיל או שהסמן כבר בהתחלה (אין מה למחוק) - אל תעשה כלום
    if (doc.id !== activeDocId || doc.cursorIndex === 0) return doc;

    const newContent = [...doc.content];
    
    // מחיקת האיבר שנמצא בדיוק לפני מיקום הסמן
    newContent.splice(doc.cursorIndex - 1, 1);

    // מחזירים את המסמך המעודכן עם התוכן החדש והסמן שהוזז אחורה
    return { 
      ...doc, 
      content: newContent, 
      cursorIndex: doc.cursorIndex - 1 
    };
  });

  // 2. מעדכנים את ה-State ושומרים פיזית ב-LocalStorage בבת אחת
  updateAndSaveDocs(nextDocs);
};

 const undo = () => {
  // 1. בדיקה: אם המחסנית ריקה, אין מה לבטל
  if (history.length === 0) return;

  // 2. שליפת המצב האחרון שנשמר בהיסטוריה
  // המצב נשמר כ-String (באמצעות JSON.stringify), אז צריך להפוך אותו חזרה לאובייקט
  const lastState = JSON.parse(history[history.length - 1]);

  // 3. עדכון המצב והשמירה ל-Storage
  // אנחנו משתמשים ב-updateAndSaveDocs כדי שגם ה-LocalStorage יתעדכן במצב הישן-חדש
  updateAndSaveDocs(lastState);

  // 4. הסרת המצב שבו השתמשנו עכשיו מהמחסנית
  setHistory(prev => prev.slice(0, -1));
};

  // חיפוש והחלפה (שומר על עיצוב האות)
  const searchReplace = (searchChar, replaceChar) => {
    if (!searchChar || !replaceChar) return;
    saveToHistory();
    setDocuments(prev => prev.map(doc => {
      if (doc.id !== activeDocId) return doc;
      const newContent = doc.content.map(item => 
        item.char === searchChar ? { ...item, char: replaceChar } : item
      );
      return { ...doc, content: newContent };
    }));
  };

  // ניהול מסמכים (הוספה, סגירה, ניקוי)
  const addNewDocument = () => {
    const newDoc = { id: Date.now(), content: [], cursorIndex: 0, owner: user.username };
    setDocuments(prev => [...prev, newDoc]);
    setActiveDocId(newDoc.id);
  };

  const closeDocument = (id) => {
    setDocuments(prev => {
      const filtered = prev.filter(doc => doc.id !== id);
      if (id === activeDocId && filtered.length > 0) setActiveDocId(filtered[0].id);
      return filtered;
    });
  };

 const clearDocument = () => {
  saveToHistory(); // חשוב מאוד לגבות לפני שמוחקים הכל!

  // 1. מחשבים את המערך החדש שבו המסמך הפעיל ריק
  const nextDocs = documents.map(doc => 
    doc.id === activeDocId 
      ? { ...doc, content: [], cursorIndex: 0 } // איפוס תוכן וסמן
      : doc
  );

  // 2. עדכון ושמירה אקטיבית
  updateAndSaveDocs(nextDocs);
};

const deleteWord = () => {
  saveToHistory();

  // 1. מחשבים את המערך החדש (nextDocs)
  const nextDocs = documents.map(doc => {
    // אם זה לא המסמך הפעיל או שהמסמך ריק - אל תעשה כלום
    if (doc.id !== activeDocId || doc.content.length === 0) return doc;
    
    const content = [...doc.content];

    /**
     * לוגיקת החיפוש: 
     * לוקחים את כל התווים עד מיקום הסמן הנוכחי, 
     * ומחפשים מהסוף להתחלה את האינדקס של התו שהוא רווח (' ').
     */
    const lastSpaceIndex = content
      .slice(0, doc.cursorIndex - 1)
      .findLastIndex(item => item.char === ' ');
    
    // קובעים מאיפה להתחיל למחוק: אם לא נמצא רווח, מוחקים מתחילת המסמך (אינדקס 0)
    const deleteFrom = lastSpaceIndex === -1 ? 0 : lastSpaceIndex + 1;
    
    // כמות התווים שיש למחוק היא המרחק בין הסמן לנקודת ההתחלה שמצאנו
    const deleteCount = doc.cursorIndex - deleteFrom;
    
    // ביצוע המחיקה בפועל מהמערך
    content.splice(deleteFrom, deleteCount);

    // מחזירים את המסמך המעודכן עם הסמן החדש (שעבר למיקום שבו התחילה המחיקה)
    return { 
      ...doc, 
      content, 
      cursorIndex: deleteFrom 
    };
  });

  // 2. מעדכנים את ה-State ושומרים פיזית ב-Storage
  updateAndSaveDocs(nextDocs);
};

const applyStyleToAll = () => {
  saveToHistory();

  // 1. יצירת עותק חדש של כל המסמכים
  const nextDocs = documents.map(doc => {
    if (doc.id !== activeDocId) return doc;
    
    // מעבר על כל אובייקט אות (item) ושינוי ה-style שלו
    const newContent = doc.content.map(item => ({
      ...item,
      style: { ...currentStyle } // החלת הסטייל הנוכחי מה-State
    }));
    
    return { ...doc, content: newContent };
  });

  // 2. עדכון ושמירה אקטיבית
  updateAndSaveDocs(nextDocs);
};

  // --- 4. חשיפת הפונקציות החוצה ---
  return { 
    documents, 
    activeDocId, 
    setActiveDocId, 
    currentStyle, 
    updateCurrentStyle: setCurrentStyle,
    addChar, 
    deleteChar, 
    undo, 
    searchReplace, 
    addNewDocument, 
    closeDocument, 
    deleteWord, 
    clearDocument
  };
};