import { Modal } from '../modal';

interface BackpackItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  slots: number;
  price?: number;
  category?: string;
  type?: string;
  
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

interface ItemDetailsModalProps {
  item: BackpackItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (itemId: string) => void;
  onDelete?: (itemId: string) => void;
  onMoveToChest?: (itemId: string) => void;
  onSell?: (itemId: string) => void;
  onConsume?: (itemId: string) => void;
  isConsumable?: boolean;
}

const ItemDetailsModal = ({
  item,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onMoveToChest,
  onSell,
  onConsume,
  isConsumable = false
}: ItemDetailsModalProps) => {
  if (!item) return null;

  // Debug: Log item data to console
  if (isOpen) {
    console.log('📦 Item Details Modal - Item data:', {
      name: item.name,
      category: item.category,
      attack_roll: item.attack_roll,
      damage: item.damage,
      crit: item.crit,
      range: item.range,
      damage_type: item.damage_type,
      armor_bonus: item.armor_bonus,
      armor_penalty: item.armor_penalty,
      effect: item.effect,
    });
  }

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

  const handleMoveToChest = () => {
    if (onMoveToChest) {
      onMoveToChest(item.id);
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
      <div className="item-details-modal">
        <div className="item-details-content">
          <div className="item-detail-row">
            <span className="item-detail-label">Descrição:</span>
            <p className="item-detail-value item-detail-description">
              {item.description || 'Sem descrição'}
            </p>
          </div>

          <div className="item-details-grid">
            <div className="item-detail-row">
              <span className="item-detail-label">Categoria:</span>
              <span className="item-detail-value">{item.category || '-'}</span>
            </div>

            <div className="item-detail-row">
              <span className="item-detail-label">Tipo:</span>
              <span className="item-detail-value">{item.type || '-'}</span>
            </div>

            <div className="item-detail-row">
              <span className="item-detail-label">Quantidade:</span>
              <span className="item-detail-value">{item.quantity}</span>
            </div>

            <div className="item-detail-row">
              <span className="item-detail-label">Slots:</span>
              <span className="item-detail-value">{item.slots}</span>
            </div>

            <div className="item-detail-row">
              <span className="item-detail-label">Preço:</span>
              <span className="item-detail-value">
                {item.price ? `${item.price} T$P` : '-'}
              </span>
            </div>
          </div>

          {/* Campos específicos para ARMAS */}
          {item.category === 'weapon' && (
            <div className="item-specific-section item-weapon-section">
              <h3 className="item-specific-title">
                <span className="section-icon">⚔️</span>
                Propriedades da Arma
              </h3>
              <div className="item-details-grid">
                {item.attack_roll && (
                  <div className="item-detail-row">
                    <span className="item-detail-label">Rolagem de Ataque:</span>
                    <span className="item-detail-value">{item.attack_roll}</span>
                  </div>
                )}
                {item.damage && (
                  <div className="item-detail-row">
                    <span className="item-detail-label">Dano:</span>
                    <span className="item-detail-value">{item.damage}</span>
                  </div>
                )}
                {item.crit && (
                  <div className="item-detail-row">
                    <span className="item-detail-label">Crítico:</span>
                    <span className="item-detail-value">{item.crit}</span>
                  </div>
                )}
                {item.range && (
                  <div className="item-detail-row">
                    <span className="item-detail-label">Alcance:</span>
                    <span className="item-detail-value">{item.range}</span>
                  </div>
                )}
                {item.damage_type && (
                  <div className="item-detail-row">
                    <span className="item-detail-label">Tipo de Dano:</span>
                    <span className="item-detail-value">{item.damage_type}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Campos específicos para ARMADURA */}
          {item.category === 'armor' && (
            <div className="item-specific-section item-armor-section">
              <h3 className="item-specific-title">
                <span className="section-icon">🛡️</span>
                Propriedades da Armadura
              </h3>
              <div className="item-details-grid">
                {item.armor_bonus !== undefined && item.armor_bonus !== null && (
                  <div className="item-detail-row">
                    <span className="item-detail-label">Bônus de Armadura:</span>
                    <span className="item-detail-value">
                      {item.armor_bonus > 0 ? `+${item.armor_bonus}` : item.armor_bonus}
                    </span>
                  </div>
                )}
                {item.armor_penalty !== undefined && item.armor_penalty !== null && (
                  <div className="item-detail-row">
                    <span className="item-detail-label">Penalidade de Armadura:</span>
                    <span className="item-detail-value">
                      {item.armor_penalty > 0 ? `+${item.armor_penalty}` : item.armor_penalty}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Campos específicos para CONSUMÍVEIS */}
          {isConsumable && item.effect && (
            <div className="item-specific-section item-consumable-section">
              <h3 className="item-specific-title">
                <span className="section-icon">✨</span>
                Propriedades do Consumível
              </h3>
              <div className="item-detail-row item-effect-section">
                <span className="item-detail-label">Efeito:</span>
                <p className="item-detail-value item-detail-effect">{item.effect}</p>
              </div>
            </div>
          )}
        </div>

        <div className="item-details-actions">
          <h3 className="item-details-actions-title">Ações</h3>
          <div className="item-details-actions-buttons">
            {onEdit && (
              <button 
                className="item-details-action-btn item-details-action-edit"
                onClick={handleEdit}
                title="Editar"
              >
                <span className="action-icon">✏️</span>
                <span className="action-label">Editar</span>
              </button>
            )}

            {onDelete && (
              <button 
                className="item-details-action-btn item-details-action-delete"
                onClick={handleDelete}
                title="Deletar"
              >
                <span className="action-icon">🗑️</span>
                <span className="action-label">Deletar</span>
              </button>
            )}

            {onMoveToChest && (
              <button 
                className="item-details-action-btn item-details-action-move"
                onClick={handleMoveToChest}
                title="Mover para Baú do Grupo"
              >
                <span className="action-icon">📦</span>
                <span className="action-label">Mover para Baú</span>
              </button>
            )}

            {onSell && (
              <button 
                className="item-details-action-btn item-details-action-sell"
                onClick={handleSell}
                title="Vender"
              >
                <span className="action-icon">💰</span>
                <span className="action-label">Vender</span>
              </button>
            )}

            {isConsumable && onConsume && (
              <button 
                className="item-details-action-btn item-details-action-consume"
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

export default ItemDetailsModal;

