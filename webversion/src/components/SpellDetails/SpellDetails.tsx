/**
 * SpellDetails Component
 *
 * Extracted from combat.tsx (lines 741-962) to eliminate code duplication
 * and improve component reusability.
 */

import { calculateSpellCost } from '../../utils/combatHelpers';

interface Aprimoramento {
  id: string;
  custoAdicionalPM: number;
  reaplicavel: boolean;
  descricao: string;
  aplicacoes: number;
}

interface Spell {
  id: string;
  name: string;
  escola: string;
  execucao: string;
  alcance: string;
  area: string;
  duracao: string;
  resistencia: string;
  efeito: string;
  aprimoramentos: Aprimoramento[];
}

interface SpellDetailsProps {
  spell: Spell;
  aprimoramentoApplications: Record<string, number>;
  onUpdateField: (spellId: string, field: string, value: string) => void;
  onUpdateAprimoramento: (
    spellId: string,
    aprimoramentoId: string,
    field: string,
    value: any
  ) => void;
  onIncrementAplicacoes: (spellId: string, aprimoramentoId: string) => void;
  onDecrementAplicacoes: (spellId: string, aprimoramentoId: string) => void;
  onRemoveAprimoramento: (spellId: string, aprimoramentoId: string) => void;
  onAddAprimoramento: (spellId: string) => void;
  openMenuId: string | null;
  onToggleMenu: (menuId: string, e: React.MouseEvent) => void;
  onCloseMenu: () => void;
}

const SpellDetails = ({
  spell,
  aprimoramentoApplications,
  onUpdateField,
  onUpdateAprimoramento,
  onIncrementAplicacoes,
  onDecrementAplicacoes,
  onRemoveAprimoramento,
  onAddAprimoramento,
  openMenuId,
  onToggleMenu,
  onCloseMenu,
}: SpellDetailsProps) => {
  const calculateTotalCost = (spellId: string, aprimoramento: Aprimoramento): number => {
    const applications = aprimoramentoApplications[`${spellId}-${aprimoramento.id}`] || 0;
    return calculateSpellCost(aprimoramento, applications);
  };

  return (
    <>
      <div className="details-header">
        <div className="editable-title">
          <input
            type="text"
            value={spell.name}
            onChange={(e) => onUpdateField(spell.id, 'name', e.target.value)}
            className="spell-name-input"
            placeholder="Nome da magia"
          />
        </div>
        <span className="details-level">{spell.escola}</span>
      </div>

      <div className="details-stats">
        <div className="stat-row">
          <strong>Escola:</strong>
          <div className="editable-stat">
            <input
              type="text"
              value={spell.escola}
              onChange={(e) => onUpdateField(spell.id, 'escola', e.target.value)}
              className="escola-input"
              placeholder="Ex: Evocação"
            />
          </div>
        </div>
        <div className="stat-row">
          <strong>Execução:</strong>
          <div className="editable-stat">
            <input
              type="text"
              value={spell.execucao}
              onChange={(e) => onUpdateField(spell.id, 'execucao', e.target.value)}
              className="execucao-input"
              placeholder="Ex: 1 ação"
            />
          </div>
        </div>
        <div className="stat-row">
          <strong>Alcance:</strong>
          <div className="editable-stat">
            <input
              type="text"
              value={spell.alcance}
              onChange={(e) => onUpdateField(spell.id, 'alcance', e.target.value)}
              className="alcance-input"
              placeholder="Ex: 36 metros"
            />
          </div>
        </div>
        <div className="stat-row">
          <strong>Área:</strong>
          <div className="editable-stat">
            <input
              type="text"
              value={spell.area}
              onChange={(e) => onUpdateField(spell.id, 'area', e.target.value)}
              className="area-input"
              placeholder="Ex: Esfera de 6m"
            />
          </div>
        </div>
        <div className="stat-row">
          <strong>Duração:</strong>
          <div className="editable-stat">
            <input
              type="text"
              value={spell.duracao}
              onChange={(e) => onUpdateField(spell.id, 'duracao', e.target.value)}
              className="duracao-input"
              placeholder="Ex: Instantâneo"
            />
          </div>
        </div>
        <div className="stat-row">
          <strong>Resistência:</strong>
          <div className="editable-stat">
            <input
              type="text"
              value={spell.resistencia}
              onChange={(e) => onUpdateField(spell.id, 'resistencia', e.target.value)}
              className="resistencia-input"
              placeholder="Ex: Destreza (meio dano)"
            />
          </div>
        </div>
      </div>

      <div className="details-description">
        <h3>Efeito</h3>
        <div className="editable-stat">
          <textarea
            value={spell.efeito}
            onChange={(e) => onUpdateField(spell.id, 'efeito', e.target.value)}
            className="efeito-textarea"
            placeholder="Descrição do efeito da magia..."
            rows={4}
          />
        </div>
      </div>

      {/* Seção de Aprimoramentos */}
      <div className="aprimoramentos-section">
        <div className="aprimoramentos-header">
          <h3>Aprimoramentos</h3>
        </div>

        {spell.aprimoramentos.length > 0 ? (
          <div className="aprimoramentos-list">
            {spell.aprimoramentos.map((aprimoramento) => (
              <div key={aprimoramento.id} className="aprimoramento-item">
                <div className="aprimoramento-header">
                  <div className="aprimoramento-info">
                    <div className="aprimoramento-cost-info">
                      <div className="custo-base-section">
                        <span className="custo-base-label">Custo Base:</span>
                        <span className="custo-base-value">
                          {aprimoramento.custoAdicionalPM || 0} PM
                        </span>
                      </div>
                      {aprimoramento.reaplicavel && (
                        <div className="custo-total-section">
                          <span className="custo-total-label">Total:</span>
                          <span className="custo-total-value">
                            {calculateTotalCost(spell.id, aprimoramento)} PM
                          </span>
                        </div>
                      )}
                      {aprimoramento.reaplicavel && (
                        <span className="reaplicavel-badge">Reaplicável</span>
                      )}
                    </div>

                    {aprimoramento.reaplicavel && (
                      <div className="aplicacoes-counter">
                        <span className="aplicacoes-label">Aplicações:</span>
                        <div className="counter-controls">
                          <button
                            className="counter-btn counter-minus"
                            onClick={() => onDecrementAplicacoes(spell.id, aprimoramento.id)}
                            disabled={
                              (aprimoramentoApplications[
                                `${spell.id}-${aprimoramento.id}`
                              ] || 0) <= 0
                            }
                          >
                            −
                          </button>
                          <span className="counter-value">
                            {aprimoramentoApplications[`${spell.id}-${aprimoramento.id}`] || 0}
                          </span>
                          <button
                            className="counter-btn counter-plus"
                            onClick={() => onIncrementAplicacoes(spell.id, aprimoramento.id)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="item-menu-container">
                    <button
                      className="item-menu-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleMenu(`aprimoramento-${aprimoramento.id}`, e);
                      }}
                    >
                      ⋮
                    </button>
                    {openMenuId === `aprimoramento-${aprimoramento.id}` && (
                      <div className="item-menu-dropdown">
                        <button
                          className="menu-option"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCloseMenu();
                            // Edit mode is already enabled in spell details
                          }}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          className="menu-option delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveAprimoramento(spell.id, aprimoramento.id);
                            onCloseMenu();
                          }}
                        >
                          🗑️ Deletar
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="aprimoramento-description">
                  <label>Descrição:</label>
                  <textarea
                    value={aprimoramento.descricao}
                    onChange={(e) =>
                      onUpdateAprimoramento(
                        spell.id,
                        aprimoramento.id,
                        'descricao',
                        e.target.value
                      )
                    }
                    className="aprimoramento-textarea"
                    placeholder="Descrição do aprimoramento..."
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-aprimoramentos">
            <p>Nenhum aprimoramento adicionado ainda.</p>
          </div>
        )}

        <button
          className="btn-add-aprimoramento"
          onClick={() => onAddAprimoramento(spell.id)}
        >
          + Adicionar Aprimoramento
        </button>
      </div>
    </>
  );
};

export default SpellDetails;
