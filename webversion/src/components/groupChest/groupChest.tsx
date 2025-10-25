import { useState } from 'react';
import { Modal, ChestItemForm } from '../modal';
import type { ChestItemFormData } from '../modal';
import ChestItemDetailsModal from './ChestItemDetailsModal';
import './groupChest.css';

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

interface GroupChestProps {
  arrows?: number;
  bullets?: number;
  items?: ChestItem[];
  onAddItem?: (item: Omit<ChestItem, 'id'>) => void;
  onEditItem?: (itemId: string) => void;
  onDeleteItem?: (itemId: string) => void;
  onMoveToInventory?: (itemId: string) => void;
  onSellItem?: (itemId: string) => void;
  onConsumeItem?: (itemId: string) => void;
  onArrowsChange?: (newValue: number) => void;
  onBulletsChange?: (newValue: number) => void;
  onUpdateItemQuantity?: (itemId: string, newQuantity: number) => void;
}

const GroupChest = ({ 
  arrows = 0, 
  bullets = 0, 
  items = [],
  onAddItem,
  onEditItem,
  onDeleteItem,
  onMoveToInventory,
  onSellItem,
  onConsumeItem,
  onArrowsChange,
  onBulletsChange,
  onUpdateItemQuantity
}: GroupChestProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ChestItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleArrowsIncrement = () => {
    if (onArrowsChange) {
      onArrowsChange(arrows + 1);
    }
  };

  const handleArrowsDecrement = () => {
    if (onArrowsChange && arrows > 0) {
      onArrowsChange(arrows - 1);
    }
  };

  const handleBulletsIncrement = () => {
    if (onBulletsChange) {
      onBulletsChange(bullets + 1);
    }
  };

  const handleBulletsDecrement = () => {
    if (onBulletsChange && bullets > 0) {
      onBulletsChange(bullets - 1);
    }
  };

  const isConsumable = (item: ChestItem) => {
    return item.category?.toLowerCase() === 'consumable' ||
           item.category?.toLowerCase() === 'consumivel' || 
           item.category?.toLowerCase() === 'consumível';
  };

  const handleAddItemClick = () => {
    setIsAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleItemSubmit = (data: ChestItemFormData) => {
    if (onAddItem) {
      // Passar todos os dados do formulário, incluindo campos específicos da categoria
      onAddItem({
        name: data.name,
        description: data.description,
        quantity: data.quantity,
        slots: data.slots_per_each,
        price: data.price,
        category: data.category,
        // Campos específicos de armas
        attack_roll: data.attack_roll,
        damage: data.damage,
        crit: data.crit,
        range: data.range,
        damage_type: data.damage_type,
        // Campos específicos de armadura
        armor_bonus: data.armor_bonus,
        armor_penalty: data.armor_penalty,
        // Campos específicos de consumíveis
        effect: data.effect,
      } as any);
    }
    setIsAddModalOpen(false);
  };

  const handleItemClick = (item: ChestItem) => {
    setSelectedItem(item);
    setIsDetailsModalOpen(true);
  };

  const handleDetailsModalClose = () => {
    setIsDetailsModalOpen(false);
    setSelectedItem(null);
  };

  // Separar itens de munição dos demais itens
  const ammoItems = items.filter(item => 
    item.category?.toLowerCase() === 'ammo' || 
    item.category?.toLowerCase() === 'munição' ||
    item.category?.toLowerCase() === 'municao'
  );
  const regularItems = items.filter(item => 
    item.category?.toLowerCase() !== 'ammo' && 
    item.category?.toLowerCase() !== 'munição' &&
    item.category?.toLowerCase() !== 'municao'
  );

  // Handlers para itens de munição
  const handleAmmoItemIncrement = (item: ChestItem) => {
    if (onUpdateItemQuantity) {
      onUpdateItemQuantity(item.id, item.quantity + 1);
    }
  };

  const handleAmmoItemDecrement = (item: ChestItem) => {
    if (onUpdateItemQuantity && item.quantity > 0) {
      onUpdateItemQuantity(item.id, item.quantity - 1);
    }
  };

  const handleAmmoItemClick = (item: ChestItem, e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.chest-ammo-btn')) {
      setSelectedItem(item);
      setIsDetailsModalOpen(true);
    }
  };

  return (
    <div className="group-chest-widget">
      <div className="group-chest-container">
        {/* Header with quick access info */}
        <div className="group-chest-header">
          <h2 className="group-chest-title">Baú do Grupo</h2>
          
          <div className="group-chest-stats">
            {/* Seção de munições - apenas itens dinâmicos */}
            {ammoItems.length > 0 && (
              <div className="chest-ammo-stats">
                {ammoItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="chest-ammo-item chest-ammo-item-clickable"
                    onClick={(e) => handleAmmoItemClick(item, e)}
                    title="Clique para ver detalhes"
                  >
                    <span className="chest-ammo-icon">🎯</span>
                    <span className="chest-ammo-label">{item.name}:</span>
                    <div className="chest-ammo-controls">
                      <button 
                        className="chest-ammo-btn chest-ammo-btn-decrease" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAmmoItemDecrement(item);
                        }}
                        disabled={item.quantity === 0}
                      >
                        -
                      </button>
                      <span className="chest-ammo-value">{item.quantity}</span>
                      <button 
                        className="chest-ammo-btn chest-ammo-btn-increase" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAmmoItemIncrement(item);
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="chest-item-count">
              <span className="chest-count-label">Itens no Baú:</span>
              <span className="chest-count-value">{items.length}</span>
            </div>
          </div>
        </div>

        {/* Items list */}
        <div className="group-chest-items">
          {regularItems.length === 0 ? (
            <div className="empty-chest">
              <span className="empty-chest-icon">📦</span>
              <p className="empty-chest-text">O baú do grupo está vazio</p>
            </div>
          ) : (
            <div className="chest-items-table">
              <div className="chest-items-header">
                <div className="chest-item-col chest-item-name-col">Nome</div>
                <div className="chest-item-col chest-item-description-col">Descrição</div>
                <div className="chest-item-col chest-item-category-col">Categoria</div>
                <div className="chest-item-col chest-item-price-col">Preço</div>
                <div className="chest-item-col chest-item-quantity-col">Quantidade</div>
              </div>
              <div className="chest-items-body">
                {regularItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="chest-item-row chest-item-row-clickable"
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="chest-item-col chest-item-name-col">{item.name}</div>
                    <div className="chest-item-col chest-item-description-col">{item.description || 'Sem descrição'}</div>
                    <div className="chest-item-col chest-item-category-col">{item.category || '-'}</div>
                    <div className="chest-item-col chest-item-price-col">{item.price ? `${item.price} T$P` : '-'}</div>
                    <div className="chest-item-col chest-item-quantity-col">{item.quantity}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="chest-add-item-container">
            <button className="chest-add-item-button" onClick={handleAddItemClick}>
              <span className="chest-add-item-icon">+</span>
              <span className="chest-add-item-text">Adicionar Item ao Baú</span>
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={handleAddModalClose}
        title="Adicionar Item ao Baú"
        size="medium"
      >
        <ChestItemForm
          onSubmit={handleItemSubmit}
          onCancel={handleAddModalClose}
        />
      </Modal>

      <ChestItemDetailsModal
        item={selectedItem}
        isOpen={isDetailsModalOpen}
        onClose={handleDetailsModalClose}
        onEdit={onEditItem}
        onDelete={onDeleteItem}
        onMoveToInventory={onMoveToInventory}
        onSell={onSellItem}
        onConsume={onConsumeItem}
        isConsumable={selectedItem ? isConsumable(selectedItem) : false}
      />
    </div>
  );
};

export default GroupChest;

