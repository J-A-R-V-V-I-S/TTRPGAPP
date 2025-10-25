import { useState } from 'react';

export interface ChestItemFormData {
  name: string;
  description: string;
  quantity: number;
  slots_per_each: number;
  price: number;
  category: 'weapon' | 'armor' | 'ammo' | 'consumable' | 'misc' | '';
  
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

interface ChestItemFormProps {
  onSubmit: (data: ChestItemFormData) => void;
  onCancel: () => void;
  initialData?: Partial<ChestItemFormData>;
}

const ChestItemForm = ({ onSubmit, onCancel, initialData }: ChestItemFormProps) => {
  const [formData, setFormData] = useState<ChestItemFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    quantity: initialData?.quantity || 1,
    slots_per_each: initialData?.slots_per_each ?? 0,
    price: initialData?.price || 0,
    category: initialData?.category || '',
    
    // Weapon fields
    attack_roll: initialData?.attack_roll || '',
    damage: initialData?.damage || '',
    crit: initialData?.crit || '',
    range: initialData?.range || '',
    damage_type: initialData?.damage_type || '',
    
    // Armor fields
    armor_bonus: initialData?.armor_bonus,
    armor_penalty: initialData?.armor_penalty,
    
    // Consumable fields
    effect: initialData?.effect || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Converter para número se for um campo numérico
    if (name === 'quantity' || name === 'slots_per_each' || name === 'price' || name === 'armor_bonus' || name === 'armor_penalty') {
      const numValue = value === '' ? 0 : Number(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="modal-form" onSubmit={handleSubmit}>
      <div className="modal-form-group">
        <label className="modal-form-label" htmlFor="name">Nome do Item *</label>
        <input
          id="name"
          name="name"
          type="text"
          className="modal-form-input"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Ex: Poção de Cura"
        />
      </div>

      <div className="modal-form-group">
        <label className="modal-form-label" htmlFor="description">Descrição</label>
        <textarea
          id="description"
          name="description"
          className="modal-form-textarea"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descreva o item e seus efeitos (opcional)"
          rows={3}
        />
      </div>

      <div className="modal-form-row modal-form-row-2">
        <div className="modal-form-group">
          <label className="modal-form-label" htmlFor="category">Categoria *</label>
          <select
            id="category"
            name="category"
            className="modal-form-select"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Selecione...</option>
            <option value="weapon">Arma</option>
            <option value="armor">Armadura</option>
            <option value="ammo">Munição</option>
            <option value="consumable">Consumível</option>
            <option value="misc">Diversos</option>
          </select>
        </div>

        <div className="modal-form-group">
          <label className="modal-form-label" htmlFor="price">Preço (Peças de Ouro)</label>
          <input
            id="price"
            name="price"
            type="number"
            className="modal-form-input"
            value={formData.price}
            onChange={handleChange}
            min="0"
            placeholder="0"
          />
        </div>
      </div>

      <div className="modal-form-row modal-form-row-2">
        <div className="modal-form-group">
          <label className="modal-form-label" htmlFor="quantity">Quantidade *</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            className="modal-form-input"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="1"
            placeholder="1"
          />
        </div>

        <div className="modal-form-group">
          <label className="modal-form-label" htmlFor="slots_per_each">Slots por Unidade *</label>
          <input
            id="slots_per_each"
            name="slots_per_each"
            type="number"
            className="modal-form-input"
            value={formData.slots_per_each}
            onChange={handleChange}
            required
            min="0"
            placeholder="0"
          />
        </div>
      </div>

      {/* Campos específicos para ARMAS */}
      {formData.category === 'weapon' && (
        <>
          <div className="modal-form-divider">
            <span>Propriedades da Arma</span>
          </div>
          
          <div className="modal-form-row modal-form-row-2">
            <div className="modal-form-group">
              <label className="modal-form-label" htmlFor="attack_roll">Rolagem de Ataque</label>
              <input
                id="attack_roll"
                name="attack_roll"
                type="text"
                className="modal-form-input"
                value={formData.attack_roll}
                onChange={handleChange}
                placeholder="Ex: 1d20+5"
              />
            </div>

            <div className="modal-form-group">
              <label className="modal-form-label" htmlFor="damage">Dano</label>
              <input
                id="damage"
                name="damage"
                type="text"
                className="modal-form-input"
                value={formData.damage}
                onChange={handleChange}
                placeholder="Ex: 1d8+3"
              />
            </div>
          </div>

          <div className="modal-form-row modal-form-row-3">
            <div className="modal-form-group">
              <label className="modal-form-label" htmlFor="crit">Crítico</label>
              <input
                id="crit"
                name="crit"
                type="text"
                className="modal-form-input"
                value={formData.crit}
                onChange={handleChange}
                placeholder="Ex: 19-20/x2"
              />
            </div>

            <div className="modal-form-group">
              <label className="modal-form-label" htmlFor="range">Alcance</label>
              <input
                id="range"
                name="range"
                type="text"
                className="modal-form-input"
                value={formData.range}
                onChange={handleChange}
                placeholder="Ex: 9m, 30m"
              />
            </div>

            <div className="modal-form-group">
              <label className="modal-form-label" htmlFor="damage_type">Tipo de Dano</label>
              <input
                id="damage_type"
                name="damage_type"
                type="text"
                className="modal-form-input"
                value={formData.damage_type}
                onChange={handleChange}
                placeholder="Ex: Cortante, Perfurante"
              />
            </div>
          </div>
        </>
      )}

      {/* Campos específicos para ARMADURA */}
      {formData.category === 'armor' && (
        <>
          <div className="modal-form-divider">
            <span>Propriedades da Armadura</span>
          </div>
          
          <div className="modal-form-row modal-form-row-2">
            <div className="modal-form-group">
              <label className="modal-form-label" htmlFor="armor_bonus">Bônus de Armadura</label>
              <input
                id="armor_bonus"
                name="armor_bonus"
                type="number"
                className="modal-form-input"
                value={formData.armor_bonus || ''}
                onChange={handleChange}
                placeholder="Ex: +5"
              />
            </div>

            <div className="modal-form-group">
              <label className="modal-form-label" htmlFor="armor_penalty">Penalidade de Armadura</label>
              <input
                id="armor_penalty"
                name="armor_penalty"
                type="number"
                className="modal-form-input"
                value={formData.armor_penalty || ''}
                onChange={handleChange}
                placeholder="Ex: -2"
              />
            </div>
          </div>
        </>
      )}

      {/* Campos específicos para CONSUMÍVEIS */}
      {formData.category === 'consumable' && (
        <>
          <div className="modal-form-divider">
            <span>Propriedades do Consumível</span>
          </div>
          
          <div className="modal-form-group">
            <label className="modal-form-label" htmlFor="effect">Efeito</label>
            <textarea
              id="effect"
              name="effect"
              className="modal-form-textarea"
              value={formData.effect}
              onChange={handleChange}
              placeholder="Descreva o efeito do consumível ao ser usado"
              rows={3}
            />
          </div>
        </>
      )}

      <div className="modal-actions">
        <button 
          type="button" 
          className="modal-button modal-button-secondary"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          className="modal-button modal-button-primary"
        >
          Salvar Item
        </button>
      </div>
    </form>
  );
};

export default ChestItemForm;

