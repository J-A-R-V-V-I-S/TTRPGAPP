/**
 * Generic Table Loader Factories
 *
 * Eliminates repetitive CRUD patterns in contexts.
 * Factory functions to create type-safe table loaders with consistent error handling.
 */

import { supabase } from '../config/supabase';
import { logError } from './errorHandler';

/**
 * Creates a simple table loader for direct table queries
 *
 * @param tableName - The Supabase table name
 * @param errorContext - Error message context (e.g., 'carregar ataques')
 * @returns Async function that loads data for a character
 *
 * @example
 * const loadAttacks = createSimpleTableLoader<Attack>('attacks', 'carregar ataques');
 */
export function createSimpleTableLoader<T>(
  tableName: string,
  errorContext: string
): (characterId: string) => Promise<T[]> {
  return async (characterId: string): Promise<T[]> => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('character_id', characterId)
        .order('created_at', { ascending: false });

      if (error) {
        logError(errorContext, error);
        return [];
      }

      return data || [];
    } catch (err) {
      logError(errorContext, err);
      return [];
    }
  };
}

/**
 * Creates a table loader for items accessed via a junction table (many-to-many)
 *
 * @param junctionTable - Junction table name (e.g., 'character_abilities')
 * @param junctionIdField - ID field in junction table (e.g., 'ability_id')
 * @param targetTable - Target table name (e.g., 'abilities')
 * @param typeFilter - Optional filter for type field (e.g., { field: 'type', value: 'ability' })
 * @param errorContext - Error message context
 * @returns Async function that loads data for a character
 *
 * @example
 * const loadAbilities = createJunctionTableLoader<Ability>(
 *   'character_abilities',
 *   'ability_id',
 *   'abilities',
 *   { field: 'type', value: 'ability' },
 *   'carregar habilidades'
 * );
 */
export function createJunctionTableLoader<T>(
  junctionTable: string,
  junctionIdField: string,
  targetTable: string,
  typeFilter: { field: string; value: string } | null,
  errorContext: string
): (characterId: string) => Promise<T[]> {
  return async (characterId: string): Promise<T[]> => {
    try {
      // Get junction table IDs
      const { data: junctionData, error: junctionError } = await supabase
        .from(junctionTable)
        .select(junctionIdField)
        .eq('character_id', characterId);

      if (junctionError) {
        logError(`${errorContext} (junction)`, junctionError);
        return [];
      }

      if (!junctionData || junctionData.length === 0) {
        return [];
      }

      const ids = junctionData.map((item: any) => item[junctionIdField]);

      // Build query for target table
      let query = supabase
        .from(targetTable)
        .select('*')
        .in('id', ids);

      // Apply type filter if provided
      if (typeFilter) {
        query = query.eq(typeFilter.field, typeFilter.value);
      }

      const { data: targetData, error: targetError } = await query;

      if (targetError) {
        logError(errorContext, targetError);
        return [];
      }

      return targetData || [];
    } catch (err) {
      logError(errorContext, err);
      return [];
    }
  };
}
