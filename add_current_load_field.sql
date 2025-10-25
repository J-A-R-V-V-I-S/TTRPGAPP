-- ==============================================
-- Adicionar campo current_load à tabela characters
-- ==============================================

-- Adicionar a coluna current_load se ela não existir
ALTER TABLE characters 
ADD COLUMN IF NOT EXISTS current_load INTEGER DEFAULT 0;

-- Comentário para documentação
COMMENT ON COLUMN characters.current_load IS 'Carga atual do inventário do personagem (calculada baseada em slots_per_each * quantity)';

-- Verificar se o campo foi adicionado com sucesso
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'characters' 
AND column_name = 'current_load';

