import { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

export const useDocuments = (user) => {
  const [documents, setDocuments] = useState([]);
  const [activeDocId, setActiveDocId] = useState(null);

  // טעינה לפי משתמש (דרישה מחלק ד')
  useEffect(() => {
    const saved = storageService.getDocuments();
    // מסננים: רק מסמכים ששייכים למשתמש המחובר או ל'guest'
    const userDocs = saved.filter(doc => doc.owner === (user?.username || 'guest'));
    
    if (userDocs.length === 0) {
      const initialDoc = { 
        id: Date.now(), 
        text: '', 
        style: { color: '#000000', fontSize: '16px', fontFamily: 'Arial' },
        owner: user?.username || 'guest'
      };
      setDocuments([initialDoc]);
      setActiveDocId(initialDoc.id);
    } else {
      setDocuments(userDocs);
      setActiveDocId(userDocs[0].id);
    }
  }, [user]);

  // פונקציות מחיקה (דרישות חלק א')
  const deleteChar = () => {
    setDocuments(prev => prev.map(doc => 
      doc.id === activeDocId ? { ...doc, text: doc.text.slice(0, -1) } : doc
    ));
  };

  const deleteWord = () => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id !== activeDocId) return doc;
      const lastSpace = doc.text.trimEnd().lastIndexOf(' ');
      return { ...doc, text: lastSpace === -1 ? '' : doc.text.substring(0, lastSpace + 1) };
    }));
  };

  const clearDocument = () => {
    setDocuments(prev => prev.map(doc => 
      doc.id === activeDocId ? { ...doc, text: '' } : doc
    ));
  };

  const addChar = (char) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === activeDocId ? { ...doc, text: doc.text + char } : doc
    ));
  };

  return { documents, activeDocId, setActiveDocId, addChar, deleteChar, deleteWord, clearDocument, setDocuments };
};