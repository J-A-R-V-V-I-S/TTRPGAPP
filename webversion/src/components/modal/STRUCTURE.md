# Estrutura do Componente Modal

## 📁 Estrutura de Arquivos

```
src/components/modal/
│
├── modal.tsx                # Componente Modal principal
├── modal.css                # Estilos do Modal (responsivo)
├── index.ts                 # Exportações centralizadas
│
├── forms/                   # Formulários pré-construídos
│   ├── AttackForm.tsx       # Formulário para ataques
│   ├── SpellForm.tsx        # Formulário para magias
│   └── AbilityForm.tsx      # Formulário para habilidades/poderes
│
├── ModalExample.tsx         # Exemplo de uso completo
├── README.md                # Documentação completa
├── QUICK_START.md          # Guia rápido de uso
└── STRUCTURE.md            # Este arquivo
```

## 🎯 Arquitetura

### 1. Modal (Componente Base)

```
┌─────────────────────────────────────┐
│          modal-overlay              │  ← Fundo escuro
│  ┌───────────────────────────────┐  │
│  │     modal-container           │  │  ← Container do modal
│  │  ┌─────────────────────────┐  │  │
│  │  │    modal-header         │  │  │  ← Título + Botão X
│  │  ├─────────────────────────┤  │  │
│  │  │    modal-content        │  │  │  ← Conteúdo (scroll)
│  │  │                         │  │  │
│  │  │  {children}             │  │  │  ← Aqui vão os forms
│  │  │                         │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### 2. Formulários

Todos os formulários seguem a mesma estrutura:

```tsx
interface FormProps {
  onSubmit: (data: FormData) => void;     // Callback quando salva
  onCancel: () => void;                    // Callback quando cancela
  initialData?: Partial<FormData>;         // Dados para edição
}
```

**Estrutura interna dos formulários:**

```
┌─────────────────────────────────────┐
│  <form className="modal-form">      │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  modal-form-group           │   │  ← Campo individual
│  │  • label                    │   │
│  │  • input/select/textarea    │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  modal-form-row-2           │   │  ← Grid com 2 colunas
│  │  ┌────────┐  ┌────────┐     │   │
│  │  │ Campo1 │  │ Campo2 │     │   │
│  │  └────────┘  └────────┘     │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  modal-actions              │   │  ← Botões de ação
│  │  [Cancelar] [Salvar]        │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

## 🔄 Fluxo de Dados

### Adicionar Novo Item

```
Usuario clica "Adicionar"
         ↓
   setModalOpen(true)
         ↓
    Modal abre
         ↓
Usuario preenche form
         ↓
Usuario clica "Salvar"
         ↓
  onSubmit(data) é chamado
         ↓
Componente pai recebe data
         ↓
Componente pai adiciona ao estado
         ↓
   setModalOpen(false)
         ↓
    Modal fecha
```

### Editar Item Existente

```
Usuario clica "Editar" em um item
         ↓
setEditingItem(item)
setModalOpen(true)
         ↓
Modal abre com initialData
         ↓
Form preenche campos com initialData
         ↓
Usuario edita e salva
         ↓
onSubmit(data) é chamado
         ↓
Componente pai atualiza item no estado
         ↓
setModalOpen(false)
setEditingItem(null)
         ↓
Modal fecha
```

## 🎨 Classes CSS Principais

### Layout
| Classe | Descrição |
|--------|-----------|
| `.modal-overlay` | Fundo escuro overlay |
| `.modal-container` | Container principal do modal |
| `.modal-small/medium/large` | Tamanhos do modal |
| `.modal-header` | Cabeçalho (título + X) |
| `.modal-content` | Área de conteúdo com scroll |

### Formulários
| Classe | Descrição |
|--------|-----------|
| `.modal-form` | Container do formulário |
| `.modal-form-group` | Grupo label + input |
| `.modal-form-row` | Grid container |
| `.modal-form-row-2` | Grid 2 colunas |
| `.modal-form-row-3` | Grid 3 colunas |
| `.modal-form-label` | Label de campo |
| `.modal-form-input` | Input de texto |
| `.modal-form-select` | Select/dropdown |
| `.modal-form-textarea` | Textarea |

### Botões
| Classe | Descrição |
|--------|-----------|
| `.modal-actions` | Container dos botões |
| `.modal-button` | Botão base |
| `.modal-button-primary` | Botão primário (azul) |
| `.modal-button-secondary` | Botão secundário (cinza) |
| `.modal-button-danger` | Botão de perigo (vermelho) |

## 📱 Breakpoints Responsivos

### Desktop (> 800px)
```css
.modal-small { max-width: 400px; }
.modal-medium { max-width: 600px; }
.modal-large { max-width: 900px; }

/* Modal centralizado na tela */
/* Grid mantém múltiplas colunas */
```

### Mobile (≤ 800px)
```css
.modal-container {
  width: 100% !important;
  max-width: 100% !important;
  /* Aparece da parte inferior */
}

.modal-form-row-2,
.modal-form-row-3 {
  grid-template-columns: 1fr;
  /* Todos os grids viram coluna única */
}

.modal-actions {
  flex-direction: column-reverse;
  /* Botões em coluna, salvar no topo */
}
```

## 🎭 Estados e Comportamentos

### Estados do Modal
- **Fechado**: `display: none` (não renderizado)
- **Abrindo**: Animação `fadeIn` (overlay) + `slideUp` (container)
- **Aberto**: Scroll do body bloqueado
- **Fechando**: Animação reversa

### Formas de Fechar
1. **Clicar no X**: `onClick` do botão close
2. **Clicar fora**: `onClick` no overlay
3. **Pressionar ESC**: Event listener de teclado
4. **onClose prop**: Callback personalizado

### Interações do Formulário
- **Campos obrigatórios**: Marcados com `required`
- **Validação**: HTML5 native validation
- **Submit**: Previne default, chama `onSubmit`
- **Cancel**: Apenas fecha o modal

## 🔧 Extensibilidade

### Criar Novo Formulário

```tsx
// 1. Definir interface
export interface MyFormData {
  field1: string;
  field2: number;
}

// 2. Criar componente
const MyForm = ({ onSubmit, onCancel, initialData }: MyFormProps) => {
  const [formData, setFormData] = useState<MyFormData>({
    field1: initialData?.field1 || '',
    field2: initialData?.field2 || 0
  });

  // 3. Implementar handlers
  // 4. Renderizar usando classes CSS do modal
};

// 5. Exportar em index.ts
```

### Customizar Estilos

```css
/* Sobrescrever no seu CSS */
.modal-overlay {
  background-color: rgba(0, 0, 0, 0.8); /* Mais escuro */
}

.modal-button-primary {
  background-color: #10b981; /* Verde */
}
```

## 🚀 Performance

- **Lazy Loading**: Modal só renderiza quando `isOpen={true}`
- **Event Cleanup**: Listeners de ESC e scroll são removidos
- **CSS Animations**: Usando GPU (transform/opacity)
- **Scroll Virtual**: Apenas o conteúdo do modal tem scroll

## 🧪 Testing

```tsx
// Exemplo de teste
describe('Modal', () => {
  it('abre quando isOpen é true', () => {
    render(<Modal isOpen={true} onClose={jest.fn()} title="Test">Content</Modal>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('fecha ao clicar no X', () => {
    const onClose = jest.fn();
    render(<Modal isOpen={true} onClose={onClose} title="Test">Content</Modal>);
    fireEvent.click(screen.getByLabelText('Fechar modal'));
    expect(onClose).toHaveBeenCalled();
  });
});
```

## 📚 Próximos Passos

1. ✅ Modal base criado e funcional
2. ✅ Formulários de exemplo implementados
3. ✅ Documentação completa
4. ⬜ Adicionar testes unitários
5. ⬜ Adicionar animações personalizáveis
6. ⬜ Suporte a múltiplos modais empilhados
7. ⬜ Integração com gerenciamento de estado global

## 🤝 Contribuindo

Para adicionar novos formulários:

1. Crie o arquivo em `forms/YourForm.tsx`
2. Exporte em `index.ts`
3. Adicione documentação em `README.md`
4. Adicione exemplo em `ModalExample.tsx`

