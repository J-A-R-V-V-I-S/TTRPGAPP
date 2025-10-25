# Implementação de Detalhes Específicos por Categoria de Item

## Resumo

Adicionei funcionalidade completa para exibir campos específicos de cada categoria de item quando o modal de detalhes é aberto, tanto na **Mochila** quanto no **Baú do Grupo**.

## Categorias Suportadas

### 1. **Armas (weapon)** ⚔️
Campos específicos exibidos:
- Rolagem de Ataque (`attack_roll`)
- Dano (`damage`)
- Crítico (`crit`)
- Alcance (`range`)
- Tipo de Dano (`damage_type`)

### 2. **Armadura (armor)** 🛡️
Campos específicos exibidos:
- Bônus de Armadura (`armor_bonus`)
- Penalidade de Armadura (`armor_penalty`)

### 3. **Consumíveis (consumable)** ✨
Campos específicos exibidos:
- Efeito (`effect`)

### 4. **Munição (ammo)** 🎯
Não possui campos adicionais específicos além dos campos base.

### 5. **Diversos (misc)**
Não possui campos adicionais específicos além dos campos base.

## Arquivos Modificados

### 1. Backpack (Mochila)
- ✅ `webversion/src/components/backpack/ItemDetailsModal.tsx`
  - Atualizada interface `BackpackItem` com campos específicos
  - Adicionadas seções condicionais para exibir propriedades de cada categoria
  - Adicionados ícones específicos para cada tipo de item

- ✅ `webversion/src/components/backpack/backpack.tsx`
  - Atualizada interface `BackpackItem` para incluir novos campos
  - Mantém compatibilidade com o fluxo de adicionar itens

- ✅ `webversion/src/components/backpack/backpack.css`
  - Adicionados estilos para seções específicas (`.item-specific-section`)
  - Estilos específicos para armas (`.item-weapon-section`)
  - Estilos específicos para armadura (`.item-armor-section`)
  - Estilos específicos para consumíveis (`.item-consumable-section`)
  - Gradientes de cores diferentes para cada categoria

### 2. Group Chest (Baú do Grupo)
- ✅ `webversion/src/components/groupChest/ChestItemDetailsModal.tsx`
  - Atualizada interface `ChestItem` com campos específicos
  - Adicionadas seções condicionais para exibir propriedades de cada categoria
  - Adicionados ícones específicos para cada tipo de item

- ✅ `webversion/src/components/groupChest/groupChest.tsx`
  - Atualizada interface `ChestItem` para incluir novos campos

- ✅ `webversion/src/components/groupChest/groupChest.css`
  - Adicionados estilos para seções específicas (`.chest-item-specific-section`)
  - Estilos específicos para armas (`.chest-item-weapon-section`)
  - Estilos específicos para armadura (`.chest-item-armor-section`)
  - Estilos específicos para consumíveis (`.chest-item-consumable-section`)
  - Gradientes de cores diferentes para cada categoria

## Visual das Seções

### Armas (Vermelho)
```
⚔️ PROPRIEDADES DA ARMA
┌─────────────────────────────┐
│ Fundo: Gradiente Vermelho   │
│ Borda Esquerda: Vermelha    │
└─────────────────────────────┘
```

### Armadura (Azul)
```
🛡️ PROPRIEDADES DA ARMADURA
┌─────────────────────────────┐
│ Fundo: Gradiente Azul       │
│ Borda Esquerda: Azul        │
└─────────────────────────────┘
```

### Consumíveis (Verde)
```
✨ PROPRIEDADES DO CONSUMÍVEL
┌─────────────────────────────┐
│ Fundo: Gradiente Verde      │
│ Borda Esquerda: Verde       │
└─────────────────────────────┘
```

## Como Funciona

1. **Ao clicar em um item** na mochila ou baú do grupo, o modal de detalhes é aberto
2. **O modal verifica a categoria** do item (`item.category`)
3. **Exibe os campos básicos** (nome, descrição, quantidade, slots, preço, categoria)
4. **Exibe seção específica** baseada na categoria:
   - Se `category === 'weapon'`: mostra seção de armas com ícone ⚔️
   - Se `category === 'armor'`: mostra seção de armadura com ícone 🛡️
   - Se `category === 'consumable'`: mostra seção de consumível com ícone ✨
5. **Dentro de cada seção**, apenas os campos preenchidos são exibidos
6. **Ações disponíveis** são mostradas no final (Editar, Deletar, Mover, Vender, Consumir)

## Campos Base (Todos os Itens)
- Nome
- Descrição
- Categoria
- Tipo
- Quantidade
- Slots
- Preço

## Integração com ItemForm

O formulário de adicionar/editar item (`ItemForm.tsx`) já estava preparado para capturar todos esses campos específicos. A implementação atual:
- ✅ Captura campos de armas quando categoria = 'weapon'
- ✅ Captura campos de armadura quando categoria = 'armor'
- ✅ Captura campo de efeito quando categoria = 'consumable'

## Próximos Passos (Opcional)

Se desejar expandir a funcionalidade, pode considerar:

1. **Ações específicas por categoria**
   - Botão "Equipar" para armas e armaduras
   - Botão "Usar" para consumíveis

2. **Validações adicionais**
   - Verificar se campos obrigatórios de cada categoria estão preenchidos

3. **Visualização em lista**
   - Adicionar indicadores visuais na lista de itens baseado na categoria
   - Ícones específicos para cada tipo

4. **Filtros e ordenação**
   - Filtrar itens por categoria
   - Ordenar por tipo, preço, etc.

## Testando a Implementação

Para testar:

1. Adicione um item do tipo "Arma" com os campos específicos preenchidos
2. Clique no item para abrir o modal de detalhes
3. Verifique se a seção "Propriedades da Arma" aparece com fundo vermelho
4. Confirme que todos os campos preenchidos estão sendo exibidos
5. Repita para Armadura e Consumíveis

## Compatibilidade

- ✅ Retrocompatível com itens existentes que não possuem campos específicos
- ✅ Campos opcionais - apenas exibe se estiverem preenchidos
- ✅ Não quebra funcionalidade existente
- ✅ Funciona em Mochila e Baú do Grupo

