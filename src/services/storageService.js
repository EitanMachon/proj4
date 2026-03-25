const STORAGE_KEY = 'visual_editor_documents';

export const storageService = {
  // פונקציה לקבלת כל המסמכים
  getDocuments: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  // פונקציה לשמירה של כל המערך
  saveDocuments: (documents) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  }
};