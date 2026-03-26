import { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

export const useDocuments = (user) => {
  const [documents, setDocuments] = useState([]);
  const [activeDocId, setActiveDocId] = useState(null);
  // הסטייל ה"נוכחי" - מה שישפיע על האותיות הבאות
  const [currentStyle, setCurrentStyle] = useState({ color: '#000000', fontSize: '16px', fontFamily: 'Arial' });

  useEffect(() => {
    if (!user) return;
    const allDocs = storageService.getDocuments();
    const userDocs = allDocs.filter(doc => doc.owner === user.username);
    
    if (userDocs.length === 0) {
      const newDoc = {
        id: Date.now(),
        content: [], // מערך של { char, style }
        cursorIndex: 0,
        owner: user.username
      };
      setDocuments([newDoc]);
      setActiveDocId(newDoc.id);
    } else {
      setDocuments(userDocs);
      setActiveDocId(userDocs[0].id);
    }
  }, [user]);

  // הוספת תו עם הסטייל הנוכחי בלבד (פתרון לבעיה 1)
  const addChar = (char) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id !== activeDocId) return doc;
      const newContent = [...doc.content];
      // מזריקים את האות עם הסטייל שנבחר ב-Toolbar ברגע זה
      newContent.splice(doc.cursorIndex, 0, { char, style: { ...currentStyle } });
      return { ...doc, content: newContent, cursorIndex: doc.cursorIndex + 1 };
    }));
  };

  const deleteChar = () => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id !== activeDocId || doc.cursorIndex === 0) return doc;
      const newContent = [...doc.content];
      newContent.splice(doc.cursorIndex - 1, 1);
      return { ...doc, content: newContent, cursorIndex: doc.cursorIndex - 1 };
    }));
  };

  // פונקציה לעדכון הסטייל "מכאן והלאה"
  const updateCurrentStyle = (newStyle) => {
    setCurrentStyle(prev => ({ ...prev, ...newStyle }));
  };

  // שמירה אוטומטית
  useEffect(() => {
    if (documents.length > 0) storageService.saveDocuments(documents);
  }, [documents]);

  return { 
    documents, activeDocId, setActiveDocId, 
    currentStyle, updateCurrentStyle,
    addChar, deleteChar, addNewDocument: () => {}, // נשלים בהמשך
    closeDocument: (id) => setDocuments(d => d.filter(x => x.id !== id))
  };
};