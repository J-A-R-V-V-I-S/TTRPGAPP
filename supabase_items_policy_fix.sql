-- ==============================================
-- FIX: Adicionar política para permitir INSERT em items
-- ==============================================
-- Executar este script no SQL Editor do Supabase

-- Permitir que usuários autenticados criem items
CREATE POLICY "Authenticated users can create items" ON items
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Opcionalmente, permitir atualização e exclusão de items criados pelo usuário
-- (Descomente se necessário)
/*
CREATE POLICY "Users can update items" ON items
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete items" ON items
  FOR DELETE USING (auth.uid() IS NOT NULL);
*/

