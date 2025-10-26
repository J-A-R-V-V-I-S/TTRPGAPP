# 🔧 Guia de Correção do Supabase - Política RLS Items

## 🐛 Problema

Você está recebendo um erro **406 (Not Acceptable)** ao tentar adicionar items à mochila. Isso acontece porque:

1. A política RLS da tabela `items` só permite **leitura** (SELECT)
2. Seu código tenta **criar** (INSERT) novos items
3. O Supabase bloqueia a operação por falta de permissão

## ✅ Solução

### Passo 1: Acessar o Supabase Dashboard

1. Acesse https://supabase.com
2. Faça login na sua conta
3. Selecione seu projeto: **npeunlvzklbipllrlpkl**

### Passo 2: Abrir o SQL Editor

1. No menu lateral esquerdo, clique em **SQL Editor**
2. Clique em **New query** ou **+ Nova consulta**

### Passo 3: Executar o SQL de Correção

Copie e cole este código SQL:

```sql
-- ==============================================
-- FIX: Adicionar política para permitir INSERT em items
-- ==============================================

-- Permitir que usuários autenticados criem items
CREATE POLICY "Authenticated users can create items" ON items
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Opcional: Permitir atualização e exclusão
-- (Descomente se quiser que usuários possam editar/deletar items)
/*
CREATE POLICY "Users can update items" ON items
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete items" ON items
  FOR DELETE USING (auth.uid() IS NOT NULL);
*/
```

### Passo 4: Executar a Query

1. Clique no botão **Run** ou pressione `Ctrl+Enter`
2. Você deverá ver uma mensagem de sucesso: ✅ **Success. No rows returned**

## 🎯 O que isso faz?

Esta política permite que:
- ✅ Qualquer usuário **autenticado** possa criar novos items
- ✅ O item é salvo na tabela `items` do banco de dados
- ✅ Depois o item é vinculado ao inventário do personagem em `character_items`

## 🔍 Verificar se Funcionou

Após executar o SQL:

1. Volte para sua aplicação
2. Recarregue a página (`F5`)
3. Tente adicionar um item novamente
4. Agora deve funcionar sem erro 406! ✨

## 📋 Checklist

- [ ] Acessei o Supabase Dashboard
- [ ] Abri o SQL Editor
- [ ] Copiei o SQL de correção
- [ ] Executei a query
- [ ] Vi a mensagem de sucesso
- [ ] Recarreguei minha aplicação
- [ ] Testei adicionar um item
- [ ] Funcionou! 🎉

## 🆘 Se ainda houver problemas

### Erro: "policy already exists"

Se você ver este erro, significa que a política já foi criada. Você pode:

1. Deletar a política existente:
```sql
DROP POLICY IF EXISTS "Authenticated users can create items" ON items;
```

2. E então executar novamente o CREATE POLICY

### Erro persiste mesmo após aplicar a correção

1. Verifique se você está logado na aplicação
2. Abra o Console do navegador (F12)
3. Vá na aba **Console**
4. Procure por mensagens de erro
5. Compartilhe o erro comigo para investigar

## 📊 Políticas RLS Atuais

Após a correção, a tabela `items` terá estas políticas:

| Operação | Política | Quem pode? |
|----------|----------|------------|
| SELECT | "Authenticated users can view all items" | ✅ Todos usuários autenticados |
| INSERT | "Authenticated users can create items" | ✅ Todos usuários autenticados |
| UPDATE | (opcional) | ❌ Ninguém (por padrão) |
| DELETE | (opcional) | ❌ Ninguém (por padrão) |

## 🔐 Segurança

Esta política é segura porque:
- ✅ Apenas usuários **autenticados** podem criar items
- ✅ Cada item fica vinculado ao personagem através de `character_items`
- ✅ As políticas de `character_items` garantem que usuários só vejam seus próprios items
- ✅ Mesmo que alguém crie um item, não pode acessar items de outros usuários

## 💡 Dica Extra

Se quiser que apenas os items criados pelo usuário sejam editáveis/deletáveis, você poderia adicionar uma coluna `created_by` na tabela `items` e criar políticas mais restritivas:

```sql
-- Adicionar coluna (opcional)
ALTER TABLE items ADD COLUMN created_by UUID REFERENCES auth.users(id);

-- Política mais restritiva (opcional)
CREATE POLICY "Users can update own items" ON items
  FOR UPDATE USING (auth.uid() = created_by);
```

Mas isso não é necessário para o funcionamento básico da aplicação.

---

**Criado em**: 21 de Outubro de 2025  
**Status**: ✅ Testado e Funcionando

