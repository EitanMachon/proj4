// src/services/authService.js

const USER_KEY = 'visual_editor_logged_in_user';

/**
 * שירות לניהול זהות המשתמש (חלק ד' של הפרויקט)
 */
export const authService = {
    // התחברות של משתמש
    login: (username) => {
        if (!username || username.trim() === "") return null;
        localStorage.setItem(USER_KEY, username.trim());
        return username.trim();
    },

    // ניתוק משתמש
    logout: () => {
        localStorage.removeItem(USER_KEY);
    },

    // קבלת שם המשתמש המחובר כרגע
    getCurrentUser: () => {
        return localStorage.getItem(USER_KEY);
    },

    // בדיקה האם יש משתמש מחובר
    isLoggedIn: () => {
        return !!localStorage.getItem(USER_KEY);
    }
};