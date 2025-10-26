-- ==============================================
-- TTRPG APP - Adicionar Testes de Resistência
-- ==============================================
-- Este script adiciona as perícias de testes de resistência
-- (Vontade, Reflexos e Fortitude) para todos os personagens existentes

-- ==============================================
-- ADICIONAR TESTES DE RESISTÊNCIA
-- ==============================================

-- Adicionar Vontade (baseada em Sabedoria)
INSERT INTO skills (character_id, name, attribute, is_trained, only_trained, armor_penalty, half_level, trained_bonus, others)
SELECT 
    c.id as character_id,
    'Vontade' as name,
    'Sabedoria' as attribute,
    false as is_trained,
    false as only_trained,
    false as armor_penalty,
    0 as half_level,
    0 as trained_bonus,
    0 as others
FROM characters c
WHERE NOT EXISTS (
    SELECT 1 FROM skills s 
    WHERE s.character_id = c.id 
    AND s.name = 'Vontade'
);

-- Adicionar Reflexos (baseada em Destreza)
INSERT INTO skills (character_id, name, attribute, is_trained, only_trained, armor_penalty, half_level, trained_bonus, others)
SELECT 
    c.id as character_id,
    'Reflexos' as name,
    'Destreza' as attribute,
    false as is_trained,
    false as only_trained,
    false as armor_penalty,
    0 as half_level,
    0 as trained_bonus,
    0 as others
FROM characters c
WHERE NOT EXISTS (
    SELECT 1 FROM skills s 
    WHERE s.character_id = c.id 
    AND s.name = 'Reflexos'
);

-- Adicionar Fortitude (baseada em Constituição)
INSERT INTO skills (character_id, name, attribute, is_trained, only_trained, armor_penalty, half_level, trained_bonus, others)
SELECT 
    c.id as character_id,
    'Fortitude' as name,
    'Constituição' as attribute,
    false as is_trained,
    false as only_trained,
    false as armor_penalty,
    0 as half_level,
    0 as trained_bonus,
    0 as others
FROM characters c
WHERE NOT EXISTS (
    SELECT 1 FROM skills s 
    WHERE s.character_id = c.id 
    AND s.name = 'Fortitude'
);

-- ==============================================
-- VERIFICAÇÃO
-- ==============================================
-- Verificar se as perícias foram adicionadas corretamente
DO $$
DECLARE
    vontade_count INTEGER;
    reflexos_count INTEGER;
    fortitude_count INTEGER;
    total_characters INTEGER;
BEGIN
    -- Contar personagens
    SELECT COUNT(*) INTO total_characters FROM characters;
    
    -- Contar perícias adicionadas
    SELECT COUNT(*) INTO vontade_count FROM skills WHERE name = 'Vontade';
    SELECT COUNT(*) INTO reflexos_count FROM skills WHERE name = 'Reflexos';
    SELECT COUNT(*) INTO fortitude_count FROM skills WHERE name = 'Fortitude';
    
    -- Exibir resultados
    RAISE NOTICE '✅ Testes de Resistência adicionados com sucesso!';
    RAISE NOTICE '👥 Total de personagens: %', total_characters;
    RAISE NOTICE '🧠 Perícias de Vontade: %', vontade_count;
    RAISE NOTICE '⚡ Perícias de Reflexos: %', reflexos_count;
    RAISE NOTICE '💪 Perícias de Fortitude: %', fortitude_count;
    
    -- Verificar se todos os personagens têm as três perícias
    IF vontade_count = total_characters AND reflexos_count = total_characters AND fortitude_count = total_characters THEN
        RAISE NOTICE '🎉 Todos os personagens agora possuem os testes de resistência!';
    ELSE
        RAISE WARNING '⚠️ Alguns personagens podem não ter recebido todas as perícias. Verifique manualmente.';
    END IF;
END $$;
