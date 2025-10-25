-- ==============================================
-- TABELA DE TRANSAÇÕES FINANCEIRAS
-- ==============================================
-- Execute este script no SQL Editor do Supabase

-- Criar tabela de transações
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL, -- 'income' (recebimento) ou 'expense' (gasto)
    category VARCHAR(50) NOT NULL, -- 'loot', 'reward', 'purchase', 'sale', 'service', 'other'
    amount_gold INTEGER DEFAULT 0,
    amount_silver INTEGER DEFAULT 0,
    amount_bronze INTEGER DEFAULT 0,
    description TEXT NOT NULL,
    notes TEXT,
    related_item_id UUID REFERENCES items(id) ON DELETE SET NULL, -- Se for compra/venda de item
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para buscar transações por personagem
CREATE INDEX IF NOT EXISTS idx_transactions_character_id ON transactions(character_id);

-- Índice para buscar por data
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);

-- ==============================================
-- POLÍTICAS RLS (Row Level Security)
-- ==============================================

-- Habilitar RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Usuários podem gerenciar transações dos seus próprios personagens
CREATE POLICY "Users can manage own character transactions" ON transactions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM characters 
      WHERE characters.id = transactions.character_id 
      AND characters.user_id = auth.uid()
    )
  );

-- ==============================================
-- COMENTÁRIOS
-- ==============================================

COMMENT ON TABLE transactions IS 'Registra todas as transações financeiras dos personagens';
COMMENT ON COLUMN transactions.type IS 'Tipo: income (recebimento) ou expense (gasto)';
COMMENT ON COLUMN transactions.category IS 'Categoria: loot, reward, purchase, sale, service, other';
COMMENT ON COLUMN transactions.description IS 'Descrição curta da transação';
COMMENT ON COLUMN transactions.notes IS 'Notas adicionais opcionais';
COMMENT ON COLUMN transactions.related_item_id IS 'ID do item relacionado (se for compra/venda)';

