/**
 * מפתח קבוע ב-LocalStorage המשמש כ"טבלת המשתמשים" של המערכת.
 * כאן נשמר מערך המכיל את כל פרטי המשתמשים הרשומים (שמות וסיסמאות).
 */
const USERS_KEY = 'visual_editor_users';

/**
 * שירות לניהול משתמשים (User Service).
 * אחראי על הרישום (Register), האימות (Login) ושליפת נתוני המשתמשים.
 */
export const userService = {
    
    /**
     * הרשמה של משתמש חדש:
     * מבצעת בדיקת כפילות, יצירת אובייקט משתמש ושמירתו במערך הכללי.
     * @param {string} username - שם המשתמש המבוקש.
     * @param {string} password - הסיסמה שנבחרה.
     * @returns {Object} - אובייקט עם סטטוס הצלחה (success) והודעה במקרה של כישלון.
     */
    register: (username, password) => {
        // שליפת כל המשתמשים הקיימים כדי לבדוק כפילות
        const users = userService.getAllUsers();
        
        // בדיקה האם כבר קיים משתמש עם אותו שם (Case Sensitive)
        if (users.find(u => u.username === username)) {
            return { success: false, msg: 'משתמש כבר קיים' };
        }
        
        // יצירת אובייקט משתמש חדש הכולל חותמת זמן (ISO String)
        const newUser = { 
            username, 
            password, 
            createdAt: new Date().toISOString() 
        };
        
        // הוספת המשתמש החדש למערך ושמירה חזרה ב-LocalStorage
        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        
        return { success: true };
    },

    /**
     * התחברות (Authentication):
     * בודקת האם קיימת התאמה בין השם והסיסמה לנתונים השמורים.
     * @param {string} username - השם שהוקלד.
     * @param {string} password - הסיסמה שהוקלדה.
     * @returns {Object} - סטטוס הצלחה ואובייקט המשתמש, או הודעת שגיאה.
     */
    login: (username, password) => {
        const users = userService.getAllUsers();
        
        // חיפוש במערך המשתמשים אחר אובייקט שבו גם השם וגם הסיסמה תואמים
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            return { success: true, user };
        }
        
        return { success: false, msg: 'שם משתמש או סיסמה שגויים' };
    },

    /**
     * פונקציית עזר פנימית:
     * מושכת את כל רשימת המשתמשים מהזיכרון ומפענחת אותה ממחרוזת למערך.
     * @returns {Array} - מערך המשתמשים או מערך ריק אם המערכת חדשה.
     */
    getAllUsers: () => {
        const data = localStorage.getItem(USERS_KEY);
        // המרת ה-JSON חזרה למבנה נתונים של JavaScript
        return data ? JSON.parse(data) : [];
    }
};