-- ==============================================
-- TTRPG APP - Supabase SQL Schema
-- ==============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================
-- USERS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    is_game_master BOOLEAN DEFAULT FALSE,
    profile_picture TEXT,
    theme VARCHAR(20) DEFAULT 'auto',
    language VARCHAR(10) DEFAULT 'pt-BR',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- CHARACTERS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS characters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    race VARCHAR(100) NOT NULL,
    class VARCHAR(100) NOT NULL,
    origin VARCHAR(100) NOT NULL,
    deity VARCHAR(100),
    size VARCHAR(20) NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    profile_img TEXT,
    background_img TEXT,
    
    -- Health
    current_health INTEGER NOT NULL DEFAULT 0,
    max_health INTEGER NOT NULL DEFAULT 0,
    temporary_health INTEGER DEFAULT 0,
    
    -- Mana
    current_mana INTEGER NOT NULL DEFAULT 0,
    max_mana INTEGER NOT NULL DEFAULT 0,
    temporary_mana INTEGER DEFAULT 0,
    
    -- Defence
    defence_base INTEGER DEFAULT 10,
    defence_armor_bonus INTEGER DEFAULT 0,
    defence_attribute_bonus INTEGER DEFAULT 0,
    defence_other INTEGER DEFAULT 0,
    defence_armor_penalty INTEGER DEFAULT 0,
    
    -- Currency
    gold INTEGER DEFAULT 0,
    silver INTEGER DEFAULT 0,
    bronze INTEGER DEFAULT 0,
    
    -- Inventory
    max_inventory_slots INTEGER DEFAULT 20,
    
    -- Text fields
    backstory TEXT,
    is_backstory_secret BOOLEAN DEFAULT FALSE,
    description TEXT,
    proficiencies_and_habilities TEXT,
    
    -- Ammunition
    arrows INTEGER DEFAULT 0,
    bullets INTEGER DEFAULT 0,
    current_load INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- CHARACTER ATTRIBUTES
-- ==============================================
CREATE TABLE IF NOT EXISTS character_attributes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE UNIQUE,
    forca INTEGER DEFAULT 10,
    destreza INTEGER DEFAULT 10,
    constituicao INTEGER DEFAULT 10,
    inteligencia INTEGER DEFAULT 10,
    sabedoria INTEGER DEFAULT 10,
    carisma INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- GAMES TABLE (Game Sessions)
-- ==============================================
CREATE TABLE IF NOT EXISTS games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    game_master_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    in_game_date TIMESTAMP WITH TIME ZONE,
    last_session_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- GAME PLAYERS (Many-to-Many: Users and Games)
-- ==============================================
CREATE TABLE IF NOT EXISTS game_players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    character_id UUID REFERENCES characters(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(game_id, user_id)
);

-- ==============================================
-- GAME SESSIONS
-- ==============================================
CREATE TABLE IF NOT EXISTS game_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    session_number INTEGER NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTEGER, -- Duration in minutes
    summary TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- GAME SESSION ATTENDEES
-- ==============================================
CREATE TABLE IF NOT EXISTS game_session_attendees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(game_session_id, user_id)
);

-- ==============================================
-- SKILLS
-- ==============================================
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    attribute VARCHAR(50) NOT NULL,
    is_trained BOOLEAN DEFAULT FALSE,
    only_trained BOOLEAN DEFAULT FALSE,
    armor_penalty BOOLEAN DEFAULT FALSE,
    half_level INTEGER DEFAULT 0,
    trained_bonus INTEGER DEFAULT 0,
    others INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- PROFICIENCIES
-- ==============================================
CREATE TABLE IF NOT EXISTS proficiencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- NOTES
-- ==============================================
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    title VARCHAR(255),
    content TEXT NOT NULL,
    category VARCHAR(50),
    tags TEXT[], -- Array of tags
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- SPELLS
-- ==============================================
CREATE TABLE IF NOT EXISTS spells (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    escola VARCHAR(100) NOT NULL,
    execucao VARCHAR(100) NOT NULL,
    alcance VARCHAR(100) NOT NULL,
    area VARCHAR(100),
    alvo VARCHAR(100),
    efeito TEXT,
    duracao VARCHAR(100) NOT NULL,
    resistencia VARCHAR(100) NOT NULL,
    fonte VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- SPELL ENHANCEMENTS (Aprimoramentos)
-- ==============================================
CREATE TABLE IF NOT EXISTS spell_enhancements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    spell_id UUID NOT NULL REFERENCES spells(id) ON DELETE CASCADE,
    custo_adicional_pm INTEGER NOT NULL,
    reaplicavel BOOLEAN DEFAULT FALSE,
    descricao TEXT NOT NULL,
    aplicacoes INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- CHARACTER SPELLS (Many-to-Many)
-- ==============================================
CREATE TABLE IF NOT EXISTS character_spells (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    spell_id UUID NOT NULL REFERENCES spells(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(character_id, spell_id)
);

-- ==============================================
-- ATTACKS
-- ==============================================
CREATE TABLE IF NOT EXISTS attacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    teste_ataque VARCHAR(100) NOT NULL,
    damage VARCHAR(100) NOT NULL,
    critico VARCHAR(100) NOT NULL,
    range VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- ABILITIES (Habilidades e Poderes)
-- ==============================================
CREATE TABLE IF NOT EXISTS abilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'ability' or 'power'
    category VARCHAR(50), -- PowerCategory for powers
    description TEXT NOT NULL,
    prerequisites TEXT,
    cost VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- CHARACTER ABILITIES (Many-to-Many)
-- ==============================================
CREATE TABLE IF NOT EXISTS character_abilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    ability_id UUID NOT NULL REFERENCES abilities(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(character_id, ability_id)
);

-- ==============================================
-- ITEMS
-- ==============================================
CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price INTEGER DEFAULT 0,
    category VARCHAR(50) NOT NULL, -- 'weapon', 'armor', 'ammo', 'consumable', 'misc'
    slots_per_each INTEGER DEFAULT 1,
    
    -- Weapon specific
    attack_roll VARCHAR(100),
    damage VARCHAR(100),
    crit VARCHAR(100),
    range VARCHAR(100),
    damage_type VARCHAR(50),
    
    -- Equipment specific
    armor_bonus INTEGER,
    armor_penalty INTEGER,
    
    -- Consumable specific
    effect TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- CHARACTER ITEMS (Inventory)
-- ==============================================
CREATE TABLE IF NOT EXISTS character_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- CHARACTER EQUIPMENT (Equipped Items)
-- ==============================================
CREATE TABLE IF NOT EXISTS character_equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    slot VARCHAR(50), -- e.g., 'head', 'chest', 'hands', 'weapon_main', 'weapon_off'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- GROUPS
-- ==============================================
CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    gold INTEGER DEFAULT 0,
    silver INTEGER DEFAULT 0,
    bronze INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- GROUP MEMBERS (Many-to-Many)
-- ==============================================
CREATE TABLE IF NOT EXISTS group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    role VARCHAR(100) NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, character_id)
);

-- ==============================================
-- GROUP STORAGE (Armazéns)
-- ==============================================
CREATE TABLE IF NOT EXISTS group_storage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- GROUP STORAGE ITEMS
-- ==============================================
CREATE TABLE IF NOT EXISTS group_storage_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    storage_id UUID NOT NULL REFERENCES group_storage(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- INDEXES for performance
-- ==============================================
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON characters(user_id);
CREATE INDEX IF NOT EXISTS idx_character_attributes_character_id ON character_attributes(character_id);
CREATE INDEX IF NOT EXISTS idx_games_game_master_id ON games(game_master_id);
CREATE INDEX IF NOT EXISTS idx_game_players_game_id ON game_players(game_id);
CREATE INDEX IF NOT EXISTS idx_game_players_user_id ON game_players(user_id);
CREATE INDEX IF NOT EXISTS idx_game_players_character_id ON game_players(character_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_game_id ON game_sessions(game_id);
CREATE INDEX IF NOT EXISTS idx_skills_character_id ON skills(character_id);
CREATE INDEX IF NOT EXISTS idx_proficiencies_character_id ON proficiencies(character_id);
CREATE INDEX IF NOT EXISTS idx_notes_character_id ON notes(character_id);
CREATE INDEX IF NOT EXISTS idx_character_spells_character_id ON character_spells(character_id);
CREATE INDEX IF NOT EXISTS idx_character_spells_spell_id ON character_spells(spell_id);
CREATE INDEX IF NOT EXISTS idx_spell_enhancements_spell_id ON spell_enhancements(spell_id);
CREATE INDEX IF NOT EXISTS idx_attacks_character_id ON attacks(character_id);
CREATE INDEX IF NOT EXISTS idx_character_abilities_character_id ON character_abilities(character_id);
CREATE INDEX IF NOT EXISTS idx_character_abilities_ability_id ON character_abilities(ability_id);
CREATE INDEX IF NOT EXISTS idx_character_items_character_id ON character_items(character_id);
CREATE INDEX IF NOT EXISTS idx_character_items_item_id ON character_items(item_id);
CREATE INDEX IF NOT EXISTS idx_character_equipment_character_id ON character_equipment(character_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_character_id ON group_members(character_id);
CREATE INDEX IF NOT EXISTS idx_group_storage_group_id ON group_storage(group_id);
CREATE INDEX IF NOT EXISTS idx_group_storage_items_storage_id ON group_storage_items(storage_id);

-- ==============================================
-- FUNCTIONS for automatic updated_at
-- ==============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- TRIGGERS for automatic updated_at
-- ==============================================
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_games_updated_at ON games;
CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON games 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_game_sessions_updated_at ON game_sessions;
CREATE TRIGGER update_game_sessions_updated_at BEFORE UPDATE ON game_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_characters_updated_at ON characters;
CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON characters 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_character_attributes_updated_at ON character_attributes;
CREATE TRIGGER update_character_attributes_updated_at BEFORE UPDATE ON character_attributes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_skills_updated_at ON skills;
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notes_updated_at ON notes;
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_spells_updated_at ON spells;
CREATE TRIGGER update_spells_updated_at BEFORE UPDATE ON spells 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_attacks_updated_at ON attacks;
CREATE TRIGGER update_attacks_updated_at BEFORE UPDATE ON attacks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_abilities_updated_at ON abilities;
CREATE TRIGGER update_abilities_updated_at BEFORE UPDATE ON abilities 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_items_updated_at ON items;
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_character_items_updated_at ON character_items;
CREATE TRIGGER update_character_items_updated_at BEFORE UPDATE ON character_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_character_equipment_updated_at ON character_equipment;
CREATE TRIGGER update_character_equipment_updated_at BEFORE UPDATE ON character_equipment 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_groups_updated_at ON groups;
CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_group_storage_updated_at ON group_storage;
CREATE TRIGGER update_group_storage_updated_at BEFORE UPDATE ON group_storage 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_group_storage_items_updated_at ON group_storage_items;
CREATE TRIGGER update_group_storage_items_updated_at BEFORE UPDATE ON group_storage_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- ROW LEVEL SECURITY (RLS) - Recommendations
-- ==============================================
-- Uncomment and configure these when you're ready to implement RLS

-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE games ENABLE ROW LEVEL SECURITY;
-- etc...

-- Example RLS policies:
-- CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid() = id);
-- CREATE POLICY "Users can view their own characters" ON characters FOR SELECT USING (auth.uid() = user_id);
-- CREATE POLICY "GMs can view their game data" ON games FOR SELECT USING (auth.uid() = game_master_id);

