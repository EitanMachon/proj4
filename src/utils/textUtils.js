// src/utils/textUtils.js

export const textUtils = {
    // פונקציה למחיקת המילה האחרונה בטקסט
    deleteLastWord: (text) => {
        if (!text) return "";
        const trimmed = text.trimEnd();
        const lastSpaceIndex = trimmed.lastIndexOf(" ");
        
        if (lastSpaceIndex === -1) return ""; // אם יש רק מילה אחת, מוחקים הכל
        
        return text.substring(0, lastSpaceIndex) + " ";
    },

    // פונקציה לבדיקת אורך טקסט (עבור מגבלות עתידיות)
    getWordCount: (text) => {
        if (!text) return 0;
        return text.trim().split(/\s+/).length;
    }
};