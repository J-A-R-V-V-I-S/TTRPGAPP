# Implementação de Atributos do Personagem

## Resumo
Sistema completo de gerenciamento de atributos do personagem integrado com o banco de dados Supabase e CharacterContext.

## O que foi implementado

### 1. CharacterContext (webversion/src/contexts/CharacterContext.tsx)
✅ **Adicionado suporte completo para atributos:**

- **Tipos de atributos**: Importado `CharacterAttributes` do arquivo de tipos
- **Interface Character atualizada**: Adicionado campo `attributes?: CharacterAttributes`
- **Função `loadAttributes`**: Carrega atributos do banco de dados
  - Cria atributos padrão (valor 10) se não existirem
  - Retorna valores convertidos do formato snake_case (DB) para camelCase (App)
- **Função `updateAttributes`**: Atualiza atributos no banco de dados
  - Aceita atualizações parciais
  - Converte campos de camelCase para snake_case
  - Atualiza estado local imediatamente
  - Mostra logs de sucesso/erro
- **Função `refreshAttributes`**: Recarrega atributos do banco
- **Integração no loadCharacter**: Carrega atributos junto com inventário, transações e notas

### 2. Página de Atributos (webversion/src/pages/attributes/attributes.tsx)
✅ **Integração completa com CharacterContext:**

- **Hook useCharacter**: Conectado ao contexto para acessar dados do personagem
- **Interface Attribute atualizada**: 
  - Adicionado campo `dbField` para mapear nomes de exibição (For, Des, etc.) para campos do banco (forca, destreza, etc.)
- **useEffect para carregar atributos**: Atualiza automaticamente quando `character.attributes` muda
- **Função `updateAttributeValue` assíncrona**:
  - Atualiza estado local imediatamente (otimistic update)
  - Salva no banco de dados via `updateAttributes`
  - Reverte mudanças locais em caso de erro
  - Recalcula modificador automaticamente
- **Nível do personagem**: Agora vem de `character.level` ao invés de valor hardcoded
- **Bônus de proficiência**: Calculado automaticamente baseado no nível do personagem
  - Fórmula: `Math.floor(((level - 1) / 4) + 2)`

### 3. Criação de Personagem (webversion/src/pages/characterCreation/characterCreation.tsx)
✅ **Criação automática de atributos padrão:**

- **Após criar personagem**: Sistema cria automaticamente atributos com valor 10
- **Tratamento de erros**: Se falhar, não bloqueia criação do personagem
  - Os atributos serão criados automaticamente no primeiro acesso à página de atributos
- **Logs informativos**: Console mostra progresso da criação de atributos

## Estrutura de Dados

### Banco de Dados (character_attributes)
```sql
- id: UUID (Primary Key)
- character_id: UUID (Foreign Key -> characters.id)
- forca: INTEGER (Default: 10)
- destreza: INTEGER (Default: 10)
- constituicao: INTEGER (Default: 10)
- inteligencia: INTEGER (Default: 10)
- sabedoria: INTEGER (Default: 10)
- carisma: INTEGER (Default: 10)
```

### TypeScript (CharacterAttributes)
```typescript
interface CharacterAttributes {
  id: string;
  characterId: string;
  forca: number;
  destreza: number;
  constituicao: number;
  inteligencia: number;
  sabedoria: number;
  carisma: number;
}
```

### Interface de Exibição
```typescript
interface Attribute {
  name: string; // 'For', 'Des', 'Con', 'Int', 'Sab', 'Car'
  dbField: 'forca' | 'destreza' | 'constituicao' | 'inteligencia' | 'sabedoria' | 'carisma';
  value: number;
  modifier: number; // Calculado: Math.floor((value - 10) / 2)
}
```

## Fluxo de Funcionamento

### 1. Criação de Personagem
```
Criar Personagem → Inserir no DB → Criar atributos padrão (10) → Redirecionar para Home
```

### 2. Carregamento de Atributos
```
Selecionar Personagem → loadCharacter() → loadAttributes() → 
  Se existe: Retornar atributos
  Se não existe: Criar atributos padrão → Retornar atributos
```

### 3. Atualização de Atributos
```
Usuário altera valor → 
  1. Atualizar estado local (UI responde imediatamente)
  2. Salvar no banco via updateAttributes()
  3. Se erro: Reverter estado local
  4. Se sucesso: Manter mudança
```

## Funcionalidades da Página de Atributos

### Atributos
- ✅ Exibição dos 6 atributos (For, Des, Con, Int, Sab, Car)
- ✅ Cada atributo mostra:
  - Nome do atributo
  - Valor editável (input)
  - Modificador calculado automaticamente
- ✅ Cores diferentes para cada atributo
- ✅ Animações ao passar o mouse
- ✅ Salvamento automático no banco de dados

### Perícias (Já existentes - não alteradas)
- Lista de perícias com busca
- Cálculos automáticos baseados em atributos
- Indicadores de treinamento e penalidades
- Especialização editável para perícias customizáveis

### Testes de Resistência (Já existentes - não alteradas)
- Fortitude, Reflexos e Vontade
- Indicador de treinamento
- Valores calculados

## Melhorias Implementadas

1. **Performance**: Otimistic updates para resposta instantânea da UI
2. **Resiliência**: Sistema cria atributos automaticamente se não existirem
3. **Segurança**: Validação de personagem carregado antes de operações
4. **UX**: Feedback visual imediato + salvamento em background
5. **Logs**: Console mostra todas operações para debugging

## Como Usar

1. **Visualizar Atributos**:
   - Navegue para a página "Atributos & Perícias"
   - Os atributos serão carregados automaticamente

2. **Editar Atributos**:
   - Clique no campo de valor do atributo
   - Digite o novo valor
   - Pressione Enter ou clique fora do campo
   - O modificador é recalculado automaticamente
   - Mudanças são salvas no banco de dados

3. **Ver Modificadores**:
   - Modificadores são calculados pela fórmula D&D 3.5/Pathfinder
   - `(Valor - 10) / 2` arredondado para baixo

## Testes Recomendados

1. ✅ Criar novo personagem → Verificar se atributos padrão são criados
2. ✅ Editar atributo → Verificar se modificador atualiza
3. ✅ Editar atributo → Verificar se salva no banco
4. ✅ Recarregar página → Verificar se mantém valores editados
5. ✅ Verificar personagens antigos → Sistema cria atributos automaticamente

## Próximos Passos Sugeridos

1. **Perícias no Banco de Dados**: Mover perícias para o banco de dados (similar aos atributos)
2. **Testes de Resistência**: Calcular automaticamente baseado em atributos e nível
3. **Rolagem de Dados**: Implementar sistema visual de rolagem de atributos
4. **Histórico de Mudanças**: Registrar quando atributos foram alterados
5. **Raças e Classes**: Aplicar bônus raciais e de classe aos atributos

## Observações Técnicas

- **Sem breaking changes**: Código existente continua funcionando
- **Backwards compatible**: Personagens antigos sem atributos recebem valores padrão automaticamente
- **Type-safe**: TypeScript garante tipos corretos em toda aplicação
- **Sem erros de linting**: Código passa em todas verificações

