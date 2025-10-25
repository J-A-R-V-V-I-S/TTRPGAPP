# 💰 Sistema de Transações Financeiras - Guia Completo

## 📋 Visão Geral

Sistema completo para registrar e gerenciar transações financeiras dos personagens, incluindo recebimentos e gastos de ouro, prata e bronze.

## 🎯 Funcionalidades

### ✅ Implementado

- ✅ **Registro de Transações**
  - Recebimentos (income): Saque, Recompensa, Venda, Outro
  - Gastos (expense): Compra, Serviço, Outro
  
- ✅ **Atualização Automática**
  - Moedas do personagem são atualizadas automaticamente
  - Histórico completo de transações
  
- ✅ **Visualização**
  - Filtros por tipo (Todas, Recebimentos, Gastos)
  - Total calculado automaticamente
  - Ordenação por data (mais recente primeiro)
  
- ✅ **Gestão**
  - Adicionar nova transação
  - Excluir transação (reverte moedas automaticamente)
  - Notas adicionais opcionais

## 🗄️ Estrutura do Banco de Dados

### Tabela `transactions`

```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    character_id UUID REFERENCES characters(id),
    type VARCHAR(20),          -- 'income' ou 'expense'
    category VARCHAR(50),       -- 'loot', 'reward', 'purchase', etc.
    amount_gold INTEGER,
    amount_silver INTEGER,
    amount_bronze INTEGER,
    description TEXT,
    notes TEXT,
    related_item_id UUID,      -- Opcional, para vincular a item
    created_at TIMESTAMP
);
```

## 🚀 Instalação

### Passo 1: Criar Tabela no Supabase

Execute o script no **SQL Editor do Supabase**:

```bash
# O arquivo está em:
supabase_transactions_table.sql
```

### Passo 2: Arquivos Criados

| Arquivo | Descrição |
|---------|-----------|
| `webversion/src/types/transaction.tsx` | Tipos TypeScript |
| `webversion/src/components/modal/forms/TransactionForm.tsx` | Formulário de transação |
| `webversion/src/components/transactionHistory/transactionHistory.tsx` | Lista/visualização |
| `webversion/src/components/transactionHistory/transactionHistory.css` | Estilos |
| `webversion/src/contexts/CharacterContext.tsx` | Funções integradas |

### Passo 3: Usar no Profile

Adicione no `profile.tsx`:

```typescript
import TransactionHistory from '../../components/transactionHistory/transactionHistory';
import { useCharacter } from '../../contexts/CharacterContext';

function Profile() {
  const { 
    character, 
    addTransaction, 
    deleteTransaction 
  } = useCharacter();

  const handleAddTransaction = async (data) => {
    try {
      await addTransaction({
        ...data,
        character_id: character.id,
      });
      console.log('✅ Transação adicionada!');
    } catch (err) {
      console.error('❌ Erro:', err);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransaction(id);
      console.log('✅ Transação excluída!');
    } catch (err) {
      console.error('❌ Erro:', err);
    }
  };

  return (
    <div>
      {/* ... outros componentes ... */}
      
      <TransactionHistory
        transactions={character?.transactions || []}
        onAddTransaction={handleAddTransaction}
        onDeleteTransaction={handleDeleteTransaction}
      />
    </div>
  );
}
```

## 📝 Exemplos de Uso

### 1. Registrar Recebimento (Saque/Loot)

```typescript
await addTransaction({
  character_id: character.id,
  type: 'income',
  category: 'loot',
  amount_gold: 50,
  amount_silver: 30,
  amount_bronze: 10,
  description: 'Tesouro do dragão derrotado',
  notes: 'Dungeon do pico nevado',
});
```

### 2. Registrar Gasto (Compra)

```typescript
await addTransaction({
  character_id: character.id,
  type: 'expense',
  category: 'purchase',
  amount_gold: 25,
  amount_silver: 0,
  amount_bronze: 0,
  description: 'Compra de Poção de Cura Superior',
  notes: 'Loja do Alquimista',
});
```

### 3. Registrar Recompensa

```typescript
await addTransaction({
  character_id: character.id,
  type: 'income',
  category: 'reward',
  amount_gold: 100,
  amount_silver: 0,
  amount_bronze: 0,
  description: 'Recompensa por salvar a vila',
});
```

## 🎨 Interface do Usuário

### Componente TransactionHistory

#### Props

```typescript
interface TransactionHistoryProps {
  transactions?: Transaction[];           // Array de transações
  onAddTransaction?: (data) => void;      // Callback ao adicionar
  onDeleteTransaction?: (id) => void;     // Callback ao deletar
}
```

#### Funcionalidades

- **Filtros**: Todas | Recebimentos | Gastos
- **Botão "Nova Transação"**: Abre modal com formulário
- **Resumo**: Mostra total baseado no filtro atual
- **Lista**: Mostra todas as transações com:
  - Badge de tipo (Recebimento/Gasto)
  - Categoria
  - Descrição
  - Notas (se houver)
  - Data e hora
  - Valor formatado
  - Botão de exclusão 🗑️

### Formulário de Transação

#### Campos

1. **Tipo** (obrigatório): Recebimento ou Gasto
2. **Categoria** (obrigatório): Dinâmica baseada no tipo
3. **Descrição** (obrigatório): Texto livre
4. **Ouro** (opcional): Valor em peças de ouro
5. **Prata** (opcional): Valor em peças de prata
6. **Bronze** (opcional): Valor em peças de bronze
7. **Notas** (opcional): Informações adicionais

#### Validações

- ✅ Pelo menos um valor de moeda deve ser > 0
- ✅ Descrição é obrigatória
- ✅ Categoria é dinâmica:
  - **Recebimento**: Saque, Recompensa, Venda, Outro
  - **Gasto**: Compra, Serviço, Outro

## 🔄 Fluxo de Dados

```
1. Usuário clica em "Nova Transação"
   ↓
2. Preenche formulário
   ↓
3. onAddTransaction é chamado
   ↓
4. CharacterContext.addTransaction()
   ├─ Insere transação no banco
   ├─ Atualiza moedas do personagem
   └─ Recarrega lista de transações
   ↓
5. UI atualiza automaticamente
```

### Exclusão de Transação

```
1. Usuário clica em 🗑️
   ↓
2. Confirma exclusão
   ↓
3. onDeleteTransaction é chamado
   ↓
4. CharacterContext.deleteTransaction()
   ├─ Busca transação para reverter
   ├─ Deleta transação do banco
   ├─ Reverte moedas do personagem
   └─ Recarrega lista de transações
   ↓
5. UI atualiza automaticamente
```

## 💡 Helpers Úteis

### Formatar Moeda

```typescript
import { formatCurrency } from '../types/transaction';

const formatted = formatCurrency(50, 30, 10);
// Resultado: "50 PO, 30 PP, 10 PC"
```

### Calcular Total em Bronze

```typescript
import { calculateTotalInBronze } from '../types/transaction';

const total = calculateTotalInBronze(1, 5, 3);
// Resultado: 153 (1*100 + 5*10 + 3)
```

### Labels em Português

```typescript
import { TransactionTypeLabels, TransactionCategoryLabels } from '../types/transaction';

TransactionTypeLabels.income;      // "Recebimento"
TransactionTypeLabels.expense;     // "Gasto"

TransactionCategoryLabels.loot;    // "Saque/Pilhagem"
TransactionCategoryLabels.purchase; // "Compra"
```

## 🔐 Segurança (RLS)

As políticas já estão configuradas no script SQL:

```sql
-- Usuários podem gerenciar transações dos seus personagens
CREATE POLICY "Users can manage own character transactions" ON transactions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM characters 
      WHERE characters.id = transactions.character_id 
      AND characters.user_id = auth.uid()
    )
  );
```

## 📊 Exemplo Completo no Profile

```typescript
import TransactionHistory from '../../components/transactionHistory/transactionHistory';

const Profile = () => {
  const { character, addTransaction, deleteTransaction } = useCharacter();

  const handleAddTransaction = async (data: TransactionFormData) => {
    if (!character) return;
    
    try {
      await addTransaction({
        ...data,
        character_id: character.id,
      });
      alert('✅ Transação registrada com sucesso!');
    } catch (err) {
      console.error(err);
      alert('❌ Erro ao registrar transação');
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
      alert('✅ Transação excluída e moedas revertidas!');
    } catch (err) {
      console.error(err);
      alert('❌ Erro ao excluir transação');
    }
  };

  return (
    <div>
      {/* Outros componentes... */}
      
      <TransactionHistory
        transactions={character?.transactions || []}
        onAddTransaction={handleAddTransaction}
        onDeleteTransaction={handleDeleteTransaction}
      />
    </div>
  );
};
```

## 🎨 Customização de Estilos

Os estilos estão em `transactionHistory.css` e seguem o padrão do sistema:

- **Cores**:
  - Verde (#10b981): Recebimentos
  - Vermelho (#ef4444): Gastos
  - Laranja (#f59e0b): Header

- **Responsivo**: Adapta para mobile automaticamente

## 🧪 Testar

### 1. Adicionar Transação Manual (Console)

```javascript
// No console do navegador
await addTransaction({
  character_id: 'seu-character-id',
  type: 'income',
  category: 'loot',
  amount_gold: 100,
  amount_silver: 0,
  amount_bronze: 0,
  description: 'Teste',
});
```

### 2. Verificar no Console

```javascript
console.log(character.transactions);
console.log('Ouro:', character.gold);
console.log('Prata:', character.silver);
console.log('Bronze:', character.bronze);
```

## 🚀 Próximos Passos

Funcionalidades futuras sugeridas:

1. **Relatórios**: Gráficos de receitas vs despesas
2. **Exportar**: CSV ou PDF do histórico
3. **Categorias Customizadas**: Usuário criar suas próprias
4. **Filtro por Data**: Por mês, semana, etc
5. **Busca**: Procurar transações por descrição
6. **Vinculação com Items**: Auto-criar transação ao comprar/vender

## ✅ Checklist de Implementação

- [ ] Executar `supabase_transactions_table.sql` no Supabase
- [ ] Verificar políticas RLS criadas
- [ ] Importar `TransactionHistory` no profile
- [ ] Conectar callbacks `onAddTransaction` e `onDeleteTransaction`
- [ ] Testar adicionar recebimento
- [ ] Testar adicionar gasto
- [ ] Testar exclusão (verificar reversão de moedas)
- [ ] Testar filtros
- [ ] Verificar responsividade mobile

---

**Criado em**: 21 de Outubro de 2025  
**Versão**: 1.0.0  
**Status**: ✅ Pronto para Uso

