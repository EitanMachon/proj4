import React from 'react';
import Toolbar from '../Toolbar/Toolbar';
import Keyboard from '../Keyboard/Keyboard';
import './EditorConsole.css';

const EditorConsole = ({ 
  onAddChar, 
  onDeleteChar, 
  onDeleteWord, 
  onClearAll,
  onUndo,
  onNewDoc,
  onUpdateStyle,
  onSearchReplace,
  currentStyle
}) => {
  return (
    <div className="editor-console-inner">
      {/* סרגל כלים - ניהול עיצוב ופעולות מערכת */}
      <Toolbar 
        onUndo={onUndo}
        onClearAll={onClearAll}
        onNewDoc={onNewDoc}
        onUpdateStyle={onUpdateStyle}
        onSearchReplace={onSearchReplace}
        currentStyle={currentStyle}
      />
      
      {/* מקלדת - הזנת נתונים ומחיקה */}
      <Keyboard 
        onKeyClick={onAddChar} 
        onDeleteChar={onDeleteChar}
        onDeleteWord={onDeleteWord}
      />
    </div>
  );
};

export default EditorConsole;