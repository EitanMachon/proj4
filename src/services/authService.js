// src/services/authService.js

/**
 * מפתח קבוע המשמש ככתובת בזיכרון הדפדפן (LocalStorage) 
 * שם נשמור את שם המשתמש שמחובר כרגע.
 */
const USER_KEY = 'visual_editor_logged_in_user';

/**
 * שירות (Service) לניהול זהות המשתמש.
 * אחראי על ה"כניסה" וה"יציאה" מהמערכת ברמת הדפדפן.
 */
export const authService = {
    
    /**
     * פונקציית התחברות: מקבלת שם משתמש ושומרת אותו בזיכרון.
     * @param {string} username - השם שהוקלד בטופס.
     * @returns {string|null} - מחזירה את השם אם הצליח, או null אם הקלט לא תקין.
     */
    login: (username) => {
        // בדיקה שהשם לא ריק ושאינו מכיל רק רווחים
        if (!username || username.trim() === "") return null;
        
        // שמירת השם ב-LocalStorage (אחרי ניקוי רווחים מיותרים)
        localStorage.setItem(USER_KEY, username.trim());
        
        return username.trim();
    },

    /**ד
     * פונקציית התנתקות: מוחקת את המשתמש מהזיכרון.
     */
    logout: () => {
        // הסרת המידע המשויך למפתח, מה שיגרום למערכת לזהות שאין אף אחד מחובר
        localStorage.removeItem(USER_KEY);
    },

    /**
     * פונקציה לשליפת המשתמש הנוכחי:
     * @returns {string|null} - שם המשתמש השמור בזיכרון.
     */
    getCurrentUser: () => {
        return localStorage.getItem(USER_KEY);
    },

    /**
     * פונקציית עזר לבדיקה מהירה:
     * @returns {boolean} - מחזירה אמת אם יש מישהו מחובר, ושקר אם לא.
     */
    isLoggedIn: () => {
        // שימוש ב-!! הופך את התוצאה (מחרוזת או null) לערך בוליאני (true/false)
        return !!localStorage.getItem(USER_KEY);
    }
};