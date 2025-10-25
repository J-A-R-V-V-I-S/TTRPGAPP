import type { Item } from "./items";
import type { Currency } from "./currency";

interface Group {
    id: string;
    name: string;
    description: string;
    members: GroupMember[];
    storage: GroupStorage[];
    groupAccountTotal: Currency;
}

interface GroupMember {
    characterId: string;
    characterName: string;
    role: string;
}

interface GroupStorage {
    id: string;
    name: string; // e.g., "Base Camp", "Safehouse in Valorian"
    location: string;
    items: Item[];
    description?: string;
}

export type { Group, GroupMember, GroupStorage };