# Fluxos de Autenticação e Autorização - Tormenta20 TTRPGAPP

**Status da Análise**: ✅ Completo
**Data**: 2025-10-25
**Arquivos Analisados**: AuthContext.tsx, UserContext.tsx, ProtectedRoute.tsx, Login/Register pages, API services, Supabase configs

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura de Autenticação](#arquitetura-de-autenticação)
3. [Fluxo de Registro (Sign Up)](#fluxo-de-registro-sign-up)
4. [Fluxo de Login (Sign In)](#fluxo-de-login-sign-in)
5. [Fluxo de Logout (Sign Out)](#fluxo-de-logout-sign-out)
6. [Sistema de Autorização](#sistema-de-autorização)
7. [Proteção de Rotas](#proteção-de-rotas)
8. [Segurança e RLS](#segurança-e-rls)
9. [Persistência de Sessão](#persistência-de-sessão)
10. [Fluxo Completo com Diagrama](#fluxo-completo-com-diagrama)

---

## Visão Geral

O aplicativo utiliza **Supabase Auth** como sistema de autenticação, com uma camada adicional de contextos React para gerenciar estado e autorização baseada em roles (Player vs Game Master).

### Stack de Autenticação

- **Provider**: Supabase Authentication
- **State Management**: React Context API (AuthContext + UserContext)
- **Route Protection**: ProtectedRoute HOC
- **Session Storage**: localStorage + Supabase session storage
- **Token Management**: Automático via Supabase (auto-refresh enabled)

---

## Arquitetura de Autenticação

### Hierarquia de Contexts

```
App.tsx
└── AuthProvider (camada 1 - autenticação base)
    └── UserProvider (camada 2 - dados do usuário + role)
        └── CharacterProvider (camada 3 - dados do personagem)
            └── Router + Routes
```

### Responsabilidades

| Context | Arquivo | Responsabilidade |
|---------|---------|------------------|
| **AuthContext** | `src/contexts/AuthContext.tsx` | Gerencia autenticação Supabase (sign in/up/out), auth state |
| **UserContext** | `src/contexts/UserContext.tsx` | Carrega perfil do usuário, determina role (Player/GM), gerencia personagens/jogos |
| **CharacterProvider** | `src/contexts/CharacterContext.tsx` | Gerencia estado completo do personagem selecionado |

---

## Fluxo de Registro (Sign Up)

### 📄 Arquivo: `src/pages/auth/register/register.tsx`

### Campos do Formulário

1. **Email** (obrigatório)
2. **Username** (obrigatório)
3. **Password** (mínimo 6 caracteres)
4. **Confirm Password** (validação client-side)
5. **Role** (seletor):
   - `"player"` → Jogador (padrão)
   - `"game-master"` → Game Master

### Fluxo Técnico

```typescript
// 1. USER CLICA EM "REGISTER"
handleSubmit(e) {
  e.preventDefault();

  // 2. VALIDAÇÕES CLIENT-SIDE
  if (password !== confirmPassword) return setError('Passwords do not match');
  if (password.length < 6) return setError('Password must be at least 6 characters');

  // 3. CHAMADA PARA AuthContext.signUp()
  const isGameMaster = role === 'game-master';
  const { error } = await signUp(email, password, username, isGameMaster);

  // 4. REDIRECIONAMENTO
  if (!error) {
    alert('Registration successful! Please check your email to verify your account.');
    navigate('/login');
  }
}
```

### AuthContext.signUp() - DUAL INSERT

```typescript
// Arquivo: src/contexts/AuthContext.tsx:62-91

async signUp(email, password, username, isGameMaster = false) {
  // PASSO 1: Criar usuário na tabela auth.users (Supabase Auth)
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username }  // Armazenado em auth.users.raw_user_meta_data
    }
  });

  if (error || !data.user) return { error };

  // PASSO 2: Criar registro na tabela public.users
  const { error: profileError } = await supabase
    .from('users')
    .insert([{
      id: data.user.id,              // MESMO UUID do auth.users
      username,
      email,
      is_game_master: isGameMaster   // ⭐ DETERMINA O ROLE
    }]);

  return { error: profileError };
}
```

### ⚠️ Importante: Verificação de Email

- Supabase **requer verificação de email** por padrão
- Usuário recebe email com link de confirmação
- Apenas após confirmação, pode fazer login
- Para desabilitar: Supabase Dashboard → Authentication → Email Auth → "Confirm email" OFF

---

## Fluxo de Login (Sign In)

### 📄 Arquivo: `src/pages/auth/login/login.tsx`

### Campos do Formulário

1. **Email** (obrigatório)
2. **Password** (obrigatório)

### Fluxo Técnico

```typescript
// 1. USER CLICA EM "LOGIN"
handleSubmit(e) {
  e.preventDefault();

  // 2. CHAMADA PARA AuthContext.signIn()
  const { error } = await signIn(email, password);

  // 3. REDIRECIONAMENTO
  if (!error) {
    navigate('/');  // Home page (protegida)
  } else {
    setError(error.message);
  }
}
```

### AuthContext.signIn()

```typescript
// Arquivo: src/contexts/AuthContext.tsx:54-60

async signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { error };
}
```

### Cascade de Efeitos Após Login

```
1. signInWithPassword() → sessão criada
         ↓
2. onAuthStateChange() dispara (AuthContext.tsx:45)
         ↓
3. setUser() e setSession() atualizados
         ↓
4. UserContext detecta novo user (useEffect em UserContext.tsx:112)
         ↓
5. fetchUserData() → carrega dados da tabela users
         ↓
6. Determina isGameMaster (UserContext.tsx:47)
         ↓
7. Se Player → fetchCharacters() (UserContext.tsx:82-94)
   Se GM → fetchGames() (UserContext.tsx:97-109)
         ↓
8. CharacterProvider carrega personagem selecionado (se existir)
         ↓
9. Home page renderiza com dados completos
```

---

## Fluxo de Logout (Sign Out)

### AuthContext.signOut()

```typescript
// Arquivo: src/contexts/AuthContext.tsx:93-95

async signOut() {
  await supabase.auth.signOut();
}
```

### Cascade de Efeitos Após Logout

```
1. signOut() → sessão destruída
         ↓
2. onAuthStateChange() dispara com session = null
         ↓
3. setUser(null) e setSession(null)
         ↓
4. UserContext detecta user = null (UserContext.tsx:60-66)
         ↓
5. setUserData(null), setCharacters([]), setGames([])
         ↓
6. CharacterProvider limpa dados do personagem
         ↓
7. ProtectedRoute detecta !user → redirect para /login
```

---

## Sistema de Autorização

### Player vs Game Master

O sistema tem **dois tipos de usuários** com fluxos completamente diferentes:

| Tipo | Campo no DB | Home Page | Dados Carregados |
|------|-------------|-----------|------------------|
| **Player** | `is_game_master = false` | Lista de personagens | `characters[]` |
| **Game Master** | `is_game_master = true` | Lista de jogos | `games[]` |

### Implementação no UserContext

```typescript
// Arquivo: src/contexts/UserContext.tsx:42-47

const [userData, setUserData] = useState<User | null>(null);
const [characters, setCharacters] = useState<Character[]>([]);
const [games, setGames] = useState<Game[]>([]);

// ⭐ DERIVED STATE
const isGameMaster = userData?.isGameMaster ?? false;
```

### Renderização Condicional

```typescript
// Arquivo: src/pages/home/home.tsx:46-130

return (
  <div className="home-container">
    <h1>{userData?.username || 'Usuário'}</h1>

    {/* PLAYER VIEW */}
    {!isGameMaster && (
      <div className="characters-section">
        <h2>Seus Personagens</h2>
        <button onClick={handleCreateCharacter}>+ Novo Personagem</button>
        {characters.map(char => (
          <CharacterCard key={char.id} character={char} />
        ))}
      </div>
    )}

    {/* GAME MASTER VIEW */}
    {isGameMaster && (
      <div className="characters-section">
        <h2>Seus Jogos</h2>
        <button onClick={handleCreateGame}>+ Novo Jogo</button>
        {games.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    )}
  </div>
);
```

### API Layer - Filtragem por User ID

```typescript
// Arquivo: src/services/api.ts:22-46

export const userApi = {
  async getCurrentUser() {
    // 1. Pega o auth user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // 2. Busca dados completos na tabela users
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)  // ⭐ FILTRA POR USER ID
      .single();

    if (error) throw error;

    // 3. Mapeia snake_case → camelCase
    return {
      id: data.id,
      username: data.username,
      email: data.email,
      isGameMaster: data.is_game_master,  // ⭐ ROLE
      // ... outros campos
    } as User;
  }
}
```

---

## Proteção de Rotas

### 📄 Arquivo: `src/components/ProtectedRoute.tsx`

### Implementação

```typescript
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // 1. ESTADO DE CARREGAMENTO
  if (loading) {
    return <div>Loading...</div>;
  }

  // 2. SEM AUTENTICAÇÃO → REDIRECT
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. AUTENTICADO → RENDERIZA CONTEÚDO
  return <>{children}</>;
};
```

### Rotas Protegidas (App.tsx)

```typescript
<Routes>
  {/* ROTAS PÚBLICAS */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/modal-example" element={<ModalExample />} />

  {/* ROTAS PROTEGIDAS */}
  <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
  <Route path="/profile/:characterId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
  <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
  <Route path="/backstory" element={<ProtectedRoute><BackstoryPage /></ProtectedRoute>} />
  <Route path="/combat" element={<ProtectedRoute><Combat /></ProtectedRoute>} />
  <Route path="/skills" element={<ProtectedRoute><Skills /></ProtectedRoute>} />
  <Route path="/proficiencies" element={<ProtectedRoute><Proficiencies /></ProtectedRoute>} />
  <Route path="/group" element={<ProtectedRoute><Group /></ProtectedRoute>} />
  <Route path="/attributes" element={<ProtectedRoute><Attributes /></ProtectedRoute>} />
  <Route path="/create-character" element={<ProtectedRoute><CharacterCreation /></ProtectedRoute>} />
</Routes>
```

### Matriz de Acesso

| Rota | Público | Player | GM | Notas |
|------|---------|--------|-----|-------|
| `/login` | ✅ | ✅ | ✅ | Público |
| `/register` | ✅ | ✅ | ✅ | Público |
| `/` (Home) | ❌ | ✅ | ✅ | Renderização diferente por role |
| `/profile/:characterId` | ❌ | ✅ | ⚠️ | GMs não têm personagens |
| `/create-character` | ❌ | ✅ | ⚠️ | GMs não criam personagens |
| Todas as outras | ❌ | ✅ | ⚠️ | Fluxo focado em Players |

⚠️ **Observação**: Atualmente NÃO há validação de role nas rotas. Um GM pode tecnicamente acessar `/profile` se tiver um characterId, mas isso não faz parte do fluxo normal.

---

## Segurança e RLS

### Status Atual

| Aspecto | Status | Detalhes |
|---------|--------|----------|
| **RLS Habilitado** | ❌ | Apenas `transactions` table |
| **Políticas Definidas** | ✅ | `supabase_rls_policies.sql` (357 linhas) |
| **Políticas Aplicadas** | ❌ | **NÃO** aplicadas ao database |
| **Razão** | 👥 | Projeto entre amigos (decisão do usuário) |

### Verificação de Segurança (via MCP Supabase)

```sql
-- Query executada: W:\rpg webapp\TTRPGAPP\docs-madeByAi\AUTHENTICATION_AUTHORIZATION_FLOWS.md

SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename IN ('users', 'characters', 'transactions');

-- RESULTADO (apenas 1 policy ativa):
┌────────────────┬──────────────────┬─────────────────────────────────────────────┐
│ schemaname     │ tablename        │ policyname                                  │
├────────────────┼──────────────────┼─────────────────────────────────────────────┤
│ public         │ transactions     │ Users can manage own character transactions │
└────────────────┴──────────────────┴─────────────────────────────────────────────┘
```

### RLS Policy Implementada (transactions)

```sql
-- Arquivo: docs-madeByAi/supabase_transactions_table.sql

CREATE POLICY "Users can manage own character transactions"
ON transactions
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM characters
    WHERE characters.id = transactions.character_id
      AND characters.user_id = auth.uid()
  )
);
```

### Políticas Disponíveis (NÃO aplicadas)

O arquivo `supabase_rls_policies.sql` contém políticas completas para:

- **users**: View/update/insert own profile
- **characters**: CRUD own characters
- **character_attributes**: Manage via character ownership
- **skills, proficiencies, notes**: Manage via character ownership
- **spells, abilities, items**: Read-only catalogs para todos
- **character_spells, character_items, attacks**: Manage via character ownership
- **games**: GMs manage own games, players view games they're in
- **game_players**: GMs manage, players view
- **game_sessions**: GMs manage, players view
- **groups**: Group members view/update
- **group_storage**: Group members manage

### Implicações de Segurança

⚠️ **RISCO**: Sem RLS nas tabelas principais, qualquer usuário autenticado pode:
- Ler TODOS os personagens de TODOS os usuários
- Modificar personagens que não são seus
- Acessar dados de outros jogadores

✅ **MITIGAÇÃO ATUAL**:
- Frontend usa `user.id` para filtrar queries (`.eq('user_id', userId)`)
- Confiança entre amigos (projeto privado)
- Supabase anon key não exposta publicamente

🔒 **RECOMENDAÇÃO**: Se o projeto se tornar público ou tiver usuários não confiáveis, aplicar as políticas RLS definidas.

---

## Persistência de Sessão

### Supabase Session Storage

```typescript
// Arquivo: src/config/supabase.ts:10-16

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,        // ⭐ Renova token automaticamente
    persistSession: true,           // ⭐ Salva sessão no localStorage
    detectSessionInUrl: true        // ⭐ Detecta sessão de magic links
  }
});
```

### localStorage - Selected Character

```typescript
// Arquivo: src/contexts/UserContext.tsx:42-56

const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(() => {
  // ⭐ INIT: Carrega do localStorage
  return localStorage.getItem('selectedCharacterId');
});

// ⭐ SYNC: Salva no localStorage quando muda
useEffect(() => {
  if (selectedCharacterId) {
    localStorage.setItem('selectedCharacterId', selectedCharacterId);
  } else {
    localStorage.removeItem('selectedCharacterId');
  }
}, [selectedCharacterId]);
```

### Comportamento de Persistência

| Cenário | Sessão Auth | selectedCharacterId | Resultado |
|---------|-------------|---------------------|-----------|
| **Primeira visita** | ❌ | ❌ | Redirect → `/login` |
| **Login bem-sucedido** | ✅ | ❌ | Home → lista de personagens |
| **Seleciona personagem** | ✅ | ✅ | Redirect → `/profile/:id` |
| **Refresh da página** | ✅ | ✅ | Mantém personagem selecionado |
| **Fecha e reabre navegador** | ✅ | ✅ | Mantém autenticação E personagem |
| **Logout** | ❌ | ✅ (ainda no storage) | Redirect → `/login`, personagem limpo no próximo login |

---

## Fluxo Completo com Diagrama

### Fluxo Detalhado: Do Registro ao Personagem

```
┌─────────────────────────────────────────────────────────────────┐
│                    FASE 1: REGISTRO                              │
└─────────────────────────────────────────────────────────────────┘

User → Register Page
   ↓
Preenche: email, username, password, role (player/game-master)
   ↓
handleSubmit()
   ↓
AuthContext.signUp(email, password, username, isGameMaster)
   ├─→ 1. Cria user em auth.users (Supabase Auth)
   └─→ 2. Cria record em public.users (is_game_master: boolean)
   ↓
Alert: "Check your email"
   ↓
User → Email → Click verification link
   ↓
Supabase confirma email
   ↓
Redirect → Login Page

┌─────────────────────────────────────────────────────────────────┐
│                    FASE 2: LOGIN                                 │
└─────────────────────────────────────────────────────────────────┘

User → Login Page
   ↓
Preenche: email, password
   ↓
handleSubmit()
   ↓
AuthContext.signIn(email, password)
   ↓
supabase.auth.signInWithPassword() → SESSION CRIADA
   ↓
onAuthStateChange() DISPARA (AuthContext)
   ├─→ setUser(session.user)
   └─→ setSession(session)
   ↓
useEffect detecta user (UserContext:112)
   ↓
fetchUserData()
   ├─→ Query: SELECT * FROM users WHERE id = auth.uid()
   └─→ setUserData({ ..., isGameMaster: data.is_game_master })
   ↓
useEffect detecta userData (UserContext:118)
   ↓
   ┌───────────────────────────────────────────────┐
   │ IF isGameMaster = TRUE                        │
   │   ↓                                           │
   │ fetchGames()                                  │
   │   ↓                                           │
   │ Query: SELECT * FROM games                    │
   │        WHERE game_master_id = auth.uid()      │
   │   ↓                                           │
   │ setGames([...])                               │
   │   ↓                                           │
   │ RENDER: Home com lista de jogos               │
   └───────────────────────────────────────────────┘
   │
   ┌───────────────────────────────────────────────┐
   │ IF isGameMaster = FALSE (PLAYER)              │
   │   ↓                                           │
   │ fetchCharacters()                             │
   │   ↓                                           │
   │ Query: SELECT * FROM characters               │
   │        WHERE user_id = auth.uid()             │
   │   ↓                                           │
   │ setCharacters([...])                          │
   │   ↓                                           │
   │ RENDER: Home com lista de personagens         │
   └───────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│             FASE 3: SELEÇÃO DE PERSONAGEM                        │
└─────────────────────────────────────────────────────────────────┘

User → Home Page → Click em Character Card
   ↓
handleCharacterClick(characterId)
   ├─→ setSelectedCharacterId(characterId)
   │     └─→ localStorage.setItem('selectedCharacterId', characterId)
   └─→ navigate(`/profile/${characterId}`)
   ↓
Profile Page monta
   ↓
useEffect no Profile (profile.tsx:33)
   └─→ setSelectedCharacterId(characterId) [redundante, já setado]
   ↓
CharacterContext detecta selectedCharacterId (CharacterContext.tsx)
   ↓
loadCharacter(characterId)
   ↓
Promise.all([
  loadInventory(characterId),
  loadTransactions(characterId),
  loadNotes(characterId),
  loadAttributes(characterId),
  loadSkills(characterId),
  loadAttacks(characterId),
  loadSpells(characterId),
  loadAbilities(characterId),
  loadPowers(characterId)
]) → 9 queries em paralelo
   ↓
Calcula current_load
   ↓
setCharacter({ ...allData })
   ↓
RENDER: Profile Page completa com todos os dados

┌─────────────────────────────────────────────────────────────────┐
│                    FASE 4: PERSISTÊNCIA                          │
└─────────────────────────────────────────────────────────────────┘

User → Refresh (F5)
   ↓
App monta
   ↓
AuthProvider monta
   ├─→ supabase.auth.getSession() → RECUPERA SESSÃO DO STORAGE
   └─→ setUser(session.user), setSession(session)
   ↓
UserProvider monta
   ├─→ Detecta user do AuthContext
   └─→ Repete FASE 2 (fetchUserData → fetchCharacters/Games)
   ↓
CharacterProvider monta
   ├─→ selectedCharacterId carregado do localStorage
   └─→ Repete FASE 3 (loadCharacter)
   ↓
RESULT: User permanece logado e no personagem selecionado

┌─────────────────────────────────────────────────────────────────┐
│                    FASE 5: LOGOUT                                │
└─────────────────────────────────────────────────────────────────┘

User → Click "Logout" (via Navbar ou Profile)
   ↓
AuthContext.signOut()
   ↓
supabase.auth.signOut() → SESSÃO DESTRUÍDA
   ↓
onAuthStateChange() DISPARA com session = null
   ├─→ setUser(null)
   └─→ setSession(null)
   ↓
UserContext detecta user = null (UserContext:60)
   ├─→ setUserData(null)
   ├─→ setCharacters([])
   └─→ setGames([])
   ↓
CharacterContext limpa character state
   ↓
ProtectedRoute detecta !user
   ↓
<Navigate to="/login" replace />
   ↓
User → Login Page
```

---

## 🔍 Observações e Melhorias Potenciais

### ✅ Pontos Fortes

1. **Separação de Responsabilidades**: AuthContext (auth) vs UserContext (dados)
2. **Persistência Robusta**: Session + selectedCharacterId
3. **Type Safety**: TypeScript em todos os contextos e APIs
4. **Auto-refresh**: Tokens renovados automaticamente
5. **Parallel Loading**: CharacterContext carrega dados em paralelo (Performance)

### ⚠️ Potenciais Melhorias

1. **Role-based Route Guards**: Adicionar verificação de `isGameMaster` no ProtectedRoute
   ```typescript
   <ProtectedRoute requireRole="player">
     <Profile />
   </ProtectedRoute>
   ```

2. **RLS Implementation**: Aplicar as políticas definidas em `supabase_rls_policies.sql`

3. **Error Boundaries**: Adicionar error boundaries nos Providers para capturar erros de auth

4. **Loading States**: Melhorar UX dos estados de loading (skeleton screens)

5. **Password Reset**: Implementar fluxo de "Esqueci minha senha"

6. **OAuth Providers**: Adicionar login social (Google, Discord, etc.)

7. **2FA/MFA**: Supabase suporta TOTP, SMS, etc. (conforme advisory de segurança)

8. **Session Timeout**: Implementar logout automático após inatividade

---

## 📊 Estatísticas do Sistema

| Métrica | Valor |
|---------|-------|
| **Contexts de Auth** | 3 (Auth, User, Character) |
| **Rotas Protegidas** | 10 de 13 rotas |
| **Rotas Públicas** | 3 (login, register, modal-example) |
| **Tabelas com RLS** | 1 de 25 (4%) |
| **Políticas Definidas** | ~50 (em supabase_rls_policies.sql) |
| **Políticas Aplicadas** | 1 (transactions) |
| **Auth Providers** | 1 (email/password) |
| **User Roles** | 2 (Player, Game Master) |

---

## 🎯 Conclusão

O sistema de autenticação e autorização está **funcional e bem estruturado** para um projeto entre amigos. A arquitetura de contexts React é sólida e escalável.

A principal lacuna é a **falta de RLS nas tabelas**, que foi uma **decisão consciente do usuário** para simplificar o projeto. Para um ambiente de produção com usuários não confiáveis, seria essencial aplicar as políticas RLS já definidas.

O fluxo de Player vs Game Master está bem implementado, com renderização condicional baseada no campo `is_game_master` da tabela `users`.

---

**Documentação criada por**: Claude Code
**Task Archon**: cb654f29-048d-4938-bc3a-feaa9fc23114
**Status**: ✅ Análise completa
