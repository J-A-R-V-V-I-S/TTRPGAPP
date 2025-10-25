# Correção: Atributos Negativos e Modificadores Temporários

## Problema

Os atributos não podiam ser alterados com números negativos de -5 até 20 conforme esperado para Tormenta 20, e o campo de "Modificador Temporário" não estava sendo persistido no banco de dados.

## Solução Implementada

### 1. Banco de Dados - Novos Campos

Criado o arquivo `add_temporary_modifiers_fields.sql` com:

- **Novos campos** na tabela `character_attributes`:
  - `forca_temp_mod`
  - `destreza_temp_mod`
  - `constituicao_temp_mod`
  - `inteligencia_temp_mod`
  - `sabedoria_temp_mod`
  - `carisma_temp_mod`

- **Constraints**: Cada modificador temporário pode variar de -20 a +20

### 2. Tipo TypeScript Atualizado

Arquivo `character_attributes.tsx`:
- Adicionados campos opcionais para modificadores temporários (camelCase)
- `forcaTempMod`, `destrezaTempMod`, `constituicaoTempMod`, etc.

### 3. CharacterContext Atualizado

**Função `loadAttributes`**:
- Agora carrega os modificadores temporários do banco de dados
- Converte de snake_case (BD) para camelCase (TypeScript)

**Função `updateAttributes`**:
- Suporta atualização de modificadores temporários
- Converte de camelCase para snake_case ao salvar

### 4. Componente de Atributos Corrigido

**Validação de Input**:
- Mudado de `type="text"` para `type="number"`
- Adicionado `min={-5}` e `max={20}` para atributos base
- Adicionado `min={-20}` e `max={20}` para modificadores temporários
- Implementada lógica de `onChange` e `onBlur` para permitir digitação de números negativos

**Modificadores Temporários**:
- Agora são carregados do banco de dados ao inicializar
- Alterações são persistidas automaticamente no banco
- Função `updateAttributeModifier` agora é `async` e salva no banco

## Como Aplicar

### 1. Execute o SQL no Supabase

```bash
# Conecte-se ao seu projeto Supabase e execute:
psql -h <seu-host> -U <seu-usuario> -d <seu-database> -f add_temporary_modifiers_fields.sql
```

Ou através do **SQL Editor** do Supabase Dashboard:
1. Acesse seu projeto no Supabase
2. Vá em "SQL Editor"
3. Copie e cole o conteúdo de `add_temporary_modifiers_fields.sql`
4. Execute o script

### 2. Código já Atualizado

Os seguintes arquivos foram atualizados:
- ✅ `webversion/src/types/character_attributes.tsx`
- ✅ `webversion/src/contexts/CharacterContext.tsx`
- ✅ `webversion/src/pages/attributes/attributes.tsx`

## Funcionalidades

### Atributos Base
- Podem ser editados com valores de **-5 até 20**
- Campo numérico com validação
- Aceita digitação de números negativos

### Modificadores Temporários
- Podem variar de **-20 até +20**
- Representam buffs/debuffs temporários
- São persistidos no banco de dados
- Podem ser usados para magias, efeitos de status, etc.

## Validações

### Frontend
- Input type="number" com min/max
- Validação em onChange e onBlur
- Permite digitação de "-" sem bloquear

### Backend (Banco de Dados)
- CHECK constraints para garantir ranges válidos
- Atributos base: -5 a 20
- Modificadores temporários: -20 a +20

## Observações

- Os modificadores temporários são **opcionais** no tipo TypeScript
- Valores padrão são 0 quando não definidos
- A lógica mantém compatibilidade com personagens existentes
- Sem erros de linter após as alterações

## Testes Recomendados

1. ✅ Criar novo personagem e verificar atributos padrão
2. ✅ Editar atributos com valores positivos (0-20)
3. ✅ Editar atributos com valores negativos (-5 a -1)
4. ✅ Tentar valores fora do range (deve ser bloqueado)
5. ✅ Adicionar modificadores temporários positivos
6. ✅ Adicionar modificadores temporários negativos
7. ✅ Verificar persistência após reload da página
8. ✅ Verificar que modificadores temporários aparecem corretamente

## Referências

- Tormenta 20: Atributos podem variar de -5 a 20
- Modificadores temporários são comuns para buffs/debuffs
- Sistema preparado para futuras implementações de cálculo automático de modificadores

