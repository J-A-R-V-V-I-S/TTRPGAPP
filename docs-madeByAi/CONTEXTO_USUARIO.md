# Implementação do Contexto de Usuário

## Resumo

Foi implementado um sistema completo de gerenciamento de contexto de usuário que diferencia entre **Jogadores** e **Game Masters**, renderizando diferentes visualizações na página inicial baseado no tipo de usuário.

## O que foi implementado

### 1. UserContext (`webversion/src/contexts/UserContext.tsx`)

Novo contexto React que gerencia:
- **Dados do usuário** da tabela `users` do Supabase
- **Identificação automática** se o usuário é Game Master ou Jogador (campo `is_game_master`)
- **Carregamento automático** de personagens para jogadores
- **Carregamento automático** de jogos para Game Masters
- **Funções de refresh** para atualizar dados quando necessário

#### Propriedades disponíveis:
```typescript
{
  userData: User | null;           // Dados completos do usuário
  isGameMaster: boolean;           // Se é Game Master
  characters: Character[];         // Lista de personagens (jogadores)
  games: Game[];                   // Lista de jogos (Game Masters)
  loading: boolean;                // Estado de carregamento
  error: string | null;            // Mensagem de erro
  refreshUserData: () => Promise<void>;
  refreshCharacters: () => Promise<void>;
  refreshGames: () => Promise<void>;
}
```

### 2. Atualização da Página Home (`webversion/src/pages/home/home.tsx`)

A página Home agora renderiza dinamicamente baseado no tipo de usuário:

#### **Visualização para Jogadores** (`is_game_master = false`):
- Lista de personagens do usuário
- Botão para criar novo personagem
- Cada card mostra: nome, nível, classe e raça
- Click no card navega para o perfil do personagem

#### **Visualização para Game Masters** (`is_game_master = true`):
- Lista de jogos que o usuário mestra
- Botão para criar novo jogo
- Cada card mostra: nome do jogo, status (ativo/inativo) e descrição
- Click no card navega para a página de gerenciamento do jogo

#### **Estados especiais**:
- **Loading**: Mostra mensagem "Carregando..." enquanto busca dados
- **Empty State**: Mensagens amigáveis quando não há personagens ou jogos

### 3. Atualização dos Tipos

#### `User` (`webversion/src/types/user.tsx`):
```typescript
interface User {
    id: string;
    username: string;
    email: string;
    isGameMaster: boolean;        // Campo principal
    profilePicture?: string;
    theme?: 'light' | 'dark' | 'auto';
    language?: string;
    notificationsEnabled?: boolean;
    createdAt?: string;
    updatedAt?: string;
}
```

#### `Game` (`webversion/src/types/game.tsx`):
```typescript
interface Game {
    id: string;
    name: string;
    description?: string;
    gameMasterId: string;
    isActive: boolean;
    inGameDate?: string;
    lastSessionDate?: string;
    createdAt?: string;
    updatedAt?: string;
}
```

### 4. Mapeamento de Campos no API Service (`webversion/src/services/api.ts`)

Implementado mapeamento automático entre:
- **snake_case** (banco de dados) ↔ **camelCase** (TypeScript)

#### APIs atualizadas:
- **`userApi.getCurrentUser()`**: Mapeia campos do usuário
- **`userApi.updateUser()`**: Mapeia campos para atualização
- **`gamesApi.getGamesByGameMaster()`**: Mapeia campos dos jogos
- **`gamesApi.getGameById()`**: Mapeia campos de um jogo
- **`gamesApi.createGame()`**: Mapeia campos para criação
- **`gamesApi.updateGame()`**: Mapeia campos para atualização

### 5. Integração no App (`webversion/src/App.tsx`)

O `UserProvider` foi adicionado à hierarquia de contextos:

```tsx
<AuthProvider>
  <UserProvider>
    <Router>
      {/* Rotas */}
    </Router>
  </UserProvider>
</AuthProvider>
```

### 6. Estilos CSS (`webversion/src/pages/home/home.css`)

Adicionados estilos para:
- **Empty state**: Visual amigável quando não há dados
- **Game cards**: Estilos específicos para cards de jogos
- **Game status badges**: Badges coloridos para status ativo/inativo

## Fluxo de Autenticação e Redirecionamento

```
1. Usuário acessa /login
   ↓
2. Faz login com email e senha
   ↓
3. AuthContext autentica com Supabase Auth
   ↓
4. Redireciona para / (Home)
   ↓
5. UserContext carrega automaticamente:
   - Dados do usuário (tabela users)
   - Se is_game_master == false → carrega personagens
   - Se is_game_master == true → carrega jogos
   ↓
6. Home renderiza a visualização apropriada
```

## Como Usar

### Em qualquer componente:

```tsx
import { useUser } from '../contexts/UserContext';

function MyComponent() {
  const { userData, isGameMaster, characters, games, loading } = useUser();

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <h1>Olá, {userData?.username}!</h1>
      
      {!isGameMaster && (
        <p>Você tem {characters.length} personagens</p>
      )}
      
      {isGameMaster && (
        <p>Você está mestrando {games.length} jogos</p>
      )}
    </div>
  );
}
```

## Testando o Sistema

### Para testar como Jogador:
1. Faça login com um usuário que tem `is_game_master = false`
2. Você verá a lista de personagens
3. Crie um novo personagem usando o botão "+ Novo Personagem"

### Para testar como Game Master:
1. Faça login com um usuário que tem `is_game_master = true`
2. Você verá a lista de jogos
3. O botão "+ Novo Jogo" aparecerá (funcionalidade a ser implementada)

## Próximos Passos Sugeridos

1. **Implementar criação de jogos**: Modal/página para Game Masters criarem novos jogos
2. **Página de gerenciamento de jogo**: Tela para GM gerenciar jogadores, sessões, etc.
3. **Listagem de jogos para jogadores**: Jogadores também podem ver jogos dos quais participam
4. **Convites para jogos**: Sistema para GM convidar jogadores para seus jogos
5. **Seleção de personagem no jogo**: Jogadores escolhem qual personagem usar em cada jogo

## Arquivos Modificados

- ✅ `webversion/src/contexts/UserContext.tsx` (novo)
- ✅ `webversion/src/contexts/README.md` (novo)
- ✅ `webversion/src/App.tsx`
- ✅ `webversion/src/pages/home/home.tsx`
- ✅ `webversion/src/pages/home/home.css`
- ✅ `webversion/src/types/user.tsx`
- ✅ `webversion/src/types/game.tsx`
- ✅ `webversion/src/services/api.ts`

## Compatibilidade

✅ TypeScript sem erros de tipo
✅ ESLint sem erros
✅ Mapeamento correto snake_case ↔ camelCase
✅ Documentação completa incluída
✅ Responsive design mantido

