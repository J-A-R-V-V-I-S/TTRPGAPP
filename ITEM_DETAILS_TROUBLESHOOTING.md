# 🔧 Troubleshooting - Detalhes de Itens não Aparecem

## ✅ Problema Resolvido

O problema estava em `profile.tsx` - os campos específicos de armas e armaduras **não estavam sendo passados** do inventário para o componente Backpack.

### Correção Aplicada

**Antes (campos faltando):**
```typescript
items={(character.inventory || []).map(item => ({
  id: item.id,
  name: item.name,
  description: item.description,
  quantity: item.quantity,
  slots: item.slots_per_each,
  price: item.price,
  category: item.category,
  effect: item.effect,  // ❌ Faltavam os outros campos!
}))}
```

**Depois (todos os campos):**
```typescript
items={(character.inventory || []).map(item => ({
  id: item.id,
  name: item.name,
  description: item.description,
  quantity: item.quantity,
  slots: item.slots_per_each,
  price: item.price,
  category: item.category,
  effect: item.effect,
  // ✅ Campos específicos de armas
  attack_roll: item.attack_roll,
  damage: item.damage,
  crit: item.crit,
  range: item.range,
  damage_type: item.damage_type,
  // ✅ Campos específicos de armadura
  armor_bonus: item.armor_bonus,
  armor_penalty: item.armor_penalty,
}))}
```

## 🧪 Como Testar

### 1. Verifique o Console do Browser

Quando você abrir o modal de um item, agora aparecerá um log no console:

```
📦 Item Details Modal - Item data: {
  name: "Espada Longa",
  category: "weapon",
  attack_roll: "1d20+5",
  damage: "1d8+3",
  crit: "19-20/x2",
  range: "Corpo a corpo",
  damage_type: "Cortante",
  ...
}
```

### 2. Teste com uma Arma

1. **Adicione uma arma:**
   - Vá para sua página de perfil
   - Clique em "Adicionar Item"
   - Selecione categoria "Arma"
   - Preencha todos os campos:
     - Nome: Ex: "Espada Longa"
     - Rolagem de Ataque: "1d20+5"
     - Dano: "1d8+3"
     - Crítico: "19-20/x2"
     - Alcance: "Corpo a corpo"
     - Tipo de Dano: "Cortante"

2. **Salve o item**

3. **Clique no item** na lista da mochila

4. **Verifique se aparece a seção vermelha:**
   ```
   ⚔️ PROPRIEDADES DA ARMA
   ┌─────────────────────────────┐
   │ Rolagem de Ataque: 1d20+5   │
   │ Dano: 1d8+3                 │
   │ Crítico: 19-20/x2           │
   │ Alcance: Corpo a corpo      │
   │ Tipo de Dano: Cortante      │
   └─────────────────────────────┘
   ```

### 3. Teste com Armadura

1. **Adicione uma armadura:**
   - Categoria: "Armadura"
   - Bônus de Armadura: +5
   - Penalidade de Armadura: -2

2. **Clique no item**

3. **Verifique a seção azul:**
   ```
   🛡️ PROPRIEDADES DA ARMADURA
   ┌─────────────────────────────┐
   │ Bônus de Armadura: +5       │
   │ Penalidade de Armadura: -2  │
   └─────────────────────────────┘
   ```

## 🔍 Se Ainda Não Funcionar

### Verificação 1: Dados no Banco

Abra o console do navegador e verifique se o log mostra os dados:

```javascript
// Se aparecer undefined ou null nos campos:
📦 Item Details Modal - Item data: {
  name: "Espada",
  category: "weapon",
  attack_roll: undefined,  // ❌ Problema aqui
  damage: undefined,       // ❌ E aqui
  ...
}
```

**Solução:** Os dados não estão salvos no banco. Adicione o item novamente preenchendo todos os campos.

### Verificação 2: Categoria Correta

A categoria do item **deve ser exatamente**:
- `weapon` (não "arma" ou "Weapon")
- `armor` (não "armadura" ou "Armor")
- `consumable` (não "consumível")

**Solução:** Verifique no console qual categoria está sendo salva:

```javascript
console.log('Categoria:', item.category);
// Deve ser: "weapon", "armor" ou "consumable"
```

### Verificação 3: Cache do Navegador

Às vezes o navegador pode estar usando uma versão antiga do código.

**Solução:**
1. Pressione `Ctrl+Shift+R` (ou `Cmd+Shift+R` no Mac) para recarregar sem cache
2. Ou abra o DevTools (F12) → Application → Clear Storage → Clear site data

### Verificação 4: Servidor em Execução

Certifique-se de que o servidor está rodando a versão mais recente do código.

**Solução:**
```bash
# Parar o servidor (Ctrl+C)
# Reinstalar dependências (se necessário)
npm install

# Iniciar novamente
npm run dev
```

## 📋 Checklist de Verificação

- [ ] Página de perfil atualizada com todos os campos
- [ ] Console mostra os dados do item quando modal abre
- [ ] Item foi criado com a categoria correta (`weapon`, `armor`, `consumable`)
- [ ] Campos específicos foram preenchidos ao criar o item
- [ ] Cache do navegador foi limpo
- [ ] Servidor foi reiniciado com código atualizado

## 🎯 Arquivos Modificados

- ✅ `webversion/src/pages/profile/profile.tsx` - Correção principal
- ✅ `webversion/src/components/backpack/ItemDetailsModal.tsx` - Debug log adicionado
- ✅ `webversion/src/components/backpack/backpack.tsx` - Interface atualizada
- ✅ `webversion/src/components/groupChest/ChestItemDetailsModal.tsx` - Interface atualizada
- ✅ `webversion/src/components/groupChest/groupChest.tsx` - Interface atualizada

## ✨ Resultado Esperado

Quando funcionando corretamente:

1. **Abrir modal** → Ver log no console com todos os dados
2. **Item categoria "weapon"** → Ver seção vermelha com ícone ⚔️
3. **Item categoria "armor"** → Ver seção azul com ícone 🛡️
4. **Item categoria "consumable"** → Ver seção verde com ícone ✨
5. **Apenas campos preenchidos** aparecem na seção

## 💡 Dicas

- Use o console do navegador (F12) para ver os logs de debug
- Verifique se está usando a aba correta (Components vs Console)
- Teste com um item novo (recém-criado) para garantir que tem todos os dados
- Se possível, compartilhe o log do console se ainda tiver problemas

---

**Status:** ✅ Correção aplicada  
**Próximo passo:** Testar criando um novo item com todos os campos preenchidos

