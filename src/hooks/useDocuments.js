import { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

export const useDocuments = (user) => {
  // --- 1. הגדרת מצבים (States) ---
  const [documents, setDocuments] = useState([]);
  const [activeDocId, setActiveDocId] = useState(null);
  const [currentStyle, setCurrentStyle] = useState({ color: '#000000', fontSize: '16px', fontFamily: 'Arial' });
  const [history, setHistory] = useState([]); // מחסנית לביצוע Undo

  // --- 2. טעינה וסנכרון (Effects) ---

  // טעינה ראשונית לפי משתמש
  useEffect(() => {
    if (!user) return;

    const userDocs = storageService.getDocuments(user.username);
    const lastState = storageService.getUserState(user.username);

    if (userDocs.length > 0) {
      setDocuments(userDocs);
      setActiveDocId(lastState?.activeDocId || userDocs[0].id);
      if (lastState?.currentStyle) setCurrentStyle(lastState.currentStyle);
    } else {
      // יצירת מסמך ראשון למשתמש חדש
      const newDoc = { id: Date.now(), content: [], cursorIndex: 0, owner: user.username };
      setDocuments([newDoc]);
      setActiveDocId(newDoc.id);
    }
  }, [user]);

  // שמירה אוטומטית של המסמכים
  useEffect(() => {
    if (user && documents.length > 0) {
      storageService.saveDocuments(user.username, documents);
    }
  }, [documents, user]);

  // שמירת מצב עבודה (סמן וסטייל)
  useEffect(() => {
    if (user && activeDocId) {
      storageService.saveUserState(user.username, { activeDocId, currentStyle });
    }
  }, [activeDocId, currentStyle, user]);


  // --- 3. לוגיקת עריכה (Functions) ---

  // עזר: שמירת מצב להיסטוריה לפני שינוי
  const saveToHistory = () => {
    setHistory(prev => [...prev, JSON.stringify(documents)].slice(-10));
  };

  // הוספת תו עם הסטייל הנוכחי
  const addChar = (char) => {
    saveToHistory(); // מאפשר לעשות Undo על ההקלדה
    setDocuments(prev => prev.map(doc => {
      if (doc.id !== activeDocId) return doc;
      const newContent = [...doc.content];
      newContent.splice(doc.cursorIndex, 0, { char, style: { ...currentStyle } });
      return { ...doc, content: newContent, cursorIndex: doc.cursorIndex + 1 };
    }));
  };

  // מחיקת תו (Backspace)
  const deleteChar = () => {
    saveToHistory();
    setDocuments(prev => prev.map(doc => {
      if (doc.id !== activeDocId || doc.cursorIndex === 0) return doc;
      const newContent = [...doc.content];
      newContent.splice(doc.cursorIndex - 1, 1);
      return { ...doc, content: newContent, cursorIndex: doc.cursorIndex - 1 };
    }));
  };

  // ביטול פעולה אחרונה
  const undo = () => {
    if (history.length === 0) return;
    const lastState = JSON.parse(history[history.length - 1]);
    setDocuments(lastState);
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
    saveToHistory();
    setDocuments(prev => prev.map(doc => 
      doc.id === activeDocId ? { ...doc, content: [], cursorIndex: 0 } : doc
    ));
  };

// 1. מחיקת מילה (Delete Word)
const deleteWord = () => {
  saveToHistory();
  setDocuments(prev => prev.map(doc => {
    if (doc.id !== activeDocId || doc.content.length === 0) return doc;
    
    const content = [...doc.content];
    // מוצאים את המיקום של הרווח האחרון לפני הסמן
    const lastSpaceIndex = content.slice(0, doc.cursorIndex - 1).findLastIndex(item => item.char === ' ');
    
    // מוחקים מהרווח (או מתחילת המסמך) ועד הסמן
    const deleteFrom = lastSpaceIndex === -1 ? 0 : lastSpaceIndex + 1;
    const deleteCount = doc.cursorIndex - deleteFrom;
    
    content.splice(deleteFrom, deleteCount);
    return { ...doc, content, cursorIndex: deleteFrom };
  }));
};

// 2. שינוי סטייל לכל הטקסט הקיים (Global Style)
const applyStyleToAll = () => {
  saveToHistory();
  setDocuments(prev => prev.map(doc => {
    if (doc.id !== activeDocId) return doc;
    
    // עוברים על כל האותיות במסמך ומשנים להן את הסטייל לזה שמוגדר כרגע ב-Toolbar
    const newContent = doc.content.map(item => ({
      ...item,
      style: { ...currentStyle }
    }));
    
    return { ...doc, content: newContent };
  }));
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