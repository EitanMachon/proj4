// src/components/EditorConsole/EditorConsole.jsx
import Toolbar from '../Toolbar/Toolbar';
import Keyboard from '../Keyboard/Keyboard';
import './EditorConsole.css';

const EditorConsole = ({ activeDoc, onUpdateStyle, onAddDoc, onSave, onKeyClick }) => {
  return (
    <div className="editor-console">
      <div className="console-inner">
        {/* החלק העליון של הקונסולה - כלי עריכה */}
        <section className="console-toolbar">
          <Toolbar 
            activeDoc={activeDoc} 
            onUpdateStyle={onUpdateStyle} 
            onAddDoc={onAddDoc}
            onSave={onSave}
          />
        </section>

        {/* החלק התחתון של הקונסולה - המקלדת */}
        <section className="console-keyboard">
          <Keyboard onKeyClick={onKeyClick} />
        </section>
      </div>
    </div>
  );
};

export default EditorConsole;