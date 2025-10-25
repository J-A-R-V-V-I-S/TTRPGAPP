# Guia Rápido de Uso do Modal

## 🚀 Início Rápido (3 passos)

### 1. Importar o Modal e o Formulário

```tsx
import { useState } from 'react';
import { Modal, AttackForm, AttackFormData } from '../../components/modal';
// Ou importar apenas o que você precisa:
// import Modal from '../../components/modal/modal';
// import AttackForm from '../../components/modal/forms/AttackForm';
```

### 2. Adicionar o Estado

```tsx
const [isModalOpen, setIsModalOpen] = useState(false);
```

### 3. Adicionar o Modal ao JSX

```tsx
<button onClick={() => setIsModalOpen(true)}>
  Adicionar Ataque
</button>

<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Adicionar Ataque"
  size="medium"
>
  <AttackForm
    onSubmit={(data) => {
      console.log(data);
      setIsModalOpen(false);
    }}
    onCancel={() => setIsModalOpen(false)}
  />
</Modal>
```

## 📝 Exemplos Práticos

### Integrar no Combat.tsx

```tsx
// No início do arquivo combat.tsx
import { Modal, AttackForm, AttackFormData } from '../../components/modal';

// Dentro do componente Combat
function Combat() {
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [attackModalOpen, setAttackModalOpen] = useState(false);

  const handleAddAttack = (data: AttackFormData) => {
    const newAttack: Attack = {
      id: `attack-${Date.now()}`,
      name: data.name,
      type: data.type,
      testeAtaque: data.testeAtaque,
      damage: data.damage,
      critico: data.critico,
      range: data.range,
      description: data.description
    };
    
    setAttacks([...attacks, newAttack]);
    setAttackModalOpen(false);
  };

  return (
    <div>
      {/* Seu código existente */}
      
      <button 
        className="add-item-button"
        onClick={() => setAttackModalOpen(true)}
      >
        + Adicionar Ataque
      </button>

      <Modal
        isOpen={attackModalOpen}
        onClose={() => setAttackModalOpen(false)}
        title="Adicionar Ataque"
        size="medium"
      >
        <AttackForm
          onSubmit={handleAddAttack}
          onCancel={() => setAttackModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
```

### Integrar Magia com Estado de Edição

```tsx
import { Modal, SpellForm, SpellFormData } from '../../components/modal';

function SpellsComponent() {
  const [spells, setSpells] = useState<Spell[]>([]);
  const [spellModalOpen, setSpellModalOpen] = useState(false);
  const [editingSpell, setEditingSpell] = useState<Spell | null>(null);

  const handleSaveSpell = (data: SpellFormData) => {
    if (editingSpell) {
      // Editando magia existente
      setSpells(spells.map(spell => 
        spell.id === editingSpell.id 
          ? { ...spell, ...data }
          : spell
      ));
    } else {
      // Adicionando nova magia
      const newSpell: Spell = {
        id: `spell-${Date.now()}`,
        ...data,
        prepared: false,
        aprimoramentos: []
      };
      setSpells([...spells, newSpell]);
    }
    
    setSpellModalOpen(false);
    setEditingSpell(null);
  };

  const handleEditSpell = (spell: Spell) => {
    setEditingSpell(spell);
    setSpellModalOpen(true);
  };

  return (
    <div>
      <button onClick={() => setSpellModalOpen(true)}>
        + Adicionar Magia
      </button>

      {spells.map(spell => (
        <div key={spell.id}>
          <span>{spell.name}</span>
          <button onClick={() => handleEditSpell(spell)}>
            Editar
          </button>
        </div>
      ))}

      <Modal
        isOpen={spellModalOpen}
        onClose={() => {
          setSpellModalOpen(false);
          setEditingSpell(null);
        }}
        title={editingSpell ? "Editar Magia" : "Adicionar Magia"}
        size="large"
      >
        <SpellForm
          onSubmit={handleSaveSpell}
          onCancel={() => {
            setSpellModalOpen(false);
            setEditingSpell(null);
          }}
          initialData={editingSpell || undefined}
        />
      </Modal>
    </div>
  );
}
```

### Múltiplos Modais na Mesma Página

```tsx
function CombatPage() {
  const [attackModalOpen, setAttackModalOpen] = useState(false);
  const [spellModalOpen, setSpellModalOpen] = useState(false);
  const [abilityModalOpen, setAbilityModalOpen] = useState(false);

  return (
    <div>
      {/* Botões */}
      <button onClick={() => setAttackModalOpen(true)}>+ Ataque</button>
      <button onClick={() => setSpellModalOpen(true)}>+ Magia</button>
      <button onClick={() => setAbilityModalOpen(true)}>+ Habilidade</button>

      {/* Modais */}
      <Modal isOpen={attackModalOpen} onClose={() => setAttackModalOpen(false)} title="Adicionar Ataque">
        <AttackForm onSubmit={handleAttackSubmit} onCancel={() => setAttackModalOpen(false)} />
      </Modal>

      <Modal isOpen={spellModalOpen} onClose={() => setSpellModalOpen(false)} title="Adicionar Magia" size="large">
        <SpellForm onSubmit={handleSpellSubmit} onCancel={() => setSpellModalOpen(false)} />
      </Modal>

      <Modal isOpen={abilityModalOpen} onClose={() => setAbilityModalOpen(false)} title="Adicionar Habilidade">
        <AbilityForm onSubmit={handleAbilitySubmit} onCancel={() => setAbilityModalOpen(false)} />
      </Modal>
    </div>
  );
}
```

## 🎨 Customização de Formulários

### Criar um Formulário Simples

```tsx
function SimpleForm({ onSubmit, onCancel }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  return (
    <form 
      className="modal-form" 
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ name, description });
      }}
    >
      <div className="modal-form-group">
        <label className="modal-form-label">Nome</label>
        <input 
          className="modal-form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="modal-form-group">
        <label className="modal-form-label">Descrição</label>
        <textarea 
          className="modal-form-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="modal-actions">
        <button type="button" className="modal-button modal-button-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="modal-button modal-button-primary">
          Salvar
        </button>
      </div>
    </form>
  );
}
```

## 📱 Comportamento Responsivo

- **Desktop (> 800px)**: Modal centralizado com largura limitada
- **Mobile (≤ 800px)**: Modal ocupa 100% da largura e aparece da parte inferior

Você não precisa fazer nada especial - o componente já é totalmente responsivo!

## 🔧 Dicas e Truques

### 1. Prevenir Fechamento Acidental

```tsx
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

<Modal
  isOpen={modalOpen}
  onClose={() => {
    if (hasUnsavedChanges) {
      if (confirm('Você tem alterações não salvas. Deseja sair?')) {
        setModalOpen(false);
      }
    } else {
      setModalOpen(false);
    }
  }}
  title="Formulário"
>
  {/* conteúdo */}
</Modal>
```

### 2. Modal sem Botão de Fechar

```tsx
<Modal
  isOpen={modalOpen}
  onClose={() => setModalOpen(false)}
  title="Carregando..."
  showCloseButton={false}
>
  <div>Por favor aguarde...</div>
</Modal>
```

### 3. Loading State

```tsx
function FormWithLoading() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await api.save(data);
      setModalOpen(false);
    } catch (error) {
      alert('Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Salvar">
      <form onSubmit={handleSubmit}>
        {/* campos */}
        <button disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </Modal>
  );
}
```

## 🌟 Ver Exemplo Completo

Acesse `/modal-example` no seu navegador para ver todos os modais em ação!

```
http://localhost:5173/modal-example
```

## 📦 Formulários Disponíveis

| Formulário | Para o quê? | Tamanho Recomendado |
|------------|-------------|---------------------|
| `AttackForm` | Ataques físicos e à distância | `medium` |
| `SpellForm` | Magias e feitiços | `large` |
| `AbilityForm` | Habilidades e poderes | `medium` |

## ❓ Problemas Comuns

### Modal não fecha ao clicar fora

✅ Certifique-se de que o `onClose` está setando o estado corretamente:

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)} // ✅ Correto
  // onClose={setIsOpen} // ❌ Incorreto
>
```

### Scroll não funciona no conteúdo

✅ O scroll já está implementado automaticamente. Se o conteúdo for maior que a altura disponível, um scroll aparecerá.

### Animação travada no mobile

✅ Certifique-se de que não há CSS conflitante com `overflow: hidden` no body.

