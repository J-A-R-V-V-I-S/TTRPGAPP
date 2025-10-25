import { useState } from 'react';
import './manaBar.css';

interface ManaBarProps {
  currentMana: number;
  maxMana: number;
  onManaChange?: (newMana: number) => void;
}

const ManaBar = ({ 
  currentMana, 
  maxMana,
  onManaChange 
}: ManaBarProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(currentMana.toString());

  const manaPercentage = Math.min((currentMana / maxMana) * 100, 100);

  const getManaBarColor = () => {
    if (manaPercentage >= 75) return '#667eea';
    if (manaPercentage >= 50) return '#4299e1';
    if (manaPercentage >= 25) return '#805ad5';
    return '#553c9a';
  };

  const handleManaSubmit = () => {
    const newValue = Math.max(0, Math.min(parseInt(editValue) || 0, maxMana));
    onManaChange?.(newValue);
    setEditValue(newValue.toString());
    setIsEditing(false);
  };

  return (
    <div className="mana-bar-container">
      <div className="mana-bar-header">
        <div className="mana-label-section">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mana-icon"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <span className="mana-label">Pontos de Mana</span>
        </div>
        
        <div className="mana-values">
          {isEditing ? (
            <input
              type="number"
              className="mana-input"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleManaSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleManaSubmit()}
              autoFocus
              min="0"
              max={maxMana}
            />
          ) : (
            <span 
              className="mana-current" 
              onClick={() => setIsEditing(true)}
              title="Clique para editar"
            >
              {currentMana}
            </span>
          )}
          <span className="mana-separator">/</span>
          <span className="mana-max">{maxMana}</span>
        </div>
      </div>

      <div className="mana-bar-wrapper">
        <div className="mana-bar-background">
          <div 
            className="mana-bar-fill"
            style={{ 
              width: `${manaPercentage}%`,
              backgroundColor: getManaBarColor()
            }}
          >
            <div className="mana-bar-shine"></div>
            <div className="mana-bar-glow"></div>
          </div>
        </div>
      </div>

      <div className="mana-bar-actions">
        <button 
          className="mana-action-btn mana-restore"
          onClick={() => onManaChange?.(Math.min(currentMana + 1, maxMana))}
          title="Restaurar 1 PM"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
        
        <button 
          className="mana-action-btn mana-spend"
          onClick={() => onManaChange?.(Math.max(currentMana - 1, 0))}
          title="Gastar 1 PM"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ManaBar;

