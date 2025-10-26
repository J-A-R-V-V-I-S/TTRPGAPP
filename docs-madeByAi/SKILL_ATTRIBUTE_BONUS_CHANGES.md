# Alterações no Sistema de Bônus de Atributo das Perícias

## Data: 21 de Outubro de 2025

## Resumo
O sistema de bônus de atributo para perícias foi atualizado para refletir diretamente o valor do atributo, sem cálculos adicionais. Anteriormente, o sistema usava a fórmula D&D 5e `(atributo - 10) / 2`, mas agora o bônus é igual ao valor do atributo.

## Mudanças Implementadas

### 1. Arquivo: `webversion/src/pages/attributes/attributes.tsx`

#### Alterações na Função de Cálculo (Linhas 70-73)
**Antes:**
```typescript
const calculateModifier = (attributeValue: number): number => {
  return Math.floor((attributeValue - 10) / 2);
};
```

**Depois:**
```typescript
const getAttributeBonus = (attributeValue: number): number => {
  return attributeValue;
};
```

#### Alterações no Cálculo de Perícias (Linhas 98-122)
- Substituído `calculateModifier(attributeValue)` por `getAttributeBonus(attributeValue)`
- O bônus de atributo agora é o valor direto do atributo (base + modificador temporário)

#### Campo de Bônus de Atributo Bloqueado (Linhas 464-471)
**Antes:**
```typescript
<input
  type="number"
  value={skill.attributeBonus}
  onChange={(e) => updateSkillField(originalIndex, 'attributeBonus', parseInt(e.target.value) || 0)}
  onClick={(e) => e.stopPropagation()}
/>
```

**Depois:**
```typescript
<input
  type="number"
  value={skill.attributeBonus}
  readOnly
  disabled
  onClick={(e) => e.stopPropagation()}
  title="Valor calculado automaticamente do atributo"
/>
```

### 2. Arquivo: `webversion/src/pages/proficiencies/proficiencies.tsx`

#### Alterações na Função de Cálculo (Linhas 50-53)
- Renomeado `calculateModifier` para `getAttributeBonus`
- Retorna o valor direto do atributo sem cálculo

#### Alterações no Cálculo Total (Linhas 70-86)
- Substituído `calculateModifier` por `getAttributeBonus` no cálculo do total da perícia

#### Alterações na Exibição (Linhas 191-198)
- Atualizada a visualização do breakdown para usar `getAttributeBonus` ao invés de `calculateModifier`

### 3. Arquivo: `webversion/src/pages/attributes/attributes.css`

#### Novos Estilos para Campos Bloqueados (Linhas 438-450)
```css
.skill-field input[type="number"]:disabled,
.skill-field input[type="number"][readonly] {
  background: #edf2f7;
  color: #718096;
  cursor: not-allowed;
  border-color: #e2e8f0;
  opacity: 0.8;
}

.skill-field input[type="number"]:disabled:hover,
.skill-field input[type="number"][readonly]:hover {
  border-color: #e2e8f0;
}
```

## Comportamento Atual

### Cálculo do Bônus de Atributo
- **Fórmula:** `Bônus = Valor do Atributo + Modificador Temporário`
- **Exemplo:** Se Força = 15 e Modificador Temporário = 2, então Bônus = 17

### Cálculo do Total da Perícia
- **Fórmula:** `Total = Bônus de Atributo + ½ Nível + Treino + Outros`
- **Exemplo:** 
  - Bônus de Atributo: 15
  - ½ Nível: 5
  - Treino: 5 (se treinado)
  - Outros: 2
  - **Total: 27**

## Interface do Usuário

### Campo de Bônus de Atributo
- ✅ **Somente Leitura:** Usuários não podem editar manualmente
- ✅ **Aparência Diferenciada:** Fundo cinza claro, cursor "not-allowed"
- ✅ **Tooltip:** Exibe "Valor calculado automaticamente do atributo"
- ✅ **Atualização Automática:** Atualiza quando o atributo ou modificador temporário muda

### Seletor de Atributo
- Apenas perícias editáveis (como Ofício, Profissão, etc.) podem ter o atributo alterado
- Quando o atributo é alterado, o bônus é recalculado automaticamente

## Impacto nas Funcionalidades

### ✅ Funcionalidades Mantidas
- Rolagem de perícias
- Busca de perícias
- Edição de campos de treino, outros, e ½ nível
- Sistema de perícias "Somente Treinadas"
- Penalidade de armadura

### ✅ Funcionalidades Melhoradas
- Maior clareza no cálculo de perícias
- Consistência com o sistema de atributos do Tormenta 20
- Interface mais intuitiva (campo bloqueado evita confusão)

## Arquivos Modificados
1. `webversion/src/pages/attributes/attributes.tsx`
2. `webversion/src/pages/proficiencies/proficiencies.tsx`
3. `webversion/src/pages/attributes/attributes.css`

## Próximos Passos Recomendados
- ✅ Testar a interface em diferentes cenários
- ✅ Verificar se os valores são persistidos corretamente no banco de dados
- ✅ Testar com personagens de diferentes níveis
- ✅ Validar o cálculo com perícias treinadas e não treinadas

## Notas Importantes
- Esta mudança está alinhada com o sistema Tormenta 20
- Os valores dos atributos no Tormenta 20 vão de -5 a 20
- O bônus de atributo é usado diretamente, sem conversão matemática
- Modificadores temporários continuam funcionando normalmente

