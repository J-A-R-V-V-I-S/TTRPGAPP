/**
 * Group Service Layer
 *
 * Centralizes group-related business logic and database operations.
 * Extracted from group.tsx to improve separation of concerns and testability.
 */

import { supabase } from '../config/supabase';
import { GROUP_WITH_MEMBERS_QUERY, GROUP_CONFIG } from '../utils/groupHelpers';

interface CreateGroupParams {
  name: string;
  description?: string;
  characterId: string;
  isPrivate?: boolean;
}

interface JoinGroupParams {
  groupId: string;
  characterId: string;
}

interface ServiceResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Create a new group with the character as the first member
 */
export const createGroupService = async ({
  name,
  description,
  characterId,
  isPrivate = false,
}: CreateGroupParams): Promise<ServiceResponse<{ groupId: string }>> => {
  try {
    // Create the group
    const { data: groupData, error: groupError } = await supabase
      .from('groups')
      .insert({
        name,
        description: description || null,
        gold: 0,
        silver: 0,
        bronze: 0,
        is_private: isPrivate,
      })
      .select()
      .single();

    if (groupError) {
      return {
        success: false,
        error: `Erro ao criar grupo: ${groupError.message}`,
      };
    }

    if (!groupData) {
      return {
        success: false,
        error: 'Erro ao criar grupo: dados não retornados',
      };
    }

    // Add the character as the first member (role: 'leader')
    const { error: memberError } = await supabase.from('group_members').insert({
      group_id: groupData.id,
      character_id: characterId,
      role: 'leader',
    });

    if (memberError) {
      // Rollback: delete the group if we can't add the member
      await supabase.from('groups').delete().eq('id', groupData.id);

      return {
        success: false,
        error: `Erro ao adicionar membro ao grupo: ${memberError.message}`,
      };
    }

    // Create group storage
    const { error: storageError } = await supabase.from('group_storage').insert({
      group_id: groupData.id,
    });

    if (storageError) {
      console.error('Erro ao criar armazenamento do grupo:', storageError);
      // Don't fail the group creation if storage creation fails
    }

    return {
      success: true,
      data: { groupId: groupData.id },
    };
  } catch (err) {
    console.error('Erro inesperado ao criar grupo:', err);
    return {
      success: false,
      error: 'Erro inesperado ao criar grupo',
    };
  }
};

/**
 * Join an existing group
 * Validates that the group has available slots before joining
 */
export const joinGroupService = async ({
  groupId,
  characterId,
}: JoinGroupParams): Promise<ServiceResponse> => {
  try {
    // Check if the group still has available slots
    const { data: groupData, error: groupError } = await supabase
      .from('groups')
      .select(GROUP_WITH_MEMBERS_QUERY)
      .eq('id', groupId)
      .single();

    if (groupError) {
      return {
        success: false,
        error: `Erro ao verificar grupo: ${groupError.message}`,
      };
    }

    if (!groupData) {
      return {
        success: false,
        error: 'Grupo não encontrado',
      };
    }

    const currentMembers = groupData.group_members?.length || 0;

    if (currentMembers >= GROUP_CONFIG.MAX_MEMBERS) {
      return {
        success: false,
        error: 'Este grupo está cheio',
      };
    }

    // Check if character is already a member
    const { data: existingMember } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', groupId)
      .eq('character_id', characterId)
      .single();

    if (existingMember) {
      return {
        success: false,
        error: 'Você já é membro deste grupo',
      };
    }

    // Add character to group
    const { error: joinError } = await supabase.from('group_members').insert({
      group_id: groupId,
      character_id: characterId,
      role: 'member',
    });

    if (joinError) {
      return {
        success: false,
        error: `Erro ao entrar no grupo: ${joinError.message}`,
      };
    }

    return {
      success: true,
    };
  } catch (err) {
    console.error('Erro inesperado ao entrar no grupo:', err);
    return {
      success: false,
      error: 'Erro inesperado ao entrar no grupo',
    };
  }
};

/**
 * Leave a group
 */
export const leaveGroupService = async ({
  groupId,
  characterId,
}: JoinGroupParams): Promise<ServiceResponse> => {
  try {
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('character_id', characterId);

    if (error) {
      return {
        success: false,
        error: `Erro ao sair do grupo: ${error.message}`,
      };
    }

    return {
      success: true,
    };
  } catch (err) {
    console.error('Erro inesperado ao sair do grupo:', err);
    return {
      success: false,
      error: 'Erro inesperado ao sair do grupo',
    };
  }
};

/**
 * Load group storage items
 */
export const loadGroupStorageItems = async (storageId: string) => {
  const { data, error } = await supabase
    .from('group_storage_items')
    .select(
      `
      id,
      quantity,
      items:item_id (
        id,
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
    `
    )
    .eq('storage_id', storageId);

  if (error) throw error;

  return data || [];
};
