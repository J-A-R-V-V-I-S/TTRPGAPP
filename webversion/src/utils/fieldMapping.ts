/**
 * Field Mapping Utilities
 *
 * Centralizes all snake_case (database) ↔ camelCase (TypeScript) conversions.
 * This eliminates duplication across contexts and ensures consistency.
 */

import type { CharacterAttributes } from '../types/character_attributes';
import type { Skill } from '../types/skill';
import type { Note } from '../types/note';

/**
 * Map CharacterAttributes from database format to TypeScript format
 */
export const mapAttributesFromDb = (data: any): CharacterAttributes => ({
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
});

/**
 * Map CharacterAttributes updates from TypeScript format to database format
 */
export const mapAttributesToDb = (updates: Partial<Omit<CharacterAttributes, 'id' | 'characterId'>>): any => {
  const dbUpdates: any = {};

  // Base attributes
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

  return dbUpdates;
};

/**
 * Map Skill from database format to TypeScript format
 */
export const mapSkillFromDb = (data: any): Skill => ({
  id: data.id,
  characterId: data.character_id,
  name: data.name,
  attribute: data.attribute,
  isTrained: data.is_trained,
  onlyTrained: data.only_trained,
  armorPenalty: data.armor_penalty,
  halfLevel: data.half_level,
  trainedBonus: data.trained_bonus,
  others: data.others,
});

/**
 * Map Skill updates from TypeScript format to database format
 */
export const mapSkillToDb = (updates: Partial<Omit<Skill, 'name' | 'attribute'>>): any => {
  const dbUpdates: any = {};

  if (updates.isTrained !== undefined) dbUpdates.is_trained = updates.isTrained;
  if (updates.onlyTrained !== undefined) dbUpdates.only_trained = updates.onlyTrained;
  if (updates.armorPenalty !== undefined) dbUpdates.armor_penalty = updates.armorPenalty;
  if (updates.halfLevel !== undefined) dbUpdates.half_level = updates.halfLevel;
  if (updates.trainedBonus !== undefined) dbUpdates.trained_bonus = updates.trainedBonus;
  if (updates.others !== undefined) dbUpdates.others = updates.others;

  return dbUpdates;
};

/**
 * Map Note from database format to TypeScript format
 */
export const mapNoteFromDb = (data: any): Note => ({
  id: data.id,
  characterId: data.character_id,
  title: data.title,
  content: data.content,
  category: data.category,
  tags: data.tags,
  createdAt: new Date(data.created_at),
  updatedAt: new Date(data.updated_at),
  isPinned: data.is_pinned,
});

/**
 * Map Note data from TypeScript format to database format (for insert)
 */
export const mapNoteToDbInsert = (
  characterId: string,
  data: Omit<Note, 'id' | 'characterId' | 'createdAt' | 'updatedAt'>
): any => {
  const noteData: any = {
    character_id: characterId,
    content: data.content,
  };

  if (data.title) noteData.title = data.title;
  if (data.category) noteData.category = data.category;
  if (data.tags) noteData.tags = data.tags;
  if (data.isPinned !== undefined) noteData.is_pinned = data.isPinned;

  return noteData;
};

/**
 * Map Note updates from TypeScript format to database format
 */
export const mapNoteToDbUpdate = (
  data: Partial<Omit<Note, 'id' | 'characterId' | 'createdAt' | 'updatedAt'>>
): any => {
  const noteData: any = {};

  if (data.title !== undefined) noteData.title = data.title;
  if (data.content !== undefined) noteData.content = data.content;
  if (data.category !== undefined) noteData.category = data.category;
  if (data.tags !== undefined) noteData.tags = data.tags;
  if (data.isPinned !== undefined) noteData.is_pinned = data.isPinned;

  return noteData;
};

/**
 * Generic field name converter: camelCase to snake_case
 * Useful for dynamic field mapping
 */
export const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

/**
 * Generic field name converter: snake_case to camelCase
 * Useful for dynamic field mapping
 */
export const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};
