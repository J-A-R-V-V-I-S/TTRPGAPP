# Guia de Teste - Contexto de Usuário

Este guia ajuda a testar o novo sistema de contexto de usuário que diferencia jogadores e Game Masters.

## Pré-requisitos

1. Banco de dados Supabase configurado
2. Tabelas criadas conforme `supabase_schema.sql`
3. Aplicação rodando (`npm run dev`)

## Preparação dos Dados de Teste

### 1. Criar Usuários de Teste

Execute no SQL Editor do Supabase:

```sql
-- Criar usuário jogador
INSERT INTO users (id, username, email, is_game_master)
VALUES (
  'UUID_DO_AUTH_USER_1',  -- Substituir pelo UUID do usuário criado no Auth
  'jogador_teste',
  'jogador@teste.com',
  false
);

-- Criar usuário Game Master
INSERT INTO users (id, username, email, is_game_master)
VALUES (
  'UUID_DO_AUTH_USER_2',  -- Substituir pelo UUID do usuário criado no Auth
  'mestre_teste',
  'mestre@teste.com',
  true
);
```

### 2. Criar Personagens de Teste (para o jogador)

```sql
INSERT INTO characters (
  user_id, 
  name, 
  race, 
  class, 
  origin, 
  size, 
  level,
  current_health,
  max_health,
  current_mana,
  max_mana
) VALUES 
(
  'UUID_DO_JOGADOR',
  'Thorin Barba de Ferro',
  'Anão',
  'Guerreiro',
  'Montanhas do Norte',
  'Médio',
  5,
  45,
  45,
  10,
  10
),
(
  'UUID_DO_JOGADOR',
  'Elara Luz da Lua',
  'Elfo',
  'Arcanista',
  'Floresta Élfica',
  'Médio',
  3,
  20,
  20,
  35,
  35
);
```

### 3. Criar Jogos de Teste (para o Game Master)

```sql
INSERT INTO games (
  game_master_id,
  name,
  description,
  is_active
) VALUES
(
  'UUID_DO_GAME_MASTER',
  'As Casas de Tesselar',
  'Uma aventura épica nas terras místicas de Tesselar',
  true
),
(
  'UUID_DO_GAME_MASTER',
  'A Maldição do Templo Perdido',
  'Exploração de ruínas antigas e mistérios ocultos',
  true
),
(
  'UUID_DO_GAME_MASTER',
  'Campanha Antiga (Finalizada)',
  'Campanha finalizada do ano passado',
  false
);
```

## Cenários de Teste

### Teste 1: Login como Jogador

**Passos:**
1. Acesse `http://localhost:5173/login`
2. Faça login com o usuário jogador (`jogador@teste.com`)
3. Após o login, você deve ser redirecionado para `/`

**Resultado Esperado:**
- ✅ Vê o nome do usuário no topo: "jogador_teste"
- ✅ Vê o título "Seus Personagens"
- ✅ Vê o botão "+ Novo Personagem"
- ✅ Vê cards dos personagens criados
- ✅ Cada card mostra: nome, nível, classe e raça
- ✅ Não vê nada relacionado a jogos ou Game Master

**Teste de Interação:**
- Click em um card de personagem → deve navegar para `/profile/${characterId}`
- Click em "+ Novo Personagem" → deve navegar para `/create-character`

### Teste 2: Login como Game Master

**Passos:**
1. Faça logout (se estiver logado)
2. Acesse `http://localhost:5173/login`
3. Faça login com o usuário Game Master (`mestre@teste.com`)
4. Após o login, você deve ser redirecionado para `/`

**Resultado Esperado:**
- ✅ Vê o nome do usuário no topo: "mestre_teste"
- ✅ Vê o título "Seus Jogos"
- ✅ Vê o botão "+ Novo Jogo"
- ✅ Vê cards dos jogos criados
- ✅ Cada card mostra: nome do jogo, status (badge verde "ATIVO" ou cinza "INATIVO") e descrição
- ✅ Não vê nada relacionado a personagens

**Teste de Interação:**
- Click em um card de jogo → deve navegar para `/game/${gameId}` (rota a ser criada)
- Click em "+ Novo Jogo" → mostra console.log por enquanto

### Teste 3: Estado Vazio - Jogador sem Personagens

**Preparação:**
1. Crie um novo usuário jogador sem personagens

**Passos:**
1. Faça login com o novo usuário

**Resultado Esperado:**
- ✅ Vê o título "Seus Personagens"
- ✅ Vê mensagem amigável: "Você ainda não tem personagens."
- ✅ Vê mensagem de incentivo: "Crie seu primeiro personagem para começar sua aventura!"
- ✅ Vê o botão "+ Novo Personagem"

### Teste 4: Estado Vazio - Game Master sem Jogos

**Preparação:**
1. Crie um novo usuário Game Master sem jogos

**Passos:**
1. Faça login com o novo usuário

**Resultado Esperado:**
- ✅ Vê o título "Seus Jogos"
- ✅ Vê mensagem amigável: "Você ainda não criou nenhum jogo."
- ✅ Vê mensagem de incentivo: "Crie seu primeiro jogo para começar a mestrar!"
- ✅ Vê o botão "+ Novo Jogo"

### Teste 5: Estado de Carregamento

**Passos:**
1. Abra as DevTools do navegador (F12)
2. Vá para Network → Throttling → Slow 3G
3. Faça login com qualquer usuário

**Resultado Esperado:**
- ✅ Enquanto carrega, vê a mensagem "Carregando..."
- ✅ Após carregar, vê o conteúdo apropriado

### Teste 6: Proteção de Rotas

**Passos:**
1. Certifique-se de estar deslogado
2. Tente acessar diretamente `http://localhost:5173/`

**Resultado Esperado:**
- ✅ É automaticamente redirecionado para `/login`
- ✅ Após fazer login, é redirecionado de volta para `/`

### Teste 7: Console - Verificar Erros

**Passos:**
1. Abra as DevTools (F12) → Console
2. Faça login e navegue pela aplicação

**Resultado Esperado:**
- ✅ Não há erros no console
- ✅ Não há warnings de React
- ✅ Não há erros de TypeScript

## Verificando no Código

### Como verificar se está usando o contexto corretamente

No componente Home, abra o console do navegador e adicione:

```tsx
console.log('User Data:', userData);
console.log('Is Game Master:', isGameMaster);
console.log('Characters:', characters);
console.log('Games:', games);
```

**Para Jogador, deve mostrar:**
```javascript
User Data: { id: "...", username: "jogador_teste", isGameMaster: false, ... }
Is Game Master: false
Characters: [{ id: "...", name: "Thorin Barba de Ferro", ... }]
Games: []
```

**Para Game Master, deve mostrar:**
```javascript
User Data: { id: "...", username: "mestre_teste", isGameMaster: true, ... }
Is Game Master: true
Characters: []
Games: [{ id: "...", name: "As Casas de Tesselar", ... }]
```

## Testes de Integração com DevTools

### 1. Verificar chamadas à API

Na aba **Network** das DevTools:

**Para Jogador:**
- ✅ Deve fazer chamada GET para `/rest/v1/users?id=eq.UUID_JOGADOR`
- ✅ Deve fazer chamada GET para `/rest/v1/characters?user_id=eq.UUID_JOGADOR`
- ❌ NÃO deve fazer chamada para `/rest/v1/games`

**Para Game Master:**
- ✅ Deve fazer chamada GET para `/rest/v1/users?id=eq.UUID_GM`
- ✅ Deve fazer chamada GET para `/rest/v1/games?game_master_id=eq.UUID_GM`
- ❌ NÃO deve fazer chamada para `/rest/v1/characters`

### 2. Verificar estado do React

Use a extensão **React DevTools**:

1. Vá para a aba "Components"
2. Encontre `UserProvider`
3. Verifique o estado:
   - `userData` deve conter os dados do usuário
   - `characters` ou `games` deve conter os dados corretos
   - `loading` deve ser `false` após carregar
   - `error` deve ser `null` se tudo estiver ok

## Problemas Comuns e Soluções

### Problema: "Carregando..." infinito

**Possíveis causas:**
- Usuário não existe na tabela `users`
- Credenciais do Supabase incorretas
- RLS (Row Level Security) bloqueando a consulta

**Solução:**
1. Verifique se o usuário existe: `SELECT * FROM users WHERE id = 'UUID_DO_USER';`
2. Verifique o console do navegador para erros
3. Verifique as políticas RLS do Supabase

### Problema: Lista vazia mesmo com dados no banco

**Possíveis causas:**
- Mapeamento incorreto de campos (snake_case vs camelCase)
- `user_id` ou `game_master_id` não correspondem ao ID do usuário logado

**Solução:**
1. Verifique o console do navegador
2. Verifique a aba Network para ver a resposta da API
3. Confirme os IDs no banco de dados

### Problema: Redireciona para login mesmo estando autenticado

**Possíveis causas:**
- Sessão expirada
- Token inválido
- Cookies bloqueados

**Solução:**
1. Limpe o localStorage do navegador
2. Faça logout e login novamente
3. Verifique se os cookies estão habilitados

## Checklist Final

Antes de considerar o teste completo, verifique:

- [ ] Jogador vê apenas personagens
- [ ] Game Master vê apenas jogos
- [ ] Estado vazio mostra mensagens apropriadas
- [ ] Botões de criação funcionam
- [ ] Navegação entre páginas funciona
- [ ] Proteção de rotas funciona
- [ ] Não há erros no console
- [ ] Não há erros de linting
- [ ] Layout responsivo funciona
- [ ] Estado de carregamento aparece brevemente

## Relatando Problemas

Se encontrar problemas, reporte com:
1. Tipo de usuário (jogador ou GM)
2. Passos para reproduzir
3. Resultado esperado vs resultado obtido
4. Screenshot do console (se houver erros)
5. Screenshot da aba Network das DevTools

