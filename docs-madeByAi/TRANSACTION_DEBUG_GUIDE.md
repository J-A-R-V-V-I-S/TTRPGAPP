# 🔍 Guia de Debug - Sistema de Transações

## ✅ O QUE FOI INTEGRADO

O sistema de transações foi **integrado ao componente Currency** que você já tinha! Agora ele está conectado ao banco de dados real.

## 🎯 PASSOS PARA TESTAR

### 1️⃣ Verificar Tabela no Supabase

Vá em: **Supabase Dashboard** → **Table Editor** → Procure por `transactions`

✅ Se a tabela aparecer: Tudo OK!  
❌ Se não aparecer: Execute novamente o `supabase_transactions_table.sql`

### 2️⃣ Recarregar a Aplicação

No navegador, pressione `Ctrl+Shift+R` (hard reload) ou `F5`

### 3️⃣ Abrir o Console

Pressione `F12` → Aba **Console**

### 4️⃣ Ir para o Perfil do Personagem

1. Vá para a página de perfil do personagem
2. Procure o widget **"Carteira"**
3. Você verá 3 botões:
   - 🏦 Banco
   - ➕ Registrar (botão primário roxo)
   - 📋 (ícone de histórico)

### 5️⃣ Clicar em "➕ Registrar"

O formulário deve aparecer com:
- ✅ Tipo: Receita / Despesa (botões)
- ✅ Categoria: Dropdown
- ✅ Campos para Ouro, Prata, Bronze
- ✅ Descrição
- ✅ Notas (opcional)
- ✅ Botão "✓ Registrar Transação"

### 6️⃣ Preencher e Enviar

**Exemplo de teste:**
```
Tipo: Receita (💰)
Categoria: Recompensa
Ouro: 100
Prata: 0
Bronze: 0
Descrição: Teste de transação
Notas: Primeira transação
```

Clique em "✓ Registrar Transação"

### 7️⃣ Verificar no Console

Você deve ver:
```
💰 Registrando transação...
✅ Transação registrada com sucesso!
✅ Inventário carregado: X itens
✅ Transações carregadas: 1
```

### 8️⃣ Verificar Moedas Atualizadas

- As moedas devem ter aumentado em 100 ouro
- O widget deve mostrar o novo valor

### 9️⃣ Ver Histórico

Clique no botão 📋 (histórico)

Você deve ver:
- ✅ Sua transação aparecendo
- ✅ Badge "💰 RECEITA"
- ✅ Categoria "Recompensa"
- ✅ Descrição "Teste de transação"
- ✅ Valor "+100 PO"
- ✅ Botão 🗑️ para excluir

## 🐛 POSSÍVEIS ERROS E SOLUÇÕES

### Erro: "transactions is not defined"

**Solução**: Recarregue a janela do VS Code
```
Ctrl+Shift+P → "Developer: Reload Window"
```

### Erro: "Cannot read property 'id' of undefined"

**Causa**: `characterId` não está sendo passado  
**Solução**: Verifique se você passou `characterId={character.id}` no Currency

### Erro ao salvar transação (400/406)

**Causa**: Tabela não existe ou RLS bloqueando  
**Soluções**:
1. Verifique se executou o SQL no Supabase
2. Verifique se a política RLS foi criada:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'transactions';
   ```

### Transação não aparece no histórico

**Causa**: Pode ser cache  
**Solução**:
1. Clique em 📋 para fechar
2. Clique novamente para abrir
3. Ou recarregue a página

### Moedas não atualizam

**Causa**: Problema no `updateCurrency`  
**Debug**:
```javascript
// No console
console.log(character.gold);
console.log(character.transactions);
```

## 🧪 TESTE COMPLETO

### Teste 1: Adicionar Receita
1. Clique em "➕ Registrar"
2. Selecione "💰 Receita"
3. Categoria: "Recompensa"
4. Ouro: 50
5. Descrição: "Teste 1"
6. Registrar
7. ✅ Moedas aumentam em 50 ouro

### Teste 2: Adicionar Despesa
1. Clique em "➕ Registrar"
2. Selecione "💸 Despesa"
3. Categoria: "Compra"
4. Ouro: 20
5. Descrição: "Teste 2"
6. Registrar
7. ✅ Moedas diminuem em 20 ouro

### Teste 3: Ver Histórico
1. Clique em 📋
2. ✅ Deve mostrar 2 transações
3. ✅ Ordem: Teste 2, Teste 1 (mais recente primeiro)

### Teste 4: Excluir Transação
1. No histórico, clique em 🗑️ da primeira transação
2. Confirme
3. ✅ Transação removida
4. ✅ Moedas revertidas (+20 ouro)

## 📊 VERIFICAR NO BANCO DE DADOS

### Ver transações no Supabase

1. Supabase Dashboard → **Table Editor** → `transactions`
2. Você deve ver suas transações registradas
3. Verifique os campos:
   - `character_id`: UUID do seu personagem
   - `type`: 'income' ou 'expense'
   - `category`: 'loot', 'reward', 'purchase', etc.
   - `amount_gold`, `amount_silver`, `amount_bronze`
   - `description`
   - `created_at`

## 💡 DICAS

### Console Logs Úteis

```javascript
// Ver personagem completo
console.log(character);

// Ver transações
console.log(character.transactions);

// Ver moedas
console.log({
  ouro: character.gold,
  prata: character.silver,
  bronze: character.bronze
});
```

### Forçar Recarregamento

Se algo estiver estranho:
1. Feche e abra a aba do navegador
2. Ou pressione `Ctrl+Shift+R` (hard reload)
3. Ou limpe o cache do navegador

## ✨ RESULTADO ESPERADO

Após tudo funcionar:

1. ✅ Botão "➕ Registrar" funciona
2. ✅ Formulário aparece e é preenchível
3. ✅ Transação é salva no banco
4. ✅ Moedas são atualizadas automaticamente
5. ✅ Transação aparece no histórico (📋)
6. ✅ Exclusão reverte as moedas
7. ✅ Filtros funcionam (quando implementados)

---

**Se ainda houver problemas, compartilhe:**
1. O erro exato do console
2. A mensagem de erro (se houver)
3. Screenshots (se possível)

Vou ajudar a resolver! 🚀

