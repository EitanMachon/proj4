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
 const closeDocument = (id) => {
    // 1. מחשבים מראש את הרשימה החדשה ללא המסמך שמחקנו
    const nextDocs = documents.filter(doc => doc.id !== id);
    
    // 2. משתמשים בפונקציית העזר כדי לעדכן גם את ה-State וגם את ה-Storage
    updateAndSaveDocs(nextDocs);

    // 3. מעדכנים את המזהה הפעיל במידת הצורך
    if (id === activeDocId && nextDocs.length > 0) {
      setActiveDocId(nextDocs[0].id);
    }
  };

  const renameDocument = (id, newTitle) => {
    // יוצרים מערך מסמכים חדש שבו רק המסמך המבוקש מקבל את השם החדש
    const nextDocs = documents.map(doc => 
      doc.id === id ? { ...doc, title: newTitle } : doc
    );
    
    // מעדכנים את ה-State ושומרים ל-LocalStorage
    updateAndSaveDocs(nextDocs);
  };

  const addNewDocument = () => {
    const newDoc = { id: Date.now(), content: [], cursorIndex: 0, owner: user.username };
    
    // 1. יוצרים את המערך החדש שכולל את המסמך החדש
    const nextDocs = [...documents, newDoc];
    
    // 2. עדכון ושמירה אקטיבית
    updateAndSaveDocs(nextDocs);
    
    // 3. הפיכת המסמך החדש לפעיל
    setActiveDocId(newDoc.id);
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


const moveCursor = (direction) => {
    setDocuments(prevDocs => prevDocs.map(doc => {
      if (doc.id !== activeDocId) return doc;

      let newIndex = doc.cursorIndex;
      const content = doc.content;
      const length = content.length;

      switch (direction) {
        case 'RIGHT':
          // ימינה (קדימה בטקסט)
          if (newIndex < length) newIndex--;
          break;

        case 'LEFT':
          // שמאלה (אחורה בטקסט)
          if (newIndex > 0) newIndex++;
          break;

        case 'DOWN':
          // מציאת השורה הנוכחית והבאה היא מורכבת במערך שטוח.
          // גישה בסיסית: חפש את תחילת השורה הבאה (ה-`\n` הבא) פלוס המרחק הנוכחי מתחילת השורה
          const nextNewLineDown = content.findIndex((item, i) => i >= doc.cursorIndex && item.char === '\n');
          if (nextNewLineDown !== -1) {
              // מצאנו שורה חדשה מתחתינו
              // חישוב המרחק של הסמן מתחילת השורה הנוכחית
              const prevNewLine = content.findLastIndex((item, i) => i < doc.cursorIndex && item.char === '\n');
              const offsetFromStartOfLine = doc.cursorIndex - (prevNewLine === -1 ? 0 : prevNewLine + 1);
              
              // הוספת האופסט לתחילת השורה הבאה (או עד סוף השורה הבאה אם היא קצרה מדי)
              const endOfNextLine = content.findIndex((item, i) => i > nextNewLineDown && item.char === '\n');
              const targetIndex = nextNewLineDown + 1 + offsetFromStartOfLine;
              
              newIndex = endOfNextLine !== -1 ? Math.min(targetIndex, endOfNextLine) : Math.min(targetIndex, length);
          } else {
              // אין שורה למטה, נלך לסוף המסמך
              newIndex = length;
          }
          break;

        case 'UP':
           // חפש את תחילת השורה הקודמת
          const prevNewLineUp = content.findLastIndex((item, i) => i < doc.cursorIndex && item.char === '\n');
          if (prevNewLineUp !== -1) {
              // מצאנו שורה קודמת מעלינו
              const startOfCurrentLine = prevNewLineUp + 1;
              const offsetFromStart = doc.cursorIndex - startOfCurrentLine;

              const startOfPrevLine = content.findLastIndex((item, i) => i < prevNewLineUp && item.char === '\n');
              const actualStartOfPrev = startOfPrevLine === -1 ? 0 : startOfPrevLine + 1;

              // ננסה לשים את הסמן באותו מרחק, או בסוף השורה הקודמת (מה שקצר יותר)
              newIndex = Math.min(actualStartOfPrev + offsetFromStart, prevNewLineUp);
          } else {
               // אין שורה מעל, נלך לתחילת המסמך
              newIndex = 0;
          }
          break;
          
        default:
          break;
      }

      return { ...doc, cursorIndex: newIndex };
    }));
  };
// הפונקציה הקלאסית: מקבלת את העיצוב החדש וממזגת אותו עם הקיים
  function updateCurrentStyle(newStyleUpdates) {
    setCurrentStyle(function(prevStyle) {
      return { 
        ...prevStyle, 
        ...newStyleUpdates 
      };
    });
  }

  // --- 4. חשיפת הפונקציות החוצה ---
 // --- 4. חשיפת הפונקציות החוצה ---
  return { 
    documents, 
    activeDocId, 
    setActiveDocId, 
    currentStyle, 
    updateCurrentStyle,
    addChar, 
    deleteChar, 
    undo, 
    searchReplace, 
    addNewDocument, 
    closeDocument,
    renameDocument, 
    deleteWord, 
    clearDocument,
    moveCursor,
    
    // תיקון בעיה #2: עכשיו אנחנו מייצאים את הפונקציה החוצה!
    applyStyleToAll
  };
};

export default useDocuments;