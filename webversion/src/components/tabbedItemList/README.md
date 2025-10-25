# TabbedItemList Component

## Descrição
Componente genérico reutilizável para exibir listas de itens com navegação por abas e painel de detalhes. Este componente elimina a duplicação de código entre diferentes páginas que precisam exibir listas tabulares com seleção de itens.

## Características
- **Sistema de Abas Configurável**: Define abas personalizadas com ícones e rótulos
- **Lista de Itens Dinâmica**: Exibe itens diferentes para cada aba
- **Painel de Detalhes**: Mostra informações detalhadas do item selecionado
- **Campos Customizáveis**: Configure quais campos mostrar para cada tipo de item
- **Botões de Ação**: Adicione botões de ação contextuais
- **Badges**: Exiba badges/etiquetas nos itens da lista
- **Temas de Cores**: Suporte para diferentes esquemas de cores (purple, orange)
- **Responsivo**: Design adaptável para diferentes tamanhos de tela

## Uso

### Exemplo Básico

```tsx
import TabbedItemList from '../../components/tabbedItemList/tabbedItemList';
import type { BaseItem, TabData } from '../../components/tabbedItemList/tabbedItemList';

type TabType = 'abilities' | 'powers';

interface Skill extends BaseItem {
  usage?: string;
  cooldown?: string;
  effect?: string;
}

const tabData: TabData<TabType, Skill> = {
  tabs: [
    { key: 'abilities', label: 'Habilidades', icon: '⚡' },
    { key: 'powers', label: 'Poderes', icon: '✨' }
  ],
  items: {
    abilities: [...],
    powers: [...]
  },
  getItemFields: (skill) => [
    { label: 'Uso', value: skill.usage },
    { label: 'Recarga', value: skill.cooldown },
    { label: 'Efeito', value: skill.effect, className: 'effect' }
  ],
  getItemBadge: (skill) => 
    skill.usage ? { value: skill.usage, className: 'usage' } : null,
  getActionButtons: (skill) => [
    {
      label: 'Usar Habilidade',
      onClick: () => handleUseSkill(skill),
      className: 'primary',
      show: skill.usage !== 'Passivo'
    }
  ],
  getNoSelectionMessage: (tabKey) => 
    `Selecione um item para ver os detalhes`
};

<TabbedItemList
  title="Habilidades e Poderes"
  tabData={tabData}
  defaultTab="abilities"
  colorScheme="purple"
/>
```

## Props

### TabbedItemListProps

| Prop | Tipo | Descrição | Obrigatório |
|------|------|-----------|-------------|
| `title` | `string` | Título da seção | Sim |
| `titleIcon` | `React.ReactNode` | Ícone do título | Não |
| `tabData` | `TabData<T, I>` | Configuração de abas e dados | Sim |
| `defaultTab` | `T` | Aba inicial ativa | Não |
| `containerClassName` | `string` | Classes CSS adicionais | Não |
| `colorScheme` | `'purple' \| 'orange'` | Esquema de cores | Não (padrão: 'purple') |

### TabData Interface

```tsx
interface TabData<T extends string, I extends BaseItem> {
  tabs: TabConfig<T>[];
  items: Record<T, I[]>;
  getItemFields: (item: I) => ItemField[];
  getItemBadge?: (item: I) => { value: string; className?: string } | null;
  getActionButtons?: (item: I, tabKey: T) => ActionButton[];
  noSelectionIcon?: React.ReactNode;
  getNoSelectionMessage?: (tabKey: T) => string;
}
```

## Variantes de Estilo

### Standalone
Para uso em páginas completas (como Skills):
```tsx
<TabbedItemList
  {...props}
  containerClassName="standalone"
/>
```

### Embedded
Para uso dentro de outras seções (como em Combat):
```tsx
<TabbedItemList
  {...props}
  colorScheme="orange"
/>
```

## Esquemas de Cores

- **purple** (padrão): Gradiente roxo/púrpura
- **orange**: Gradiente laranja/dourado

## Onde é Usado

1. **Skills Page** (`src/pages/skills/skills.tsx`): Página completa de Habilidades e Poderes
2. **Combat Page** (`src/pages/combat/combat.tsx`): Seção de Habilidades e Poderes dentro da página de Combate

## Benefícios da Refatoração

- ✅ Eliminou ~200 linhas de código duplicado
- ✅ Componente reutilizável para futuras funcionalidades
- ✅ Manutenção centralizada
- ✅ Tipagem TypeScript forte
- ✅ Funcionalidade preservada
- ✅ Estilos consistentes

