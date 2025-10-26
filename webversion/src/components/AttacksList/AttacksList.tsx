/**
 * AttacksList Component
 *
 * Extracted from combat.tsx (lines 519-576) to eliminate code duplication
 * and improve component reusability.
 */

interface Attack {
  id: string;
  name: string;
  type: string;
  testeAtaque: string;
  damage: string;
  critico: string;
  range: string;
  description: string;
}

interface AttacksListProps {
  attacks: Attack[];
  selectedAttack: Attack | null;
  onSelectAttack: (attack: Attack) => void;
  onEditAttack: (attack: Attack) => void;
  onDeleteAttack: (attackId: string) => void;
  onAddAttack: () => void;
  openMenuId: string | null;
  onToggleMenu: (menuId: string, e: React.MouseEvent) => void;
}

const AttacksList = ({
  attacks,
  selectedAttack,
  onSelectAttack,
  onEditAttack,
  onDeleteAttack,
  onAddAttack,
  openMenuId,
  onToggleMenu,
}: AttacksListProps) => {
  return (
    <>
      {attacks.map((attack) => (
        <div
          key={attack.id}
          className={`combat-item ${selectedAttack?.id === attack.id ? 'selected' : ''}`}
          onClick={() => onSelectAttack(attack)}
        >
          <div className="combat-item-header">
            <div className="combat-name-level">
              <span className="combat-name">{attack.name}</span>
              <span className="combat-level">{attack.type}</span>
            </div>
            <div className="combat-item-actions">
              <span className="attack-bonus">{attack.testeAtaque}</span>
              <div className="item-menu-container">
                <button
                  className="item-menu-btn"
                  onClick={(e) => onToggleMenu(`attack-${attack.id}`, e)}
                >
                  ⋮
                </button>
                {openMenuId === `attack-${attack.id}` && (
                  <div className="item-menu-dropdown">
                    <button
                      className="menu-option"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditAttack(attack);
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="menu-option delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteAttack(attack.id);
                      }}
                    >
                      🗑️ Deletar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="combat-school">{attack.damage}</div>
        </div>
      ))}
      <div className="combat-item add-item-btn" onClick={onAddAttack}>
        <div className="add-item-content">
          <span className="add-item-icon">+</span>
          <span className="add-item-text">Adicionar Ataque</span>
        </div>
      </div>
    </>
  );
};

export default AttacksList;
