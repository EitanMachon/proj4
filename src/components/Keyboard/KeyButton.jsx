import Button from '../common/Button';

const KeyButton = ({ label, onClick, isActive }) => {
  return (
    <Button 
      label={label} 
      onClick={onClick} 
      className={`key-btn ${isActive ? 'active' : ''}`}
    />
  );
};

export default KeyButton;
