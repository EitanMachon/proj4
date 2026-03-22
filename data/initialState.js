// פונקציה שמייצרת אובייקט מסמך חדש
// זה מבטיח שכל מסמך (גם ה-10) ייראה בדיוק אותו דבר ב-State
export const createNewDoc = (id) => ({
    id: id,                     // מזהה ייחודי (חשוב ל-React Keys)
    title: `מסמך חדש ${id}`,     // שם הקובץ שיוצג
    content: "",                // הטקסט שהמשתמש יקליד
    style: {
        color: "#000000",       // שחור כברירת מחדל
        fontSize: "20px",       // גודל קריא
        fontFamily: "Arial",    // גופן סטנדרטי
        textAlign: "right",     // יישור לימין (עברית)
        fontWeight: "normal"
    },
    language: "he",             // שפת המקלדת ההתחלתית
    lastSaved: null             // חותמת זמן לשמירה (לחלק ב')
});
    
// הגדרות כלליות לעורך
export const editorConfig = {
    fonts: ["Arial", "Courier New", "Georgia", "Times New Roman", "David"],
    fontSizes: ["14px", "18px", "24px", "32px", "48px", "64px"],
    colors: ["#000000", "#ff0000", "#00ff00", "#0000ff", "#ff00ff", "#ffa500"]
};