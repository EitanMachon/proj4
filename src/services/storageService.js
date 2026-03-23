// src/services/storageService.js

const STORAGE_KEY = 'visual_editor_docs';

/**
 * שירות לניהול אחסון המסמכים ב-LocalStorage
 */
export const storageService = {
    // שמירת כל מערך המסמכים
    saveDocs: (docs) => {
        try {
            const serializedDocs = JSON.stringify(docs);
            localStorage.setItem(STORAGE_KEY, serializedDocs);
            return true;
        } catch (error) {
            console.error("Error saving to LocalStorage", error);
            return false;
        }
    },

    // טעינת כל המסמכים שנשמרו
    loadDocs: () => {
        try {
            const savedDocs = localStorage.getItem(STORAGE_KEY);
            return savedDocs ? JSON.parse(savedDocs) : [];
        } catch (error) {
            console.error("Error loading from LocalStorage", error);
            return [];
        }
    },

    // פונקציית עזר למחיקת כל המידע (לצורך דיבאג או איפוס)
    clearAll: () => {
        localStorage.removeItem(STORAGE_KEY);
    }
};