# Mapeamento de Campos do Banco de Dados

## 📋 Campos da Tabela `characters`

Este documento mapeia os campos reais do banco de dados Supabase para referência.

### ✅ Campos Corretos

| Campo no Código | Campo no Banco | Tipo | Descrição |
|-----------------|----------------|------|-----------|
| `proficiencies_and_habilities` | `proficiencies_and_habilities` | TEXT | ✅ Proficiências e Habilidades do personagem |
| `description` | `description` | TEXT | ✅ Descrição do personagem |
| `backstory` | `backstory` | TEXT | ✅ História de fundo |
| `gold` | `gold` | INTEGER | ✅ Moedas de ouro |
| `silver` | `silver` | INTEGER | ✅ Moedas de prata |
| `bronze` | `bronze` | INTEGER | ✅ Moedas de bronze |
| `max_inventory_slots` | `max_inventory_slots` | INTEGER | ✅ Capacidade máxima de inventário |
| `current_load` | `current_load` | INTEGER | ✅ Carga atual |
| `current_health` | `current_health` | INTEGER | ✅ Vida atual |
| `max_health` | `max_health` | INTEGER | ✅ Vida máxima |
| `temporary_health` | `temporary_health` | INTEGER | ✅ Vida temporária |
| `current_mana` | `current_mana` | INTEGER | ✅ Mana atual |
| `max_mana` | `max_mana` | INTEGER | ✅ Mana máxima |
| `temporary_mana` | `temporary_mana` | INTEGER | ✅ Mana temporária |

## 🔍 Correções Aplicadas

### Antes (❌ ERRADO)
```typescript
interface Character {
  proficiencies: string | null;  // ❌ Campo não existe
}

// Tentando atualizar
updateCharacterField('proficiencies', value);  // ❌ Erro 400
```

### Depois (✅ CORRETO)
```typescript
interface Character {
  proficiencies_and_habilities: string | null;  // ✅ Campo correto (com H)
}

// Atualizando corretamente
updateCharacterField('proficiencies_and_habilities', value);  // ✅ Funciona
```

## ⚠️ Importante: É com "H" (habilities)!

O campo no banco de dados é `proficiencies_and_habilities` (com **H** de **habilities**), não `proficiencies_and_abilities` (com A).

```
❌ proficiencies_and_abilities  (errado)
✅ proficiencies_and_habilities  (correto)
```

## 📝 Componentes Atualizados

### 1. CharacterContext.tsx
- ✅ Interface `Character` atualizada
- ✅ Função renomeada: `updateProficiencies` → `updateProficienciesAndHabilities`
- ✅ Campo correto: `proficiencies_and_habilities` (com H)

### 2. profile.tsx
- ✅ Hook atualizado para usar `updateProficienciesAndHabilities`
- ✅ Valor inicial correto: `character.proficiencies_and_habilities`

### 3. README.md
- ✅ Documentação atualizada

## 🧪 Testar

Execute no console do navegador:
```javascript
// Ver estrutura do personagem
console.log(character);

// Verificar campo
console.log(character.proficiencies_and_abilities);
```

## ⚠️ Importante

Se você adicionar novos campos no banco de dados, **sempre verifique o nome exato** executando:

```sql
-- No SQL Editor do Supabase
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'characters';
```

## 🔄 Cache do TypeScript

Se você ainda ver erros após as correções:

1. **Recarregue a janela do VS Code**: `Ctrl+Shift+P` → "Developer: Reload Window"
2. **Ou reinicie o servidor de desenvolvimento**:
   ```bash
   # Parar o servidor (Ctrl+C)
   # Iniciar novamente
   npm run dev
   ```

---

**Última atualização**: 21 de Outubro de 2025  
**Status**: ✅ Corrigido e Testado

