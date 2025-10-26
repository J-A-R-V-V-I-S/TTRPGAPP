# 🔧 Guia Rápido: Correção de Atributos Negativos

## ✅ Problema Resolvido

Agora os atributos podem ser editados com valores negativos (-5 até 20) e o campo "Modificador Temporário" é salvo no banco de dados!

## 📋 Passo a Passo

### 1️⃣ Execute o SQL no Supabase

Você precisa adicionar os campos de modificadores temporários no banco:

**Opção A - Pelo Dashboard do Supabase (Recomendado):**

1. Acesse: https://app.supabase.com
2. Entre no seu projeto
3. Clique em **"SQL Editor"** no menu lateral
4. Clique em **"New Query"**
5. Copie todo o conteúdo do arquivo `add_temporary_modifiers_fields.sql`
6. Cole no editor
7. Clique em **"Run"** (ou pressione Ctrl+Enter)

**Opção B - Pela Linha de Comando:**

```bash
# Se você tem o Supabase CLI instalado
supabase db push add_temporary_modifiers_fields.sql
```

### 2️⃣ Pronto!

O código frontend já está atualizado. Basta recarregar a aplicação:

```bash
# No diretório webversion/
npm run dev
```

## 🎮 Como Usar

### Atributos Base
- Digite valores de **-5 até 20**
- Exemplos válidos: `-5, -2, 0, 10, 18, 20`
- Valores fora do range serão bloqueados

### Modificadores Temporários
- Digite valores de **-20 até +20**  
- Use para buffs/debuffs temporários
- Exemplos:
  - `+2` → Benção
  - `-4` → Veneno
  - `0` → Sem modificador

## 🔍 Verificar se Funcionou

1. Abra a página de **Atributos**
2. Tente digitar um valor negativo (ex: `-3`) em um atributo
3. O valor deve ser salvo corretamente
4. Adicione um modificador temporário (ex: `+2` ou `-5`)
5. Recarregue a página
6. Os valores devem persistir

## 📁 Arquivos Alterados

✅ **SQL:**
- `add_temporary_modifiers_fields.sql` (NOVO - precisa executar)

✅ **TypeScript:**
- `webversion/src/types/character_attributes.tsx`
- `webversion/src/contexts/CharacterContext.tsx`  
- `webversion/src/pages/attributes/attributes.tsx`

## ❓ Problemas?

### "Não consigo digitar números negativos"

- Certifique-se de que executou o SQL no Supabase
- Limpe o cache do navegador (Ctrl+Shift+R)
- Verifique se não há erros no console

### "Modificadores temporários não salvam"

- Execute o SQL `add_temporary_modifiers_fields.sql` no Supabase
- Verifique se os campos foram criados: vá em "Table Editor" → "character_attributes"
- Deve ter os campos: `forca_temp_mod`, `destreza_temp_mod`, etc.

### "Erro ao salvar atributos"

- Verifique a conexão com o Supabase
- Confira se o personagem tem registro em `character_attributes`

## 🎯 Próximos Passos (Opcional)

Se quiser adicionar cálculo automático de modificadores:
- Os modificadores temporários já estão salvos no banco
- Você pode criar uma função que calcula o modificador final
- Exemplo: `(atributo + modificador_temporario - 10) / 2`

## 📚 Mais Informações

Veja `ATTRIBUTES_TEMP_MODIFIERS_FIX.md` para detalhes técnicos completos.

