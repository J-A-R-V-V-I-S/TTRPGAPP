import { useState } from 'react';

export interface AbilityFormData {
  name: string;
  type: 'ability' | 'power';
  category: string;
  cost: string;
  description: string;
  prerequisites: string;
}

interface AbilityFormProps {
  onSubmit: (data: AbilityFormData) => void;
  onCancel: () => void;
  initialData?: Partial<AbilityFormData>;
  defaultType?: 'ability' | 'power';
}

const AbilityForm = ({ onSubmit, onCancel, initialData, defaultType = 'ability' }: AbilityFormProps) => {
  const [formData, setFormData] = useState<AbilityFormData>({
    name: initialData?.name || '',
    type: initialData?.type || defaultType,
    category: initialData?.category || (defaultType === 'ability' ? 'Geral' : ''),
    cost: initialData?.cost || '',
    description: initialData?.description || '',
    prerequisites: initialData?.prerequisites || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isAbility = formData.type === 'ability';

  return (
    <form className="modal-form" onSubmit={handleSubmit}>
      <div className="modal-form-group">
        <label className="modal-form-label" htmlFor="name">
          Nome {isAbility ? 'da Habilidade' : 'do Poder'} *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="modal-form-input"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder={isAbility ? "Ex: Ataque Furtivo" : "Ex: Telepatia"}
        />
      </div>

      <div className="modal-form-group">
        <label className="modal-form-label" htmlFor="category">Categoria</label>
        {isAbility ? (
          <input
            id="category"
            name="category"
            type="text"
            className="modal-form-input"
            value={formData.category}
            onChange={handleChange}
            placeholder="Ex: Classe, Raça, Geral"
          />
        ) : (
          <select
            id="category"
            name="category"
            className="modal-form-select"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Selecione o tipo de poder</option>
            <option value="Poderes de Combate">Poderes de Combate</option>
            <option value="Poderes de Destino">Poderes de Destino</option>
            <option value="Poderes de Magia">Poderes de Magia</option>
            <option value="Poderes Concedidos">Poderes Concedidos</option>
            <option value="Poderes da Tormenta">Poderes da Tormenta</option>
          </select>
        )}
      </div>

      <div className="modal-form-group">
        <label className="modal-form-label" htmlFor="cost">Custo / Uso</label>
        <input
          id="cost"
          name="cost"
          type="text"
          className="modal-form-input"
          value={formData.cost}
          onChange={handleChange}
          placeholder="Ex: 2 PM, 1x por dia, Ação Padrão"
        />
      </div>

      <div className="modal-form-group">
        <label className="modal-form-label" htmlFor="prerequisites">Pré-requisitos</label>
        <input
          id="prerequisites"
          name="prerequisites"
          type="text"
          className="modal-form-input"
          value={formData.prerequisites}
          onChange={handleChange}
          placeholder="Ex: Nível 5, Des 15"
        />
      </div>

      <div className="modal-form-group">
        <label className="modal-form-label" htmlFor="description">Descrição *</label>
        <textarea
          id="description"
          name="description"
          className="modal-form-textarea"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Descreva os efeitos e mecânicas..."
        />
      </div>

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
          Salvar {isAbility ? 'Habilidade' : 'Poder'}
        </button>
      </div>
    </form>
  );
};

export default AbilityForm;

