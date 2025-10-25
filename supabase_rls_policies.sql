-- ==============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================
-- Run this after setting up Supabase Auth
-- These policies ensure users can only access their own data

-- ==============================================
-- ENABLE RLS ON ALL TABLES
-- ==============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_session_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE proficiencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE spells ENABLE ROW LEVEL SECURITY;
ALTER TABLE spell_enhancements ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_spells ENABLE ROW LEVEL SECURITY;
ALTER TABLE attacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE abilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_abilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_storage ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_storage_items ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- USERS TABLE POLICIES
-- ==============================================
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile (for registration)
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ==============================================
-- CHARACTERS TABLE POLICIES
-- ==============================================
-- Users can view their own characters
CREATE POLICY "Users can view own characters" ON characters
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own characters
CREATE POLICY "Users can create own characters" ON characters
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own characters
CREATE POLICY "Users can update own characters" ON characters
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own characters
CREATE POLICY "Users can delete own characters" ON characters
  FOR DELETE USING (auth.uid() = user_id);

-- ==============================================
-- CHARACTER ATTRIBUTES POLICIES
-- ==============================================
CREATE POLICY "Users can view own character attributes" ON character_attributes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM characters 
      WHERE characters.id = character_attributes.character_id 
      AND characters.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own character attributes" ON character_attributes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM characters 
      WHERE characters.id = character_attributes.character_id 
      AND characters.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own character attributes" ON character_attributes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM characters 
      WHERE characters.id = character_attributes.character_id 
      AND characters.user_id = auth.uid()
    )
  );

-- ==============================================
-- SKILLS POLICIES
-- ==============================================
CREATE POLICY "Users can manage own character skills" ON skills
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM characters 
      WHERE characters.id = skills.character_id 
      AND characters.user_id = auth.uid()
    )
  );

-- ==============================================
-- PROFICIENCIES POLICIES
-- ==============================================
CREATE POLICY "Users can manage own character proficiencies" ON proficiencies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM characters 
      WHERE characters.id = proficiencies.character_id 
      AND characters.user_id = auth.uid()
    )
  );

-- ==============================================
-- NOTES POLICIES
-- ==============================================
CREATE POLICY "Users can manage own character notes" ON notes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM characters 
      WHERE characters.id = notes.character_id 
      AND characters.user_id = auth.uid()
    )
  );

-- ==============================================
-- SPELLS POLICIES (Read-only for all authenticated users)
-- ==============================================
CREATE POLICY "Authenticated users can view all spells" ON spells
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view spell enhancements" ON spell_enhancements
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- ==============================================
-- CHARACTER SPELLS POLICIES
-- ==============================================
CREATE POLICY "Users can manage own character spells" ON character_spells
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM characters 
      WHERE characters.id = character_spells.character_id 
      AND characters.user_id = auth.uid()
    )
  );

-- ==============================================
-- ATTACKS POLICIES
-- ==============================================
CREATE POLICY "Users can manage own character attacks" ON attacks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM characters 
      WHERE characters.id = attacks.character_id 
      AND characters.user_id = auth.uid()
    )
  );

-- ==============================================
-- ABILITIES POLICIES (Read-only for all authenticated users)
-- ==============================================
CREATE POLICY "Authenticated users can view all abilities" ON abilities
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- ==============================================
-- CHARACTER ABILITIES POLICIES
-- ==============================================
CREATE POLICY "Users can manage own character abilities" ON character_abilities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM characters 
      WHERE characters.id = character_abilities.character_id 
      AND characters.user_id = auth.uid()
    )
  );

-- ==============================================
-- ITEMS POLICIES (Read-only for all authenticated users)
-- ==============================================
CREATE POLICY "Authenticated users can view all items" ON items
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- ==============================================
-- CHARACTER ITEMS POLICIES
-- ==============================================
CREATE POLICY "Users can manage own character items" ON character_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM characters 
      WHERE characters.id = character_items.character_id 
      AND characters.user_id = auth.uid()
    )
  );

-- ==============================================
-- CHARACTER EQUIPMENT POLICIES
-- ==============================================
CREATE POLICY "Users can manage own character equipment" ON character_equipment
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM characters 
      WHERE characters.id = character_equipment.character_id 
      AND characters.user_id = auth.uid()
    )
  );

-- ==============================================
-- GAMES POLICIES
-- ==============================================
-- Game Masters can view/manage their own games
CREATE POLICY "Game Masters can manage own games" ON games
  FOR ALL USING (auth.uid() = game_master_id);

-- Players can view games they're part of
CREATE POLICY "Players can view games they're in" ON games
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM game_players 
      WHERE game_players.game_id = games.id 
      AND game_players.user_id = auth.uid()
    )
  );

-- ==============================================
-- GAME PLAYERS POLICIES
-- ==============================================
-- Game Masters can manage players in their games
CREATE POLICY "GMs can manage players in their games" ON game_players
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM games 
      WHERE games.id = game_players.game_id 
      AND games.game_master_id = auth.uid()
    )
  );

-- Players can view other players in their games
CREATE POLICY "Players can view game members" ON game_players
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM game_players gp2
      WHERE gp2.game_id = game_players.game_id 
      AND gp2.user_id = auth.uid()
    )
  );

-- ==============================================
-- GAME SESSIONS POLICIES
-- ==============================================
CREATE POLICY "GMs and players can view game sessions" ON game_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM games 
      WHERE games.id = game_sessions.game_id 
      AND (
        games.game_master_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM game_players 
          WHERE game_players.game_id = games.id 
          AND game_players.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "GMs can manage game sessions" ON game_sessions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM games 
      WHERE games.id = game_sessions.game_id 
      AND games.game_master_id = auth.uid()
    )
  );

CREATE POLICY "GMs can update game sessions" ON game_sessions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM games 
      WHERE games.id = game_sessions.game_id 
      AND games.game_master_id = auth.uid()
    )
  );

-- ==============================================
-- GROUPS POLICIES
-- ==============================================
-- Group members can view their groups
CREATE POLICY "Group members can view their groups" ON groups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_members gm
      JOIN characters c ON c.id = gm.character_id
      WHERE gm.group_id = groups.id 
      AND c.user_id = auth.uid()
    )
  );

-- Group members can update their groups (for shared resources)
CREATE POLICY "Group members can update groups" ON groups
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM group_members gm
      JOIN characters c ON c.id = gm.character_id
      WHERE gm.group_id = groups.id 
      AND c.user_id = auth.uid()
    )
  );

-- ==============================================
-- GROUP MEMBERS POLICIES
-- ==============================================
CREATE POLICY "Group members can view group membership" ON group_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_members gm2
      JOIN characters c ON c.id = gm2.character_id
      WHERE gm2.group_id = group_members.group_id 
      AND c.user_id = auth.uid()
    )
  );

-- ==============================================
-- GROUP STORAGE POLICIES
-- ==============================================
CREATE POLICY "Group members can manage group storage" ON group_storage
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM group_members gm
      JOIN characters c ON c.id = gm.character_id
      WHERE gm.group_id = group_storage.group_id 
      AND c.user_id = auth.uid()
    )
  );

-- ==============================================
-- GROUP STORAGE ITEMS POLICIES
-- ==============================================
CREATE POLICY "Group members can manage storage items" ON group_storage_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM group_storage gs
      JOIN group_members gm ON gm.group_id = gs.group_id
      JOIN characters c ON c.id = gm.character_id
      WHERE gs.id = group_storage_items.storage_id 
      AND c.user_id = auth.uid()
    )
  );

