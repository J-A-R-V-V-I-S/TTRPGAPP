/**
 * Supabase Operations Utilities
 *
 * Generic CRUD operations to eliminate duplication across contexts.
 * Provides type-safe database operations with consistent error handling.
 */

import { supabase } from '../config/supabase';
import { logError, logSuccess } from './errorHandler';

/**
 * Generic function to load items from a table
 */
export const loadItems = async <T>(
  table: string,
  characterId: string,
  mapper?: (data: any) => T,
  orderBy?: { column: string; ascending: boolean }[]
): Promise<T[]> => {
  try {
    let query = supabase
      .from(table)
      .select('*')
      .eq('character_id', characterId);

    // Apply ordering if provided
    if (orderBy) {
      orderBy.forEach(order => {
        query = query.order(order.column, { ascending: order.ascending });
      });
    }

    const { data, error } = await query;

    if (error) {
      logError(`carregar ${table}`, error);
      return [];
    }

    logSuccess(`${table} carregados: ${data?.length || 0}`);

    // Apply mapper if provided, otherwise return raw data
    if (mapper && data) {
      return data.map(mapper);
    }

    return (data || []) as T[];
  } catch (err) {
    logError(`carregar ${table}`, err);
    return [];
  }
};

/**
 * Generic function to load a single item from a table
 */
export const loadSingleItem = async <T>(
  table: string,
  characterId: string,
  mapper?: (data: any) => T
): Promise<T | null> => {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('character_id', characterId)
      .single();

    if (error) {
      logError(`carregar ${table}`, error);
      return null;
    }

    logSuccess(`${table} carregado`);

    // Apply mapper if provided, otherwise return raw data
    if (mapper && data) {
      return mapper(data);
    }

    return data as T;
  } catch (err) {
    logError(`carregar ${table}`, err);
    return null;
  }
};

/**
 * Generic function to insert an item into a table
 */
export const insertItem = async <T>(
  table: string,
  data: any,
  successMessage?: string
): Promise<T | null> => {
  try {
    const { data: inserted, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single();

    if (error) throw error;

    if (successMessage) {
      logSuccess(successMessage);
    }

    return inserted as T;
  } catch (err) {
    logError(`adicionar em ${table}`, err);
    throw err;
  }
};

/**
 * Generic function to update an item in a table
 */
export const updateItem = async (
  table: string,
  id: string,
  updates: any,
  characterId?: string,
  successMessage?: string
): Promise<void> => {
  try {
    let query = supabase.from(table).update(updates).eq('id', id);

    // Add character_id check if provided (for security)
    if (characterId) {
      query = query.eq('character_id', characterId);
    }

    const { error } = await query;

    if (error) throw error;

    if (successMessage) {
      logSuccess(successMessage);
    }
  } catch (err) {
    logError(`atualizar ${table}`, err);
    throw err;
  }
};

/**
 * Generic function to delete an item from a table
 */
export const deleteItem = async (
  table: string,
  id: string,
  characterId?: string,
  successMessage?: string
): Promise<void> => {
  try {
    let query = supabase.from(table).delete().eq('id', id);

    // Add character_id check if provided (for security)
    if (characterId) {
      query = query.eq('character_id', characterId);
    }

    const { error } = await query;

    if (error) throw error;

    if (successMessage) {
      logSuccess(successMessage);
    }
  } catch (err) {
    logError(`deletar de ${table}`, err);
    throw err;
  }
};

/**
 * Generic function to update a character field
 */
export const updateCharacterField = async (
  characterId: string,
  field: string,
  value: any
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('characters')
      .update({ [field]: value })
      .eq('id', characterId);

    if (error) throw error;
  } catch (err) {
    logError(`atualizar ${field}`, err);
    throw err;
  }
};

/**
 * Generic function to update multiple character fields
 */
export const updateCharacterFields = async (
  characterId: string,
  updates: Record<string, any>
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('characters')
      .update(updates)
      .eq('id', characterId);

    if (error) throw error;
  } catch (err) {
    logError('atualizar personagem', err);
    throw err;
  }
};
