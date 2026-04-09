import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // עיצוב גלובלי בסיסי (כמו פונטים וצבעי רקע של כל הדף)

/**
 * נקודת הכניסה הרשמית של האפליקציה לדפדפן.
 * כאן מתבצע החיבור בין עולם ה-React לבין ה-DOM (ה-HTML האמיתי).
 */

// 1. איתור האלמנט ב-HTML עם ה-ID בשם 'root'. 
// 2. יצירת "שורש" (Root) של React עליו תורכב כל האפליקציה.
// 3. הרצת פקודת ה-render שמזריקה את הקומפוננטה הראשית <App /> פנימה.
ReactDOM.createRoot(document.getElementById('root')).render(
  /**
   * React.StrictMode הוא "מעטפת הגנה" בזמן הפיתוח.
   * הוא עוזר למצוא באגים, מזהה קוד מיושן ומתריע על בעיות ביצועים בקונסול.
   */
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)