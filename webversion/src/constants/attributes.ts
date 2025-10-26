/**
 * Attributes Constants
 *
 * Centralizes all attribute-related constants and configurations.
 * Eliminates duplication of attribute arrays across the codebase.
 */

import type { CharacterAttributes } from '../types/character_attributes';

/**
 * Attribute definition type
 */
export interface AttributeDefinition {
  name: string;
  shortName: string;
  fullName: string;
  dbField: keyof Omit<CharacterAttributes, 'id' | 'characterId'>;
  tempModField: keyof CharacterAttributes;
  color: string;
}

/**
 * Centralized attributes configuration
 * Single source of truth for all attribute data
 */
export const ATTRIBUTES: readonly AttributeDefinition[] = [
  {
    name: 'Força',
    shortName: 'For',
    fullName: 'Força',
    dbField: 'forca',
    tempModField: 'forcaTempMod',
    color: '#e74c3c',
  },
  {
    name: 'Destreza',
    shortName: 'Des',
    fullName: 'Destreza',
    dbField: 'destreza',
    tempModField: 'destrezaTempMod',
    color: '#27ae60',
  },
  {
    name: 'Constituição',
    shortName: 'Con',
    fullName: 'Constituição',
    dbField: 'constituicao',
    tempModField: 'constituicaoTempMod',
    color: '#e67e22',
  },
  {
    name: 'Inteligência',
    shortName: 'Int',
    fullName: 'Inteligência',
    dbField: 'inteligencia',
    tempModField: 'inteligenciaTempMod',
    color: '#3498db',
  },
  {
    name: 'Sabedoria',
    shortName: 'Sab',
    fullName: 'Sabedoria',
    dbField: 'sabedoria',
    tempModField: 'sabedoriaTempMod',
    color: '#9b59b6',
  },
  {
    name: 'Carisma',
    shortName: 'Car',
    fullName: 'Carisma',
    dbField: 'carisma',
    tempModField: 'carismaTempMod',
    color: '#e91e63',
  },
] as const;

/**
 * Local attribute state type
 */
export interface AttributeState {
  name: string;
  dbField: keyof Omit<CharacterAttributes, 'id' | 'characterId'>;
  value: number;
  modifier: number;
}

/**
 * Factory function to create attribute state from character attributes
 * Eliminates code duplication when building/rebuilding attribute arrays
 *
 * @param characterAttributes - The character's attributes from the database
 * @returns Array of attribute states ready for local component state
 */
export const createAttributeState = (
  characterAttributes?: CharacterAttributes | null
): AttributeState[] => {
  return ATTRIBUTES.map(attr => ({
    name: attr.shortName,
    dbField: attr.dbField,
    value: (characterAttributes?.[attr.dbField] as number) ?? 10,
    modifier: (characterAttributes?.[attr.tempModField] as number) ?? 0,
  }));
};

/**
 * Get attribute definition by short name (For, Des, Con, etc.)
 */
export const getAttributeByShortName = (shortName: string): AttributeDefinition | undefined => {
  return ATTRIBUTES.find(attr => attr.shortName === shortName);
};

/**
 * Get attribute definition by full name (Força, Destreza, etc.)
 */
export const getAttributeByFullName = (fullName: string): AttributeDefinition | undefined => {
  return ATTRIBUTES.find(attr => attr.fullName === fullName);
};

/**
 * Get attribute color by short name
 */
export const getAttributeColor = (shortName: string): string => {
  const attr = getAttributeByShortName(shortName);
  return attr?.color ?? '#e94560';
};

/**
 * Convert full attribute name to short form
 */
export const getAttributeShortName = (attributeName: string): string => {
  const attr = getAttributeByFullName(attributeName);
  return attr?.shortName ?? attributeName;
};

/**
 * Get full attribute value (base + temp modifier) by full name
 */
export const getFullAttributeValue = (
  attributeName: string,
  characterAttributes?: CharacterAttributes | null
): number => {
  if (!characterAttributes) return 10;

  const attr = getAttributeByFullName(attributeName);
  if (!attr) return 10;

  const baseValue = (characterAttributes[attr.dbField] as number) ?? 10;
  const tempMod = (characterAttributes[attr.tempModField] as number) ?? 0;

  return baseValue + tempMod;
};
