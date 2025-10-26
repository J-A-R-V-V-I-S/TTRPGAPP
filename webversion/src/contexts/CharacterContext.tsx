/**
 * CharacterContext - Refactored
 *
 * SIMPLIFIED: Now only manages basic character data.
 * Combat, Inventory, Transactions, Notes, and Attributes are managed by specialized contexts.
 *
 * Responsibilities:
 * - Basic character info (name, level, class, race, deity, origin, size, movement)
 * - Description, backstory, backstorySecret
 * - Health, Mana (current, max, temporary)
 * - Profile/Background images
 * - Proficiencies and habilities
 * - Arrows, Bullets
 * - Defense values
 * - Max inventory slots
 * - Level management (also triggers skill updates)
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../config/supabase';
import { useUser } from './UserContext';
import { updateCharacterField, updateCharacterFields } from '../utils/supabaseOperations';
import { validateCharacterId, executeWithLogging, logError, logSuccess } from '../utils/errorHandler';

interface Character {
  id: string;
  user_id: string;
  name: string;
  level: number;
  class: string;
  race: string;
  deity: string;
  origin: string;
  size: string;
  movement: string | null;
  description: string | null;
  backstory: string | null;
  is_backstory_secret: boolean;
  proficiencies_and_habilities: string | null;
  arrows: number;
  bullets: number;
  max_inventory_slots: number;
  current_load: number;
  profile_img: string | null;
  background_img: string | null;
  current_health: number;
  max_health: number;
  temporary_health: number;
  current_mana: number;
  max_mana: number;
  temporary_mana: number;
  // Defense fields
  defence_base: number;
  defence_armor_bonus: number;
  defence_attribute_bonus: number;
  defence_other: number;
  defence_armor_penalty: number;
}

interface CharacterContextType {
  character: Character | null;
  loading: boolean;
  error: string | null;

  // Load/Refresh functions
  loadCharacter: (characterId: string) => Promise<void>;
  refreshCharacter: () => Promise<void>;

  // Update functions for specific properties
  updateDescription: (value: string) => Promise<void>;
  updateBackstory: (value: string) => Promise<void>;
  updateBackstorySecret: (isSecret: boolean) => Promise<void>;
  updateProficienciesAndHabilities: (value: string) => Promise<void>;
  updateArrows: (value: number) => Promise<void>;
  updateBullets: (value: number) => Promise<void>;
  updateMaxInventorySlots: (value: number) => Promise<void>;
  updateCurrentLoad: (value: number) => Promise<void>;
  updateMovement: (value: string) => Promise<void>;

  // Health and Mana updates
  updateHealth: (current: number, max?: number, temporary?: number) => Promise<void>;
  updateMana: (current: number, max?: number, temporary?: number) => Promise<void>;

  // Profile images
  updateProfileImage: (url: string) => Promise<void>;
  updateBackgroundImage: (url: string) => Promise<void>;

  // Level management
  updateLevel: (newLevel: number) => Promise<void>;

  // Defense management
  updateDefenseBase: (value: number) => Promise<void>;
  updateDefenseArmorBonus: (value: number) => Promise<void>;
  updateDefenseAttributeBonus: (value: number) => Promise<void>;
  updateDefenseOther: (value: number) => Promise<void>;
  updateDefenseArmorPenalty: (value: number) => Promise<void>;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
};

interface CharacterProviderProps {
  children: ReactNode;
}

export const CharacterProvider = ({ children }: CharacterProviderProps) => {
  const { selectedCharacterId } = useUser();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load character from database (SIMPLIFIED - only basic fields)
  const loadCharacter = useCallback(async (characterId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Load character data (basic fields only)
      const { data, error: fetchError } = await supabase
        .from('characters')
        .select('*')
        .eq('id', characterId)
        .single();

      if (fetchError) throw fetchError;

      if (!data) {
        setError('Personagem não encontrado');
        setCharacter(null);
      } else {
        setCharacter(data as Character);
      }
    } catch (err) {
      logError('carregar personagem', err);
      setError('Erro ao carregar personagem');
      setCharacter(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load character when selectedCharacterId changes
  useEffect(() => {
    if (selectedCharacterId) {
      loadCharacter(selectedCharacterId);
    } else {
      setCharacter(null);
    }
  }, [selectedCharacterId, loadCharacter]);

  // Refresh current character
  const refreshCharacter = useCallback(async () => {
    if (character?.id) {
      await loadCharacter(character.id);
    }
  }, [character?.id, loadCharacter]);

  // Wrapper function to update field in both DB and local state
  const updateField = async (field: string, value: any) => {
    validateCharacterId(character?.id, `update ${field}`);

    await executeWithLogging(
      async () => {
        await updateCharacterField(character!.id, field, value);

        // Update local state
        setCharacter(prev => prev ? { ...prev, [field]: value } : null);
      },
      `atualizar ${field}`
    );
  };

  // Wrapper function to update multiple fields in both DB and local state
  const updateFields = async (updates: Partial<Character>) => {
    validateCharacterId(character?.id, 'update multiple fields');

    await executeWithLogging(
      async () => {
        await updateCharacterFields(character!.id, updates);

        // Update local state
        setCharacter(prev => prev ? { ...prev, ...updates } : null);
      },
      'atualizar personagem'
    );
  };

  // Specific update functions (using generic updateField)
  // Factory function to create simple field updaters
  // Eliminates repetitive wrapper functions - Clean Code Pattern
  const createFieldUpdater = (fieldName: string) => async (value: any) => {
    await updateField(fieldName, value);
  };

  const updateDescription = createFieldUpdater('description');
  const updateBackstory = createFieldUpdater('backstory');
  const updateBackstorySecret = createFieldUpdater('is_backstory_secret');
  const updateProficienciesAndHabilities = createFieldUpdater('proficiencies_and_habilities');
  const updateArrows = createFieldUpdater('arrows');
  const updateBullets = createFieldUpdater('bullets');
  const updateMaxInventorySlots = createFieldUpdater('max_inventory_slots');
  const updateCurrentLoad = createFieldUpdater('current_load');
  const updateMovement = createFieldUpdater('movement');

  const updateHealth = async (current: number, max?: number, temporary?: number) => {
    const updates: any = { current_health: current };
    if (max !== undefined) updates.max_health = max;
    if (temporary !== undefined) updates.temporary_health = temporary;
    await updateFields(updates);
  };

  const updateMana = async (current: number, max?: number, temporary?: number) => {
    const updates: any = { current_mana: current };
    if (max !== undefined) updates.max_mana = max;
    if (temporary !== undefined) updates.temporary_mana = temporary;
    await updateFields(updates);
  };

  const updateProfileImage = createFieldUpdater('profile_img');
  const updateBackgroundImage = createFieldUpdater('background_img');

  // Update level and skills half_level
  const updateLevel = async (newLevel: number) => {
    validateCharacterId(character?.id, 'updateLevel');

    await executeWithLogging(
      async () => {
        // Update character level
        await updateCharacterField(character!.id, 'level', newLevel);

        // Calculate new half level (rounded down)
        const newHalfLevel = Math.floor(newLevel / 2);

        // Update all skills with new half_level
        const { error: skillsError } = await supabase
          .from('skills')
          .update({ half_level: newHalfLevel })
          .eq('character_id', character!.id);

        if (skillsError) {
          logError('atualizar half_level das perícias', skillsError);
          throw skillsError;
        }

        // Update local state
        setCharacter(prev => prev ? { ...prev, level: newLevel } : null);

        logSuccess('Nível e perícias atualizados com sucesso!');
      },
      'atualizar nível'
    );
  };

  // Defense management functions - using factory pattern
  const updateDefenseBase = createFieldUpdater('defence_base');
  const updateDefenseArmorBonus = createFieldUpdater('defence_armor_bonus');
  const updateDefenseAttributeBonus = createFieldUpdater('defence_attribute_bonus');
  const updateDefenseOther = createFieldUpdater('defence_other');
  const updateDefenseArmorPenalty = createFieldUpdater('defence_armor_penalty');

  const value = {
    character,
    loading,
    error,
    loadCharacter,
    refreshCharacter,
    updateDescription,
    updateBackstory,
    updateBackstorySecret,
    updateProficienciesAndHabilities,
    updateArrows,
    updateBullets,
    updateMaxInventorySlots,
    updateCurrentLoad,
    updateMovement,
    updateHealth,
    updateMana,
    updateProfileImage,
    updateBackgroundImage,
    updateLevel,
    updateDefenseBase,
    updateDefenseArmorBonus,
    updateDefenseAttributeBonus,
    updateDefenseOther,
    updateDefenseArmorPenalty,
  };

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
};
