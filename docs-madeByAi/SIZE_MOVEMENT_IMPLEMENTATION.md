# Implementação dos Campos Size e Movement

## Resumo das Mudanças

Este documento descreve as mudanças implementadas para adicionar os campos de **tamanho (size)** e **deslocamento (movement)** na página de perfil do personagem.

## Arquivos Modificados

### 1. Banco de Dados
- **`add_movement_field.sql`** - Script SQL para adicionar o campo `movement` à tabela `characters`

### 2. Contexto do Personagem
- **`webversion/src/contexts/CharacterContext.tsx`**
  - Adicionado campo `movement: string | null` na interface `Character`
  - Adicionada função `updateMovement: (value: string) => Promise<void>`
  - Implementada a função `updateMovement` para atualizar o campo no banco de dados

### 3. Componente ProfileHeader
- **`webversion/src/components/profileHeader/profileHeader.tsx`**
  - Adicionados props `size?: string` e `movement?: string`
  - Adicionados badges para exibir tamanho e deslocamento
  - Valores padrão: `size = 'Médio'` e `movement = '6 quadrados'`

- **`webversion/src/components/profileHeader/profileHeader.css`**
  - Adicionados estilos para os novos badges:
    - `.profile-size` - Gradiente suave azul/rosa
    - `.profile-movement` - Gradiente suave laranja/rosa

### 4. Página de Perfil
- **`webversion/src/pages/profile/profile.tsx`**
  - Atualizado para passar os campos `size` e `movement` para o `ProfileHeader`
  - Valor padrão para movement: `'6 quadrados'` se não estiver definido

## Campos Exibidos

A página de perfil agora exibe os seguintes badges:

1. **Level** - Nível do personagem
2. **Classe** - Classe do personagem
3. **Raça** - Raça do personagem
4. **Divindade** - Divindade do personagem
5. **Origem** - Origem do personagem
6. **Tamanho** - Tamanho do personagem (ex: "Médio", "Pequeno", "Grande")
7. **Deslocamento** - Velocidade de movimento (ex: "6 quadrados", "30 ft", "Fly 60 ft")

## Como Usar

### Para Adicionar o Campo Movement ao Banco de Dados:
```sql
-- Execute o script add_movement_field.sql no seu banco Supabase
```

### Para Atualizar o Deslocamento de um Personagem:
```typescript
const { updateMovement } = useCharacter();

// Atualizar deslocamento
await updateMovement("9 quadrados");
```

## Estilos Visuais

- **Tamanho**: Badge com gradiente azul claro/rosa claro
- **Deslocamento**: Badge com gradiente laranja/rosa
- Ambos os badges são responsivos e se adaptam a diferentes tamanhos de tela
- Cores de texto ajustadas para melhor legibilidade

## Responsividade

Os novos badges se adaptam automaticamente a diferentes tamanhos de tela:
- **Desktop (>800px)**: Badges maiores com mais espaçamento
- **Tablet (≤768px)**: Badges médios
- **Mobile (≤480px)**: Badges menores e mais compactos

## Próximos Passos

1. Execute o script SQL `add_movement_field.sql` no banco de dados
2. Teste a funcionalidade na interface
3. Considere adicionar funcionalidade de edição inline para os campos size e movement
4. Implemente validação para valores de deslocamento (ex: apenas números positivos)

## Observações

- O campo `size` já existia no banco de dados e na interface
- O campo `movement` foi adicionado como novo campo
- Os valores são exibidos como texto livre, permitindo flexibilidade na descrição
- A implementação mantém compatibilidade com personagens existentes
