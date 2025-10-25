import { supabase } from '../config/supabase';
import type { 
  Character, 
  CharacterAttributes, 
  Skill, 
  Proficiency,
  Note,
  Spell,
  Attack,
  Ability,
  Item,
  Group,
  Game,
  User
} from '../types';

// ============================================================================
// USER OPERATIONS
// ============================================================================

export const userApi = {
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    
    // Map snake_case to camelCase
    return {
      id: data.id,
      username: data.username,
      email: data.email,
      isGameMaster: data.is_game_master,
      profilePicture: data.profile_picture,
      theme: data.theme,
      language: data.language,
      notificationsEnabled: data.notifications_enabled,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as User;
  },

  async updateUser(userId: string, updates: Partial<User>) {
    // Map camelCase to snake_case for database
    const dbUpdates: any = {};
    if (updates.username !== undefined) dbUpdates.username = updates.username;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.isGameMaster !== undefined) dbUpdates.is_game_master = updates.isGameMaster;
    if (updates.profilePicture !== undefined) dbUpdates.profile_picture = updates.profilePicture;
    if (updates.theme !== undefined) dbUpdates.theme = updates.theme;
    if (updates.language !== undefined) dbUpdates.language = updates.language;
    if (updates.notificationsEnabled !== undefined) dbUpdates.notifications_enabled = updates.notificationsEnabled;

    const { data, error } = await supabase
      .from('users')
      .update(dbUpdates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    
    // Map back to camelCase
    return {
      id: data.id,
      username: data.username,
      email: data.email,
      isGameMaster: data.is_game_master,
      profilePicture: data.profile_picture,
      theme: data.theme,
      language: data.language,
      notificationsEnabled: data.notifications_enabled,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as User;
  },
};

// ============================================================================
// CHARACTER OPERATIONS
// ============================================================================

export const characterApi = {
  async getCharactersByUserId(userId: string) {
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data as Character[];
  },

  async getCharacterById(characterId: string) {
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('id', characterId)
      .single();

    if (error) throw error;
    return data as Character;
  },

  async createCharacter(character: Omit<Character, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('characters')
      .insert([character])
      .select()
      .single();

    if (error) throw error;

    // Create default attributes for the character
    await supabase
      .from('character_attributes')
      .insert([{
        character_id: data.id,
        forca: 10,
        destreza: 10,
        constituicao: 10,
        inteligencia: 10,
        sabedoria: 10,
        carisma: 10,
      }]);

    return data as Character;
  },

  async updateCharacter(characterId: string, updates: Partial<Character>) {
    const { data, error } = await supabase
      .from('characters')
      .update(updates)
      .eq('id', characterId)
      .select()
      .single();

    if (error) throw error;
    return data as Character;
  },

  async deleteCharacter(characterId: string) {
    const { error } = await supabase
      .from('characters')
      .delete()
      .eq('id', characterId);

    if (error) throw error;
  },
};

// ============================================================================
// CHARACTER ATTRIBUTES OPERATIONS
// ============================================================================

export const attributesApi = {
  async getAttributes(characterId: string) {
    const { data, error } = await supabase
      .from('character_attributes')
      .select('*')
      .eq('character_id', characterId)
      .single();

    if (error) throw error;
    return data as CharacterAttributes;
  },

  async updateAttributes(characterId: string, attributes: Partial<CharacterAttributes>) {
    const { data, error } = await supabase
      .from('character_attributes')
      .update(attributes)
      .eq('character_id', characterId)
      .select()
      .single();

    if (error) throw error;
    return data as CharacterAttributes;
  },
};

// ============================================================================
// SKILLS OPERATIONS
// ============================================================================

export const skillsApi = {
  async getSkills(characterId: string) {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('character_id', characterId);

    if (error) throw error;
    return data as Skill[];
  },

  async createSkill(skill: Omit<Skill, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('skills')
      .insert([skill])
      .select()
      .single();

    if (error) throw error;
    return data as Skill;
  },

  async updateSkill(skillId: string, updates: Partial<Skill>) {
    const { data, error } = await supabase
      .from('skills')
      .update(updates)
      .eq('id', skillId)
      .select()
      .single();

    if (error) throw error;
    return data as Skill;
  },

  async deleteSkill(skillId: string) {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', skillId);

    if (error) throw error;
  },
};

// ============================================================================
// PROFICIENCIES OPERATIONS
// ============================================================================

export const proficienciesApi = {
  async getProficiencies(characterId: string) {
    const { data, error } = await supabase
      .from('proficiencies')
      .select('*')
      .eq('character_id', characterId);

    if (error) throw error;
    return data as Proficiency[];
  },

  async createProficiency(proficiency: Omit<Proficiency, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('proficiencies')
      .insert([proficiency])
      .select()
      .single();

    if (error) throw error;
    return data as Proficiency;
  },

  async deleteProficiency(proficiencyId: string) {
    const { error } = await supabase
      .from('proficiencies')
      .delete()
      .eq('id', proficiencyId);

    if (error) throw error;
  },
};

// ============================================================================
// NOTES OPERATIONS
// ============================================================================

export const notesApi = {
  async getNotes(characterId: string) {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('character_id', characterId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Note[];
  },

  async createNote(note: Omit<Note, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('notes')
      .insert([note])
      .select()
      .single();

    if (error) throw error;
    return data as Note;
  },

  async updateNote(noteId: string, updates: Partial<Note>) {
    const { data, error } = await supabase
      .from('notes')
      .update(updates)
      .eq('id', noteId)
      .select()
      .single();

    if (error) throw error;
    return data as Note;
  },

  async deleteNote(noteId: string) {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId);

    if (error) throw error;
  },
};

// ============================================================================
// SPELLS OPERATIONS
// ============================================================================

export const spellsApi = {
  async getCharacterSpells(characterId: string) {
    const { data, error } = await supabase
      .from('character_spells')
      .select('*, spells(*)')
      .eq('character_id', characterId);

    if (error) throw error;
    return data.map(cs => cs.spells) as Spell[];
  },

  async getAllSpells() {
    const { data, error } = await supabase
      .from('spells')
      .select('*')
      .order('name');

    if (error) throw error;
    return data as Spell[];
  },

  async addSpellToCharacter(characterId: string, spellId: string) {
    const { error } = await supabase
      .from('character_spells')
      .insert([{ character_id: characterId, spell_id: spellId }]);

    if (error) throw error;
  },

  async removeSpellFromCharacter(characterId: string, spellId: string) {
    const { error } = await supabase
      .from('character_spells')
      .delete()
      .eq('character_id', characterId)
      .eq('spell_id', spellId);

    if (error) throw error;
  },
};

// ============================================================================
// ATTACKS OPERATIONS
// ============================================================================

export const attacksApi = {
  async getAttacks(characterId: string) {
    const { data, error } = await supabase
      .from('attacks')
      .select('*')
      .eq('character_id', characterId);

    if (error) throw error;
    return data as Attack[];
  },

  async createAttack(attack: Omit<Attack, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('attacks')
      .insert([attack])
      .select()
      .single();

    if (error) throw error;
    return data as Attack;
  },

  async updateAttack(attackId: string, updates: Partial<Attack>) {
    const { data, error } = await supabase
      .from('attacks')
      .update(updates)
      .eq('id', attackId)
      .select()
      .single();

    if (error) throw error;
    return data as Attack;
  },

  async deleteAttack(attackId: string) {
    const { error } = await supabase
      .from('attacks')
      .delete()
      .eq('id', attackId);

    if (error) throw error;
  },
};

// ============================================================================
// ABILITIES OPERATIONS
// ============================================================================

export const abilitiesApi = {
  async getCharacterAbilities(characterId: string) {
    const { data, error } = await supabase
      .from('character_abilities')
      .select('*, abilities(*)')
      .eq('character_id', characterId);

    if (error) throw error;
    return data.map(ca => ca.abilities) as Ability[];
  },

  async getAllAbilities() {
    const { data, error } = await supabase
      .from('abilities')
      .select('*')
      .order('name');

    if (error) throw error;
    return data as Ability[];
  },

  async addAbilityToCharacter(characterId: string, abilityId: string) {
    const { error } = await supabase
      .from('character_abilities')
      .insert([{ character_id: characterId, ability_id: abilityId }]);

    if (error) throw error;
  },

  async removeAbilityFromCharacter(characterId: string, abilityId: string) {
    const { error } = await supabase
      .from('character_abilities')
      .delete()
      .eq('character_id', characterId)
      .eq('ability_id', abilityId);

    if (error) throw error;
  },
};

// ============================================================================
// ITEMS & INVENTORY OPERATIONS
// ============================================================================

export const itemsApi = {
  async getCharacterItems(characterId: string) {
    const { data, error } = await supabase
      .from('character_items')
      .select('*, items(*)')
      .eq('character_id', characterId);

    if (error) throw error;
    return data.map(ci => ({ ...ci.items, quantity: ci.quantity, inventoryId: ci.id })) as (Item & { quantity: number; inventoryId: string })[];
  },

  async getAllItems() {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('name');

    if (error) throw error;
    return data as Item[];
  },

  async addItemToCharacter(characterId: string, itemId: string, quantity: number = 1) {
    // Check if item already exists in inventory
    const { data: existing } = await supabase
      .from('character_items')
      .select('*')
      .eq('character_id', characterId)
      .eq('item_id', itemId)
      .single();

    if (existing) {
      // Update quantity
      const { error } = await supabase
        .from('character_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id);

      if (error) throw error;
    } else {
      // Insert new item
      const { error } = await supabase
        .from('character_items')
        .insert([{ character_id: characterId, item_id: itemId, quantity }]);

      if (error) throw error;
    }
  },

  async updateItemQuantity(inventoryId: string, quantity: number) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      const { error } = await supabase
        .from('character_items')
        .delete()
        .eq('id', inventoryId);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('character_items')
        .update({ quantity })
        .eq('id', inventoryId);

      if (error) throw error;
    }
  },

  async removeItemFromCharacter(inventoryId: string) {
    const { error } = await supabase
      .from('character_items')
      .delete()
      .eq('id', inventoryId);

    if (error) throw error;
  },
};

// ============================================================================
// GROUPS OPERATIONS
// ============================================================================

export const groupsApi = {
  async getCharacterGroups(characterId: string) {
    const { data, error } = await supabase
      .from('group_members')
      .select('*, groups(*)')
      .eq('character_id', characterId);

    if (error) throw error;
    return data.map(gm => gm.groups) as Group[];
  },

  async getGroupById(groupId: string) {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('id', groupId)
      .single();

    if (error) throw error;
    return data as Group;
  },

  async getGroupMembers(groupId: string) {
    const { data, error } = await supabase
      .from('group_members')
      .select('*, characters(*)')
      .eq('group_id', groupId);

    if (error) throw error;
    return data;
  },

  async createGroup(group: Omit<Group, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('groups')
      .insert([group])
      .select()
      .single();

    if (error) throw error;
    return data as Group;
  },

  async updateGroup(groupId: string, updates: Partial<Group>) {
    const { data, error } = await supabase
      .from('groups')
      .update(updates)
      .eq('id', groupId)
      .select()
      .single();

    if (error) throw error;
    return data as Group;
  },
};

// ============================================================================
// GAMES OPERATIONS
// ============================================================================

export const gamesApi = {
  async getGamesByGameMaster(userId: string) {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('game_master_id', userId);

    if (error) throw error;
    
    // Map snake_case to camelCase
    return data.map(game => ({
      id: game.id,
      name: game.name,
      description: game.description,
      gameMasterId: game.game_master_id,
      isActive: game.is_active,
      inGameDate: game.in_game_date,
      lastSessionDate: game.last_session_date,
      createdAt: game.created_at,
      updatedAt: game.updated_at,
    })) as Game[];
  },

  async getGamesByPlayer(userId: string) {
    const { data, error } = await supabase
      .from('game_players')
      .select('*, games(*)')
      .eq('user_id', userId);

    if (error) throw error;
    
    // Map snake_case to camelCase
    return data.map(gp => ({
      id: gp.games.id,
      name: gp.games.name,
      description: gp.games.description,
      gameMasterId: gp.games.game_master_id,
      isActive: gp.games.is_active,
      inGameDate: gp.games.in_game_date,
      lastSessionDate: gp.games.last_session_date,
      createdAt: gp.games.created_at,
      updatedAt: gp.games.updated_at,
    })) as Game[];
  },

  async getGameById(gameId: string) {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', gameId)
      .single();

    if (error) throw error;
    
    // Map snake_case to camelCase
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      gameMasterId: data.game_master_id,
      isActive: data.is_active,
      inGameDate: data.in_game_date,
      lastSessionDate: data.last_session_date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as Game;
  },

  async createGame(game: Omit<Game, 'id' | 'createdAt' | 'updatedAt'>) {
    // Map camelCase to snake_case for database
    const dbGame = {
      name: game.name,
      description: game.description,
      game_master_id: game.gameMasterId,
      is_active: game.isActive,
      in_game_date: game.inGameDate,
      last_session_date: game.lastSessionDate,
    };

    const { data, error } = await supabase
      .from('games')
      .insert([dbGame])
      .select()
      .single();

    if (error) throw error;
    
    // Map back to camelCase
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      gameMasterId: data.game_master_id,
      isActive: data.is_active,
      inGameDate: data.in_game_date,
      lastSessionDate: data.last_session_date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as Game;
  },

  async updateGame(gameId: string, updates: Partial<Game>) {
    // Map camelCase to snake_case for database
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.gameMasterId !== undefined) dbUpdates.game_master_id = updates.gameMasterId;
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
    if (updates.inGameDate !== undefined) dbUpdates.in_game_date = updates.inGameDate;
    if (updates.lastSessionDate !== undefined) dbUpdates.last_session_date = updates.lastSessionDate;

    const { data, error } = await supabase
      .from('games')
      .update(dbUpdates)
      .eq('id', gameId)
      .select()
      .single();

    if (error) throw error;
    
    // Map back to camelCase
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      gameMasterId: data.game_master_id,
      isActive: data.is_active,
      inGameDate: data.in_game_date,
      lastSessionDate: data.last_session_date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as Game;
  },
};
