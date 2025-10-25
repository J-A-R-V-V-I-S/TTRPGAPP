import type { Attack } from "./attack";
import type { CharacterAttributes } from "./character_attributes";
import type { Equipment, Item } from "./items";
import type { Spell } from "./spell";
import type { Currency } from "./currency";
import type { Skill } from "./skill";
import type { Size } from "./types";
import type { Defence } from "./defence";
import type { Note } from "./note";

interface Character {
    id: string;
    userId: string;
    profileImg: string;
    backgroundImg: string;
    name: string;
    race: string;
    class: string;
    origin: string;
    deity?: string;
    size: Size;
    level: number;
    health: Health;
    mana: Mana;
    defence: Defence;
    attributes: CharacterAttributes;
    spells: Spell[];
    attacks: Attack[];
    equipment: Equipment[];
    proficiencies: string[];
    skills: Skill[];
    inventory: Inventory[];
    accountTotal: Currency;

    backstory: string;
    description: string;
    notes: Note[];
}

interface Health {
    currentHealth: number;
    maxHealth: number;
    temporaryHealth: number;
}

interface Mana {	
    currentMana: number;
    maxMana: number;
    temporaryMana: number;
}

interface Inventory {
    items: Item[];
    maxSlots: number;
}

export type { Character, Health, Mana, Inventory };
