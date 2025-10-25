import { useState } from 'react';

export interface EtcFormData {
  name: string;
  description: string;
}

interface EtcFormProps {
  onSubmit: (data: EtcFormData) => void;
  onCancel: () => void;
  initialData?: Partial<EtcFormData>;
}

const EtcForm = ({ onSubmit, onCancel, initialData }: EtcFormProps) => {
  const [formData, setFormData] = useState<EtcFormData>({
    name: initialData?.name || '',
    description: initialData?.description || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        <label className="modal-form-label" htmlFor="name">
          Título *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="modal-form-input"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Digite o título"
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
          placeholder="Descreva o item..."
          style={{ minHeight: '150px' }}
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
          Salvar
        </button>
      </div>
    </form>
  );
};

export default EtcForm;

