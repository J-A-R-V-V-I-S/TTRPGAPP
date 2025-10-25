# Guia do CharacterContext

## 📋 Visão Geral

O `CharacterContext` é um contexto React que centraliza todo o gerenciamento do estado do personagem atualmente selecionado na aplicação. Ele fornece uma interface limpa e consistente para acessar e atualizar dados do personagem, eliminando a necessidade de gerenciar estados locais e chamadas ao Supabase em cada componente.

## 🎯 Benefícios

- ✅ **Centralização**: Todos os dados do personagem em um único lugar
- ✅ **Sincronização Automática**: Carrega automaticamente o personagem quando `selectedCharacterId` muda
- ✅ **Consistência**: API unificada para todas as atualizações
- ✅ **Menos Boilerplate**: Elimina código repetitivo de fetch e update
- ✅ **Cache Local**: Mantém os dados em memória para acesso rápido
- ✅ **Error Handling**: Gerenciamento centralizado de erros

## 🔧 Como Usar

### 1. Básico - Acessar Dados do Personagem

```tsx
import { useCharacter } from '../contexts/CharacterContext';

function MyComponent() {
  const { character, loading, error } = useCharacter();

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!character) return <div>Nenhum personagem selecionado</div>;

  return (
    <div>
      <h1>{character.name}</h1>
      <p>Nível {character.level}</p>
      <p>{character.class} - {character.race}</p>
    </div>
  );
}
```

### 2. Atualizar Descrição

```tsx
function DescriptionEditor() {
  const { character, updateDescription } = useCharacter();
  const [text, setText] = useState(character?.description || '');

  const handleSave = async () => {
    try {
      await updateDescription(text);
      console.log('Descrição atualizada!');
    } catch (err) {
      console.error('Erro ao salvar:', err);
    }
  };

  return (
    <div>
      <textarea 
        value={text} 
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleSave}>Salvar</button>
    </div>
  );
}
```

### 3. Gerenciar Moedas

```tsx
function CurrencyManager() {
  const { character, updateCurrency } = useCharacter();

  const addGold = async (amount: number) => {
    if (!character) return;
    
    await updateCurrency(
      character.gold + amount,
      character.silver,
      character.bronze
    );
  };

  return (
    <div>
      <p>Ouro: {character?.gold}</p>
      <button onClick={() => addGold(10)}>+10 Ouro</button>
    </div>
  );
}
```

### 4. Gerenciar Health e Mana

```tsx
function HealthManaBar() {
  const { character, updateHealth, updateMana } = useCharacter();

  const takeDamage = async (damage: number) => {
    if (!character) return;
    
    const newHealth = Math.max(0, character.current_health - damage);
    await updateHealth(newHealth);
  };

  const heal = async (amount: number) => {
    if (!character) return;
    
    const newHealth = Math.min(
      character.max_health, 
      character.current_health + amount
    );
    await updateHealth(newHealth);
  };

  const spendMana = async (cost: number) => {
    if (!character) return;
    
    const newMana = Math.max(0, character.current_mana - cost);
    await updateMana(newMana);
  };

  return (
    <div>
      <div>
        HP: {character?.current_health} / {character?.max_health}
        <button onClick={() => takeDamage(10)}>Dano -10</button>
        <button onClick={() => heal(10)}>Curar +10</button>
      </div>
      <div>
        Mana: {character?.current_mana} / {character?.max_mana}
        <button onClick={() => spendMana(5)}>Gastar -5</button>
      </div>
    </div>
  );
}
```

### 5. Atualizar Múltiplos Campos

Para atualizar health com máximo e temporário:

```tsx
// Atualizar apenas o HP atual
await updateHealth(50);

// Atualizar HP atual e máximo
await updateHealth(50, 100);

// Atualizar HP atual, máximo e temporário
await updateHealth(50, 100, 10);
```

### 6. Recarregar Dados do Personagem

```tsx
function RefreshButton() {
  const { refreshCharacter } = useCharacter();

  return (
    <button onClick={refreshCharacter}>
      Atualizar Dados
    </button>
  );
}
```

## 📚 API Completa

### Estados

- `character`: Objeto com todos os dados do personagem ou `null`
  - Inclui `inventory`: Array de itens do inventário
- `loading`: Boolean indicando se está carregando
- `error`: String com mensagem de erro ou `null`

### Funções de Carregamento

- `loadCharacter(characterId: string)`: Carrega um personagem específico (inclui inventário)
- `refreshCharacter()`: Recarrega o personagem atual
- `refreshInventory()`: Recarrega apenas o inventário

### Funções de Atualização

#### Informações Gerais
- `updateDescription(value: string)`
- `updateBackstory(value: string)`
- `updateProficiencies(value: string)`

#### Moedas
- `updateCurrency(gold: number, silver: number, bronze: number)`

#### Inventário
- `updateArrows(value: number)`
- `updateBullets(value: number)`
- `updateMaxInventorySlots(value: number)`
- `updateCurrentLoad(value: number)`

#### Recursos (Health & Mana)
- `updateHealth(current: number, max?: number, temporary?: number)`
- `updateMana(current: number, max?: number, temporary?: number)`

#### Imagens
- `updateProfileImage(url: string)`
- `updateBackgroundImage(url: string)`

#### Inventário
- `addItemToInventory(itemId: string, quantity?: number)` - Adiciona item ao inventário (ou aumenta quantidade)
- `removeItemFromInventory(characterItemId: string)` - Remove item do inventário
- `updateItemQuantity(characterItemId: string, quantity: number)` - Atualiza quantidade (remove se <= 0)

## 🔄 Fluxo de Dados

```
1. Usuário seleciona personagem na Home
   ↓
2. setSelectedCharacterId(id) é chamado
   ↓
3. CharacterContext detecta mudança no selectedCharacterId
   ↓
4. loadCharacter() é automaticamente executado
   ↓
5. Dados são carregados do Supabase
   ↓
6. Estado 'character' é atualizado
   ↓
7. Todos os componentes usando useCharacter() recebem os novos dados
```

## 💡 Dicas e Melhores Práticas

### ✅ Fazer

```tsx
// Usar o contexto em qualquer componente
const { character, updateHealth } = useCharacter();

// Verificar se o personagem existe antes de usar
if (character) {
  console.log(character.name);
}

// Tratar erros nas atualizações
try {
  await updateDescription(text);
} catch (err) {
  // Mostrar mensagem ao usuário
}
```

### ❌ Não Fazer

```tsx
// NÃO modificar o objeto character diretamente
character.gold = 100; // ❌ Errado

// Use a função de update apropriada
updateCurrency(100, 0, 0); // ✅ Correto

// NÃO fazer múltiplas chamadas fetch manuais
const { data } = await supabase.from('characters').select(); // ❌ Desnecessário

// Use o contexto
const { character } = useCharacter(); // ✅ Correto
```

## 🔗 Integração com UserContext

O `CharacterContext` está integrado com o `UserContext`:

```tsx
// UserContext gerencia QUAL personagem está selecionado
const { selectedCharacterId, setSelectedCharacterId } = useUser();

// CharacterContext gerencia os DADOS do personagem selecionado
const { character, updateDescription } = useCharacter();

// Quando você chama setSelectedCharacterId(), o CharacterContext
// automaticamente carrega os dados do novo personagem
```

## 🐛 Troubleshooting

### Personagem não carrega

**Problema**: `character` está sempre `null`

**Soluções**:
1. Verifique se `selectedCharacterId` está definido no `UserContext`
2. Verifique se o ID do personagem existe no banco de dados
3. Verifique as permissões RLS do Supabase

### Atualizações não salvam

**Problema**: Função de update não está salvando no banco

**Soluções**:
1. Verifique se há erros no console
2. Verifique as políticas RLS da tabela `characters`
3. Verifique se o usuário tem permissão de update
4. Confirme que o personagem pertence ao usuário logado

### Loading infinito

**Problema**: `loading` nunca fica `false`

**Soluções**:
1. Verifique erros de conexão com o Supabase
2. Verifique se a tabela `characters` existe
3. Veja o console do navegador para erros

## 📝 Exemplo Completo

```tsx
import { useCharacter } from '../contexts/CharacterContext';
import { useState } from 'react';

function ProfilePage() {
  const {
    character,
    loading,
    error,
    updateDescription,
    updateCurrency,
    updateHealth,
  } = useCharacter();

  const [description, setDescription] = useState('');

  if (loading) {
    return <div>Carregando personagem...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Erro: {error}</div>;
  }

  if (!character) {
    return <div>Selecione um personagem na página inicial</div>;
  }

  const handleSaveDescription = async () => {
    try {
      await updateDescription(description);
      alert('Descrição salva!');
    } catch (err) {
      alert('Erro ao salvar descrição');
    }
  };

  const handleTakeDamage = async () => {
    const newHealth = Math.max(0, character.current_health - 10);
    await updateHealth(newHealth);
  };

  const handleAddGold = async () => {
    await updateCurrency(
      character.gold + 100,
      character.silver,
      character.bronze
    );
  };

  return (
    <div>
      <h1>{character.name}</h1>
      <p>Nível {character.level} - {character.class}</p>
      
      <div>
        <h2>Recursos</h2>
        <p>HP: {character.current_health} / {character.max_health}</p>
        <p>Mana: {character.current_mana} / {character.max_mana}</p>
        <button onClick={handleTakeDamage}>Receber Dano (-10 HP)</button>
      </div>

      <div>
        <h2>Moedas</h2>
        <p>Ouro: {character.gold}</p>
        <p>Prata: {character.silver}</p>
        <p>Bronze: {character.bronze}</p>
        <button onClick={handleAddGold}>Adicionar 100 Ouro</button>
      </div>

      <div>
        <h2>Descrição</h2>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={character.description || 'Descrição do personagem...'}
        />
        <button onClick={handleSaveDescription}>Salvar Descrição</button>
      </div>
    </div>
  );
}

export default ProfilePage;
```

### 6. Gerenciar Inventário

```tsx
function InventoryManager() {
  const { character, addItemToInventory, removeItemFromInventory, updateItemQuantity } = useCharacter();

  const handleAddItem = async (itemId: string) => {
    try {
      await addItemToInventory(itemId, 1);
      console.log('Item adicionado!');
    } catch (err) {
      console.error('Erro:', err);
    }
  };

  const handleRemoveItem = async (characterItemId: string) => {
    try {
      await removeItemFromInventory(characterItemId);
      console.log('Item removido!');
    } catch (err) {
      console.error('Erro:', err);
    }
  };

  const handleUseConsumable = async (item: any) => {
    // Diminui quantidade em 1
    await updateItemQuantity(item.id, item.quantity - 1);
  };

  return (
    <div>
      <h2>Inventário ({character?.inventory?.length || 0} itens)</h2>
      {character?.inventory?.map(item => (
        <div key={item.id}>
          <span>{item.name} x{item.quantity}</span>
          <button onClick={() => handleRemoveItem(item.id)}>Remover</button>
          {item.category === 'consumable' && (
            <button onClick={() => handleUseConsumable(item)}>Usar</button>
          )}
        </div>
      ))}
    </div>
  );
}
```

## 🚀 Próximos Passos

Para expandir o `CharacterContext` no futuro, considere adicionar:

1. ✅ **Funções para Inventário**: `addItem()`, `removeItem()`, `updateItem()` - **IMPLEMENTADO!**
2. **Funções para Ataques**: `addAttack()`, `removeAttack()`, `updateAttack()`
3. **Funções para Magias**: `addSpell()`, `removeSpell()`, `updateSpell()`
4. **Funções para Notas**: `addNote()`, `removeNote()`, `updateNote()`
5. **Otimistic Updates**: Atualizar UI antes da confirmação do servidor
6. **Undo/Redo**: Sistema de histórico de alterações
7. **Real-time Sync**: Sincronização em tempo real com outros jogadores

---

**Criado em**: 21 de Outubro de 2025
**Versão**: 1.0.0

