import { Modal } from '../modal';

interface ChestItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  slots?: number;
  price?: number;
  category?: string;
  
  // Campos específicos para armas (category = 'weapon')
  attack_roll?: string;
  damage?: string;
  crit?: string;
  range?: string;
  damage_type?: string;
  
  // Campos específicos para armadura (category = 'armor')
  armor_bonus?: number;
  armor_penalty?: number;
  
  // Campos específicos para consumíveis (category = 'consumable')
  effect?: string;
}

interface ChestItemDetailsModalProps {
  item: ChestItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (itemId: string) => void;
  onDelete?: (itemId: string) => void;
  onMoveToInventory?: (itemId: string) => void;
  onSell?: (itemId: string) => void;
  onConsume?: (itemId: string) => void;
  isConsumable?: boolean;
}

const ChestItemDetailsModal = ({
  item,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onMoveToInventory,
  onSell,
  onConsume,
  isConsumable = false
}: ChestItemDetailsModalProps) => {
  if (!item) return null;

  const handleEdit = () => {
    if (onEdit) {
      onEdit(item.id);
    }
    onClose();
  };

  const handleDelete = () => {
    if (onDelete && confirm(`Tem certeza que deseja deletar "${item.name}"?`)) {
      onDelete(item.id);
      onClose();
    }
  };

  const handleMoveToInventory = () => {
    if (onMoveToInventory) {
      onMoveToInventory(item.id);
      onClose();
    }
  };

  const handleSell = () => {
    if (onSell) {
      onSell(item.id);
      onClose();
    }
  };

  const handleConsume = () => {
    if (onConsume) {
      onConsume(item.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item.name}
      size="medium"
    >
      <div className="chest-item-details-modal">
        <div className="chest-item-details-content">
          <div className="chest-item-detail-row">
            <span className="chest-item-detail-label">Descrição:</span>
            <p className="chest-item-detail-value chest-item-detail-description">
              {item.description || 'Sem descrição'}
            </p>
          </div>

          <div className="chest-item-details-grid">
            <div className="chest-item-detail-row">
              <span className="chest-item-detail-label">Categoria:</span>
              <span className="chest-item-detail-value">{item.category || '-'}</span>
            </div>

            <div className="chest-item-detail-row">
              <span className="chest-item-detail-label">Quantidade:</span>
              <span className="chest-item-detail-value">{item.quantity}</span>
            </div>

            {item.slots !== undefined && (
              <div className="chest-item-detail-row">
                <span className="chest-item-detail-label">Slots:</span>
                <span className="chest-item-detail-value">{item.slots}</span>
              </div>
            )}

            <div className="chest-item-detail-row">
              <span className="chest-item-detail-label">Preço:</span>
              <span className="chest-item-detail-value">
                {item.price ? `${item.price} T$P` : '-'}
              </span>
            </div>
          </div>

          {/* Campos específicos para ARMAS */}
          {item.category === 'weapon' && (
            <div className="chest-item-specific-section chest-item-weapon-section">
              <h3 className="chest-item-specific-title">
                <span className="section-icon">⚔️</span>
                Propriedades da Arma
              </h3>
              <div className="chest-item-details-grid">
                {item.attack_roll && (
                  <div className="chest-item-detail-row">
                    <span className="chest-item-detail-label">Rolagem de Ataque:</span>
                    <span className="chest-item-detail-value">{item.attack_roll}</span>
                  </div>
                )}
                {item.damage && (
                  <div className="chest-item-detail-row">
                    <span className="chest-item-detail-label">Dano:</span>
                    <span className="chest-item-detail-value">{item.damage}</span>
                  </div>
                )}
                {item.crit && (
                  <div className="chest-item-detail-row">
                    <span className="chest-item-detail-label">Crítico:</span>
                    <span className="chest-item-detail-value">{item.crit}</span>
                  </div>
                )}
                {item.range && (
                  <div className="chest-item-detail-row">
                    <span className="chest-item-detail-label">Alcance:</span>
                    <span className="chest-item-detail-value">{item.range}</span>
                  </div>
                )}
                {item.damage_type && (
                  <div className="chest-item-detail-row">
                    <span className="chest-item-detail-label">Tipo de Dano:</span>
                    <span className="chest-item-detail-value">{item.damage_type}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Campos específicos para ARMADURA */}
          {item.category === 'armor' && (
            <div className="chest-item-specific-section chest-item-armor-section">
              <h3 className="chest-item-specific-title">
                <span className="section-icon">🛡️</span>
                Propriedades da Armadura
              </h3>
              <div className="chest-item-details-grid">
                {item.armor_bonus !== undefined && item.armor_bonus !== null && (
                  <div className="chest-item-detail-row">
                    <span className="chest-item-detail-label">Bônus de Armadura:</span>
                    <span className="chest-item-detail-value">
                      {item.armor_bonus > 0 ? `+${item.armor_bonus}` : item.armor_bonus}
                    </span>
                  </div>
                )}
                {item.armor_penalty !== undefined && item.armor_penalty !== null && (
                  <div className="chest-item-detail-row">
                    <span className="chest-item-detail-label">Penalidade de Armadura:</span>
                    <span className="chest-item-detail-value">
                      {item.armor_penalty > 0 ? `+${item.armor_penalty}` : item.armor_penalty}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Campos específicos para CONSUMÍVEIS */}
          {isConsumable && item.effect && (
            <div className="chest-item-specific-section chest-item-consumable-section">
              <h3 className="chest-item-specific-title">
                <span className="section-icon">✨</span>
                Propriedades do Consumível
              </h3>
              <div className="chest-item-detail-row chest-item-effect-section">
                <span className="chest-item-detail-label">Efeito:</span>
                <p className="chest-item-detail-value chest-item-detail-effect">{item.effect}</p>
              </div>
            </div>
          )}
        </div>

        <div className="chest-item-details-actions">
          <h3 className="chest-item-details-actions-title">Ações</h3>
          <div className="chest-item-details-actions-buttons">
            {onEdit && (
              <button 
                className="chest-item-details-action-btn chest-item-details-action-edit"
                onClick={handleEdit}
                title="Editar"
              >
                <span className="action-icon">✏️</span>
                <span className="action-label">Editar</span>
              </button>
            )}

            {onDelete && (
              <button 
                className="chest-item-details-action-btn chest-item-details-action-delete"
                onClick={handleDelete}
                title="Deletar"
              >
                <span className="action-icon">🗑️</span>
                <span className="action-label">Deletar</span>
              </button>
            )}

            {onMoveToInventory && (
              <button 
                className="chest-item-details-action-btn chest-item-details-action-move"
                onClick={handleMoveToInventory}
                title="Mover para Inventário"
              >
                <span className="action-icon">🎒</span>
                <span className="action-label">Mover para Inventário</span>
              </button>
            )}

            {onSell && (
              <button 
                className="chest-item-details-action-btn chest-item-details-action-sell"
                onClick={handleSell}
                title="Vender"
              >
                <span className="action-icon">💰</span>
                <span className="action-label">Vender</span>
              </button>
            )}

            {isConsumable && onConsume && (
              <button 
                className="chest-item-details-action-btn chest-item-details-action-consume"
                onClick={handleConsume}
                title="Consumir"
              >
                <span className="action-icon">🍎</span>
                <span className="action-label">Consumir</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ChestItemDetailsModal;

