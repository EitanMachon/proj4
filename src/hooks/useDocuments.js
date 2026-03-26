import { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

export const useDocuments = (user) => {
  const [documents, setDocuments] = useState([]);
  const [activeDocId, setActiveDocId] = useState(null);
  const [currentStyle, setCurrentStyle] = useState({ color: '#000000', fontSize: '16px', fontFamily: 'Arial' });

  // טעינה ראשונית של הכל ברגע שהמשתמש מתחבר
  useEffect(() => {
    if (!user) return;

    // 1. טעינת מסמכים
    const userDocs = storageService.getDocuments(user.username);
    
    // 2. טעינת מצב אחרון (איפה הוא עצר)
    const lastState = storageService.getUserState(user.username);

    if (userDocs.length > 0) {
      setDocuments(userDocs);
      // מחזיר אותו בדיוק למסמך האחרון ולסטייל האחרון
      setActiveDocId(lastState?.activeDocId || userDocs[0].id);
      if (lastState?.currentStyle) setCurrentStyle(lastState.currentStyle);
    } else {
      // אם זה משתמש חדש לגמרי, יוצרים לו מסמך ראשון
      const newDoc = { id: Date.now(), content: [], cursorIndex: 0, owner: user.username };
      setDocuments([newDoc]);
      setActiveDocId(newDoc.id);
    }
  }, [user]);

  // שמירה אוטומטית של המסמכים בכל שינוי
  useEffect(() => {
    if (user && documents.length > 0) {
      storageService.saveDocuments(user.username, documents);
    }
  }, [documents, user]);

  // שמירת ה"מצב" (State) בכל פעם שהוא משנה מסמך או צבע
  useEffect(() => {
    if (user && activeDocId) {
      storageService.saveUserState(user.username, { activeDocId, currentStyle });
    }
  }, [activeDocId, currentStyle, user]);

  const addChar = (char) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id !== activeDocId) return doc;
      const newContent = [...doc.content];
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

  const addNewDocument = () => {
    const newDoc = { id: Date.now(), content: [], cursorIndex: 0, owner: user.username };
    setDocuments(prev => [...prev, newDoc]);
    setActiveDocId(newDoc.id);
  };

  return { 
    documents, activeDocId, setActiveDocId, 
    currentStyle, updateCurrentStyle: setCurrentStyle,
    addChar, deleteChar, addNewDocument,
    closeDocument: (id) => setDocuments(d => d.filter(x => x.id !== id))
  };
};