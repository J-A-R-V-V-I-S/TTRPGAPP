/**
 * AprimoramentoForm Component
 *
 * Extracted from combat.tsx (lines 965-1039) to eliminate code duplication
 * and improve component reusability.
 */

interface NewAprimoramentoData {
  custoAdicionalPM: number;
  reaplicavel: boolean;
  descricao: string;
}

interface AprimoramentoFormProps {
  isOpen: boolean;
  newAprimoramentoData: NewAprimoramentoData;
  onUpdateData: (data: Partial<NewAprimoramentoData>) => void;
  onCancel: () => void;
  onCreate: () => void;
}

const AprimoramentoForm = ({
  isOpen,
  newAprimoramentoData,
  onUpdateData,
  onCancel,
  onCreate,
}: AprimoramentoFormProps) => {
  if (!isOpen) return null;

  return (
    <div className="aprimoramento-modal-overlay">
      <div className="aprimoramento-modal">
        <div className="modal-header">
          <h3>Novo Aprimoramento</h3>
          <button className="modal-close-btn" onClick={onCancel}>
            ×
          </button>
        </div>

        <div className="modal-content">
          <div className="modal-field">
            <label>Custo Base (PM):</label>
            <input
              type="number"
              value={newAprimoramentoData.custoAdicionalPM}
              onChange={(e) =>
                onUpdateData({
                  custoAdicionalPM: parseInt(e.target.value) || 1,
                })
              }
              className="modal-input"
              min="1"
            />
          </div>

          <div className="modal-field">
            <label className="modal-checkbox-label">
              <input
                type="checkbox"
                checked={newAprimoramentoData.reaplicavel}
                onChange={(e) =>
                  onUpdateData({
                    reaplicavel: e.target.checked,
                  })
                }
                className="modal-checkbox"
              />
              Reaplicável (pode ser usado múltiplas vezes)
            </label>
          </div>

          <div className="modal-field">
            <label>Descrição:</label>
            <textarea
              value={newAprimoramentoData.descricao}
              onChange={(e) =>
                onUpdateData({
                  descricao: e.target.value,
                })
              }
              className="modal-textarea"
              placeholder="Descrição do aprimoramento..."
              rows={3}
            />
          </div>
        </div>

        <div className="modal-actions">
          <button className="modal-btn modal-cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button className="modal-btn modal-create" onClick={onCreate}>
            Criar Aprimoramento
          </button>
        </div>
      </div>
    </div>
  );
};

export default AprimoramentoForm;
