import { useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService';

export const useDocuments = (user) => {
  const [documents, setDocuments] = useState([]);
  const [activeDocId, setActiveDocId] = useState(null);
  const [history, setHistory] = useState([]); // לשמירת מצבים קודמים (Undo)

  // טעינה ראשונית לפי משתמש - חלק ד'
  useEffect(() => {
    if (!user) return;
    const allDocs = storageService.getDocuments();
    // סינון מפורש: המשתמש רואה רק את שלו
    const userDocs = allDocs.filter(doc => doc.owner === user.username);
    
    if (userDocs.length === 0) {
      const newDoc = {
        id: Date.now(),
        text: '',
        style: { color: '#000000', fontSize: '16px', fontFamily: 'Arial' },
        owner: user.username
      };
      setDocuments([newDoc]);
      setActiveDocId(newDoc.id);
    } else {
      setDocuments(userDocs);
      setActiveDocId(userDocs[0].id);
    }
  }, [user]);

  // שמירה אוטומטית ל-Local Storage בכל שינוי - חלק ב'
  useEffect(() => {
    if (documents.length > 0) {
      storageService.saveDocuments(documents);
    }
  }, [documents]);

  // פונקציות עריכה - חלק א'
  const saveToHistory = useCallback(() => {
    setHistory(prev => [...prev, JSON.stringify(documents)].slice(-10)); // שומר 10 צעדים אחרונה
  }, [documents]);

  const addChar = (char) => {
    saveToHistory();
    setDocuments(prev => prev.map(doc => 
      doc.id === activeDocId ? { ...doc, text: doc.text + char } : doc
    ));
  };

  const deleteChar = () => {
    saveToHistory();
    setDocuments(prev => prev.map(doc => 
      doc.id === activeDocId ? { ...doc, text: doc.text.slice(0, -1) } : doc
    ));
  };

  const deleteWord = () => {
    saveToHistory();
    setDocuments(prev => prev.map(doc => {
      if (doc.id !== activeDocId) return doc;
      const words = doc.text.trimEnd().split(' ');
      words.pop();
      return { ...doc, text: words.join(' ') + (words.length > 0 ? ' ' : '') };
    }));
  };

  const clearDocument = () => {
    saveToHistory();
    setDocuments(prev => prev.map(doc => 
      doc.id === activeDocId ? { ...doc, text: '' } : doc
    ));
  };

  const undo = () => {
    if (history.length === 0) return;
    const lastState = JSON.parse(history[history.length - 1]);
    setDocuments(lastState);
    setHistory(prev => prev.slice(0, -1));
  };

  // ניהול מסמכים מרובים - חלק ג'
  const addNewDocument = () => {
    const newDoc = {
      id: Date.now(),
      text: '',
      style: { color: '#000000', fontSize: '16px', fontFamily: 'Arial' },
      owner: user.username
    };
    setDocuments(prev => [...prev, newDoc]);
    setActiveDocId(newDoc.id);
  };

  const closeDocument = (id) => {
    const remaining = documents.filter(doc => doc.id !== id);
    if (remaining.length === 0) return; // תמיד נשאר מסמך אחד לפחות
    setDocuments(remaining);
    if (activeDocId === id) setActiveDocId(remaining[0].id);
  };

  const updateStyle = (newStyle) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === activeDocId ? { ...doc, style: { ...doc.style, ...newStyle } } : doc
    ));
  };

  return { 
    documents, activeDocId, setActiveDocId, 
    addChar, deleteChar, deleteWord, clearDocument, 
    undo, addNewDocument, closeDocument, updateStyle 
  };
};