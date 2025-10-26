import { useState } from 'react';

// Interface baseada exatamente no schema do banco de dados
export interface NoteFormData {
  title?: string;
  content: string;
  category?: 'Quest' | 'NPC' | 'Location' | 'Lore' | 'Combat' | 'General';
  tags?: string[];
  is_pinned?: boolean;
}

interface NoteFormProps {
  onSubmit: (data: NoteFormData) => void;
  onCancel: () => void;
  initialData?: Partial<NoteFormData>;
}

const NoteForm = ({ onSubmit, onCancel, initialData }: NoteFormProps) => {
  const [formData, setFormData] = useState<NoteFormData>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    category: initialData?.category,
    tags: initialData?.tags || [],
    is_pinned: initialData?.is_pinned || false,
  });

  const [tagInput, setTagInput] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.tags?.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), trimmedTag],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || [],
    }));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação
    if (!formData.content.trim()) {
      alert('O conteúdo da anotação é obrigatório!');
      return;
    }

    // Limpar campos vazios antes de enviar
    const dataToSubmit: NoteFormData = {
      content: formData.content.trim(),
    };

    if (formData.title?.trim()) {
      dataToSubmit.title = formData.title.trim();
    }

      if (formData.category) {
        dataToSubmit.category = formData.category;
      }

    if (formData.tags && formData.tags.length > 0) {
      dataToSubmit.tags = formData.tags;
    }

    if (formData.is_pinned) {
      dataToSubmit.is_pinned = formData.is_pinned;
    }

    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="note-form">
      {/* Título */}
      <div className="form-group">
        <label htmlFor="title">Título (opcional)</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Ex: Pista importante sobre o vilão"
        />
      </div>

      {/* Conteúdo */}
      <div className="form-group">
        <label htmlFor="content">Conteúdo *</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Escreva o conteúdo da sua anotação aqui..."
          rows={6}
          required
        />
      </div>

      {/* Categoria */}
      <div className="form-group">
        <label htmlFor="category">Categoria</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="">Selecione uma categoria</option>
          <option value="Quest">Missão (Quest)</option>
          <option value="NPC">Personagem (NPC)</option>
          <option value="Location">Localização</option>
          <option value="Lore">História/Lore</option>
          <option value="Combat">Combate</option>
          <option value="General">Geral</option>
        </select>
      </div>

      {/* Tags */}
      <div className="form-group">
        <label htmlFor="tags">Tags</label>
        <div className="tags-input-container">
          <input
            type="text"
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder="Digite uma tag e pressione Enter"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="add-tag-button"
          >
            + Adicionar
          </button>
        </div>
        
        {formData.tags && formData.tags.length > 0 && (
          <div className="tags-list">
            {formData.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="remove-tag-button"
                  aria-label={`Remover tag ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Fixar */}
      <div className="form-group checkbox-group">
        <label htmlFor="is_pinned">
          <input
            type="checkbox"
            id="is_pinned"
            name="is_pinned"
            checked={formData.is_pinned}
            onChange={handleChange}
          />
          <span>📌 Fixar esta anotação</span>
        </label>
      </div>

      {/* Botões */}
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">
          Cancelar
        </button>
        <button type="submit" className="btn-submit">
          {initialData ? 'Atualizar' : 'Adicionar'} Anotação
        </button>
      </div>
    </form>
  );
};

export default NoteForm;

