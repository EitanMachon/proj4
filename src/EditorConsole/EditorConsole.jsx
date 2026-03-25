import React from 'react';
import Toolbar from '../Toolbar/Toolbar';
import Keyboard from '../Keyboard/Keyboard';
import './EditorConsole.css';

const EditorConsole = ({ onAddChar, onDeleteChar, onDeleteWord, onClearAll }) => {
  return (
    <div className="editor-console">
      {/* סרגל הכלים מקבל את פונקציית הניקוי הכללי */}
      <Toolbar onClearAll={onClearAll} />
      
      {/* המקלדת מקבלת את פונקציות המחיקה */}
      <Keyboard 
        onKeyClick={onAddChar} 
        onDeleteChar={onDeleteChar}
        onDeleteWord={onDeleteWord}
      />
    </div>
  );
};

export default EditorConsole;