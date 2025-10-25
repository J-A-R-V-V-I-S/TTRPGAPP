import type { AbilityType } from './types';

// Abilities and Powers

interface Ability {
    id: string;
    name: string;
    type: AbilityType;
    description: string;
    prerequisites?: string;
    cost?: string; // e.g., "2 PM", "1x por dia"
}

interface Power {
    id: string;
    name: string;
    category: PowerCategory;
    description: string;
    prerequisites?: string;
    cost?: string;
}

type PowerCategory =
    | 'Combat'      // Poderes de Combate
    | 'Destiny'     // Poderes de Destino
    | 'Magic'       // Poderes de Magia
    | 'Granted'     // Poderes Concedidos
    | 'Torment';    // Poderes da Tormenta

// Form data interfaces for creating/editing
interface AbilityFormData {
    name: string;
    type: 'ability' | 'power';
    category: string;
    cost: string;
    description: string;
    prerequisites: string;
}

export type {
    Ability,
    Power,
    PowerCategory,
    AbilityFormData,
};

