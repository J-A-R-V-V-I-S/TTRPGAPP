/**
 * Base Types and Enums for TTRPG Application
 * 
 * This file contains fundamental type definitions used across the application.
 * These types represent core game mechanics and character attributes.
 */

// ============================================================================
// Character Attributes
// ============================================================================

/**
 * Character attribute names (in Portuguese)
 * Maps to the six primary character attributes
 */
type AttributeName = 
  | 'força'          // Strength
  | 'destreza'       // Dexterity
  | 'constituição'   // Constitution
  | 'inteligência'   // Intelligence
  | 'sabedoria'      // Wisdom
  | 'carisma';       // Charisma

// ============================================================================
// Combat & Damage Types
// ============================================================================

/**
 * Types of damage that can be dealt
 * Includes physical and elemental damage types
 */
type DamageType =
  // Physical Damage
  | 'Slashing'
  | 'Piercing'
  | 'Bludgeoning'
  // Elemental Damage
  | 'Fire'
  | 'Cold'
  | 'Electricity'
  | 'Acid'
  | 'Sonic'
  // Magical Damage
  | 'Light'
  | 'Darkness'
  | 'Mental';

// ============================================================================
// Magic System Types
// ============================================================================

/**
 * Components required to cast a spell
 */
type SpellComponent = 
  | 'Verbal'    // V - Spoken words/incantations
  | 'Somatic'   // S - Hand gestures
  | 'Material'; // M - Physical components

/**
 * Schools of magic
 * Based on traditional D&D/Pathfinder magic schools
 */
type MagicSchool =
  | 'Abjuration'     // Protection and wards
  | 'Conjuration'    // Summoning and creation
  | 'Divination'     // Information gathering
  | 'Enchantment'    // Mind-affecting magic
  | 'Evocation'      // Energy and elemental magic
  | 'Illusion'       // Deception and illusions
  | 'Necromancy'     // Death and undead magic
  | 'Transmutation'; // Transformation magic

// ============================================================================
// Abilities & Powers
// ============================================================================

/**
 * Sources/types of character abilities
 */
type AbilityType =
  | 'Race'      // Racial abilities
  | 'Class'     // Class features
  | 'Origin'    // Background abilities
  | 'Deity'     // Divine powers
  | 'General'   // General feats/abilities
  | 'Magic'     // Magical abilities
  | 'Combat'    // Combat feats
  | 'Torment';  // Tormenta-specific abilities

// ============================================================================
// Equipment Types
// ============================================================================

/**
 * Weapon categories
 * Determines proficiency requirements and usage
 */
type WeaponType =
  // Melee Weapons
  | 'Simple Melee'
  | 'Martial Melee'
  | 'Exotic Melee'
  // Ranged Weapons
  | 'Simple Ranged'
  | 'Martial Ranged'
  | 'Exotic Ranged';

/**
 * Armor categories
 * Affects AC bonus and movement penalties
 */
type ArmorType = 
  | 'Light'   // Light armor
  | 'Medium'  // Medium armor
  | 'Heavy'   // Heavy armor
  | 'Shield'; // Shields

// ============================================================================
// Creature Size
// ============================================================================

/**
 * Creature size categories
 * Affects space, reach, and various modifiers
 */
type Size = 
  | 'Tiny'      // 2.5 ft
  | 'Small'     // 5 ft
  | 'Medium'    // 5 ft
  | 'Large'     // 10 ft
  | 'Huge'      // 15 ft
  | 'Colossal'; // 20+ ft

// ============================================================================
// Exports
// ============================================================================

export type {
  AttributeName,
  DamageType,
  SpellComponent,
  MagicSchool,
  AbilityType,
  WeaponType,
  ArmorType,
  Size,
};