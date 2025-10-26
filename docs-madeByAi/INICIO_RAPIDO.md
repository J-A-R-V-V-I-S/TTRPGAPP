# 🚀 Início Rápido - Sistema de Contexto de Usuário

## ⚡ Começando em 5 Minutos

### 1. Iniciar o Servidor de Desenvolvimento

```bash
# Navegue até a pasta webversion
cd webversion

# Instale as dependências (se ainda não instalou)
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O servidor iniciará em `http://localhost:5173`

---

## 🎮 Teste 1: Criar Conta como Jogador (2 minutos)

### Passo 1: Acesse o Registro
```
Abra o navegador em: http://localhost:5173/register
```

### Passo 2: Preencha o Formulário
```
Email:    jogador@teste.com
Username: jogador_teste
Password: teste123
Confirmar: teste123
Tipo:     Jogador  👈 Importante!
```

### Passo 3: Clique em Register
```
✓ Verá mensagem de sucesso
✓ Será redirecionado para /login
```

---

## 🎲 Teste 2: Login e Visualização (1 minuto)

### Passo 1: Faça Login
```
Email:    jogador@teste.com
Password: teste123
```

### Passo 2: Verifique a Home
```
✓ Deve ver: "jogador_teste" no topo
✓ Deve ver: "Seus Personagens"
✓ Deve ver: Botão "+ Novo Personagem"
✓ Deve ver: Mensagem de lista vazia (normal, você ainda não tem personagens)
```

**Mensagem esperada:**
```
"Você ainda não tem personagens.
Crie seu primeiro personagem para começar sua aventura!"
```

---

## 🎯 Teste 3: Criar Conta como Game Master (2 minutos)

### Passo 1: Faça Logout
```
1. Clique no botão de logout (se houver)
2. Ou acesse diretamente: http://localhost:5173/register
```

### Passo 2: Registre um Game Master
```
Email:    mestre@teste.com
Username: mestre_teste
Password: teste123
Confirmar: teste123
Tipo:     Game Master  👈 Importante!
```

### Passo 3: Faça Login como GM
```
Email:    mestre@teste.com
Password: teste123
```

### Passo 4: Verifique a Home
```
✓ Deve ver: "mestre_teste" no topo
✓ Deve ver: "Seus Jogos"  👈 Diferente do jogador!
✓ Deve ver: Botão "+ Novo Jogo"
✓ Deve ver: Mensagem de lista vazia
```

**Mensagem esperada:**
```
"Você ainda não criou nenhum jogo.
Crie seu primeiro jogo para começar a mestrar!"
```

---

## 📊 Verificar no Console do Navegador

### Abra o DevTools (F12) → Console

Você deve ver logs como:
```javascript
User Data: { id: "...", username: "mestre_teste", isGameMaster: true, ... }
Is Game Master: true
```

**Para Jogador:**
```javascript
isGameMaster: false
```

**Para Game Master:**
```javascript
isGameMaster: true
```

---

## 🔍 Verificar no Supabase

### Acesse o Supabase Dashboard

1. Vá para: https://supabase.com
2. Abra seu projeto
3. Vá para "Table Editor"
4. Selecione a tabela `users`

### Você deve ver:

| id | username | email | is_game_master | created_at |
|----|----------|-------|----------------|------------|
| UUID | jogador_teste | jogador@teste.com | false | ... |
| UUID | mestre_teste | mestre@teste.com | **true** | ... |

---

## ✅ Checklist de Verificação

Marque o que você conseguiu testar:

### Registro
- [ ] Conseguiu registrar um jogador
- [ ] Conseguiu registrar um Game Master
- [ ] Escolheu o tipo de conta no formulário

### Login
- [ ] Conseguiu fazer login como jogador
- [ ] Conseguiu fazer login como Game Master
- [ ] Foi redirecionado para `/` após login

### Visualização do Jogador
- [ ] Vê "Seus Personagens"
- [ ] Vê botão "+ Novo Personagem"
- [ ] Vê mensagem de lista vazia
- [ ] NÃO vê nada sobre "jogos"

### Visualização do Game Master
- [ ] Vê "Seus Jogos"
- [ ] Vê botão "+ Novo Jogo"
- [ ] Vê mensagem de lista vazia
- [ ] NÃO vê nada sobre "personagens"

### Técnico
- [ ] Sem erros no console
- [ ] Dados aparecem no Supabase
- [ ] Loading aparece brevemente

---

## 🎨 Criar Dados de Teste (Opcional)

Se quiser ver as listas com dados, execute no SQL Editor do Supabase:

### Criar Personagem para o Jogador

```sql
-- Primeiro, pegue o UUID do jogador
SELECT id FROM users WHERE email = 'jogador@teste.com';

-- Use o UUID na query abaixo (substitua UUID_DO_JOGADOR)
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
  'UUID_DO_JOGADOR',  -- Substitua aqui
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
);
```

### Criar Jogo para o Game Master

```sql
-- Primeiro, pegue o UUID do Game Master
SELECT id FROM users WHERE email = 'mestre@teste.com';

-- Use o UUID na query abaixo (substitua UUID_DO_GM)
INSERT INTO games (
  game_master_id,
  name,
  description,
  is_active
) VALUES
(
  'UUID_DO_GM',  -- Substitua aqui
  'As Casas de Tesselar',
  'Uma aventura épica nas terras místicas de Tesselar',
  true
);
```

### Recarregar a Página

```
1. Volte para o navegador
2. Recarregue a página (F5)
3. Agora você deve ver os cards com dados!
```

---

## 🐛 Problemas Comuns

### 1. "Carregando..." infinito

**Causa**: Usuário não foi criado na tabela `users`

**Solução**:
```sql
-- Verifique se o usuário existe
SELECT * FROM users WHERE email = 'jogador@teste.com';

-- Se não existir, o sistema deve ter criado automaticamente
-- Se ainda não funcionar, verifique o console para erros
```

### 2. "Error: relation 'users' does not exist"

**Causa**: Tabela não foi criada

**Solução**:
```bash
# Execute o schema SQL no Supabase
# Vá para SQL Editor e execute o arquivo supabase_schema.sql
```

### 3. Página em branco após login

**Causa**: Erro de JavaScript

**Solução**:
```bash
# Abra o console (F12)
# Veja qual é o erro
# Provavelmente um problema de permissões (RLS)
```

**Solução Temporária (Desenvolvimento):**
```sql
-- Desabilite o RLS temporariamente
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE characters DISABLE ROW LEVEL SECURITY;
ALTER TABLE games DISABLE ROW LEVEL SECURITY;
```

---

## 📱 Teste Responsivo

### Desktop
```
✓ Layout de grid com múltiplas colunas
✓ Cards lado a lado
```

### Mobile
```
✓ Layout de coluna única
✓ Cards empilhados
✓ Botão ocupa largura completa
```

**Para testar:**
1. Abra DevTools (F12)
2. Clique no ícone de dispositivo móvel
3. Escolha diferentes tamanhos de tela

---

## 🎯 Resultado Final Esperado

### Jogador logado vê:
```
┌──────────────────────────────────────┐
│         jogador_teste                │
│                                      │
│  Seus Personagens   [+ Novo Persona]│
│  ┌─────────────┐  ┌─────────────┐  │
│  │ Thorin      │  │ Elara       │  │
│  │ Nível 5     │  │ Nível 3     │  │
│  │ Guerreiro   │  │ Arcanista   │  │
│  └─────────────┘  └─────────────┘  │
└──────────────────────────────────────┘
```

### Game Master logado vê:
```
┌──────────────────────────────────────┐
│         mestre_teste                 │
│                                      │
│  Seus Jogos          [+ Novo Jogo]  │
│  ┌──────────────────────────────┐   │
│  │ As Casas de Tesselar         │   │
│  │ [ATIVO] 🟢                   │   │
│  │ Uma aventura épica...        │   │
│  └──────────────────────────────┘   │
└──────────────────────────────────────┘
```

---

## 📚 Próximos Passos

Após confirmar que tudo funciona:

1. **Leia a documentação completa**: `CONTEXTO_USUARIO.md`
2. **Veja os testes detalhados**: `TESTE_CONTEXTO_USUARIO.md`
3. **Entenda a implementação**: `IMPLEMENTACAO_COMPLETA.md`
4. **Veja o resumo visual**: `RESUMO_VISUAL.md`

---

## 🎉 Pronto!

Se você chegou até aqui e tudo funcionou:

```
╔═══════════════════════════════════════╗
║                                       ║
║   ✅ SISTEMA FUNCIONANDO!             ║
║                                       ║
║   Você testou com sucesso:            ║
║   • Registro de jogador ✓             ║
║   • Registro de Game Master ✓         ║
║   • Login ✓                           ║
║   • Visualização dinâmica ✓           ║
║                                       ║
║   Agora você pode começar a           ║
║   desenvolver novas features! 🚀      ║
║                                       ║
╚═══════════════════════════════════════╝
```

---

## 💡 Dica Final

Use este hook em qualquer página para acessar os dados:

```tsx
import { useUser } from '../contexts/UserContext';

function MinhasPaginas() {
  const { userData, isGameMaster, characters, games } = useUser();
  
  // Agora você tem acesso aos dados!
}
```

**Feliz codificação! 🎮**

