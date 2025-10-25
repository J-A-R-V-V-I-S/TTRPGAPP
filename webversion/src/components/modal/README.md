# Componente Modal Reutilizável

Um componente modal responsivo e reutilizável para formulários e conteúdo genérico.

## Características

- ✅ **Responsivo**: Ocupa 100% da largura em telas menores que 800px
- ✅ **Animações suaves**: Transições elegantes ao abrir/fechar
- ✅ **Acessível**: Suporte para tecla ESC e aria-labels
- ✅ **Flexível**: 3 tamanhos (small, medium, large)
- ✅ **Scroll inteligente**: Bloqueia scroll da página quando aberto
- ✅ **Formulários incluídos**: AttackForm, SpellForm e AbilityForm

## Uso Básico

```tsx
import { useState } from 'react';
import Modal from './components/modal/modal';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Abrir Modal
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Meu Modal"
        size="medium"
      >
        <p>Conteúdo do modal aqui...</p>
      </Modal>
    </>
  );
}
```

## Props do Modal

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `isOpen` | `boolean` | - | Controla se o modal está visível |
| `onClose` | `() => void` | - | Callback chamado ao fechar o modal |
| `title` | `string` | - | Título exibido no header do modal |
| `children` | `ReactNode` | - | Conteúdo do modal |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Tamanho do modal em telas grandes |
| `showCloseButton` | `boolean` | `true` | Exibe/oculta o botão X de fechar |

## Tamanhos

- **small**: max-width 400px (800px abaixo: 100%)
- **medium**: max-width 600px (800px abaixo: 100%)
- **large**: max-width 900px (800px abaixo: 100%)

## Usando com Formulários

### AttackForm - Adicionar Ataques

```tsx
import Modal from './components/modal/modal';
import AttackForm, { AttackFormData } from './components/modal/forms/AttackForm';

function CombatPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = (data: AttackFormData) => {
    console.log('Novo ataque:', data);
    // Salvar ataque...
    setModalOpen(false);
  };

  return (
    <Modal
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      title="Adicionar Ataque"
      size="medium"
    >
      <AttackForm
        onSubmit={handleSubmit}
        onCancel={() => setModalOpen(false)}
      />
    </Modal>
  );
}
```

### SpellForm - Adicionar Magias

```tsx
import Modal from './components/modal/modal';
import SpellForm, { SpellFormData } from './components/modal/forms/SpellForm';

function SpellsPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = (data: SpellFormData) => {
    console.log('Nova magia:', data);
    // Salvar magia...
    setModalOpen(false);
  };

  return (
    <Modal
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      title="Adicionar Magia"
      size="large"
    >
      <SpellForm
        onSubmit={handleSubmit}
        onCancel={() => setModalOpen(false)}
      />
    </Modal>
  );
}
```

### AbilityForm - Adicionar Habilidades e Poderes

```tsx
import Modal from './components/modal/modal';
import AbilityForm, { AbilityFormData } from './components/modal/forms/AbilityForm';

function SkillsPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = (data: AbilityFormData) => {
    console.log('Nova habilidade:', data);
    // Salvar habilidade...
    setModalOpen(false);
  };

  return (
    <Modal
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      title="Adicionar Habilidade"
      size="medium"
    >
      <AbilityForm
        onSubmit={handleSubmit}
        onCancel={() => setModalOpen(false)}
        defaultType="ability"
      />
    </Modal>
  );
}
```

## Editando Dados Existentes

Todos os formulários suportam `initialData` para edição:

```tsx
<AttackForm
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  initialData={{
    name: "Espada Longa",
    type: "Corpo a Corpo",
    damage: "1d8+4"
  }}
/>
```

## Criando Formulários Customizados

Você pode criar seus próprios formulários usando as classes CSS fornecidas:

```tsx
function CustomForm({ onSubmit, onCancel }) {
  return (
    <form className="modal-form" onSubmit={onSubmit}>
      <div className="modal-form-group">
        <label className="modal-form-label">Campo</label>
        <input className="modal-form-input" />
      </div>

      {/* Grid com 2 colunas */}
      <div className="modal-form-row modal-form-row-2">
        <div className="modal-form-group">
          <label className="modal-form-label">Campo 1</label>
          <input className="modal-form-input" />
        </div>
        <div className="modal-form-group">
          <label className="modal-form-label">Campo 2</label>
          <input className="modal-form-input" />
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
          Salvar
        </button>
      </div>
    </form>
  );
}
```

## Classes CSS Disponíveis

### Layout
- `.modal-form` - Container do formulário
- `.modal-form-group` - Grupo de campo (label + input)
- `.modal-form-row` - Grid para múltiplas colunas
- `.modal-form-row-2` - Grid com 2 colunas
- `.modal-form-row-3` - Grid com 3 colunas

### Elementos
- `.modal-form-label` - Label do campo
- `.modal-form-input` - Input de texto
- `.modal-form-select` - Select/dropdown
- `.modal-form-textarea` - Textarea

### Botões
- `.modal-button` - Botão base
- `.modal-button-primary` - Botão primário (azul)
- `.modal-button-secondary` - Botão secundário (cinza)
- `.modal-button-danger` - Botão de perigo (vermelho)
- `.modal-actions` - Container dos botões de ação

## Comportamento Responsivo

### Desktop (> 800px)
- Modal centralizado na tela
- Largura máxima baseada no tamanho escolhido
- Animação de slide up + fade in

### Mobile (≤ 800px)
- Modal ocupa 100% da largura
- Aparece da parte inferior da tela
- Grid de formulários vira coluna única
- Botões em coluna (full width)

## Exemplo Completo

Veja o arquivo `ModalExample.tsx` para um exemplo completo com todos os formulários.

