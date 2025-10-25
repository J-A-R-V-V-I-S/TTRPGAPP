import { useState } from 'react';
import type { TransactionType, TransactionCategory } from '../../../types/transaction';
import { TransactionTypeLabels, TransactionCategoryLabels } from '../../../types/transaction';

export interface TransactionFormData {
  type: TransactionType;
  category: TransactionCategory;
  amount_gold: number;
  amount_silver: number;
  amount_bronze: number;
  description: string;
}

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  onCancel: () => void;
  initialData?: Partial<TransactionFormData>;
}

const TransactionForm = ({ onSubmit, onCancel, initialData }: TransactionFormProps) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    type: initialData?.type || 'income',
    category: initialData?.category || 'other',
    amount_gold: initialData?.amount_gold || 0,
    amount_silver: initialData?.amount_silver || 0,
    amount_bronze: initialData?.amount_bronze || 0,
    description: initialData?.description || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Converter para número se for um campo numérico
    if (name === 'amount_gold' || name === 'amount_silver' || name === 'amount_bronze') {
      const numValue = value === '' ? 0 : Number(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que pelo menos um valor de moeda foi informado
    if (formData.amount_gold === 0 && formData.amount_silver === 0 && formData.amount_bronze === 0) {
      alert('Por favor, informe pelo menos um valor de moeda.');
      return;
    }
    
    onSubmit(formData);
  };

  // Filtrar categorias baseadas no tipo
  const getCategoriesForType = () => {
    if (formData.type === 'income') {
      return ['loot', 'reward', 'sale', 'other'] as TransactionCategory[];
    } else {
      return ['purchase', 'service', 'other'] as TransactionCategory[];
    }
  };

  const availableCategories = getCategoriesForType();

  return (
    <form className="modal-form" onSubmit={handleSubmit}>
      <div className="modal-form-row modal-form-row-2">
        <div className="modal-form-group">
          <label className="modal-form-label" htmlFor="type">Tipo de Transação *</label>
          <select
            id="type"
            name="type"
            className="modal-form-select"
            value={formData.type}
            onChange={handleChange}
            required
          >
            {(Object.keys(TransactionTypeLabels) as TransactionType[]).map(type => (
              <option key={type} value={type}>
                {TransactionTypeLabels[type]}
              </option>
            ))}
          </select>
        </div>

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
            {availableCategories.map(category => (
              <option key={category} value={category}>
                {TransactionCategoryLabels[category]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="modal-form-group">
        <label className="modal-form-label" htmlFor="description">Descrição *</label>
        <input
          id="description"
          name="description"
          type="text"
          className="modal-form-input"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Ex: Venda de espada, Recompensa da missão, etc."
        />
      </div>

      <div className="modal-form-divider">
        <span>Valores</span>
      </div>

      <div className="modal-form-row modal-form-row-3">
        <div className="modal-form-group">
          <label className="modal-form-label" htmlFor="amount_gold">
            Ouro (PO)
          </label>
          <input
            id="amount_gold"
            name="amount_gold"
            type="number"
            className="modal-form-input"
            value={formData.amount_gold}
            onChange={handleChange}
            min="0"
            placeholder="0"
          />
        </div>

        <div className="modal-form-group">
          <label className="modal-form-label" htmlFor="amount_silver">
            Prata (PP)
          </label>
          <input
            id="amount_silver"
            name="amount_silver"
            type="number"
            className="modal-form-input"
            value={formData.amount_silver}
            onChange={handleChange}
            min="0"
            placeholder="0"
          />
        </div>

        <div className="modal-form-group">
          <label className="modal-form-label" htmlFor="amount_bronze">
            Bronze (PC)
          </label>
          <input
            id="amount_bronze"
            name="amount_bronze"
            type="number"
            className="modal-form-input"
            value={formData.amount_bronze}
            onChange={handleChange}
            min="0"
            placeholder="0"
          />
        </div>
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
          {formData.type === 'income' ? 'Registrar Recebimento' : 'Registrar Gasto'}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;

