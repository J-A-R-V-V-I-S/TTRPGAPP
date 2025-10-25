import { useState } from 'react';
import './defenseBar.css';

interface DefenseBarProps {
  dexterityBonus: number;
  armorBonus: number;
  shieldBonus: number;
  otherBonus: number;
  baseDefense?: number; // Base defense from database (defaults to 10)
  onDexterityChange?: (newBonus: number) => void;
  onArmorChange?: (newBonus: number) => void;
  onShieldChange?: (newBonus: number) => void;
  onOtherChange?: (newBonus: number) => void;
}

const DefenseBar = ({ 
  dexterityBonus,
  armorBonus,
  shieldBonus,
  otherBonus,
  baseDefense = 10,
  onDexterityChange,
  onArmorChange,
  onShieldChange,
  onOtherChange
}: DefenseBarProps) => {
  const [isEditingDex, setIsEditingDex] = useState(false);
  const [isEditingArmor, setIsEditingArmor] = useState(false);
  const [isEditingShield, setIsEditingShield] = useState(false);
  const [isEditingOther, setIsEditingOther] = useState(false);

  const [dexEditValue, setDexEditValue] = useState(dexterityBonus.toString());
  const [armorEditValue, setArmorEditValue] = useState(armorBonus.toString());
  const [shieldEditValue, setShieldEditValue] = useState(shieldBonus.toString());
  const [otherEditValue, setOtherEditValue] = useState(otherBonus.toString());

  // Defesa Total = Base + Des + Armadura + Escudo + Outros
  const totalDefense = baseDefense + dexterityBonus + armorBonus + shieldBonus + otherBonus;

  const handleDexSubmit = () => {
    const newValue = parseInt(dexEditValue) || 0;
    onDexterityChange?.(newValue);
    setDexEditValue(newValue.toString());
    setIsEditingDex(false);
  };

  const handleArmorSubmit = () => {
    const newValue = Math.max(0, parseInt(armorEditValue) || 0);
    onArmorChange?.(newValue);
    setArmorEditValue(newValue.toString());
    setIsEditingArmor(false);
  };

  const handleShieldSubmit = () => {
    const newValue = Math.max(0, parseInt(shieldEditValue) || 0);
    onShieldChange?.(newValue);
    setShieldEditValue(newValue.toString());
    setIsEditingShield(false);
  };

  const handleOtherSubmit = () => {
    const newValue = parseInt(otherEditValue) || 0;
    onOtherChange?.(newValue);
    setOtherEditValue(newValue.toString());
    setIsEditingOther(false);
  };

  const formatBonus = (value: number): string => {
    return value >= 0 ? `+${value}` : `${value}`;
  };

  return (
    <div className="defense-bar-container">
      <div className="defense-bar-header">
        <div className="defense-label-section">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="defense-icon"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span className="defense-label">Classe de Armadura</span>
        </div>
        
        <div className="defense-total">
          <span className="defense-total-value">{totalDefense}</span>
        </div>
      </div>

      <div className="defense-breakdown">
        <div className="defense-component base">
          <span className="component-label">Base</span>
          <span className="component-value">{baseDefense}</span>
        </div>

        <div className="defense-separator">+</div>

        <div className="defense-component dex">
          <span className="component-label">Des</span>
          {isEditingDex ? (
            <input
              type="number"
              className="component-input"
              value={dexEditValue}
              onChange={(e) => setDexEditValue(e.target.value)}
              onBlur={handleDexSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleDexSubmit()}
              autoFocus
            />
          ) : (
            <span 
              className="component-value editable" 
              onClick={() => setIsEditingDex(true)}
              title="Clique para editar"
            >
              {formatBonus(dexterityBonus)}
            </span>
          )}
        </div>

        <div className="defense-separator">+</div>

        <div className="defense-component armor">
          <span className="component-label">Armadura</span>
          {isEditingArmor ? (
            <input
              type="number"
              className="component-input"
              value={armorEditValue}
              onChange={(e) => setArmorEditValue(e.target.value)}
              onBlur={handleArmorSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleArmorSubmit()}
              autoFocus
              min="0"
            />
          ) : (
            <span 
              className="component-value editable" 
              onClick={() => setIsEditingArmor(true)}
              title="Clique para editar"
            >
              {formatBonus(armorBonus)}
            </span>
          )}
        </div>

        <div className="defense-separator">+</div>

        <div className="defense-component shield">
          <span className="component-label">Escudo</span>
          {isEditingShield ? (
            <input
              type="number"
              className="component-input"
              value={shieldEditValue}
              onChange={(e) => setShieldEditValue(e.target.value)}
              onBlur={handleShieldSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleShieldSubmit()}
              autoFocus
              min="0"
            />
          ) : (
            <span 
              className="component-value editable" 
              onClick={() => setIsEditingShield(true)}
              title="Clique para editar"
            >
              {formatBonus(shieldBonus)}
            </span>
          )}
        </div>

        <div className="defense-separator">+</div>

        <div className="defense-component other">
          <span className="component-label">Outros</span>
          {isEditingOther ? (
            <input
              type="number"
              className="component-input"
              value={otherEditValue}
              onChange={(e) => setOtherEditValue(e.target.value)}
              onBlur={handleOtherSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleOtherSubmit()}
              autoFocus
            />
          ) : (
            <span 
              className="component-value editable" 
              onClick={() => setIsEditingOther(true)}
              title="Clique para editar"
            >
              {formatBonus(otherBonus)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DefenseBar;

