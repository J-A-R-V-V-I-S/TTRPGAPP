import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../config/supabase';
import { useUser } from './UserContext';
import type { Transaction, CreateTransactionData } from '../types/transaction';
import type { Note } from '../types/note';
import type { CharacterAttributes } from '../types/character_attributes';
import type { Skill } from '../types/skill';
import type { Attack } from '../types/attack';
import type { Spell, Aprimoramento } from '../types/spell';
import type { Ability, Power } from '../types/ability';

interface InventoryItem {
  id: string; // character_items.id
  item_id: string; // items.id
  character_id: string;
  quantity: number;
  name: string;
  description: string;
  price: number;
  category: string;
  slots_per_each: number;
  // Weapon specific
  attack_roll?: string;
  damage?: string;
  crit?: string;
  range?: string;
  damage_type?: string;
  // Equipment specific
  armor_bonus?: number;
  armor_penalty?: number;
  // Consumable specific
  effect?: string;
}

interface CharacterSkill extends Skill {
  id: string; // skill.id from database
  characterId: string;
}

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
  inventory?: InventoryItem[];
  transactions?: Transaction[];
  notes?: Note[];
  attributes?: CharacterAttributes;
  skills?: CharacterSkill[];
  attacks?: Attack[];
  spells?: Spell[];
  abilities?: Ability[];
  powers?: Power[];
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
  
  // Inventory management
  addItemToInventory: (itemId: string, quantity?: number) => Promise<void>;
  removeItemFromInventory: (characterItemId: string) => Promise<void>;
  updateItemQuantity: (characterItemId: string, quantity: number) => Promise<void>;
  refreshInventory: () => Promise<void>;
  
  // Transaction management
  addTransaction: (data: CreateTransactionData) => Promise<void>;
  deleteTransaction: (transactionId: string) => Promise<void>;
  refreshTransactions: () => Promise<void>;
  
  // Notes management
  addNote: (data: Omit<Note, 'id' | 'characterId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateNote: (noteId: string, data: Partial<Omit<Note, 'id' | 'characterId' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  refreshNotes: () => Promise<void>;
  
  // Attributes management
  updateAttributes: (attributes: Partial<Omit<CharacterAttributes, 'id' | 'characterId'>>) => Promise<void>;
  refreshAttributes: () => Promise<void>;
  
  // Skills management
  updateSkill: (skillId: string, updates: Partial<Omit<Skill, 'name' | 'attribute'>>) => Promise<void>;
  refreshSkills: () => Promise<void>;
  
  // Defense management
  updateDefenseBase: (value: number) => Promise<void>;
  updateDefenseArmorBonus: (value: number) => Promise<void>;
  updateDefenseAttributeBonus: (value: number) => Promise<void>;
  updateDefenseOther: (value: number) => Promise<void>;
  updateDefenseArmorPenalty: (value: number) => Promise<void>;
  
  // Attacks management
  addAttack: (attack: Omit<Attack, 'id'>) => Promise<void>;
  updateAttack: (attackId: string, updates: Partial<Omit<Attack, 'id'>>) => Promise<void>;
  deleteAttack: (attackId: string) => Promise<void>;
  refreshAttacks: () => Promise<void>;
  
  // Spells management
  addSpell: (spell: Omit<Spell, 'id' | 'aprimoramentos'>) => Promise<void>;
  updateSpell: (spellId: string, updates: Partial<Omit<Spell, 'id' | 'aprimoramentos'>>) => Promise<void>;
  deleteSpell: (spellId: string) => Promise<void>;
  refreshSpells: () => Promise<void>;
  addSpellEnhancement: (spellId: string, enhancement: Omit<Aprimoramento, 'id'>) => Promise<void>;
  updateSpellEnhancement: (spellId: string, enhancementId: string, updates: Partial<Omit<Aprimoramento, 'id'>>) => Promise<void>;
  deleteSpellEnhancement: (spellId: string, enhancementId: string) => Promise<void>;
  
  // Abilities and Powers management
  addAbility: (ability: Omit<Ability, 'id'>) => Promise<void>;
  updateAbility: (abilityId: string, updates: Partial<Omit<Ability, 'id'>>) => Promise<void>;
  deleteAbility: (abilityId: string) => Promise<void>;
  refreshAbilities: () => Promise<void>;
  addPower: (power: Omit<Power, 'id'>) => Promise<void>;
  updatePower: (powerId: string, updates: Partial<Omit<Power, 'id'>>) => Promise<void>;
  deletePower: (powerId: string) => Promise<void>;
  refreshPowers: () => Promise<void>;
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

  // Load transactions
  const loadTransactions = async (characterId: string): Promise<Transaction[]> => {
    try {
      const { data, error: transactionError } = await supabase
        .from('transactions')
        .select('*')
        .eq('character_id', characterId)
        .order('created_at', { ascending: false });

      if (transactionError) {
        console.error('❌ Erro ao carregar transações:', transactionError);
        return [];
      }

      console.log('✅ Transações carregadas:', data?.length || 0);
      return (data || []) as Transaction[];
    } catch (err) {
      console.error('❌ Exceção ao carregar transações:', err);
      return [];
    }
  };

  // Load notes
  const loadNotes = async (characterId: string): Promise<Note[]> => {
    try {
      const { data, error: notesError } = await supabase
        .from('notes')
        .select('*')
        .eq('character_id', characterId)
        .order('is_pinned', { ascending: false })
        .order('updated_at', { ascending: false });

      if (notesError) {
        console.error('❌ Erro ao carregar anotações:', notesError);
        return [];
      }

      console.log('✅ Anotações carregadas:', data?.length || 0);
      
      // Convert database fields to Note type
      const notes = (data || []).map((note: any) => ({
        id: note.id,
        characterId: note.character_id,
        title: note.title,
        content: note.content,
        category: note.category,
        tags: note.tags,
        createdAt: new Date(note.created_at),
        updatedAt: new Date(note.updated_at),
        isPinned: note.is_pinned,
      }));

      return notes as Note[];
    } catch (err) {
      console.error('❌ Exceção ao carregar anotações:', err);
      return [];
    }
  };

  // Load attributes
  const loadAttributes = async (characterId: string): Promise<CharacterAttributes | null> => {
    try {
      const { data, error: attributesError } = await supabase
        .from('character_attributes')
        .select('*')
        .eq('character_id', characterId)
        .single();

      if (attributesError) {
        console.error('❌ Erro ao carregar atributos:', attributesError);
        return null;
      }

      if (!data) {
        console.log('⚠️ Atributos não encontrados, criando valores padrão...');
        // Create default attributes if they don't exist
        const { data: newData, error: insertError } = await supabase
          .from('character_attributes')
          .insert({
            character_id: characterId,
            forca: 10,
            destreza: 10,
            constituicao: 10,
            inteligencia: 10,
            sabedoria: 10,
            carisma: 10,
          })
          .select()
          .single();

        if (insertError) {
          console.error('❌ Erro ao criar atributos padrão:', insertError);
          return null;
        }

        console.log('✅ Atributos padrão criados');
        return {
          id: newData.id,
          characterId: newData.character_id,
          forca: newData.forca,
          destreza: newData.destreza,
          constituicao: newData.constituicao,
          inteligencia: newData.inteligencia,
          sabedoria: newData.sabedoria,
          carisma: newData.carisma,
        };
      }

      console.log('✅ Atributos carregados');
      return {
        id: data.id,
        characterId: data.character_id,
        forca: data.forca,
        destreza: data.destreza,
        constituicao: data.constituicao,
        inteligencia: data.inteligencia,
        sabedoria: data.sabedoria,
        carisma: data.carisma,
        forcaTempMod: data.forca_temp_mod || 0,
        destrezaTempMod: data.destreza_temp_mod || 0,
        constituicaoTempMod: data.constituicao_temp_mod || 0,
        inteligenciaTempMod: data.inteligencia_temp_mod || 0,
        sabedoriaTempMod: data.sabedoria_temp_mod || 0,
        carismaTempMod: data.carisma_temp_mod || 0,
      };
    } catch (err) {
      console.error('❌ Exceção ao carregar atributos:', err);
      return null;
    }
  };

  // Load skills
  const loadSkills = async (characterId: string): Promise<CharacterSkill[]> => {
    try {
      const { data, error: skillsError } = await supabase
        .from('skills')
        .select('*')
        .eq('character_id', characterId)
        .order('name', { ascending: true });

      if (skillsError) {
        console.error('❌ Erro ao carregar perícias:', skillsError);
        return [];
      }

      console.log('✅ Perícias carregadas:', data?.length || 0);
      
      // Convert database fields to CharacterSkill type
      const skills = (data || []).map((skill: any) => ({
        id: skill.id,
        characterId: skill.character_id,
        name: skill.name,
        attribute: skill.attribute,
        isTrained: skill.is_trained,
        onlyTrained: skill.only_trained,
        armorPenalty: skill.armor_penalty,
        halfLevel: skill.half_level,
        trainedBonus: skill.trained_bonus,
        others: skill.others,
      }));

      return skills as CharacterSkill[];
    } catch (err) {
      console.error('❌ Exceção ao carregar perícias:', err);
      return [];
    }
  };

  // Load inventory items
  const loadInventory = async (characterId: string): Promise<InventoryItem[]> => {
    try {
      const { data, error: inventoryError } = await supabase
        .from('character_items')
        .select(`
          id,
          character_id,
          item_id,
          quantity,
          items!inner (
            name,
            description,
            price,
            category,
            slots_per_each,
            attack_roll,
            damage,
            crit,
            range,
            damage_type,
            armor_bonus,
            armor_penalty,
            effect
          )
        `)
        .eq('character_id', characterId);

      if (inventoryError) {
        console.error('❌ Erro ao carregar inventário:', inventoryError);
        console.error('Detalhes:', JSON.stringify(inventoryError, null, 2));
        return [];
      }

      if (!data || data.length === 0) {
        console.log('✅ Inventário vazio para o personagem:', characterId);
        return [];
      }

      // Transform the data to flatten the items object
      const inventory = (data || []).map((item: any) => {
        if (!item.items) {
          console.warn('⚠️ Item sem dados relacionados:', item);
          return null;
        }
        
        return {
          id: item.id,
          character_id: item.character_id,
          item_id: item.item_id,
          quantity: item.quantity,
          name: item.items.name,
          description: item.items.description,
          price: item.items.price,
          category: item.items.category,
          slots_per_each: item.items.slots_per_each,
          attack_roll: item.items.attack_roll,
          damage: item.items.damage,
          crit: item.items.crit,
          range: item.items.range,
          damage_type: item.items.damage_type,
          armor_bonus: item.items.armor_bonus,
          armor_penalty: item.items.armor_penalty,
          effect: item.items.effect,
        };
      }).filter(item => item !== null);

      console.log('✅ Inventário carregado:', inventory.length, 'itens');
      return inventory as InventoryItem[];
    } catch (err) {
      console.error('❌ Exceção ao carregar inventário:', err);
      return [];
    }
  };

  // Load character from database
  const loadCharacter = useCallback(async (characterId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Load character data
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
        // Load inventory items, transactions, notes, attributes, skills, attacks, spells, abilities, and powers
        const [inventory, transactions, notes, attributes, skills, attacks, spells, abilities, powers] = await Promise.all([
          loadInventory(characterId),
          loadTransactions(characterId),
          loadNotes(characterId),
          loadAttributes(characterId),
          loadSkills(characterId),
          loadAttacks(characterId),
          loadSpells(characterId),
          loadAbilities(characterId),
          loadPowers(characterId),
        ]);
        
        // Calculate current load from inventory
        const currentLoad = calculateCurrentLoad(inventory);
        
        setCharacter({
          ...(data as Character),
          inventory,
          transactions,
          notes,
          attributes: attributes || undefined,
          skills,
          attacks,
          spells,
          abilities,
          powers,
          current_load: currentLoad,
        });
        
        // Update current load in database if it has changed
        if ((data as Character).current_load !== currentLoad) {
          await supabase
            .from('characters')
            .update({ current_load: currentLoad })
            .eq('id', characterId);
        }
      }
    } catch (err) {
      console.error('Erro ao carregar personagem:', err);
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

  // Generic update function
  const updateCharacterField = async (field: string, value: any) => {
    if (!character?.id) {
      console.error('Nenhum personagem carregado');
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from('characters')
        .update({ [field]: value })
        .eq('id', character.id);

      if (updateError) throw updateError;

      // Update local state
      setCharacter(prev => prev ? { ...prev, [field]: value } : null);
    } catch (err) {
      console.error(`Erro ao atualizar ${field}:`, err);
      throw err;
    }
  };

  // Update multiple fields at once
  const updateCharacterFields = async (updates: Partial<Character>) => {
    if (!character?.id) {
      console.error('Nenhum personagem carregado');
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from('characters')
        .update(updates)
        .eq('id', character.id);

      if (updateError) throw updateError;

      // Update local state
      setCharacter(prev => prev ? { ...prev, ...updates } : null);
    } catch (err) {
      console.error('Erro ao atualizar personagem:', err);
      throw err;
    }
  };

  // Specific update functions
  const updateDescription = async (value: string) => {
    await updateCharacterField('description', value);
  };

  const updateBackstory = async (value: string) => {
    await updateCharacterField('backstory', value);
  };

  const updateBackstorySecret = async (isSecret: boolean) => {
    await updateCharacterField('is_backstory_secret', isSecret);
  };

  const updateProficienciesAndHabilities = async (value: string) => {
    await updateCharacterField('proficiencies_and_habilities', value);
  };

  const updateArrows = async (value: number) => {
    await updateCharacterField('arrows', value);
  };

  const updateBullets = async (value: number) => {
    await updateCharacterField('bullets', value);
  };

  const updateMaxInventorySlots = async (value: number) => {
    await updateCharacterField('max_inventory_slots', value);
  };

  const updateCurrentLoad = async (value: number) => {
    await updateCharacterField('current_load', value);
  };

  const updateMovement = async (value: string) => {
    await updateCharacterField('movement', value);
  };

  const updateHealth = async (current: number, max?: number, temporary?: number) => {
    const updates: any = { current_health: current };
    if (max !== undefined) updates.max_health = max;
    if (temporary !== undefined) updates.temporary_health = temporary;
    await updateCharacterFields(updates);
  };

  const updateMana = async (current: number, max?: number, temporary?: number) => {
    const updates: any = { current_mana: current };
    if (max !== undefined) updates.max_mana = max;
    if (temporary !== undefined) updates.temporary_mana = temporary;
    await updateCharacterFields(updates);
  };

  const updateProfileImage = async (url: string) => {
    await updateCharacterField('profile_img', url);
  };

  const updateBackgroundImage = async (url: string) => {
    await updateCharacterField('background_img', url);
  };

  const updateLevel = async (newLevel: number) => {
    if (!character?.id) {
      console.error('Nenhum personagem carregado');
      return;
    }

    try {
      // Update character level
      await updateCharacterField('level', newLevel);

      // Calculate new half level (rounded down)
      const newHalfLevel = Math.floor(newLevel / 2);

      // Update all skills with new half_level
      const { error: skillsError } = await supabase
        .from('skills')
        .update({ half_level: newHalfLevel })
        .eq('character_id', character.id);

      if (skillsError) {
        console.error('❌ Erro ao atualizar half_level das perícias:', skillsError);
        throw skillsError;
      }

      // Refresh skills to show updated values
      await refreshSkills();
      
      console.log('✅ Nível e perícias atualizados com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao atualizar nível:', err);
      throw err;
    }
  };

  // Calculate current load from inventory
  const calculateCurrentLoad = (inventory: InventoryItem[]): number => {
    return inventory.reduce((total, item) => {
      return total + (item.quantity * item.slots_per_each);
    }, 0);
  };

  // Update current load in database
  const updateCurrentLoadFromInventory = async (inventory: InventoryItem[]) => {
    if (!character?.id) return;

    const newLoad = calculateCurrentLoad(inventory);
    
    try {
      const { error: updateError } = await supabase
        .from('characters')
        .update({ current_load: newLoad })
        .eq('id', character.id);

      if (updateError) {
        console.error('❌ Erro ao atualizar carga atual:', updateError);
        throw updateError;
      }

      // Update local state
      setCharacter(prev => prev ? { ...prev, current_load: newLoad } : null);
      console.log('✅ Carga atualizada:', newLoad);
    } catch (err) {
      console.error('❌ Exceção ao atualizar carga:', err);
      throw err;
    }
  };

  // Inventory management functions
  const refreshInventory = async () => {
    if (!character?.id) return;
    
    const inventory = await loadInventory(character.id);
    setCharacter(prev => prev ? { ...prev, inventory } : null);
    
    // Update current load based on new inventory
    await updateCurrentLoadFromInventory(inventory);
  };

  const addItemToInventory = async (itemId: string, quantity: number = 1) => {
    if (!character?.id) {
      console.error('Nenhum personagem carregado');
      return;
    }

    try {
      // Check if item already exists in inventory
      const { data: existingItem } = await supabase
        .from('character_items')
        .select('id, quantity')
        .eq('character_id', character.id)
        .eq('item_id', itemId)
        .single();

      if (existingItem) {
        // Update quantity if item exists
        await updateItemQuantity(existingItem.id, existingItem.quantity + quantity);
      } else {
        // Insert new item
        const { error: insertError } = await supabase
          .from('character_items')
          .insert({
            character_id: character.id,
            item_id: itemId,
            quantity,
          });

        if (insertError) throw insertError;

        // Refresh inventory (this will automatically update the load)
        await refreshInventory();
      }
    } catch (err) {
      console.error('Erro ao adicionar item ao inventário:', err);
      throw err;
    }
  };

  const removeItemFromInventory = async (characterItemId: string) => {
    if (!character?.id) {
      console.error('Nenhum personagem carregado');
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from('character_items')
        .delete()
        .eq('id', characterItemId)
        .eq('character_id', character.id);

      if (deleteError) throw deleteError;

      // Update local state
      const updatedInventory = character.inventory?.filter(item => item.id !== characterItemId) || [];
      setCharacter(prev => {
        if (!prev) return null;
        return {
          ...prev,
          inventory: updatedInventory,
        };
      });

      // Update current load after removing item
      await updateCurrentLoadFromInventory(updatedInventory);
    } catch (err) {
      console.error('Erro ao remover item do inventário:', err);
      throw err;
    }
  };

  const updateItemQuantity = async (characterItemId: string, quantity: number) => {
    if (!character?.id) {
      console.error('Nenhum personagem carregado');
      return;
    }

    try {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        await removeItemFromInventory(characterItemId);
        return;
      }

      const { error: updateError } = await supabase
        .from('character_items')
        .update({ quantity })
        .eq('id', characterItemId)
        .eq('character_id', character.id);

      if (updateError) throw updateError;

      // Update local state
      const updatedInventory = character.inventory?.map(item => 
        item.id === characterItemId ? { ...item, quantity } : item
      ) || [];
      
      setCharacter(prev => {
        if (!prev) return null;
        return {
          ...prev,
          inventory: updatedInventory,
        };
      });

      // Update current load after quantity change
      await updateCurrentLoadFromInventory(updatedInventory);
    } catch (err) {
      console.error('Erro ao atualizar quantidade do item:', err);
      throw err;
    }
  };

  // Transaction management functions
  const refreshTransactions = async () => {
    if (!character?.id) return;
    
    const transactions = await loadTransactions(character.id);
    setCharacter(prev => prev ? { ...prev, transactions } : null);
  };

  const addTransaction = async (data: CreateTransactionData) => {
    if (!character?.id) {
      console.error('Nenhum personagem carregado');
      return;
    }

    try {
      // Adicionar transação
      const { error: insertError } = await supabase
        .from('transactions')
        .insert(data);

      if (insertError) throw insertError;

      // Apenas refresh transactions (a carteira é calculada automaticamente)
      await refreshTransactions();

      console.log('✅ Transação adicionada com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao adicionar transação:', err);
      throw err;
    }
  };

  const deleteTransaction = async (transactionId: string) => {
    if (!character?.id) {
      console.error('Nenhum personagem carregado');
      return;
    }

    try {
      // Deletar transação
      const { error: deleteError } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId)
        .eq('character_id', character.id);

      if (deleteError) throw deleteError;

      // Apenas refresh transactions (a carteira é recalculada automaticamente)
      await refreshTransactions();

      console.log('✅ Transação deletada com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao deletar transação:', err);
      throw err;
    }
  };

  // Notes management functions
  const refreshNotes = async () => {
    if (!character?.id) return;
    
    const notes = await loadNotes(character.id);
    setCharacter(prev => prev ? { ...prev, notes } : null);
  };

  const addNote = async (data: Omit<Note, 'id' | 'characterId' | 'createdAt' | 'updatedAt'>) => {
    if (!character?.id) {
      console.error('Nenhum personagem carregado');
      return;
    }

    try {
      // Convert Note type to database schema
      const noteData: any = {
        character_id: character.id,
        content: data.content,
      };

      if (data.title) noteData.title = data.title;
      if (data.category) noteData.category = data.category;
      if (data.tags) noteData.tags = data.tags;
      if (data.isPinned !== undefined) noteData.is_pinned = data.isPinned;

      const { error: insertError } = await supabase
        .from('notes')
        .insert(noteData);

      if (insertError) throw insertError;

      // Refresh notes
      await refreshNotes();

      console.log('✅ Anotação adicionada com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao adicionar anotação:', err);
      throw err;
    }
  };

  const updateNote = async (noteId: string, data: Partial<Omit<Note, 'id' | 'characterId' | 'createdAt' | 'updatedAt'>>) => {
    if (!character?.id) {
      console.error('Nenhum personagem carregado');
      return;
    }

    try {
      // Convert Note type to database schema
      const noteData: any = {};

      if (data.title !== undefined) noteData.title = data.title;
      if (data.content !== undefined) noteData.content = data.content;
      if (data.category !== undefined) noteData.category = data.category;
      if (data.tags !== undefined) noteData.tags = data.tags;
      if (data.isPinned !== undefined) noteData.is_pinned = data.isPinned;

      const { error: updateError } = await supabase
        .from('notes')
        .update(noteData)
        .eq('id', noteId)
        .eq('character_id', character.id);

      if (updateError) throw updateError;

      // Refresh notes
      await refreshNotes();

      console.log('✅ Anotação atualizada com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao atualizar anotação:', err);
      throw err;
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!character?.id) {
      console.error('Nenhum personagem carregado');
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId)
        .eq('character_id', character.id);

      if (deleteError) throw deleteError;

      // Update local state
      setCharacter(prev => {
        if (!prev) return null;
        return {
          ...prev,
          notes: prev.notes?.filter(note => note.id !== noteId) || [],
        };
      });

      console.log('✅ Anotação deletada com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao deletar anotação:', err);
      throw err;
    }
  };

  // Attributes management functions
  const refreshAttributes = async () => {
    if (!character?.id) return;
    
    const attributes = await loadAttributes(character.id);
    setCharacter(prev => prev ? { ...prev, attributes: attributes || undefined } : null);
  };

  const updateAttributes = async (updates: Partial<Omit<CharacterAttributes, 'id' | 'characterId'>>) => {
    if (!character?.id) {
      console.error('Nenhum personagem carregado');
      return;
    }

    try {
      // Convert camelCase to snake_case for database
      const dbUpdates: any = {};
      if (updates.forca !== undefined) dbUpdates.forca = updates.forca;
      if (updates.destreza !== undefined) dbUpdates.destreza = updates.destreza;
      if (updates.constituicao !== undefined) dbUpdates.constituicao = updates.constituicao;
      if (updates.inteligencia !== undefined) dbUpdates.inteligencia = updates.inteligencia;
      if (updates.sabedoria !== undefined) dbUpdates.sabedoria = updates.sabedoria;
      if (updates.carisma !== undefined) dbUpdates.carisma = updates.carisma;
      // Temporary modifiers
      if (updates.forcaTempMod !== undefined) dbUpdates.forca_temp_mod = updates.forcaTempMod;
      if (updates.destrezaTempMod !== undefined) dbUpdates.destreza_temp_mod = updates.destrezaTempMod;
      if (updates.constituicaoTempMod !== undefined) dbUpdates.constituicao_temp_mod = updates.constituicaoTempMod;
      if (updates.inteligenciaTempMod !== undefined) dbUpdates.inteligencia_temp_mod = updates.inteligenciaTempMod;
      if (updates.sabedoriaTempMod !== undefined) dbUpdates.sabedoria_temp_mod = updates.sabedoriaTempMod;
      if (updates.carismaTempMod !== undefined) dbUpdates.carisma_temp_mod = updates.carismaTempMod;

      const { error: updateError } = await supabase
        .from('character_attributes')
        .update(dbUpdates)
        .eq('character_id', character.id);

      if (updateError) throw updateError;

      // Update local state
      setCharacter(prev => {
        if (!prev || !prev.attributes) return prev;
        return {
          ...prev,
          attributes: {
            ...prev.attributes,
            ...updates,
          },
        };
      });

      console.log('✅ Atributos atualizados com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao atualizar atributos:', err);
      throw err;
    }
  };

  // Skills management functions
  const refreshSkills = async () => {
    if (!character?.id) return;
    
    const skills = await loadSkills(character.id);
    setCharacter(prev => prev ? { ...prev, skills } : null);
  };

  const updateSkill = async (skillId: string, updates: Partial<Omit<Skill, 'name' | 'attribute'>>) => {
    if (!character?.id) {
      console.error('Nenhum personagem carregado');
      return;
    }

    try {
      // Convert camelCase to snake_case for database
      const dbUpdates: any = {};
      if (updates.isTrained !== undefined) dbUpdates.is_trained = updates.isTrained;
      if (updates.onlyTrained !== undefined) dbUpdates.only_trained = updates.onlyTrained;
      if (updates.armorPenalty !== undefined) dbUpdates.armor_penalty = updates.armorPenalty;
      if (updates.halfLevel !== undefined) dbUpdates.half_level = updates.halfLevel;
      if (updates.trainedBonus !== undefined) dbUpdates.trained_bonus = updates.trainedBonus;
      if (updates.others !== undefined) dbUpdates.others = updates.others;

      const { error: updateError } = await supabase
        .from('skills')
        .update(dbUpdates)
        .eq('id', skillId)
        .eq('character_id', character.id);

      if (updateError) throw updateError;

      // Update local state
      setCharacter(prev => {
        if (!prev || !prev.skills) return prev;
        return {
          ...prev,
          skills: prev.skills.map(skill => 
            skill.id === skillId 
              ? { ...skill, ...updates } 
              : skill
          ),
        };
      });

      console.log('✅ Perícia atualizada com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao atualizar perícia:', err);
      throw err;
    }
  };

  // Defense management functions
  const updateDefenseBase = async (value: number) => {
    await updateCharacterField('defence_base', value);
  };

  const updateDefenseArmorBonus = async (value: number) => {
    await updateCharacterField('defence_armor_bonus', value);
  };

  const updateDefenseAttributeBonus = async (value: number) => {
    await updateCharacterField('defence_attribute_bonus', value);
  };

  const updateDefenseOther = async (value: number) => {
    await updateCharacterField('defence_other', value);
  };

  const updateDefenseArmorPenalty = async (value: number) => {
    await updateCharacterField('defence_armor_penalty', value);
  };

  // Load attacks
  const loadAttacks = async (characterId: string): Promise<Attack[]> => {
    try {
      const { data, error } = await supabase
        .from('attacks')
        .select('*')
        .eq('character_id', characterId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao carregar ataques:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('❌ Erro ao carregar ataques:', err);
      return [];
    }
  };

  // Attacks management functions
  const addAttack = async (attack: Omit<Attack, 'id'>) => {
    if (!character?.id) {
      console.error('Nenhum personagem carregado');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('attacks')
        .insert({
          character_id: character.id,
          name: attack.name,
          type: attack.type,
          teste_ataque: attack.testeAtaque,
          damage: attack.damage,
          critico: attack.critico,
          range: attack.range,
          description: attack.description
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setCharacter(prev => prev ? {
        ...prev,
        attacks: [data, ...(prev.attacks || [])]
      } : null);

      console.log('✅ Ataque adicionado com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao adicionar ataque:', err);
      throw err;
    }
  };

  const updateAttack = async (attackId: string, updates: Partial<Omit<Attack, 'id'>>) => {
    if (!character?.id) {
      console.error('Nenhum personagem carregado');
      return;
    }

    try {
      const { error } = await supabase
        .from('attacks')
        .update({
          name: updates.name,
          type: updates.type,
          teste_ataque: updates.testeAtaque,
          damage: updates.damage,
          critico: updates.critico,
          range: updates.range,
          description: updates.description
        })
        .eq('id', attackId)
        .eq('character_id', character.id);

      if (error) throw error;

      // Update local state
      setCharacter(prev => {
        if (!prev || !prev.attacks) return prev;
        return {
          ...prev,
          attacks: prev.attacks.map(attack => 
            attack.id === attackId 
              ? { ...attack, ...updates } 
              : attack
          )
        };
      });

      console.log('✅ Ataque atualizado com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao atualizar ataque:', err);
      throw err;
    }
  };

  const deleteAttack = async (attackId: string) => {
    if (!character?.id) {
      console.error('Nenhum personagem carregado');
      return;
    }

    try {
      const { error } = await supabase
        .from('attacks')
        .delete()
        .eq('id', attackId)
        .eq('character_id', character.id);

      if (error) throw error;

      // Update local state
      setCharacter(prev => prev ? {
        ...prev,
        attacks: (prev.attacks || []).filter(attack => attack.id !== attackId)
      } : null);

      console.log('✅ Ataque deletado com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao deletar ataque:', err);
      throw err;
    }
  };

  const refreshAttacks = async () => {
    if (!character?.id) return;
    
    const attacks = await loadAttacks(character.id);
    setCharacter(prev => prev ? { ...prev, attacks } : null);
  };

  // Load spells
  const loadSpells = async (characterId: string): Promise<Spell[]> => {
    try {
      // First get character_spells to get spell IDs
      const { data: characterSpells, error: characterSpellsError } = await supabase
        .from('character_spells')
        .select('spell_id')
        .eq('character_id', characterId);

      if (characterSpellsError) {
        console.error('❌ Erro ao carregar character_spells:', characterSpellsError);
        return [];
      }

      if (!characterSpells || characterSpells.length === 0) {
        return [];
      }

      // Get spell IDs
      const spellIds = characterSpells.map(cs => cs.spell_id);

      // Get spells data
      const { data: spellsData, error: spellsError } = await supabase
        .from('spells')
        .select('*')
        .in('id', spellIds);

      if (spellsError) {
        console.error('❌ Erro ao carregar magias:', spellsError);
        return [];
      }

      // Load enhancements for each spell
      const spells: Spell[] = [];
      for (const spell of spellsData || []) {
        const { data: enhancements, error: enhancementError } = await supabase
          .from('spell_enhancements')
          .select('*')
          .eq('spell_id', spell.id);

        if (enhancementError) {
          console.error('❌ Erro ao carregar aprimoramentos:', enhancementError);
          spells.push({ ...spell, aprimoramentos: [] });
        } else {
          spells.push({
            ...spell,
            aprimoramentos: (enhancements || []).map(enh => ({
              id: enh.id,
              custoAdicionalPM: enh.custo_adicional_pm,
              reaplicavel: enh.reaplicavel,
              descricao: enh.descricao,
              aplicacoes: 0 // Sempre 0, gerenciado localmente
            }))
          });
        }
      }

      return spells;
    } catch (err) {
      console.error('❌ Erro ao carregar magias:', err);
      return [];
    }
  };

  // Load abilities
  const loadAbilities = async (characterId: string): Promise<Ability[]> => {
    try {
      // First get character_abilities to get ability IDs
      const { data: characterAbilities, error: characterAbilitiesError } = await supabase
        .from('character_abilities')
        .select('ability_id')
        .eq('character_id', characterId);

      if (characterAbilitiesError) {
        console.error('❌ Erro ao carregar character_abilities:', characterAbilitiesError);
        return [];
      }

      if (!characterAbilities || characterAbilities.length === 0) {
        return [];
      }

      // Get ability IDs
      const abilityIds = characterAbilities.map(ca => ca.ability_id);

      // Get abilities data
      const { data: abilitiesData, error: abilitiesError } = await supabase
        .from('abilities')
        .select('*')
        .in('id', abilityIds)
        .eq('type', 'ability');

      if (abilitiesError) {
        console.error('❌ Erro ao carregar habilidades:', abilitiesError);
        return [];
      }

      return abilitiesData || [];
    } catch (err) {
      console.error('❌ Erro ao carregar habilidades:', err);
      return [];
    }
  };

  // Load powers
  const loadPowers = async (characterId: string): Promise<Power[]> => {
    try {
      // First get character_abilities to get ability IDs
      const { data: characterAbilities, error: characterAbilitiesError } = await supabase
        .from('character_abilities')
        .select('ability_id')
        .eq('character_id', characterId);

      if (characterAbilitiesError) {
        console.error('❌ Erro ao carregar character_abilities:', characterAbilitiesError);
        return [];
      }

      if (!characterAbilities || characterAbilities.length === 0) {
        return [];
      }

      // Get ability IDs
      const abilityIds = characterAbilities.map(ca => ca.ability_id);

      // Get powers data
      const { data: powersData, error: powersError } = await supabase
        .from('abilities')
        .select('*')
        .in('id', abilityIds)
        .eq('type', 'power');

      if (powersError) {
        console.error('❌ Erro ao carregar poderes:', powersError);
        return [];
      }

      return powersData || [];
    } catch (err) {
      console.error('❌ Erro ao carregar poderes:', err);
      return [];
    }
  };

  // Spells management functions
  const addSpell = async (spell: Omit<Spell, 'id' | 'aprimoramentos'>) => {
    if (!character?.id) {
      console.error('Nenhum personagem carregado');
      return;
    }

    try {
      // First create the spell
      const { data: spellData, error: spellError } = await supabase
        .from('spells')
        .insert({
          name: spell.name,
          escola: spell.escola,
          execucao: spell.execucao,
          alcance: spell.alcance,
          area: spell.area,
          alvo: spell.alvo,
          efeito: spell.efeito,
          duracao: spell.duracao,
          resistencia: spell.resistencia,
          fonte: spell.fonte
        })
        .select()
        .single();

      if (spellError) throw spellError;

      // Then link it to the character
      const { error: linkError } = await supabase
        .from('character_spells')
        .insert({
          character_id: character.id,
          spell_id: spellData.id
        });

      if (linkError) throw linkError;

      // Update local state
      setCharacter(prev => prev ? {
        ...prev,
        spells: [{ ...spellData, aprimoramentos: [] }, ...(prev.spells || [])]
      } : null);

      console.log('✅ Magia adicionada com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao adicionar magia:', err);
      throw err;
    }
  };

  const updateSpell = async (spellId: string, updates: Partial<Omit<Spell, 'id' | 'aprimoramentos'>>) => {
    if (!character?.id) {
      console.error('Nenhum personagem carregado');
      return;
    }

    try {
      const { error } = await supabase
        .from('spells')
        .update({
          name: updates.name,
          escola: updates.escola,
          execucao: updates.execucao,
          alcance: updates.alcance,
          area: updates.area,
          alvo: updates.alvo,
          efeito: updates.efeito,
          duracao: updates.duracao,
          resistencia: updates.resistencia,
          fonte: updates.fonte
        })
        .eq('id', spellId);

      if (error) throw error;

      // Update local state
      setCharacter(prev => {
        if (!prev || !prev.spells) return prev;
        return {
          ...prev,
          spells: prev.spells.map(spell => 
            spell.id === spellId 
              ? { ...spell, ...updates } 
              : spell
          )
        };
      });

      console.log('✅ Magia atualizada com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao atualizar magia:', err);
      throw err;
    }
  };

  const deleteSpell = async (spellId: string) => {
    if (!character?.id) {
      console.error('Nenhum personagem carregado');
      return;
    }

    try {
      // Remove from character_spells first
      const { error: unlinkError } = await supabase
        .from('character_spells')
        .delete()
        .eq('character_id', character.id)
        .eq('spell_id', spellId);

      if (unlinkError) throw unlinkError;

      // Delete the spell
      const { error: deleteError } = await supabase
        .from('spells')
        .delete()
        .eq('id', spellId);

      if (deleteError) throw deleteError;

      // Update local state
      setCharacter(prev => prev ? {
        ...prev,
        spells: (prev.spells || []).filter(spell => spell.id !== spellId)
      } : null);

      console.log('✅ Magia deletada com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao deletar magia:', err);
      throw err;
    }
  };

  const refreshSpells = async () => {
    if (!character?.id) return;
    
    const spells = await loadSpells(character.id);
    setCharacter(prev => prev ? { ...prev, spells } : null);
  };

  // Spell enhancements management
  const addSpellEnhancement = async (spellId: string, enhancement: Omit<Aprimoramento, 'id'>) => {
    if (!character?.id) {
      console.error('Nenhum personagem carregado');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('spell_enhancements')
        .insert({
          spell_id: spellId,
          custo_adicional_pm: enhancement.custoAdicionalPM,
          reaplicavel: enhancement.reaplicavel,
          descricao: enhancement.descricao
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setCharacter(prev => {
        if (!prev || !prev.spells) return prev;
        return {
          ...prev,
          spells: prev.spells.map(spell => 
            spell.id === spellId 
              ? { ...spell, aprimoramentos: [...spell.aprimoramentos, data] }
              : spell
          )
        };
      });

      console.log('✅ Aprimoramento adicionado com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao adicionar aprimoramento:', err);
      throw err;
    }
  };

  const updateSpellEnhancement = async (spellId: string, enhancementId: string, updates: Partial<Omit<Aprimoramento, 'id'>>) => {
    if (!character?.id) {
      console.error('Nenhum personagem carregado');
      return;
    }

    try {
      const { error } = await supabase
        .from('spell_enhancements')
        .update({
          custo_adicional_pm: updates.custoAdicionalPM,
          reaplicavel: updates.reaplicavel,
          descricao: updates.descricao
        })
        .eq('id', enhancementId);

      if (error) throw error;

      // Update local state
      setCharacter(prev => {
        if (!prev || !prev.spells) return prev;
        return {
          ...prev,
          spells: prev.spells.map(spell => 
            spell.id === spellId 
              ? {
                  ...spell,
                  aprimoramentos: spell.aprimoramentos.map(enh => 
                    enh.id === enhancementId ? { ...enh, ...updates } : enh
                  )
                }
              : spell
          )
        };
      });

      console.log('✅ Aprimoramento atualizado com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao atualizar aprimoramento:', err);
      throw err;
    }
  };

  const deleteSpellEnhancement = async (spellId: string, enhancementId: string) => {
    if (!character?.id) {
      console.error('Nenhum personagem carregado');
      return;
    }

    try {
      const { error } = await supabase
        .from('spell_enhancements')
        .delete()
        .eq('id', enhancementId);

      if (error) throw error;

      // Update local state
      setCharacter(prev => {
        if (!prev || !prev.spells) return prev;
        return {
          ...prev,
          spells: prev.spells.map(spell => 
            spell.id === spellId 
              ? {
                  ...spell,
                  aprimoramentos: spell.aprimoramentos.filter(enh => enh.id !== enhancementId)
                }
              : spell
          )
        };
      });

      console.log('✅ Aprimoramento deletado com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao deletar aprimoramento:', err);
      throw err;
    }
  };

  // Abilities management functions
  const addAbility = async (ability: Omit<Ability, 'id'>) => {
    if (!character?.id) {
      console.error('Nenhum personagem carregado');
      return;
    }

    try {
      // First create the ability
      const { data: abilityData, error: abilityError } = await supabase
        .from('abilities')
        .insert({
          name: ability.name,
          type: ability.type,
          description: ability.description,
          prerequisites: ability.prerequisites,
          cost: ability.cost
        })
        .select()
        .single();

      if (abilityError) throw abilityError;

      // Then link it to the character
      const { error: linkError } = await supabase
        .from('character_abilities')
        .insert({
          character_id: character.id,
          ability_id: abilityData.id
        });

      if (linkError) throw linkError;

      // Update local state
      setCharacter(prev => prev ? {
        ...prev,
        abilities: [abilityData, ...(prev.abilities || [])]
      } : null);

      console.log('✅ Habilidade adicionada com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao adicionar habilidade:', err);
      throw err;
    }
  };

  const updateAbility = async (abilityId: string, updates: Partial<Omit<Ability, 'id'>>) => {
    if (!character?.id) {
      console.error('Nenhum personagem carregado');
      return;
    }

    try {
      const { error } = await supabase
        .from('abilities')
        .update({
          name: updates.name,
          type: updates.type,
          description: updates.description,
          prerequisites: updates.prerequisites,
          cost: updates.cost
        })
        .eq('id', abilityId);

      if (error) throw error;

      // Update local state
      setCharacter(prev => {
        if (!prev || !prev.abilities) return prev;
        return {
          ...prev,
          abilities: prev.abilities.map(ability => 
            ability.id === abilityId 
              ? { ...ability, ...updates } 
              : ability
          )
        };
      });

      console.log('✅ Habilidade atualizada com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao atualizar habilidade:', err);
      throw err;
    }
  };

  const deleteAbility = async (abilityId: string) => {
    if (!character?.id) {
      console.error('Nenhum personagem carregado');
      return;
    }

    try {
      // Remove from character_abilities first
      const { error: unlinkError } = await supabase
        .from('character_abilities')
        .delete()
        .eq('character_id', character.id)
        .eq('ability_id', abilityId);

      if (unlinkError) throw unlinkError;

      // Delete the ability
      const { error: deleteError } = await supabase
        .from('abilities')
        .delete()
        .eq('id', abilityId);

      if (deleteError) throw deleteError;

      // Update local state
      setCharacter(prev => prev ? {
        ...prev,
        abilities: (prev.abilities || []).filter(ability => ability.id !== abilityId)
      } : null);

      console.log('✅ Habilidade deletada com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao deletar habilidade:', err);
      throw err;
    }
  };

  const refreshAbilities = async () => {
    if (!character?.id) return;
    
    const abilities = await loadAbilities(character.id);
    setCharacter(prev => prev ? { ...prev, abilities } : null);
  };

  // Powers management functions
  const addPower = async (power: Omit<Power, 'id'>) => {
    if (!character?.id) {
      console.error('Nenhum personagem carregado');
      return;
    }

    try {
      // First create the power
      const { data: powerData, error: powerError } = await supabase
        .from('abilities')
        .insert({
          name: power.name,
          type: 'power',
          category: power.category,
          description: power.description,
          prerequisites: power.prerequisites,
          cost: power.cost
        })
        .select()
        .single();

      if (powerError) throw powerError;

      // Then link it to the character
      const { error: linkError } = await supabase
        .from('character_abilities')
        .insert({
          character_id: character.id,
          ability_id: powerData.id
        });

      if (linkError) throw linkError;

      // Update local state
      setCharacter(prev => prev ? {
        ...prev,
        powers: [powerData, ...(prev.powers || [])]
      } : null);

      console.log('✅ Poder adicionado com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao adicionar poder:', err);
      throw err;
    }
  };

  const updatePower = async (powerId: string, updates: Partial<Omit<Power, 'id'>>) => {
    if (!character?.id) {
      console.error('Nenhum personagem carregado');
      return;
    }

    try {
      const { error } = await supabase
        .from('abilities')
        .update({
          name: updates.name,
          type: 'power',
          category: updates.category,
          description: updates.description,
          prerequisites: updates.prerequisites,
          cost: updates.cost
        })
        .eq('id', powerId);

      if (error) throw error;

      // Update local state
      setCharacter(prev => {
        if (!prev || !prev.powers) return prev;
        return {
          ...prev,
          powers: prev.powers.map(power => 
            power.id === powerId 
              ? { ...power, ...updates } 
              : power
          )
        };
      });

      console.log('✅ Poder atualizado com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao atualizar poder:', err);
      throw err;
    }
  };

  const deletePower = async (powerId: string) => {
    if (!character?.id) {
      console.error('Nenhum personagem carregado');
      return;
    }

    try {
      // Remove from character_abilities first
      const { error: unlinkError } = await supabase
        .from('character_abilities')
        .delete()
        .eq('character_id', character.id)
        .eq('ability_id', powerId);

      if (unlinkError) throw unlinkError;

      // Delete the power
      const { error: deleteError } = await supabase
        .from('abilities')
        .delete()
        .eq('id', powerId);

      if (deleteError) throw deleteError;

      // Update local state
      setCharacter(prev => prev ? {
        ...prev,
        powers: (prev.powers || []).filter(power => power.id !== powerId)
      } : null);

      console.log('✅ Poder deletado com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao deletar poder:', err);
      throw err;
    }
  };

  const refreshPowers = async () => {
    if (!character?.id) return;
    
    const powers = await loadPowers(character.id);
    setCharacter(prev => prev ? { ...prev, powers } : null);
  };

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
    addItemToInventory,
    removeItemFromInventory,
    updateItemQuantity,
    refreshInventory,
    addTransaction,
    deleteTransaction,
    refreshTransactions,
    addNote,
    updateNote,
    deleteNote,
    refreshNotes,
    updateAttributes,
    refreshAttributes,
    updateSkill,
    refreshSkills,
    updateDefenseBase,
    updateDefenseArmorBonus,
    updateDefenseAttributeBonus,
    updateDefenseOther,
    updateDefenseArmorPenalty,
    addAttack,
    updateAttack,
    deleteAttack,
    refreshAttacks,
    addSpell,
    updateSpell,
    deleteSpell,
    refreshSpells,
    addSpellEnhancement,
    updateSpellEnhancement,
    deleteSpellEnhancement,
    addAbility,
    updateAbility,
    deleteAbility,
    refreshAbilities,
    addPower,
    updatePower,
    deletePower,
    refreshPowers,
  };

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
};

