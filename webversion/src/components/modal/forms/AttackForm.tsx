import { useState } from 'react';

export interface AttackFormData {
  name: string;
  type: string;
  testeAtaque: string;
  damage: string;
  critico: string;
  range: string;
  description: string;
}

interface AttackFormProps {
  onSubmit: (data: AttackFormData) => void;
  onCancel: () => void;
  initialData?: Partial<AttackFormData>;
}

const AttackForm = ({ onSubmit, onCancel, initialData }: AttackFormProps) => {
  const [formData, setFormData] = useState<AttackFormData>({
    name: initialData?.name || '',
    type: initialData?.type || 'Corpo a Corpo',
    testeAtaque: initialData?.testeAtaque || '',
    damage: initialData?.damage || '',
    critico: initialData?.critico || '20',
    range: initialData?.range || '',
    description: initialData?.description || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="modal-form" onSubmit={handleSubmit}>
      <div className="modal-form-group">
        <label className="modal-form-label" htmlFor="name">Nome do Ataque *</label>
        <input
          id="name"
          name="name"
          type="text"
          className="modal-form-input"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Ex: Espada Longa"
        />
      </div>

      <div className="modal-form-row modal-form-row-2">
        <div className="modal-form-group">
          <label className="modal-form-label" htmlFor="type">Tipo *</label>
          <select
            id="type"
            name="type"
            className="modal-form-select"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="Corpo a Corpo">Corpo a Corpo</option>
            <option value="Distância">Distância</option>
            <option value="Arremesso">Arremesso</option>
          </select>
        </div>

        <div className="modal-form-group">
          <label className="modal-form-label" htmlFor="testeAtaque">Teste de Ataque *</label>
          <input
            id="testeAtaque"
            name="testeAtaque"
            type="text"
            className="modal-form-input"
            value={formData.testeAtaque}
            onChange={handleChange}
            required
            placeholder="Ex: +8"
          />
        </div>
      </div>

      <div className="modal-form-row modal-form-row-3">
        <div className="modal-form-group">
          <label className="modal-form-label" htmlFor="damage">Dano *</label>
          <textarea
            id="damage"
            name="damage"
            className="modal-form-textarea modal-form-textarea-small"
            value={formData.damage}
            onChange={handleChange}
            required
            placeholder="Ex: 1d8+4"
          />
        </div>

        <div className="modal-form-group">
          <label className="modal-form-label" htmlFor="critico">Crítico</label>
          <textarea
            id="critico"
            name="critico"
            className="modal-form-textarea modal-form-textarea-small"
            value={formData.critico}
            onChange={handleChange}
            placeholder="Ex: 19-20"
          />
        </div>

        <div className="modal-form-group">
          <label className="modal-form-label" htmlFor="range">Alcance</label>
          <textarea
            id="range"
            name="range"
            className="modal-form-textarea modal-form-textarea-small"
            value={formData.range}
            onChange={handleChange}
            placeholder="Ex: 6m"
          />
        </div>
      </div>

      <div className="modal-form-group">
        <label className="modal-form-label" htmlFor="description">Descrição</label>
        <textarea
          id="description"
          name="description"
          className="modal-form-textarea"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descreva efeitos especiais, propriedades do ataque, etc."
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
          Salvar Ataque
        </button>
      </div>
    </form>
  );
};

export default AttackForm;

