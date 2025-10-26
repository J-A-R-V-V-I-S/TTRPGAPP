/**
 * Inventory Item Types
 */

export interface InventoryItem {
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
