# 💰 Sistema de Carteira vs Banco

## 🎯 Conceito

A partir de agora, o sistema financeiro do personagem está dividido em duas partes:

### 💼 **CARTEIRA** (Dinheiro em Mãos)
- Calculado automaticamente pelas **transações**
- Soma: Receitas - Despesas
- Não é armazenado no banco de dados
- Atualizado em tempo real

### 🏦 **BANCO** (Dinheiro Guardado)
- Armazenado nos campos `gold`, `silver`, `bronze` da tabela `characters`
- Gerenciado manualmente (Depositar/Sacar)
- Protegido e seguro

## 📊 Como Funciona

```
┌─────────── CARTEIRA ───────────┐
│ Calculada das Transações       │
│                                 │
│ 🥇 Ouro:    150  ← (200-50)    │
│ 🥈 Prata:    30  ← (50-20)     │
│ 🥉 Bronze:   15  ← (20-5)      │
└─────────────────────────────────┘
      ↑
      │ Baseado em:
      │
      ├─ + Receita: 200 ouro (loot)
      ├─ - Gasto: 50 ouro (compra)
      ├─ + Receita: 50 prata (reward)
      └─ - Gasto: 20 prata (serviço)

┌─────────── BANCO ──────────────┐
│ Armazenado no Personagem       │
│                                 │
│ 🥇 Ouro:    1000                │
│ 🥈 Prata:    500                │
│ 🥉 Bronze:   250                │
│                                 │
│ [⬇️ Depositar] [⬆️ Sacar]       │
└─────────────────────────────────┘
```

## 🔄 Fluxo de Dinheiro

### Adicionar Receita (Transação)
```
1. Recebeu 100 ouro de recompensa
   ↓
2. Criar transação: type='income', amount_gold=100
   ↓
3. CARTEIRA aumenta em 100 ouro (calculado)
   ↓
4. BANCO não muda (separado)
```

### Adicionar Despesa (Transação)
```
1. Gastou 50 ouro em poções
   ↓
2. Criar transação: type='expense', amount_gold=50
   ↓
3. CARTEIRA diminui em 50 ouro (calculado)
   ↓
4. BANCO não muda (separado)
```

### Depositar no Banco (Futuro)
```
1. Usuário clica "⬇️ Depositar"
   ↓
2. Seleciona valor da CARTEIRA
   ↓
3. Transfere para BANCO
   ↓
4. CARTEIRA diminui (criar transação de despesa)
   ↓
5. BANCO aumenta (atualizar campos do personagem)
```

### Sacar do Banco (Futuro)
```
1. Usuário clica "⬆️ Sacar"
   ↓
2. Seleciona valor do BANCO
   ↓
3. Transfere para CARTEIRA
   ↓
4. BANCO diminui (atualizar campos do personagem)
   ↓
5. CARTEIRA aumenta (criar transação de receita)
```

## 💡 Vantagens deste Sistema

### ✅ Para o Jogador
- **Organização**: Dinheiro em mãos vs guardado
- **Histórico**: Ver exatamente de onde veio cada moeda
- **Segurança**: Banco protege contra perda/roubo (futuro)
- **Realismo**: Simula economia de RPG

### ✅ Para o Sistema
- **Auditoria**: Rastreabilidade completa
- **Flexibilidade**: Fácil adicionar taxas, juros, etc.
- **Separação**: Lógica clara e independente
- **Performance**: Cálculos leves em tempo real

## 🎮 Exemplo de Jogo

### Sessão de RPG típica:

```
Início:
├─ Carteira: 0 PO
└─ Banco: 1000 PO (dinheiro guardado)

Durante aventura:
├─ Encontrou tesouro: +200 PO (carteira)
├─ Comprou poções: -50 PO (carteira)
├─ Recompensa de quest: +150 PO (carteira)
└─ Gastou em hotel: -10 PO (carteira)

Carteira agora: 290 PO

Volta à cidade:
├─ Deposita 250 PO no banco
│  ├─ Carteira: 290 - 250 = 40 PO
│  └─ Banco: 1000 + 250 = 1250 PO
└─ Mantém 40 PO para despesas

Status final:
├─ Carteira: 40 PO (dinheiro em mãos)
└─ Banco: 1250 PO (dinheiro guardado)
```

## 📋 Estrutura Atual

### Campos no Personagem (characters table)

```sql
gold INTEGER DEFAULT 0,      -- 🏦 Banco
silver INTEGER DEFAULT 0,    -- 🏦 Banco  
bronze INTEGER DEFAULT 0,    -- 🏦 Banco
```

### Tabela de Transações (transactions table)

```sql
amount_gold INTEGER,         -- 💼 Afeta Carteira
amount_silver INTEGER,       -- 💼 Afeta Carteira
amount_bronze INTEGER,       -- 💼 Afeta Carteira
type VARCHAR(20),            -- 'income' ou 'expense'
category VARCHAR(50),        -- 'loot', 'purchase', etc.
description TEXT             -- Descrição
```

## 🎨 Interface Atualizada

### Widget Carteira

```
┌────────────── CARTEIRA ──────────────┐
│ 🏦 Banco  ➕ Registrar  📋 Histórico │
├──────────────────────────────────────┤
│                                       │
│  💼 Dinheiro em Mãos                 │
│                                       │
│  🥇 Ouro:     150  ← Calculado       │
│  🥈 Prata:     30  ← das transações  │
│  🥉 Bronze:    15  ← (receitas-gastos)│
│                                       │
└──────────────────────────────────────┘

Clicou em "🏦 Banco":
┌────────────── BANCO ─────────────────┐
│ 💰 Banco                              │
│                                       │
│ Guarde suas moedas com segurança...  │
│                                       │
│ 🥇 Ouro:    1000  ← Valor do DB      │
│ 🥈 Prata:    500  ← Campo gold       │
│ 🥉 Bronze:   250  ← Campo silver     │
│                                       │
│ [⬇️ Depositar] [⬆️ Sacar]            │
└──────────────────────────────────────┘
```

## 🔄 Como os Dados Fluem

### Criar Transação
```typescript
await addTransaction({
  character_id: character.id,
  type: 'income',
  category: 'loot',
  amount_gold: 100,
  amount_silver: 0,
  amount_bronze: 0,
  description: 'Saque do dragão',
});

// Resultado:
// 1. Transação salva no banco
// 2. CharacterContext recarrega transações
// 3. Currency recalcula totais da carteira
// 4. UI atualiza mostrando novo valor
// 5. Campos gold/silver/bronze do personagem NÃO mudam
```

### Deletar Transação
```typescript
await deleteTransaction(transactionId);

// Resultado:
// 1. Transação deletada do banco
// 2. CharacterContext recarrega transações
// 3. Currency recalcula totais da carteira
// 4. UI atualiza (carteira diminui)
// 5. Campos gold/silver/bronze do personagem NÃO mudam
```

## 💾 Armazenamento

| Dado | Onde está | Como é calculado |
|------|-----------|------------------|
| **Carteira Ouro** | Calculado em tempo real | Σ(transações.income.gold) - Σ(transações.expense.gold) |
| **Carteira Prata** | Calculado em tempo real | Σ(transações.income.silver) - Σ(transações.expense.silver) |
| **Carteira Bronze** | Calculado em tempo real | Σ(transações.income.bronze) - Σ(transações.expense.bronze) |
| **Banco Ouro** | characters.gold | Valor direto do campo |
| **Banco Prata** | characters.silver | Valor direto do campo |
| **Banco Bronze** | characters.bronze | Valor direto do campo |

## ✨ Benefícios da Nova Abordagem

### 1. **Histórico Completo**
Todas as movimentações da carteira são rastreadas

### 2. **Auditoria**
Sempre saberá de onde veio cada moeda

### 3. **Flexibilidade**
Fácil adicionar features como:
- Taxas de transação
- Impostos
- Conversão de moedas
- Relatórios financeiros

### 4. **Segurança**
Banco protege contra:
- Roubo (NPC ladrão)
- Perda (morte do personagem)
- Gastos impulsivos

### 5. **Realismo**
Simula economia real de RPG

## 🚀 Próximos Passos

### Implementar Depositar/Sacar

```typescript
const handleDeposit = async (gold: number, silver: number, bronze: number) => {
  // 1. Criar transação de despesa (sai da carteira)
  await addTransaction({
    character_id: character.id,
    type: 'expense',
    category: 'other',
    amount_gold: gold,
    amount_silver: silver,
    amount_bronze: bronze,
    description: 'Depósito no banco',
  });

  // 2. Aumentar valores do banco (personagem)
  await updateCurrency(
    character.gold + gold,
    character.silver + silver,
    character.bronze + bronze
  );
};

const handleWithdraw = async (gold: number, silver: number, bronze: number) => {
  // 1. Verificar se tem saldo no banco
  if (character.gold < gold || character.silver < silver || character.bronze < bronze) {
    alert('Saldo insuficiente no banco!');
    return;
  }

  // 2. Diminuir valores do banco (personagem)
  await updateCurrency(
    character.gold - gold,
    character.silver - silver,
    character.bronze - bronze
  );

  // 3. Criar transação de receita (entra na carteira)
  await addTransaction({
    character_id: character.id,
    type: 'income',
    category: 'other',
    amount_gold: gold,
    amount_silver: silver,
    amount_bronze: bronze,
    description: 'Saque do banco',
  });
};
```

## 🧪 Testar

### Ver Carteira vs Banco

```javascript
// Console do navegador
console.log('Carteira (calculada):', {
  ouro: walletGold,
  prata: walletSilver,
  bronze: walletBronze
});

console.log('Banco (campo do personagem):', {
  ouro: character.gold,
  prata: character.silver,
  bronze: character.bronze
});
```

---

**Criado em**: 21 de Outubro de 2025  
**Versão**: 2.0 - Sistema Carteira/Banco Separados  
**Status**: ✅ Implementado e Funcionando

