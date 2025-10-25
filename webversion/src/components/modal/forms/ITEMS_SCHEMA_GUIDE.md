# Guia do Schema de Items

## 📋 Estrutura do Banco de Dados

O formulário de items está **100% alinhado** com o schema do banco de dados Supabase.

### Tabela: `items`

```sql
CREATE TABLE items (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price INTEGER DEFAULT 0,
    category VARCHAR(50) NOT NULL,  -- 'weapon', 'armor', 'ammo', 'consumable', 'misc'
    slots_per_each INTEGER DEFAULT 1,
    
    -- Campos específicos para ARMAS (category = 'weapon')
    attack_roll VARCHAR(100),
    damage VARCHAR(100),
    crit VARCHAR(100),
    range VARCHAR(100),
    damage_type VARCHAR(50),
    
    -- Campos específicos para ARMADURA (category = 'armor')
    armor_bonus INTEGER,
    armor_penalty INTEGER,
    
    -- Campos específicos para CONSUMÍVEIS (category = 'consumable')
    effect TEXT
);
```

## 🎯 Categorias de Items

### 1. `weapon` - Armas
Campos disponíveis:
- `name` (obrigatório)
- `description` (obrigatório)
- `price`
- `category = 'weapon'` (obrigatório)
- `slots_per_each`
- `attack_roll` - Ex: "1d20+5"
- `damage` - Ex: "1d8+3"
- `crit` - Ex: "19-20/x2"
- `range` - Ex: "9m", "30m"
- `damage_type` - Ex: "Cortante", "Perfurante"

**Exemplo:**
```typescript
{
  name: "Espada Longa",
  description: "Uma espada longa afiada",
  price: 150,
  category: "weapon",
  slots_per_each: 2,
  attack_roll: "1d20+2",
  damage: "1d8+2",
  crit: "19-20/x2",
  range: "Corpo a corpo",
  damage_type: "Cortante"
}
```

### 2. `armor` - Armadura
Campos disponíveis:
- `name` (obrigatório)
- `description` (obrigatório)
- `price`
- `category = 'armor'` (obrigatório)
- `slots_per_each`
- `armor_bonus` - Bônus de CA (número)
- `armor_penalty` - Penalidade de movimento (número negativo)

**Exemplo:**
```typescript
{
  name: "Cota de Malha",
  description: "Armadura média feita de anéis entrelaçados",
  price: 750,
  category: "armor",
  slots_per_each: 4,
  armor_bonus: 5,
  armor_penalty: -2
}
```

### 3. `ammo` - Munição
Campos disponíveis:
- `name` (obrigatório)
- `description` (obrigatório)
- `price`
- `category = 'ammo'` (obrigatório)
- `slots_per_each`

**Exemplo:**
```typescript
{
  name: "Flechas (20)",
  description: "Conjunto de 20 flechas padrão",
  price: 10,
  category: "ammo",
  slots_per_each: 1
}
```

### 4. `consumable` - Consumível
Campos disponíveis:
- `name` (obrigatório)
- `description` (obrigatório)
- `price`
- `category = 'consumable'` (obrigatório)
- `slots_per_each`
- `effect` - Descrição detalhada do efeito ao usar

**Exemplo:**
```typescript
{
  name: "Poção de Cura Maior",
  description: "Restaura pontos de vida quando bebida",
  price: 150,
  category: "consumable",
  slots_per_each: 1,
  effect: "Restaura 4d4+4 pontos de vida imediatamente"
}
```

### 5. `misc` - Diversos
Campos disponíveis:
- `name` (obrigatório)
- `description` (obrigatório)
- `price`
- `category = 'misc'` (obrigatório)
- `slots_per_each`

**Exemplo:**
```typescript
{
  name: "Corda de Cânhamo (15m)",
  description: "Corda resistente para escalada",
  price: 10,
  category: "misc",
  slots_per_each: 2
}
```

## 🎨 Interface do Formulário

O formulário **adapta-se dinamicamente** baseado na categoria selecionada:

### Campos Sempre Visíveis:
1. Nome do Item (obrigatório)
2. Descrição (obrigatório)
3. Categoria (obrigatório) - dropdown
4. Preço
5. Quantidade (obrigatório)
6. Slots por Unidade (obrigatório)

### Campos Condicionais:

#### Se categoria = `weapon`:
- Divisor: "PROPRIEDADES DA ARMA"
- Rolagem de Ataque
- Dano
- Crítico
- Alcance
- Tipo de Dano

#### Se categoria = `armor`:
- Divisor: "PROPRIEDADES DA ARMADURA"
- Bônus de Armadura
- Penalidade de Armadura

#### Se categoria = `consumable`:
- Divisor: "PROPRIEDADES DO CONSUMÍVEL"
- Efeito (textarea)

## ⚠️ Regras Importantes

### 1. **Sem campo `type`**
❌ **ERRADO:** O schema não tem um campo `type` separado
```typescript
// NÃO FAÇA ISSO
{
  category: "Arma",
  type: "Espada"  // ❌ Este campo não existe no banco
}
```

✅ **CORRETO:** Use apenas `category` com os valores do enum
```typescript
{
  category: "weapon"  // ✅ Valor correto do banco
}
```

### 2. **Valores da Categoria**
As categorias devem usar **exatamente** estes valores em inglês:
- `weapon` (não "Arma")
- `armor` (não "Armadura")
- `ammo` (não "Munição")
- `consumable` (não "Consumível")
- `misc` (não "Diversos")

O formulário mostra os nomes em português, mas salva os valores em inglês.

### 3. **Campos Opcionais**
Todos os campos específicos de categoria são **opcionais**:
- Você pode criar uma arma sem preencher `attack_roll`, `damage`, etc.
- Você pode criar uma armadura sem preencher `armor_bonus`
- Você pode criar um consumível sem preencher `effect`

### 4. **Campos Não Utilizados**
Se um item de uma categoria tem campos de outra categoria, eles são **ignorados**:
- Uma arma com `armor_bonus` → `armor_bonus` é NULL no banco
- Um consumível com `damage` → `damage` é NULL no banco

## 💾 Salvando Items

### Interface TypeScript:
```typescript
interface ItemFormData {
  name: string;
  description: string;
  quantity: number;
  slots_per_each: number;
  price: number;
  category: 'weapon' | 'armor' | 'ammo' | 'consumable' | 'misc' | '';
  
  // Weapon fields (optional)
  attack_roll?: string;
  damage?: string;
  crit?: string;
  range?: string;
  damage_type?: string;
  
  // Armor fields (optional)
  armor_bonus?: number;
  armor_penalty?: number;
  
  // Consumable fields (optional)
  effect?: string;
}
```

### Exemplo de Uso:
```tsx
import ItemForm from './components/modal/forms/ItemForm';

function MyComponent() {
  const handleSubmit = async (data: ItemFormData) => {
    // data está pronto para ser enviado ao Supabase
    const { data: item, error } = await supabase
      .from('items')
      .insert({
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        slots_per_each: data.slots_per_each,
        // Campos condicionais (podem ser undefined)
        attack_roll: data.attack_roll,
        damage: data.damage,
        crit: data.crit,
        range: data.range,
        damage_type: data.damage_type,
        armor_bonus: data.armor_bonus,
        armor_penalty: data.armor_penalty,
        effect: data.effect,
      });
    
    if (!error) {
      console.log('Item criado:', item);
    }
  };

  return <ItemForm onSubmit={handleSubmit} onCancel={() => {}} />;
}
```

## 🔄 Relação com Inventário

Os items são adicionados ao inventário do personagem através da tabela `character_items`:

```sql
CREATE TABLE character_items (
    id UUID PRIMARY KEY,
    character_id UUID REFERENCES characters(id),
    item_id UUID REFERENCES items(id),
    quantity INTEGER DEFAULT 1
);
```

Para adicionar ao inventário:
```typescript
// 1. Criar o item (se não existir)
const { data: item } = await supabase
  .from('items')
  .insert({ name, description, category, ... })
  .select()
  .single();

// 2. Adicionar ao inventário do personagem
await supabase
  .from('character_items')
  .insert({
    character_id: characterId,
    item_id: item.id,
    quantity: 1
  });

// OU usar a função do CharacterContext:
const { addItemToInventory } = useCharacter();
await addItemToInventory(item.id, 1);
```

## 🎯 Validações

O formulário valida:
1. ✅ Nome é obrigatório
2. ✅ Descrição é obrigatória
3. ✅ Categoria é obrigatória
4. ✅ Quantidade mínima: 1
5. ✅ Slots mínimo: 1
6. ✅ Preço mínimo: 0
7. ✅ Campos numéricos aceitam apenas números

## 📝 Migrando Código Antigo

Se você tem código usando o campo `type`:

### Antes (ERRADO):
```typescript
{
  category: "Arma",
  type: "Espada Longa",
  slots: 2
}
```

### Depois (CORRETO):
```typescript
{
  category: "weapon",
  slots_per_each: 2,
  // Informações adicionais vão no name ou description
  name: "Espada Longa"
}
```

## 🚀 Checklist de Implementação

Ao criar funcionalidades relacionadas a items:

- [ ] Usar `category` com valores: `weapon`, `armor`, `ammo`, `consumable`, `misc`
- [ ] Usar `slots_per_each` (não `slots`)
- [ ] NÃO usar campo `type`
- [ ] Campos específicos de categoria são opcionais
- [ ] Valores em inglês no banco, labels em português na UI
- [ ] Quantidade gerenciada em `character_items`, não em `items`

---

**Última atualização:** 21 de Outubro de 2025  
**Schema Version:** 1.0

