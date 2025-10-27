/**
 * Group Helper Functions
 *
 * Centralized utility functions for group-related operations.
 * Eliminates duplication across group management code.
 */

/**
 * Transform raw group storage item data from database to application format
 * Eliminates duplication of this transformation logic (previously in lines 242-258 and 375-391)
 */
export const transformGroupItem = (storageItem: any) => ({
  id: storageItem.id,
  name: storageItem.items.name,
  description: storageItem.items.description || '',
  quantity: storageItem.quantity,
  slots: storageItem.items.slots_per_each,
  price: storageItem.items.price,
  category: storageItem.items.category,
  attack_roll: storageItem.items.attack_roll,
  damage: storageItem.items.damage,
  crit: storageItem.items.crit,
  range: storageItem.items.range,
  damage_type: storageItem.items.damage_type,
  armor_bonus: storageItem.items.armor_bonus,
  armor_penalty: storageItem.items.armor_penalty,
  effect: storageItem.items.effect,
});

/**
 * Calculate member health status based on HP percentage
 * Returns one of: 'healthy', 'injured', 'critical', 'unconscious'
 */
export const getGroupMemberStatus = (currentHealth: number, maxHealth: number): string => {
  if (maxHealth === 0) return 'unconscious';

  const hpPercentage = (currentHealth / maxHealth) * 100;

  if (hpPercentage > 75) return 'healthy';
  if (hpPercentage > 50) return 'injured';
  if (hpPercentage > 25) return 'critical';
  return 'unconscious';
};

/**
 * Get color hex code for health status
 * Centralized status color definitions
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'healthy':
      return '#4ecca3';
    case 'injured':
      return '#f4a261';
    case 'critical':
      return '#e94560';
    case 'unconscious':
      return '#6c757d';
    default:
      return '#fff';
  }
};

/**
 * Get localized label for health status
 * Centralized status label translations
 */
export const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'healthy':
      return 'Saudável';
    case 'injured':
      return 'Ferido';
    case 'critical':
      return 'Crítico';
    case 'unconscious':
      return 'Inconsciente';
    default:
      return status;
  }
};

/**
 * Calculate HP percentage for progress bars
 */
export const calculateHpPercentage = (currentHealth: number, maxHealth: number): number => {
  return maxHealth > 0 ? (currentHealth / maxHealth) * 100 : 0;
};

/**
 * Group query for fetching group data with members
 * Standardized query string to eliminate duplication (lines 131-139 and 603-612)
 */
export const GROUP_WITH_MEMBERS_QUERY = `
  *,
  group_members (
    id,
    character_id
  )
`;

/**
 * Constants for group configuration
 */
export const GROUP_CONFIG = {
  MAX_MEMBERS: 6,
  DEFAULT_MEMBER_COUNT: 0,
} as const;
