# Sistema de Carga da Mochila - Implementação

## 📦 Visão Geral

Foi implementado um sistema automático de cálculo de carga para a mochila do personagem. O sistema calcula automaticamente quanto espaço está sendo usado baseado nos itens do inventário.

## 🎯 Como Funciona

### Cálculo Automático

A carga atual (`current_load`) é calculada automaticamente usando a fórmula:

```
current_load = Σ (quantidade × slots_per_each)
```

Para cada item no inventário:
- **quantidade**: Número de unidades do item
- **slots_per_each**: Quantos slots cada unidade do item ocupa

### Exemplo

Se o inventário contém:
- 3x Espada Longa (2 slots cada) = 6 slots
- 10x Poção de Cura (0.5 slots cada) = 5 slots  
- 1x Armadura Pesada (8 slots) = 8 slots

**Total de carga = 19 slots**

## ⚙️ Atualização Automática

O sistema atualiza a carga automaticamente sempre que:

1. ✅ **Um item é adicionado** ao inventário
2. ✅ **Um item é removido** do inventário
3. ✅ **A quantidade de um item é alterada** (aumentada ou diminuída)
4. ✅ **O personagem é carregado** pela primeira vez
5. ✅ **O inventário é atualizado** manualmente

## 🎨 Feedback Visual

A interface da mochila exibe:

### Indicador de Texto
```
Carga: 19 / 50
```
- **Primeiro número**: Carga atual calculada automaticamente
- **Segundo número**: Capacidade máxima (editável clicando)

### Barra de Progresso
- 🟢 **Verde**: Carga normal (abaixo da capacidade)
- 🔴 **Vermelho**: Sobrecarregado (acima da capacidade)
- ⚡ **Animação de pulso**: Quando sobrecarregado

### Exemplo Visual

```
Normal:     [████████░░░░░░░░░░] 40 / 100
Sobrecarregado: [████████████████████] 120 / 100 (pulsando em vermelho)
```

## 📝 Mudanças no Código

### 1. CharacterContext.tsx

Foram adicionadas três novas funções:

#### 1. `calculateCurrentLoad(inventory: InventoryItem[]): number`
Calcula a carga total baseada no inventário.

```typescript
const calculateCurrentLoad = (inventory: InventoryItem[]): number => {
  return inventory.reduce((total, item) => {
    return total + (item.quantity * item.slots_per_each);
  }, 0);
};
```

#### 2. `updateCurrentLoadFromInventory(inventory: InventoryItem[])`
Atualiza a carga no banco de dados e no estado local.

```typescript
const updateCurrentLoadFromInventory = async (inventory: InventoryItem[]) => {
  const newLoad = calculateCurrentLoad(inventory);
  
  await supabase
    .from('characters')
    .update({ current_load: newLoad })
    .eq('id', character.id);
    
  setCharacter(prev => ({ ...prev, current_load: newLoad }));
};
```

#### 3. Integração automática
As seguintes funções foram modificadas para chamar automaticamente `updateCurrentLoadFromInventory`:

- ✅ `loadCharacter()` - Calcula na primeira carga
- ✅ `refreshInventory()` - Atualiza após refresh
- ✅ `addItemToInventory()` - Atualiza após adicionar
- ✅ `removeItemFromInventory()` - Atualiza após remover
- ✅ `updateItemQuantity()` - Atualiza após mudar quantidade

### 2. Backpack Component (backpack.tsx)

Foi adicionada uma nova coluna na tabela de itens para mostrar a carga total de cada item:

#### Nova Coluna: "Carga Total"
Exibe a carga total ocupada por cada item no inventário:

```typescript
const totalLoad = item.quantity * item.slots;
```

**Exemplo Visual da Tabela:**

| Nome | Descrição | Categoria | Preço | Quantidade | Slots/Un | **Carga Total** |
|------|-----------|-----------|-------|------------|----------|-----------------|
| Espada Longa | Uma espada afiada | Arma | 150 T$P | 2 | 3 | **6** |
| Poção de Cura | Restaura 50 HP | Consumível | 25 T$P | 5 | 0.5 | **2.5** |
| Armadura Pesada | Proteção robusta | Armadura | 500 T$P | 1 | 10 | **10** |

#### Benefícios da Nova Coluna:
- ✅ **Visibilidade**: Mostra quanto cada stack está ocupando
- ✅ **Planejamento**: Ajuda a decidir o que descartar quando sobrecarregado
- ✅ **Clareza**: Torna óbvio quais itens ocupam mais espaço
- ✅ **Destaque Visual**: Coluna com cor roxa e negrito para destaque

### 3. Estilos CSS (backpack.css)

Foram ajustados os estilos para acomodar a nova coluna:

```css
.item-total-load-col {
  justify-content: center;
  font-weight: 700;
  color: #8b5cf6;  /* Roxo para destaque */
  font-size: 15px;
}
```

**Responsividade:**
- Desktop: 7 colunas no grid
- Mobile: Cada coluna em linha separada com labels
- Grid: Ajustado para `1.5fr 2.5fr 1fr 0.8fr 0.8fr 0.8fr 0.9fr`

## 🔄 Fluxo de Dados

```
┌─────────────────────────┐
│  Ação do Usuário        │
│  (adicionar/remover)    │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Atualização no DB      │
│  (character_items)      │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Cálculo Automático     │
│  calculateCurrentLoad() │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Atualização do DB      │
│  (current_load)         │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Atualização da UI      │
│  (barra + texto)        │
└─────────────────────────┘
```

## 🧪 Testando

Para testar a funcionalidade:

1. **Adicionar um item**: A carga deve aumentar automaticamente
2. **Aumentar quantidade**: Usar os botões +/- nas munições
3. **Remover item**: Consumir ou deletar um item
4. **Verificar UI**: A barra e o texto devem atualizar instantaneamente

### Teste de Sobrecarga

1. Definir capacidade máxima baixa (ex: 10)
2. Adicionar itens até ultrapassar
3. Verificar se a barra fica vermelha e pulsa
4. O valor numérico também deve ficar vermelho

## 💡 Benefícios

- ✅ **Automático**: Não precisa calcular manualmente
- ✅ **Preciso**: Sempre reflete o estado real do inventário
- ✅ **Visual**: Feedback imediato com barra de progresso
- ✅ **Intuitivo**: Cores indicam quando está sobrecarregado
- ✅ **Consistente**: Sincronizado entre DB e UI

## 🚀 Próximos Passos Possíveis

Melhorias futuras que podem ser implementadas:

1. **Penalidades**: Aplicar debuffs quando sobrecarregado
2. **Avisos**: Notificação ao tentar adicionar item quando já sobrecarregado
3. **Categorias**: Calcular carga por tipo de item
4. **Histórico**: Log de mudanças na carga
5. **Stats**: Peso transportado ao longo do tempo

## 📚 Arquivos Modificados

1. ✅ **`webversion/src/contexts/CharacterContext.tsx`**
   - Adicionadas funções de cálculo automático
   - Modificadas funções de gerenciamento de inventário
   - Integrado cálculo automático em todas as operações de inventário

2. ✅ **`webversion/src/components/backpack/backpack.tsx`**
   - Adicionada coluna "Carga Total" na tabela de itens
   - Cálculo visual de carga por item (quantidade × slots)
   - Renomeada coluna "Slots" para "Slots/Un" para clareza

3. ✅ **`webversion/src/components/backpack/backpack.css`**
   - Ajustado grid para 7 colunas
   - Adicionados estilos para `.item-total-load-col`
   - Atualizado suporte responsivo para nova coluna

## 🔗 Arquivos Relacionados

- `webversion/src/components/backpack/backpack.tsx` - Componente visual
- `webversion/src/components/backpack/backpack.css` - Estilos da barra
- `webversion/src/pages/profile/profile.tsx` - Uso do componente
- `supabase_schema.sql` - Schema do banco de dados

---

**Status**: ✅ Implementado e funcional
**Data**: Outubro 2025
**Versão**: 1.0

