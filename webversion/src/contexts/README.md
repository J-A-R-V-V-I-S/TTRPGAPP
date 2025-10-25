# Contextos da Aplicação

Este diretório contém os contextos React que gerenciam o estado global da aplicação.

## Hierarquia de Contextos

```
AuthProvider
  └── UserProvider
      └── CharacterProvider
          └── Aplicação
```

## AuthContext

O `AuthContext` gerencia a autenticação do usuário usando Supabase Auth.

### Funcionalidades:
- Login de usuário
- Registro de usuário
- Logout
- Gerenciamento de sessão
- Monitoramento de estado de autenticação

### Como usar:

```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, session, loading, signIn, signOut } = useAuth();

  // Verificar se o usuário está autenticado
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;

  return <div>Welcome, {user.email}!</div>;
}
```

## UserContext

O `UserContext` gerencia os dados do usuário e diferencia entre jogadores e Game Masters.

### Funcionalidades:
- Carrega dados do usuário da tabela `users`
- Identifica se o usuário é Game Master ou Jogador
- Carrega personagens automaticamente para jogadores
- Carrega jogos automaticamente para Game Masters
- Fornece métodos para atualizar os dados

### Como usar:

```tsx
import { useUser } from '../contexts/UserContext';

function MyComponent() {
  const { userData, isGameMaster, characters, games, loading } = useUser();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{userData?.username}</h1>
      
      {!isGameMaster && (
        <div>
          <h2>Meus Personagens</h2>
          {characters.map(char => (
            <div key={char.id}>{char.name}</div>
          ))}
        </div>
      )}

      {isGameMaster && (
        <div>
          <h2>Meus Jogos</h2>
          {games.map(game => (
            <div key={game.id}>{game.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Propriedades do UserContext:

- `userData`: Dados completos do usuário (id, username, email, isGameMaster, etc.)
- `isGameMaster`: Boolean indicando se o usuário é um Game Master
- `characters`: Array de personagens (apenas para jogadores)
- `games`: Array de jogos (apenas para Game Masters)
- `selectedCharacterId`: ID do personagem atualmente selecionado
- `setSelectedCharacterId(id)`: Função para definir o personagem selecionado
- `loading`: Boolean indicando se os dados estão sendo carregados
- `error`: String com mensagem de erro, se houver
- `refreshUserData()`: Função para recarregar os dados do usuário
- `refreshCharacters()`: Função para recarregar os personagens
- `refreshGames()`: Função para recarregar os jogos

## CharacterContext

O `CharacterContext` gerencia o estado e operações do personagem atualmente selecionado. Ele automaticamente carrega o personagem baseado no `selectedCharacterId` do `UserContext`.

### Funcionalidades:
- Carregamento automático do personagem selecionado
- Atualização de propriedades específicas (descrição, proficiências, moedas, etc.)
- Gerenciamento de health e mana
- Atualização de imagens de perfil e background
- Sincronização automática com o Supabase

### Como usar:

```tsx
import { useCharacter } from '../contexts/CharacterContext';

function ProfilePage() {
  const {
    character,
    loading,
    error,
    updateDescription,
    updateCurrency,
    updateHealth
  } = useCharacter();

  if (loading) return <div>Carregando personagem...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!character) return <div>Nenhum personagem selecionado</div>;

  return (
    <div>
      <h1>{character.name}</h1>
      <p>Nível {character.level} - {character.class}</p>
      
      <button onClick={() => updateHealth(50)}>
        Atualizar HP para 50
      </button>
      
      <button onClick={() => updateCurrency(100, 50, 25)}>
        Adicionar moedas
      </button>
    </div>
  );
}
```

### Propriedades do CharacterContext:

- `character`: Dados completos do personagem atual
- `loading`: Boolean indicando se os dados estão sendo carregados
- `error`: String com mensagem de erro, se houver
- `loadCharacter(characterId)`: Carrega um personagem específico
- `refreshCharacter()`: Recarrega o personagem atual
- `updateDescription(value)`: Atualiza a descrição do personagem
- `updateBackstory(value)`: Atualiza o backstory do personagem
- `updateProficienciesAndAbilities(value)`: Atualiza as proficiências e habilidades
- `updateCurrency(gold, silver, bronze)`: Atualiza as moedas
- `updateArrows(value)`: Atualiza quantidade de flechas
- `updateBullets(value)`: Atualiza quantidade de balas
- `updateMaxInventorySlots(value)`: Atualiza capacidade máxima do inventário
- `updateCurrentLoad(value)`: Atualiza a carga atual
- `updateHealth(current, max?, temporary?)`: Atualiza pontos de vida
- `updateMana(current, max?, temporary?)`: Atualiza pontos de mana
- `updateProfileImage(url)`: Atualiza imagem de perfil
- `updateBackgroundImage(url)`: Atualiza imagem de fundo

### Estrutura do Character:

```typescript
interface Character {
  id: string;
  user_id: string;
  name: string;
  level: number;
  class: string;
  race: string;
  deity: string;
  origin: string;
  size: string;
  description: string | null;
  backstory: string | null;
  proficiencies: string | null;
  gold: number;
  silver: number;
  bronze: number;
  arrows: number;
  bullets: number;
  max_inventory_slots: number;
  current_load: number;
  profile_img: string | null;
  background_img: string | null;
  current_health: number;
  max_health: number;
  temporary_health: number;
  current_mana: number;
  max_mana: number;
  temporary_mana: number;
}
```

## Fluxo de Autenticação

1. Usuário faz login na página `/login`
2. `AuthContext` autentica o usuário com Supabase Auth
3. Após autenticação bem-sucedida, o usuário é redirecionado para `/`
4. `UserContext` carrega automaticamente os dados do usuário da tabela `users`
5. Baseado no campo `is_game_master`:
   - Se `false`: Carrega lista de personagens do usuário
   - Se `true`: Carrega lista de jogos do Game Master
6. A página Home renderiza a visualização apropriada

## Proteção de Rotas

Use o componente `ProtectedRoute` para proteger rotas que requerem autenticação:

```tsx
<Route path="/profile" element={
  <ProtectedRoute>
    <Profile />
  </ProtectedRoute>
} />
```

O `ProtectedRoute` verifica se o usuário está autenticado e redireciona para `/login` se necessário.

