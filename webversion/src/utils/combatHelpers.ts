/**
 * Combat Helper Functions
 *
 * Utility functions for combat calculations and spell management.
 * Extracted from combat.tsx to eliminate duplication and improve testability.
 */

import type { TabData } from '../components/tabbedItemList/tabbedItemList';

/**
 * Aprimoramento (Enhancement) interface
 */
export interface Aprimoramento {
  id: string;
  custoAdicionalPM: number;
  reaplicavel: boolean;
  descricao: string;
  aplicacoes: number;
}

/**
 * Ability/Power interface for skills tab
 */
export interface Skill {
  id: string;
  name: string;
  description: string;
  category?: string;
  type: string;
  cost?: string;
  prerequisites?: string;
  cooldown?: string;
  effect?: string;
}

/**
 * Tab type for abilities section
 */
export type AbilityTabType = 'abilities' | 'powers';

/**
 * Calculate total mana cost for a spell with enhancement applications
 * Extracted from combat.tsx line 244-248
 *
 * @param aprimoramento - The enhancement configuration
 * @param applications - Current number of applications
 * @returns Total mana cost including enhancement cost
 */
export const calculateSpellCost = (
  aprimoramento: Aprimoramento,
  applications: number
): number => {
  return aprimoramento.custoAdicionalPM * (aprimoramento.reaplicavel ? applications : 1);
};

/**
 * Generate tab data configuration for skills section (abilities and powers)
 * Extracted from combat.tsx lines 372-426
 *
 * @param abilities - List of character abilities
 * @param powers - List of character powers
 * @param handlers - Event handlers for edit, delete, add, and update actions
 * @returns TabData configuration object for TabbedItemList component
 */
export const generateSkillsTabData = (
  abilities: Skill[],
  powers: Skill[],
  handlers: {
    handleEditSkill: (skill: Skill, tabKey: AbilityTabType) => void;
    handleDeleteSkill: (skillId: string, tabKey: AbilityTabType) => void;
    handleAddSkill: (tabKey: AbilityTabType) => void;
    handleUpdateSkillDescription: (skillId: string, tabKey: AbilityTabType, newDescription: string) => void;
  }
): TabData<AbilityTabType, Skill> => ({
  tabs: [
    { key: 'abilities', label: 'Habilidades', icon: '⚡' },
    { key: 'powers', label: 'Poderes', icon: '✨' },
  ],
  items: {
    abilities,
    powers,
  },
  getItemFields: (skill) => {
    const fields = [];

    if (skill.category || skill.type) {
      fields.push({ label: 'Categoria', value: skill.category || skill.type });
    }

    if (skill.cost) {
      fields.push({ label: 'Custo/Uso', value: skill.cost });
    }

    if (skill.prerequisites) {
      fields.push({ label: 'Pré-requisitos', value: skill.prerequisites });
    }

    if (skill.cooldown) {
      fields.push({ label: 'Recarga', value: skill.cooldown });
    }

    if (skill.effect) {
      fields.push({ label: 'Efeito', value: skill.effect });
    }

    return fields;
  },
  getActionButtons: (skill, tabKey) => [
    {
      label: '✏️ Editar',
      onClick: () => handlers.handleEditSkill(skill, tabKey),
      show: true,
    },
    {
      label: '🗑️ Deletar',
      onClick: () => handlers.handleDeleteSkill(skill.id, tabKey),
      className: 'delete',
      show: true,
    },
  ],
  getNoSelectionMessage: (tabKey) =>
    tabKey === 'abilities'
      ? 'Selecione uma habilidade para ver os detalhes'
      : 'Selecione um poder para ver os detalhes',
  onAddItem: handlers.handleAddSkill,
  onUpdateDescription: (skillId: string, tabKey: AbilityTabType, newDescription: string) =>
    handlers.handleUpdateSkillDescription(skillId, tabKey, newDescription),
  showMenu: false, // Remove the "..." menu for abilities and powers
});

/**
 * Calculate spell preparation slots used
 * Helper for spell preparation tracking
 */
export const calculatePreparedSlotsUsed = (spells: any[], circleLevel: number): number => {
  return spells.filter((spell) => spell.circle === circleLevel && spell.prepared).length;
};

/**
 * Get maximum spell preparation slots by circle level
 * Based on standard RPG rules (can be customized)
 */
export const getMaxPreparedSlots = (circleLevel: number, characterLevel: number): number => {
  // This is a placeholder - adjust based on your game's rules
  // Example: Level 1 char = 2 slots, Level 5 = 3 slots, etc.
  const baseSlots = Math.floor(characterLevel / 2) + 1;
  return Math.max(1, baseSlots - (circleLevel - 1));
};
