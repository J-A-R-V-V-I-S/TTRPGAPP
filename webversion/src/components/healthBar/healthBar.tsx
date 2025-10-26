import { useState } from 'react';
import './healthBar.css';

interface HealthBarProps {
  currentHp: number;
  maxHp: number;
  tempHp?: number;
  onHpChange?: (newHp: number) => void;
  onTempHpChange?: (newTempHp: number) => void;
}

const HealthBar = ({ 
  currentHp, 
  maxHp, 
  tempHp = 0,
  onHpChange,
  onTempHpChange 
}: HealthBarProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(currentHp.toString());
  const [isTempEditing, setIsTempEditing] = useState(false);
  const [tempEditValue, setTempEditValue] = useState(tempHp.toString());

  const healthPercentage = currentHp < 0 ? 0 : Math.min((currentHp / maxHp) * 100, 100);

  const getHealthBarColor = () => {
    if (currentHp < 0) return '#4a5568'; // Dark gray for unconscious/fallen character
    if (healthPercentage >= 75) return '#4ecca3';
    if (healthPercentage >= 50) return '#ffa62b';
    if (healthPercentage >= 25) return '#ff6b6b';
    return '#c92a2a';
  };

  const handleHpSubmit = () => {
    const newValue = Math.min(parseInt(editValue) || 0, maxHp);
    onHpChange?.(newValue);
    setEditValue(newValue.toString());
    setIsEditing(false);
  };

  const handleTempHpSubmit = () => {
    const newValue = Math.max(0, parseInt(tempEditValue) || 0);
    onTempHpChange?.(newValue);
    setTempEditValue(newValue.toString());
    setIsTempEditing(false);
  };

  return (
    <div className="health-bar-container">
      <div className="health-bar-header">
        <div className="health-label-section">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="health-icon"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span className="health-label">Pontos de Vida</span>
        </div>
        
        <div className="health-values">
          {isEditing ? (
            <input
              type="number"
              className="hp-input"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleHpSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleHpSubmit()}
              autoFocus
              max={maxHp}
            />
          ) : (
            <span 
              className="hp-current" 
              onClick={() => setIsEditing(true)}
              title="Clique para editar"
            >
              {currentHp}
            </span>
          )}
          <span className="hp-separator">/</span>
          <span className="hp-max">{maxHp}</span>
          
          {currentHp < 0 && (
            <span className="hp-status fallen">
              CAÍDO
            </span>
          )}
          
          {tempHp > 0 && (
            <span className="hp-temp">
              +{tempHp} temp
            </span>
          )}
        </div>
      </div>

      <div className="health-bar-wrapper">
        <div className="health-bar-background">
          {tempHp > 0 && (
            <div 
              className="health-bar-temp"
              style={{ 
                width: `${Math.min(((Math.max(currentHp, 0) + tempHp) / maxHp) * 100, 100)}%`
              }}
            />
          )}
          <div 
            className="health-bar-fill"
            style={{ 
              width: `${healthPercentage}%`,
              backgroundColor: getHealthBarColor()
            }}
          >
            <div className="health-bar-shine"></div>
          </div>
        </div>
      </div>

      <div className="health-bar-actions">
        <button 
          className="hp-action-btn hp-heal"
          onClick={() => onHpChange?.(Math.min(currentHp + 1, maxHp))}
          title="Curar 1 PV"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
        
        <button 
          className="hp-action-btn hp-damage"
          onClick={() => onHpChange?.(currentHp - 1)}
          title="Receber 1 de dano"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>

        <div className="temp-hp-section">
          {isTempEditing ? (
            <input
              type="number"
              className="temp-hp-input"
              value={tempEditValue}
              onChange={(e) => setTempEditValue(e.target.value)}
              onBlur={handleTempHpSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTempHpSubmit()}
              autoFocus
              min="0"
              placeholder="PV Temp"
            />
          ) : (
            <button 
              className="hp-action-btn hp-temp-btn"
              onClick={() => setIsTempEditing(true)}
              title="Adicionar PV temporários"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              <span>PV Temp</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthBar;

