import { useState, useEffect } from 'react';
import { Modal, ItemForm } from '../modal';
import type { ItemFormData } from '../modal';
import ItemDetailsModal from './ItemDetailsModal';
import './backpack.css';

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

interface BackpackProps {
  maxCapacity?: number;
  currentLoad?: number;
  items?: BackpackItem[];
  onAddItem?: (item: Omit<BackpackItem, 'id'>) => void;
  onEditItem?: (itemId: string) => void;
  onDeleteItem?: (itemId: string) => void;
  onMoveToChest?: (itemId: string) => void;
  onSellItem?: (itemId: string) => void;
  onConsumeItem?: (itemId: string) => void;
  onMaxCapacityChange?: (newValue: number) => void;
  onUpdateItemQuantity?: (itemId: string, newQuantity: number) => void;
}

const Backpack = ({ 
  maxCapacity = 100,
  currentLoad = 0,
  items = [],
  onAddItem,
  onEditItem,
  onDeleteItem,
  onMoveToChest,
  onSellItem,
  onConsumeItem,
  onMaxCapacityChange,
  onUpdateItemQuantity
}: BackpackProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BackpackItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingMaxCapacity, setEditingMaxCapacity] = useState(false);
  const [tempMaxCapacity, setTempMaxCapacity] = useState(maxCapacity);
  const loadPercentage = (currentLoad / maxCapacity) * 100;
  const isOverloaded = currentLoad > maxCapacity;

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

  // Sync tempMaxCapacity with maxCapacity prop changes
  useEffect(() => {
    setTempMaxCapacity(maxCapacity);
  }, [maxCapacity]);

  // Handlers para itens de munição
  const handleAmmoItemIncrement = (item: BackpackItem) => {
    if (onUpdateItemQuantity) {
      onUpdateItemQuantity(item.id, item.quantity + 1);
    }
  };

  const handleAmmoItemDecrement = (item: BackpackItem) => {
    if (item.quantity > 0 && onUpdateItemQuantity) {
      onUpdateItemQuantity(item.id, item.quantity - 1);
    }
  };

  const handleAmmoItemClick = (item: BackpackItem, e: React.MouseEvent) => {
    // Verifica se o clique não foi em um botão
    const target = e.target as HTMLElement;
    if (!target.closest('.ammo-btn')) {
      setSelectedItem(item);
      setIsDetailsModalOpen(true);
    }
  };

  const handleMaxCapacityClick = () => {
    if (onMaxCapacityChange) {
      setEditingMaxCapacity(true);
      setTempMaxCapacity(maxCapacity);
    }
  };

  const handleMaxCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
    setTempMaxCapacity(value);
  };

  const handleMaxCapacityBlur = () => {
    if (onMaxCapacityChange && tempMaxCapacity !== maxCapacity) {
      onMaxCapacityChange(tempMaxCapacity);
    }
    setEditingMaxCapacity(false);
  };

  const handleMaxCapacityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (onMaxCapacityChange && tempMaxCapacity !== maxCapacity) {
        onMaxCapacityChange(tempMaxCapacity);
      }
      setEditingMaxCapacity(false);
    } else if (e.key === 'Escape') {
      setTempMaxCapacity(maxCapacity);
      setEditingMaxCapacity(false);
    }
  };

  const isConsumable = (item: BackpackItem) => {
    return item.category?.toLowerCase() === 'consumivel' ||
           item.category?.toLowerCase() === 'consumível' ||
           item.category?.toLowerCase() === 'consumable';
  };

  const handleAddItemClick = () => {
    setIsAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleItemSubmit = (data: ItemFormData) => {
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

  const handleItemClick = (item: BackpackItem) => {
    setSelectedItem(item);
    setIsDetailsModalOpen(true);
  };

  const handleDetailsModalClose = () => {
    setIsDetailsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="backpack-widget">
      <div className="backpack-container">
        {/* Header with quick access info */}
        <div className="backpack-header">
          <h2 className="backpack-title">Mochila</h2>
          
          <div className="backpack-stats">
            {/* Seção de munições - apenas itens dinâmicos */}
            {ammoItems.length > 0 && (
              <div className="ammo-stats">
                {ammoItems.map((item) => (
                <div 
                  key={item.id} 
                  className="ammo-item ammo-item-clickable"
                  onClick={(e) => handleAmmoItemClick(item, e)}
                  title="Clique para ver detalhes"
                >
                  <span className="ammo-icon">🎯</span>
                  <span className="ammo-label">{item.name}:</span>
                  <div className="ammo-controls">
                    <button 
                      className="ammo-btn ammo-btn-decrease" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAmmoItemDecrement(item);
                      }}
                      disabled={item.quantity === 0}
                    >
                      -
                    </button>
                    <span className="ammo-value">{item.quantity}</span>
                    <button 
                      className="ammo-btn ammo-btn-increase" 
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

            <div className="capacity-stats">
              <div className="capacity-bar-container">
                <div className="capacity-labels">
                  <span className="capacity-label">Carga</span>
                  <span className={`capacity-value ${isOverloaded ? 'overloaded' : ''}`}>
                    {currentLoad} / {editingMaxCapacity ? (
                      <input
                        type="number"
                        value={tempMaxCapacity}
                        onChange={handleMaxCapacityChange}
                        onBlur={handleMaxCapacityBlur}
                        onKeyDown={handleMaxCapacityKeyDown}
                        className="capacity-input"
                        min="0"
                        autoFocus
                      />
                    ) : (
                      <span 
                        onClick={handleMaxCapacityClick}
                        className={`capacity-max ${onMaxCapacityChange ? 'editable' : ''}`}
                        title={onMaxCapacityChange ? "Clique para editar" : ""}
                      >
                        {maxCapacity}
                      </span>
                    )}
                  </span>
                </div>
                <div className="capacity-bar">
                  <div 
                    className={`capacity-fill ${isOverloaded ? 'overloaded' : ''}`}
                    style={{ width: `${Math.min(loadPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items list */}
        <div className="backpack-items">
          {regularItems.length === 0 ? (
            <div className="empty-backpack">
              <span className="empty-icon">🎒</span>
              <p className="empty-text">Sua mochila está vazia</p>
            </div>
          ) : (
            <div className="items-table">
              <div className="items-header">
                <div className="item-col item-name-col">Nome</div>
                <div className="item-col item-description-col">Descrição</div>
                <div className="item-col item-category-col">Categoria</div>
                <div className="item-col item-price-col">Preço</div>
                <div className="item-col item-quantity-col">Quantidade</div>
                <div className="item-col item-slots-col">Slots/Un</div>
                <div className="item-col item-total-load-col">Carga Total</div>
              </div>
              <div className="items-body">
                {regularItems.map((item) => {
                  const totalLoad = item.quantity * item.slots;
                  return (
                    <div 
                      key={item.id} 
                      className="item-row item-row-clickable"
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="item-col item-name-col">{item.name}</div>
                      <div className="item-col item-description-col">{item.description || 'Sem descrição'}</div>
                      <div className="item-col item-category-col">{item.category || '-'}</div>
                      <div className="item-col item-price-col">{item.price ? `${item.price} T$P` : '-'}</div>
                      <div className="item-col item-quantity-col">{item.quantity}</div>
                      <div className="item-col item-slots-col">{item.slots}</div>
                      <div className="item-col item-total-load-col">{totalLoad}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="add-item-container">
            <button className="add-item-button" onClick={handleAddItemClick}>
              <span className="add-item-icon">+</span>
              <span className="add-item-text">Adicionar Item</span>
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={handleAddModalClose}
        title="Adicionar Item"
        size="medium"
      >
        <ItemForm
          onSubmit={handleItemSubmit}
          onCancel={handleAddModalClose}
        />
      </Modal>

      <ItemDetailsModal
        item={selectedItem}
        isOpen={isDetailsModalOpen}
        onClose={handleDetailsModalClose}
        onEdit={onEditItem}
        onDelete={onDeleteItem}
        onMoveToChest={onMoveToChest}
        onSell={onSellItem}
        onConsume={onConsumeItem}
        isConsumable={selectedItem ? isConsumable(selectedItem) : false}
      />
    </div>
  );
};

export default Backpack;

