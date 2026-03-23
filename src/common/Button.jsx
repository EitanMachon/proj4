// src/components/common/Button.jsx
import './Button.css';

/**
 * קומפוננטת כפתור גנרית - אבן הבניין של ה-UI
 * @param {string} label - הטקסט שיוצג על הכפתור
 * @param {function} onClick - הפונקציה שתופעל בלחיצה
 * @param {string} className - מחלקה נוספת לעיצוב ספציפי (למשל 'key' או 'action')
 * @param {object} style - עיצוב inline אופציונלי
 */
const Button = ({ label, onClick, className = "", style = {} }) => {
  return (
    <button 
      className={`custom-button ${className}`} 
      onClick={onClick}
      style={style}
    >
      {label}
    </button>
  );
};

export default Button;