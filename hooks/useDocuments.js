// src/hooks/useDocuments.js
import { useState, useEffect } from 'react';
import { createNewDoc } from '../data/initialState';
import { storageService } from '../services/storageService';

/**
 * Custom Hook לניהול הלוגיקה של המסמכים בפרויקט
 */
export const useDocuments = () => {
    // 1. הגדרת ה-State המרכזי: מערך של מסמכים
    const [documents, setDocuments] = useState(() => {
        // טעינה ראשונית מה-LocalStorage או יצירת מסמך ראשון אם ריק
        const saved = storageService.loadDocs();
        return saved.length > 0 ? saved : [createNewDoc(Date.now())];
    });

    // 2. ה-State של המסמך שנמצא כרגע ב"פוקוס" (עבור עריכה)
    const [activeDocId, setActiveDocId] = useState(documents[0].id);

    // 3. שמירה אוטומטית ל-LocalStorage בכל פעם שהמסמכים משתנים
    useEffect(() => {
        storageService.saveDocs(documents);
    }, [documents]);

    // --- פונקציות לוגיקה (המנוע) ---

    // הוספת תו למסמך הפעיל
    const addChar = (char) => {
        setDocuments(prevDocs => prevDocs.map(doc => 
            doc.id === activeDocId ? { ...doc, content: doc.content + char } : doc
        ));
    };

    // עדכון עיצוב (סטייל) למסמך הפעיל
    const updateActiveStyle = (newStyle) => {
        setDocuments(prevDocs => prevDocs.map(doc => 
            doc.id === activeDocId ? { ...doc, style: { ...doc.style, ...newStyle } } : doc
        ));
    };

    // הוספת מסמך חדש (חלק ג' של הפרויקט)
    const addDocument = () => {
        const newDoc = createNewDoc(Date.now());
        setDocuments(prev => [...prev, newDoc]);
        setActiveDocId(newDoc.id); // מעבר אוטומטי למסמך החדש
    };

    // מחיקת מסמך
    const removeDocument = (id) => {
        if (documents.length <= 1) return; // תמיד להשאיר לפחות מסמך אחד
        const newDocs = documents.filter(doc => doc.id !== id);
        setDocuments(newDocs);
        if (activeDocId === id) setActiveDocId(newDocs[0].id);
    };

    // מציאת המסמך הפעיל כרגע (לשימוש בתצוגה)
    const activeDoc = documents.find(doc => doc.id === activeDocId);

    // מה שה-App יקבל מה-Hook
    return {
        documents,
        activeDoc,
        activeDocId,
        setActiveDocId,
        addChar,
        updateActiveStyle,
        addDocument,
        removeDocument
    };
};