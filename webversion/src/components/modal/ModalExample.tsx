import { useState } from 'react';
import Modal from './modal';
import AttackForm from './forms/AttackForm';
import SpellForm from './forms/SpellForm';
import AbilityForm from './forms/AbilityForm';
import type { AttackFormData } from './forms/AttackForm';
import type { SpellFormData } from './forms/SpellForm';
import type { AbilityFormData } from './forms/AbilityForm';

/**
 * Componente de exemplo demonstrando como usar o Modal com diferentes formulários
 * 
 * Este exemplo pode ser usado como referência para implementar modais
 * em qualquer parte da aplicação.
 */
const ModalExample = () => {
  const [attackModalOpen, setAttackModalOpen] = useState(false);
  const [spellModalOpen, setSpellModalOpen] = useState(false);
  const [abilityModalOpen, setAbilityModalOpen] = useState(false);
  const [powerModalOpen, setPowerModalOpen] = useState(false);

  // Handlers para ataque
  const handleAttackSubmit = (data: AttackFormData) => {
    console.log('Novo ataque:', data);
    // Aqui você adicionaria a lógica para salvar o ataque
    // Por exemplo: addAttack(data);
    setAttackModalOpen(false);
  };

  // Handlers para magia
  const handleSpellSubmit = (data: SpellFormData) => {
    console.log('Nova magia:', data);
    // Aqui você adicionaria a lógica para salvar a magia
    // Por exemplo: addSpell(data);
    setSpellModalOpen(false);
  };

  // Handlers para habilidade
  const handleAbilitySubmit = (data: AbilityFormData) => {
    console.log('Nova habilidade:', data);
    // Aqui você adicionaria a lógica para salvar a habilidade
    // Por exemplo: addAbility(data);
    setAbilityModalOpen(false);
  };

  // Handlers para poder
  const handlePowerSubmit = (data: AbilityFormData) => {
    console.log('Novo poder:', data);
    // Aqui você adicionaria a lógica para salvar o poder
    // Por exemplo: addPower(data);
    setPowerModalOpen(false);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Exemplo de Modal Reutilizável</h1>
      <p>Clique nos botões abaixo para abrir os modais de exemplo:</p>
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setAttackModalOpen(true)}
          style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', cursor: 'pointer' }}
        >
          Adicionar Ataque
        </button>

        <button 
          onClick={() => setSpellModalOpen(true)}
          style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', cursor: 'pointer' }}
        >
          Adicionar Magia
        </button>

        <button 
          onClick={() => setAbilityModalOpen(true)}
          style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', cursor: 'pointer' }}
        >
          Adicionar Habilidade
        </button>

        <button 
          onClick={() => setPowerModalOpen(true)}
          style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', cursor: 'pointer' }}
        >
          Adicionar Poder
        </button>
      </div>

      {/* Modal de Ataque */}
      <Modal
        isOpen={attackModalOpen}
        onClose={() => setAttackModalOpen(false)}
        title="Adicionar Ataque"
        size="medium"
      >
        <AttackForm
          onSubmit={handleAttackSubmit}
          onCancel={() => setAttackModalOpen(false)}
        />
      </Modal>

      {/* Modal de Magia */}
      <Modal
        isOpen={spellModalOpen}
        onClose={() => setSpellModalOpen(false)}
        title="Adicionar Magia"
        size="large"
      >
        <SpellForm
          onSubmit={handleSpellSubmit}
          onCancel={() => setSpellModalOpen(false)}
        />
      </Modal>

      {/* Modal de Habilidade */}
      <Modal
        isOpen={abilityModalOpen}
        onClose={() => setAbilityModalOpen(false)}
        title="Adicionar Habilidade"
        size="medium"
      >
        <AbilityForm
          onSubmit={handleAbilitySubmit}
          onCancel={() => setAbilityModalOpen(false)}
          defaultType="ability"
        />
      </Modal>

      {/* Modal de Poder */}
      <Modal
        isOpen={powerModalOpen}
        onClose={() => setPowerModalOpen(false)}
        title="Adicionar Poder"
        size="medium"
      >
        <AbilityForm
          onSubmit={handlePowerSubmit}
          onCancel={() => setPowerModalOpen(false)}
          defaultType="power"
        />
      </Modal>
    </div>
  );
};

export default ModalExample;

