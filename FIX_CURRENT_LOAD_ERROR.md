# 🔧 Correção do Erro: Campo `current_load` não encontrado

## ❌ Problema

Erro ao tentar atualizar itens do inventário:

```
PGRST204: Could not find the 'current_load' column of 'characters' in the schema cache
```

## 🔍 Causa

O campo `current_load` está definido no arquivo `supabase_schema.sql` (linha 74), mas **não foi criado na tabela `characters`** do seu banco de dados Supabase.

## ✅ Solução

### Passo 1: Adicionar o campo no Supabase

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Vá para o seu projeto
3. Clique em **SQL Editor** (ícone de </> no menu lateral)
4. Clique em **New Query**
5. Cole o seguinte SQL:

```sql
-- Adicionar campo current_load à tabela characters
ALTER TABLE characters 
ADD COLUMN IF NOT EXISTS current_load INTEGER DEFAULT 0;

-- Verificar se o campo foi adicionado com sucesso
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'characters' 
AND column_name = 'current_load';
```

6. Clique em **Run** (ou pressione `Ctrl+Enter`)

### Passo 2: Verificar se foi adicionado corretamente

Você deve ver uma resposta mostrando:

| column_name   | data_type | column_default |
|---------------|-----------|----------------|
| current_load  | integer   | 0              |

### Passo 3: Recarregar o cache do Supabase (opcional)

Se ainda tiver problemas após adicionar o campo:

1. No Supabase Dashboard, vá para **Settings** → **API**
2. Clique em **Reload schema cache** (se disponível)
3. Ou simplesmente aguarde alguns segundos (o cache atualiza automaticamente)

### Passo 4: Recarregar a página da aplicação

Após adicionar o campo, recarregue sua aplicação web (`F5` ou `Ctrl+R`)

## 📋 O que o campo `current_load` faz?

- **Armazena**: A carga atual total do inventário do personagem
- **Calculado por**: `soma de (quantidade × slots_per_each)` de todos os itens
- **Usado para**: Verificar se o personagem excedeu a capacidade máxima (`max_inventory_slots`)

### Exemplo:

```typescript
// Item 1: Espada (quantity: 1, slots_per_each: 2) = 2 slots
// Item 2: Poção (quantity: 5, slots_per_each: 1) = 5 slots
// current_load = 2 + 5 = 7 slots
```

## 🔄 Campos Relacionados

| Campo                 | Tipo    | Descrição                           |
|-----------------------|---------|-------------------------------------|
| `current_load`        | INTEGER | Carga atual (calculada)             |
| `max_inventory_slots` | INTEGER | Capacidade máxima de inventário     |

## 🧪 Testar

Após aplicar a correção, teste:

1. Abrir o perfil de um personagem
2. Adicionar/remover itens do inventário
3. Alterar a quantidade de itens
4. **Não deve mais aparecer o erro** `PGRST204`

## ⚠️ Importante

Este campo deveria ter sido criado quando você executou o `supabase_schema.sql` pela primeira vez. Se você pulou esse passo ou criou as tabelas manualmente, precisará adicionar este campo agora.

## 📝 Arquivos Relacionados

- `supabase_schema.sql` - Schema completo (linha 74 define o campo)
- `add_current_load_field.sql` - Script específico para adicionar apenas este campo
- `webversion/src/contexts/CharacterContext.tsx` - Onde o campo é atualizado (linha 448)

---

**Status**: 🔧 Aguardando aplicação do SQL no Supabase

