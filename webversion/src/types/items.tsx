interface Item {
    id: string;
    name: string;
    description: string;
    quantity: number;
    price: number;
    category: string;
    slotsPerEach: number;
}

interface Weapon extends Item {
    category: 'weapon';
    attackRoll: string;
    damage: string;
    crit: string;
    range: string;
    damageType: string;
}

interface Equipment extends Item {
    category: 'armor';
    armorBonus: number;
    armorPenalty: number;
}

interface Ammo extends Item {
    category: 'ammo';
}

interface Consumable extends Item {
    category: 'consumable';
    effect: string;
}

export type { Item, Weapon, Equipment, Ammo, Consumable };