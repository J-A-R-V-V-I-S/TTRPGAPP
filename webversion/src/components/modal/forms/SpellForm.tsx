import { useState } from 'react';

export interface SpellFormData {
  name: string;
  escola: string;
  circulo: string;
  execucao: string;
  alcance: string;
  area: string;
  duracao: string;
  resistencia: string;
  efeito: string;
}

interface SpellFormProps {
  onSubmit: (data: SpellFormData) => void;
  onCancel: () => void;
  initialData?: Partial<SpellFormData>;
}

const SpellForm = ({ onSubmit, onCancel, initialData }: SpellFormProps) => {
  const [formData, setFormData] = useState<SpellFormData>({
    name: initialData?.name || '',
    escola: initialData?.escola || 'Abjuração',
    circulo: initialData?.circulo || '1',
    execucao: initialData?.execucao || '1 ação padrão',
    alcance: initialData?.alcance || 'Toque',
    area: initialData?.area || 'Pessoal',
    duracao: initialData?.duracao || 'Instantânea',
    resistencia: initialData?.resistencia || 'Nenhuma',
    efeito: initialData?.efeito || ''
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
        <label className="modal-form-label" htmlFor="name">Nome da Magia *</label>
        <input
          id="name"
          name="name"
          type="text"
          className="modal-form-input"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Ex: Bola de Fogo"
        />
      </div>

      <div className="modal-form-row modal-form-row-2">
        <div className="modal-form-group">
          <label className="modal-form-label" htmlFor="escola">Escola *</label>
          <select
            id="escola"
            name="escola"
            className="modal-form-select"
            value={formData.escola}
            onChange={handleChange}
            required
          >
            <option value="Abjuração">Abjuração</option>
            <option value="Adivinhação">Adivinhação</option>
            <option value="Convocação">Convocação</option>
            <option value="Encantamento">Encantamento</option>
            <option value="Evocação">Evocação</option>
            <option value="Ilusão">Ilusão</option>
            <option value="Necromancia">Necromancia</option>
            <option value="Transmutação">Transmutação</option>
          </select>
        </div>

        <div className="modal-form-group">
          <label className="modal-form-label" htmlFor="circulo">Círculo *</label>
          <select
            id="circulo"
            name="circulo"
            className="modal-form-select"
            value={formData.circulo}
            onChange={handleChange}
            required
          >
            {[1, 2, 3, 4, 5].map(n => (
              <option key={n} value={n.toString()}>{n}º Círculo</option>
            ))}
          </select>
        </div>
      </div>

      <div className="modal-form-row modal-form-row-2">
        <div className="modal-form-group">
          <label className="modal-form-label" htmlFor="execucao">Execução *</label>
          <textarea
            id="execucao"
            name="execucao"
            className="modal-form-textarea modal-form-textarea-small"
            value={formData.execucao}
            onChange={handleChange}
            required
            placeholder="Ex: 1 ação padrão"
          />
        </div>

        <div className="modal-form-group">
          <label className="modal-form-label" htmlFor="alcance">Alcance *</label>
          <textarea
            id="alcance"
            name="alcance"
            className="modal-form-textarea modal-form-textarea-small"
            value={formData.alcance}
            onChange={handleChange}
            required
            placeholder="Ex: 30m"
          />
        </div>
      </div>

      <div className="modal-form-row modal-form-row-2">
        <div className="modal-form-group">
          <label className="modal-form-label" htmlFor="area">Área</label>
          <textarea
            id="area"
            name="area"
            className="modal-form-textarea modal-form-textarea-small"
            value={formData.area}
            onChange={handleChange}
            placeholder="Ex: Esfera de 6m de raio"
          />
        </div>

        <div className="modal-form-group">
          <label className="modal-form-label" htmlFor="duracao">Duração *</label>
          <textarea
            id="duracao"
            name="duracao"
            className="modal-form-textarea modal-form-textarea-small"
            value={formData.duracao}
            onChange={handleChange}
            required
            placeholder="Ex: Sustentada"
          />
        </div>
      </div>

      <div className="modal-form-group">
        <label className="modal-form-label" htmlFor="resistencia">Resistência</label>
        <textarea
          id="resistencia"
          name="resistencia"
          className="modal-form-textarea modal-form-textarea-small"
          value={formData.resistencia}
          onChange={handleChange}
          placeholder="Ex: Vontade parcial"
        />
      </div>

      <div className="modal-form-group">
        <label className="modal-form-label" htmlFor="efeito">Efeito *</label>
        <textarea
          id="efeito"
          name="efeito"
          className="modal-form-textarea"
          value={formData.efeito}
          onChange={handleChange}
          required
          placeholder="Descreva os efeitos da magia..."
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
          Salvar Magia
        </button>
      </div>
    </form>
  );
};

export default SpellForm;

