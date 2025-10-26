import type { AttributeName } from './types';

interface Skill {
    id?: string;
    characterId?: string;
    name: string;
    attribute: AttributeName;
    isTrained: boolean;
    onlyTrained: boolean;
    armorPenalty: boolean;
    halfLevel: number;
    trainedBonus: number;
    others: number;
}

export type { Skill };