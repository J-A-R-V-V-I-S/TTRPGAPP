/**
 * Central Type Export File
 * 
 * This file re-exports all types from their respective modules.
 * Import from this file to access any type in the application.
 * 
 * Example:
 *   import type { Character, User, Spell } from '@/types';
 */

// ============================================================================
// Base Types
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
} from './types';

// ============================================================================
// Character & Stats
// ============================================================================
export type { 
  Character, 
  Health, 
  Mana, 
  Inventory 
} from './character';

export type { CharacterAttributes } from './character_attributes';
export type { Defence } from './defence';
export type { Skill } from './skill';

// ============================================================================
// Combat & Actions
// ============================================================================
export type { Attack } from './attack';
export type { Spell, Aprimoramento } from './spell';

// ============================================================================
// Abilities & Powers
// ============================================================================
export type {
  Ability,
  Power,
  PowerCategory,
  AbilityFormData,
} from './ability';

// ============================================================================
// Items & Equipment
// ============================================================================
export type {
  Item,
  Weapon,
  Equipment,
  Ammo,
  Consumable
} from './items';

export type { InventoryItem } from './inventory';

export type { Currency } from './currency';

// ============================================================================
// Proficiencies
// ============================================================================
export type {
  Proficiency,
} from './proficiency';

// ============================================================================
// Social & Group
// ============================================================================
export type { 
  Group, 
  GroupMember, 
  GroupStorage 
} from './group';

// ============================================================================
// Game Sessions
// ============================================================================
export type {
  Game,
  GamePlayer,
  GameSession,
} from './game';

// ============================================================================
// User & Authentication
// ============================================================================
export type {
  User,
  UserPreferences,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  AuthState,
} from './user';

// ============================================================================
// Notes & Documentation
// ============================================================================
export type {
  Note,
  NoteCategory,
  NoteFilter,
} from './note';

// ============================================================================
// Context Types (App State)
// ============================================================================
export type {
  AppContextType,
  CharacterContextType,
  GroupContextType,
  GameContextType,
} from './context';

// ============================================================================
// UI State Types
// ============================================================================
export type {
  ModalState,
  ModalType,
  ConfirmModalData,
  DropdownState,
  TooltipState,
  TooltipPosition,
  FormState,
  FormErrors,
  PaginationState,
  TabState,
  Tab,
  LoadingState,
  NotificationState,
  Notification,
  NotificationType,
} from './ui';
