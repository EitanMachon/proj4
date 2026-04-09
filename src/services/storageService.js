/**
 * שירות לניהול הזיכרון המקומי (Storage Service).
 * הקובץ אחראי על שמירה וטעינה של נתונים מ-LocalStorage בצורה של מחרוזות JSON.
 */
export const storageService = {
    
    /**
     * שמירת מסמכים לפי משתמש ספציפי:
     * הופכת את מערך האובייקטים למחרוזת ושומרת אותם תחת מפתח ייחודי.
     * @param {string} username - שם המשתמש הנוכחי.
     * @param {Array} documents - מערך המסמכים לעדכון.
     */
    saveDocuments: (username, documents) => {
        // LocalStorage יודע לשמור רק מחרוזות (Strings), לכן משתמשים ב-stringify
        localStorage.setItem(`docs_${username}`, JSON.stringify(documents));
    },

    /**
     * טעינת מסמכים:
     * מחפשת בזיכרון מידע השייך למשתמש הספציפי.
     * @param {string} username - שם המשתמש שאת המסמכים שלו רוצים לטעון.
     * @returns {Array} - מחזירה מערך של אובייקטים, או מערך ריק אם אין מידע שמור.
     */
    getDocuments: (username) => {
        const data = localStorage.getItem(`docs_${username}`);
        // המרת המחרוזת חזרה לאובייקט JS חי (Parsing)
        return data ? JSON.parse(data) : [];
    },

    /**
     * שמירת "מצב אחרון" (User State):
     * זוכרת נתונים זמניים כמו איזה מסמך פתוח כרגע או איזה סטייל נבחר ב-Toolbar.
     * @param {string} username - שם המשתמש.
     * @param {Object} state - אובייקט המכיל את המצב הנוכחי (activeDocId, currentStyle).
     */
    saveUserState: (username, state) => {
        localStorage.setItem(`state_${username}`, JSON.stringify(state));
    },

    /**
     * קבלת המצב האחרון:
     * משמש להמשכיות העבודה ברגע שהמשתמש מתחבר מחדש.
     * @param {string} username - שם המשתמש.
     * @returns {Object|null} - מחזירה את אובייקט המצב או null אם לא נמצא מידע.
     */
    getUserState: (username) => {
        const data = localStorage.getItem(`state_${username}`);
        return data ? JSON.parse(data) : null;
    }
};