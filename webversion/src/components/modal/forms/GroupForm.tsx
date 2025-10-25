import { useState } from 'react';

// Interface baseada no schema do banco de dados
export interface GroupFormData {
  name: string;
  description?: string;
  gold?: number;
  silver?: number;
  bronze?: number;
}

interface GroupFormProps {
  onSubmit: (data: GroupFormData) => void;
  onCancel: () => void;
  initialData?: Partial<GroupFormData>;
}

const GroupForm = ({ onSubmit, onCancel, initialData }: GroupFormProps) => {
  const [formData, setFormData] = useState<GroupFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    gold: initialData?.gold || 0,
    silver: initialData?.silver || 0,
    bronze: initialData?.bronze || 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      const numValue = value === '' ? 0 : parseInt(value, 10);
      if (!isNaN(numValue)) {
        setFormData(prev => ({ ...prev, [name]: numValue }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação
    if (!formData.name.trim()) {
      alert('O nome do grupo é obrigatório!');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="group-form">
      {/* Nome do Grupo */}
      <div className="form-group">
        <label htmlFor="name">
          Nome do Grupo <span className="required">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ex: Companhia dos Destemidos"
          required
        />
      </div>

      {/* Descrição */}
      <div className="form-group">
        <label htmlFor="description">Descrição</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descreva seu grupo de aventureiros, objetivos, estilo de jogo..."
          rows={4}
        />
      </div>

      {/* Moeda inicial do grupo */}
      <div className="form-section">
        <h3 className="section-title">Moeda Inicial (Opcional)</h3>
        <p className="section-description">
          Adicione moedas iniciais ao caixa do grupo. Você pode deixar em branco para começar com 0.
        </p>

        <div className="currency-inputs">
          <div className="form-group">
            <label htmlFor="gold">🪙 Ouro</label>
            <input
              type="number"
              id="gold"
              name="gold"
              value={formData.gold}
              onChange={handleChange}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="silver">🥈 Prata</label>
            <input
              type="number"
              id="silver"
              name="silver"
              value={formData.silver}
              onChange={handleChange}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bronze">🥉 Bronze</label>
            <input
              type="number"
              id="bronze"
              name="bronze"
              value={formData.bronze}
              onChange={handleChange}
              placeholder="0"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Botões */}
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">
          Cancelar
        </button>
        <button type="submit" className="btn-submit">
          Criar Grupo
        </button>
      </div>
    </form>
  );
};

export default GroupForm;
