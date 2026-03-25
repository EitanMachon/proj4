// src/components/Toolbar/Toolbar.jsx
import { editorConfig } from "../data/initialState";
import Button from '../common/Button';
import './Toolbar.css';

const Toolbar = ({ activeDoc, onUpdateStyle, onAddDoc, onSave }) => {
  if (!activeDoc) return null;

  return (
    <div className="toolbar-container">
      {/* קבוצת פעולות מסמך */}
      <div className="toolbar-section">
        <Button label="📄 מסמך חדש" onClick={onAddDoc} className="action" />
        <Button label="💾 שמור הכל" onClick={onSave} className="action" />
      </div>

      <div className="divider" />

      {/* בחירת צבע */}
      <div className="toolbar-section">
        <span>צבע:</span>
        <div className="color-picker">
          {editorConfig.colors.map(color => (
            <div 
              key={color} 
              className={`color-circle ${activeDoc.style.color === color ? 'selected' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => onUpdateStyle({ color })}
            />
          ))}
        </div>
      </div>

      <div className="divider" />

      {/* בחירת גופן */}
      <div className="toolbar-section">
        <span>גופן:</span>
        <select 
          value={activeDoc.style.fontFamily} 
          onChange={(e) => onUpdateStyle({ fontFamily: e.target.value })}
        >
          {editorConfig.fonts.map(font => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
      </div>

      <div className="divider" />

      {/* בחירת גודל */}
      <div className="toolbar-section">
        <span>גודל:</span>
        <select 
          value={activeDoc.style.fontSize} 
          onChange={(e) => onUpdateStyle({ fontSize: e.target.value })}
        >
          {editorConfig.fontSizes.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Toolbar;