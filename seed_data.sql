-- ==============================================
-- TTRPG APP - Seed Data for Development
-- ==============================================
-- This file contains sample data for testing during development
-- DO NOT use this in production!

-- ==============================================
-- TEST USERS
-- ==============================================
INSERT INTO users (id, username, email, is_game_master, profile_picture, theme) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'mestrejorge', 'mestre@ttrpg.com', true, 'https://api.dicebear.com/7.x/avataaars/svg?seed=jorge', 'dark'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'guerreirobob', 'bob@ttrpg.com', false, 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob', 'light'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'magaalice', 'alice@ttrpg.com', false, 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice', 'dark'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'ladraocarl', 'carl@ttrpg.com', false, 'https://api.dicebear.com/7.x/avataaars/svg?seed=carl', 'auto')
ON CONFLICT (id) DO NOTHING;

-- ==============================================
-- TEST GAME
-- ==============================================
INSERT INTO games (id, name, description, game_master_id, is_active, in_game_date) VALUES
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
     'Crônicas de Arton', 
     'Uma aventura épica no mundo de Tormenta20',
     'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
     true,
     '1520-03-15 10:00:00+00')
ON CONFLICT (id) DO NOTHING;

-- ==============================================
-- TEST CHARACTERS
-- ==============================================
INSERT INTO characters (id, user_id, name, race, class, origin, deity, size, level, 
    current_health, max_health, current_mana, max_mana, 
    gold, silver, bronze, backstory, description) VALUES
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
     'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
     'Thorin Martelo de Ferro',
     'Anão',
     'Guerreiro',
     'Montanhas de Ferro',
     'Keenn',
     'Médio',
     5,
     45, 45, 0, 0,
     250, 30, 15,
     'Thorin nasceu nas profundezas das Montanhas de Ferro, onde aprendeu a forjar armas e a lutar.',
     'Um anão robusto com barba ruiva trançada e armadura pesada.'),
    
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
     'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
     'Lysandra Flamejante',
     'Elfo',
     'Mago',
     'Floresta dos Sussurros',
     'Wynna',
     'Médio',
     5,
     25, 25, 35, 35,
     180, 50, 20,
     'Lysandra estudou nas torres de magia de Valkaria, especializando-se em feitiços de fogo.',
     'Uma elfa alta com cabelos prateados e olhos que brilham como chamas.'),
    
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
     'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
     'Sombra Silenciosa',
     'Humano',
     'Ladino',
     'Ruas de Valkaria',
     NULL,
     'Médio',
     5,
     32, 32, 15, 15,
     420, 80, 5,
     'Cresceu nas ruas como órfão, aprendendo a arte da furtividade para sobreviver.',
     'Um humano ágil vestido com roupas escuras, sempre nas sombras.')
ON CONFLICT (id) DO NOTHING;

-- ==============================================
-- CHARACTER ATTRIBUTES
-- ==============================================
INSERT INTO character_attributes (id, character_id, forca, destreza, constituicao, inteligencia, sabedoria, carisma) VALUES
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 18, 12, 16, 10, 11, 8),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 8, 14, 12, 18, 15, 13),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 10, 18, 13, 14, 12, 15)
ON CONFLICT (id) DO NOTHING;

-- ==============================================
-- TEST GROUP
-- ==============================================
INSERT INTO groups (id, name, description, gold, silver, bronze) VALUES
    ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
     'Os Heróis de Arton',
     'Um grupo de aventureiros unidos por um propósito comum.',
     1500, 250, 80)
ON CONFLICT (id) DO NOTHING;

-- ==============================================
-- GROUP MEMBERS
-- ==============================================
INSERT INTO group_members (id, group_id, character_id, role) VALUES
    ('g0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Tanque'),
    ('g0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'DPS Mágico'),
    ('g0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Suporte/Scout')
ON CONFLICT (group_id, character_id) DO NOTHING;

-- ==============================================
-- GROUP STORAGE
-- ==============================================
INSERT INTO group_storage (id, group_id, name, location, description) VALUES
    ('h0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
     'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
     'Base em Valkaria',
     'Distrito Comercial de Valkaria',
     'Um pequeno armazém alugado para guardar equipamentos e tesouros.')
ON CONFLICT (id) DO NOTHING;

-- ==============================================
-- TEST ITEMS
-- ==============================================
INSERT INTO items (id, name, description, price, category, slots_per_each, 
    attack_roll, damage, crit, range, damage_type) VALUES
    ('i0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
     'Espada Longa +1',
     'Uma espada longa de aço élfico com encantamento mágico.',
     500, 'weapon', 1,
     '+1', '1d8+1', '19-20/x2', 'Corpo a corpo', 'Perfurante'),
    
    ('i0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
     'Poção de Cura',
     'Uma poção que restaura 2d8+2 pontos de vida.',
     50, 'consumable', 1,
     NULL, NULL, NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

UPDATE items SET effect = 'Restaura 2d8+2 PV' 
WHERE id = 'i0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12';

INSERT INTO items (id, name, description, price, category, slots_per_each,
    armor_bonus, armor_penalty) VALUES
    ('i0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
     'Armadura de Placas',
     'Uma armadura pesada de placas de aço.',
     1500, 'armor', 2,
     8, -5)
ON CONFLICT (id) DO NOTHING;

-- ==============================================
-- CHARACTER ITEMS (Inventory)
-- ==============================================
INSERT INTO character_items (id, character_id, item_id, quantity) VALUES
    ('j0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'i0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 3),
    ('j0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'i0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 2)
ON CONFLICT (id) DO NOTHING;

-- ==============================================
-- CHARACTER EQUIPMENT (Equipped)
-- ==============================================
INSERT INTO character_equipment (id, character_id, item_id, slot) VALUES
    ('k0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'i0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'weapon_main'),
    ('k0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'i0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'chest')
ON CONFLICT (id) DO NOTHING;

-- ==============================================
-- TEST SPELLS
-- ==============================================
INSERT INTO spells (id, name, escola, execucao, alcance, area, duracao, resistencia, fonte) VALUES
    ('l0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
     'Bola de Fogo',
     'Evocação',
     '1 ação padrão',
     'Médio (30m + 3m/nível)',
     'Esfera de 6m de raio',
     'Instantânea',
     'Reflexos (1/2 dano)',
     'Tormenta20'),
    
    ('l0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
     'Mísseis Mágicos',
     'Evocação',
     '1 ação padrão',
     'Médio (30m + 3m/nível)',
     'Até 3 criaturas',
     'Instantânea',
     'Nenhuma',
     'Tormenta20')
ON CONFLICT (id) DO NOTHING;

-- ==============================================
-- CHARACTER SPELLS
-- ==============================================
INSERT INTO character_spells (id, character_id, spell_id) VALUES
    ('m0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'l0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('m0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'l0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12')
ON CONFLICT (character_id, spell_id) DO NOTHING;

-- ==============================================
-- SPELL ENHANCEMENTS
-- ==============================================
INSERT INTO spell_enhancements (id, spell_id, custo_adicional_pm, reaplicavel, descricao, aplicacoes) VALUES
    ('n0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
     'l0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
     2,
     true,
     'Aumenta o dano em 1d6',
     1)
ON CONFLICT (id) DO NOTHING;

-- ==============================================
-- TEST ATTACKS
-- ==============================================
INSERT INTO attacks (id, character_id, name, type, teste_ataque, damage, critico, range, description) VALUES
    ('o0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
     'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
     'Golpe com Espada',
     'Corpo a corpo',
     '1d20+8',
     '1d8+4',
     '19-20/x2',
     'Corpo a corpo',
     'Um golpe poderoso com a espada longa.'),
    
    ('o0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
     'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
     'Ataque Furtivo',
     'Corpo a corpo',
     '1d20+10',
     '1d6+3d6',
     '19-20/x2',
     'Corpo a corpo',
     'Ataque pelas costas causando dano extra.')
ON CONFLICT (id) DO NOTHING;

-- ==============================================
-- TEST SKILLS
-- ==============================================
INSERT INTO skills (character_id, name, attribute, is_trained, only_trained, armor_penalty, half_level, trained_bonus, others) VALUES
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Atletismo', 'Força', true, false, false, 2, 5, 0),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Intimidação', 'Carisma', true, false, false, 2, 5, 2),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Conhecimento (Arcano)', 'Inteligência', true, true, false, 2, 5, 0),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Furtividade', 'Destreza', true, false, true, 2, 5, 0),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Ladinagem', 'Destreza', true, true, false, 2, 5, 0);

-- ==============================================
-- TEST PROFICIENCIES
-- ==============================================
INSERT INTO proficiencies (character_id, name) VALUES
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Armas Marciais'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Armaduras Pesadas'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Escudos'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Armas Simples'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Armas Simples'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Armaduras Leves');

-- ==============================================
-- TEST NOTES
-- ==============================================
INSERT INTO notes (id, character_id, title, content, category, tags, is_pinned) VALUES
    ('p0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
     'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
     'Mistério da Torre Negra',
     'Descobrimos que a Torre Negra está conectada à Tormenta. Precisamos investigar mais.',
     'Quest',
     ARRAY['tormenta', 'investigação', 'urgente'],
     true),
    
    ('p0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
     'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
     'Vendedor Suspeito',
     'O vendedor na taverna pode ter informações sobre o paradeiro do artefato.',
     'NPC',
     ARRAY['informante', 'valkaria'],
     false);

-- ==============================================
-- TEST ABILITIES
-- ==============================================
INSERT INTO abilities (id, name, type, category, description, prerequisites, cost) VALUES
    ('q0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
     'Ataque Poderoso',
     'ability',
     NULL,
     'Você pode sacrificar precisão para causar mais dano.',
     'For 13',
     'Ação livre'),
    
    ('q0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
     'Chamas da Batalha',
     'power',
     'Combat',
     'Você envolve suas armas em chamas, causando dano extra de fogo.',
     'Nível 5',
     '2 PM');

-- ==============================================
-- CHARACTER ABILITIES
-- ==============================================
INSERT INTO character_abilities (id, character_id, ability_id) VALUES
    ('r0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'q0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('r0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'q0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12');

-- ==============================================
-- GAME SESSION
-- ==============================================
INSERT INTO game_sessions (id, game_id, session_number, date, duration, summary, notes) VALUES
    ('s0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
     'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
     1,
     '2024-10-15 19:00:00+00',
     240,
     'Os heróis se encontram em uma taverna em Valkaria e recebem sua primeira missão.',
     'Sessão introdutória. Todos os jogadores compareceram.');

-- ==============================================
-- GAME SESSION ATTENDEES
-- ==============================================
INSERT INTO game_session_attendees (game_session_id, user_id) VALUES
    ('s0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'),
    ('s0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'),
    ('s0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14');

-- ==============================================
-- GROUP STORAGE ITEMS
-- ==============================================
INSERT INTO group_storage_items (storage_id, item_id, quantity) VALUES
    ('h0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'i0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 10);

-- ==============================================
-- Success Message
-- ==============================================
DO $$
BEGIN
    RAISE NOTICE '✅ Seed data inserted successfully!';
    RAISE NOTICE '👥 Created 4 users (1 GM, 3 players)';
    RAISE NOTICE '🎭 Created 3 characters';
    RAISE NOTICE '🎮 Created 1 game with 1 session';
    RAISE NOTICE '👥 Created 1 group';
    RAISE NOTICE '⚔️ Created sample items, spells, attacks, and abilities';
END $$;

