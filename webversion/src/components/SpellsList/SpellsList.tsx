/**
 * SpellsList Component
 *
 * Extracted from combat.tsx (lines 587-650) to eliminate code duplication
 * and improve component reusability.
 */

interface Spell {
  id: string;
  name: string;
  escola: string;
  execucao: string;
  alcance: string;
  area?: string;
  duracao: string;
  resistencia: string;
  efeito?: string;
  aprimoramentos: any[];
}

interface SpellsListProps {
  spells: Spell[];
  selectedSpell: Spell | null;
  onSelectSpell: (spell: Spell) => void;
  onEditSpell: (spell: Spell) => void;
  onDeleteSpell: (spellId: string) => void;
  onAddSpell: () => void;
  onToggleSpellPrepared: (spellId: string) => void;
  openMenuId: string | null;
  onToggleMenu: (menuId: string, e: React.MouseEvent) => void;
}

const SpellsList = ({
  spells,
  selectedSpell,
  onSelectSpell,
  onEditSpell,
  onDeleteSpell,
  onAddSpell,
  onToggleSpellPrepared,
  openMenuId,
  onToggleMenu,
}: SpellsListProps) => {
  return (
    <>
      {spells.map((spell) => (
        <div
          key={spell.id}
          className={`combat-item ${selectedSpell?.id === spell.id ? 'selected' : ''}`}
          onClick={() => onSelectSpell(spell)}
        >
          <div className="combat-item-header">
            <div className="combat-name-level">
              <span className="combat-name">{spell.name}</span>
              <span className="combat-level">{spell.escola}</span>
            </div>
            <div className="combat-item-actions">
              <input
                type="checkbox"
                checked={false}
                onChange={() => onToggleSpellPrepared(spell.id)}
                onClick={(e) => e.stopPropagation()}
                title="Preparada"
              />
              <div className="item-menu-container">
                <button
                  className="item-menu-btn"
                  onClick={(e) => onToggleMenu(`spell-${spell.id}`, e)}
                >
                  ⋮
                </button>
                {openMenuId === `spell-${spell.id}` && (
                  <div className="item-menu-dropdown">
                    <button
                      className="menu-option"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditSpell(spell);
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="menu-option delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSpell(spell.id);
                      }}
                    >
                      🗑️ Deletar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="combat-school">{spell.execucao}</div>
        </div>
      ))}
      <div className="combat-item add-item-btn" onClick={onAddSpell}>
        <div className="add-item-content">
          <span className="add-item-icon">+</span>
          <span className="add-item-text">Adicionar Magia</span>
        </div>
      </div>
    </>
  );
};

export default SpellsList;
