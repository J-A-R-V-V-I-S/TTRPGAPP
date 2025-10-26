import { useState } from 'react';
import Modal from '../modal';
import { skillsApi } from '../../../services/api';
import { useCharacter } from '../../../contexts/CharacterContext';
import { useAttributes } from '../../../contexts/AttributesContext';
import type { AttributeName } from '../../../types/types';
import './AddCraftModal.css';

interface AddCraftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddCraftModal = ({ isOpen, onClose }: AddCraftModalProps) => {
  const { character } = useCharacter();
  const { refreshSkills } = useAttributes();
  const [craftName, setCraftName] = useState('');
  const [selectedAttribute, setSelectedAttribute] = useState<AttributeName>('inteligência');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const attributes: Array<{ value: AttributeName; label: string }> = [
    { value: 'força', label: 'Força' },
    { value: 'destreza', label: 'Destreza' },
    { value: 'constituição', label: 'Constituição' },
    { value: 'inteligência', label: 'Inteligência' },
    { value: 'sabedoria', label: 'Sabedoria' },
    { value: 'carisma', label: 'Carisma' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!craftName.trim()) {
      setError('Nome do ofício é obrigatório');
      return;
    }

    if (!character?.id) {
      setError('Personagem não encontrado');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Calcular half_level baseado no nível do personagem
      const halfLevel = Math.floor((character.level || 1) / 2);

      // Criar a skill/ofício (usando formato do banco de dados - snake_case)
      const skillData: any = {
        character_id: character.id,
        name: craftName.trim(),
        attribute: selectedAttribute,
        is_trained: false,
        only_trained: false,
        armor_penalty: false,
        half_level: halfLevel,
        trained_bonus: 0,
        others: 0,
      };

      await skillsApi.createSkill(skillData);

      // Atualizar a lista de skills
      await refreshSkills();

      // Limpar formulário e fechar modal
      setCraftName('');
      setSelectedAttribute('inteligência');
      onClose();
    } catch (err) {
      console.error('Erro ao criar ofício:', err);
      setError('Erro ao criar ofício. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setCraftName('');
      setSelectedAttribute('inteligência');
      setError(null);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Adicionar Ofício"
      size="small"
    >
      <form onSubmit={handleSubmit} className="add-craft-form">
        <div className="form-group">
          <label htmlFor="craftName" className="form-label">
            Nome do Ofício
          </label>
          <input
            type="text"
            id="craftName"
            value={craftName}
            onChange={(e) => setCraftName(e.target.value)}
            placeholder="Ex: Carpintaria, Alquimia, Culinária..."
            className="form-input"
            disabled={isLoading}
            maxLength={50}
          />
        </div>

        <div className="form-group">
          <label htmlFor="attribute" className="form-label">
            Atributo Base
          </label>
          <select
            id="attribute"
            value={selectedAttribute}
            onChange={(e) => setSelectedAttribute(e.target.value as AttributeName)}
            className="form-select"
            disabled={isLoading}
          >
            {attributes.map(attr => (
              <option key={attr.value} value={attr.value}>
                {attr.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={handleClose}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || !craftName.trim()}
          >
            {isLoading ? 'Criando...' : 'Criar Ofício'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCraftModal;
